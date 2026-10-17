'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GeneratedRecipe, RecipeStep } from '@/types';
import { soundManager } from '@/utils/audio';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Scale,
  Sparkles,
  Droplets,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExtractionTimerProps {
  recipe: GeneratedRecipe;
  onFinish: (totalSecondsElapsed: number) => void;
  onClose: () => void;
}

export const ExtractionTimer: React.FC<ExtractionTimerProps> = ({
  recipe,
  onFinish,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepSecondsElapsed, setStepSecondsElapsed] = useState<number>(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentStep: RecipeStep = recipe.steps[currentStepIndex] || recipe.steps[0];
  const stepDuration = currentStep.durationSeconds;
  const stepSecondsRemaining = Math.max(0, stepDuration - stepSecondsElapsed);
  const stepProgress = Math.min(100, (stepSecondsElapsed / stepDuration) * 100);

  const totalRecipeDuration = recipe.totalEstimatedTimeSeconds;
  const totalProgress = Math.min(100, (totalSecondsElapsed / totalRecipeDuration) * 100);

  // Sound cues for 3, 2, 1
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    // Countdown cue when step is about to finish
    if (stepSecondsRemaining === 3 || stepSecondsRemaining === 2 || stepSecondsRemaining === 1) {
      soundManager.playCountdownTick();
    }
  }, [stepSecondsRemaining, isRunning, isCompleted]);

  // Main Timer ticker (100ms precision for silky smooth UI)
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const interval = setInterval(() => {
      setStepSecondsElapsed((prev) => {
        const next = prev + 1;

        // If step completed
        if (next >= stepDuration) {
          if (currentStepIndex < recipe.steps.length - 1) {
            // Advance to next step
            soundManager.playStepAlert();
            setCurrentStepIndex((idx) => idx + 1);
            return 0;
          } else {
            // Recipe fully completed!
            setIsCompleted(true);
            setIsRunning(false);
            soundManager.playCompletionFanfare();
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f59e0b', '#d97706', '#fbbf24', '#78350f'],
              });
            } catch {
              // Ignore confetti error
            }
            return stepDuration;
          }
        }
        return next;
      });

      setTotalSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentStepIndex, stepDuration, recipe.steps.length, isCompleted]);

  const togglePlay = () => {
    soundManager.playToggleSound();
    setIsRunning(!isRunning);
  };

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      soundManager.playStepAlert();
      setCurrentStepIndex((idx) => idx + 1);
      setStepSecondsElapsed(0);
    } else {
      setIsCompleted(true);
      setIsRunning(false);
      soundManager.playCompletionFanfare();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((idx) => idx - 1);
      setStepSecondsElapsed(0);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setStepSecondsElapsed(0);
    setTotalSecondsElapsed(0);
    setIsCompleted(false);
  };

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundManager.setMuted(nextMute);
    if (!nextMute) {
      soundManager.playToggleSound();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col justify-between overflow-hidden select-none animate-fade-in"
    >
      {/* Top Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-amber-200">
              {recipe.coffeeName}
            </h2>
            <p className="text-xs text-stone-400">
              {recipe.methodName} • {recipe.grindSettingFormatted} • {recipe.waterTempCelsius}°C
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute button */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            title="Salir del temporizador"
            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Focus Extraction Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center items-center text-center">
        {/* Step Indicator Header */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400/90 mb-3 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            Paso {currentStepIndex + 1} de {recipe.steps.length}: {currentStep.title}
          </span>
        </div>

        {/* Big Giant Digital Timer */}
        <div className="relative my-4">
          <div className="text-7xl sm:text-9xl font-mono font-black tracking-tight text-white font-serif drop-shadow-[0_0_35px_rgba(245,158,11,0.2)]">
            {formatTime(totalSecondsElapsed)}
          </div>
          <div className="text-xs font-mono text-stone-500 mt-1 flex items-center justify-center gap-2">
            <span>Tiempo Total Transcurrido</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">
              Paso actual: {stepSecondsRemaining}s restantes
            </span>
          </div>
        </div>

        {/* Step Instruction Display */}
        <div className="max-w-xl mx-auto my-4 p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-2xl backdrop-blur-md">
          <p className="text-base sm:text-lg text-stone-200 font-medium leading-relaxed">
            {currentStep.description}
          </p>

          {/* Water Target & Scale Guidance */}
          <div className="mt-4 pt-4 border-t border-stone-800/80 grid grid-cols-2 gap-4 text-center">
            <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Verter en este paso
              </div>
              <div className="text-2xl font-mono font-black text-amber-400 mt-0.5">
                {currentStep.waterDeltaGrams > 0 ? `+${currentStep.waterDeltaGrams}g` : '0g'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Objetivo en Balanza
              </div>
              <div className="text-2xl font-mono font-black text-white mt-0.5">
                {currentStep.targetWaterGrams}g
                <span className="text-xs text-stone-500 font-normal"> / {recipe.totalWaterGrams}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="w-full max-w-xl space-y-2 mt-2">
          {/* Step Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-stone-400">
              <span>Progreso del Paso ({currentStep.durationSeconds}s)</span>
              <span>{Math.round(stepProgress)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-900 overflow-hidden border border-stone-800">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          {/* Total Recipe Progress */}
          <div className="w-full h-1 rounded-full bg-stone-900 overflow-hidden">
            <div
              className="h-full bg-stone-600 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      </main>

      {/* Bottom Interactive Controls */}
      <footer className="p-4 sm:p-6 border-t border-stone-800/80 bg-stone-950/60 backdrop-blur-md">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          {/* Previous Step */}
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            title="Paso Anterior"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-all active:scale-95"
            title="Reiniciar Temporizador"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Main Play / Pause Hero Button */}
          <button
            onClick={togglePlay}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base transition-all shadow-xl shadow-amber-900/40 active:scale-98 flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-stone-950" /> Pausar
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Finalizado
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-stone-950" /> Iniciar Vertido
              </>
            )}
          </button>

          {/* Next Step / Complete */}
          <button
            onClick={handleNextStep}
            className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-all active:scale-95"
            title={currentStepIndex === recipe.steps.length - 1 ? 'Finalizar Extracción' : 'Siguiente Paso'}
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Finish & Feedback Button */}
          <button
            onClick={() => onFinish(totalSecondsElapsed)}
            className="px-4 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-colors shrink-0"
          >
            Finalizar & Calibrar
          </button>
        </div>
      </footer>
    </div>
  );
};
