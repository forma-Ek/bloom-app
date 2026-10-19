import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GeneratedRecipe } from '@/types';
import { useVibration } from '@/hooks/useVibration';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface PhaseTimerProps {
  recipe: GeneratedRecipe;
  onComplete?: () => void;
}

export const PhaseTimer: React.FC<PhaseTimerProps> = ({ recipe, onComplete }) => {
  const steps = recipe.steps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [stepElapsed, setStepElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);

  const { vibratePhaseChange, vibrateComplete } = useVibration();
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const currentStep = steps[currentStepIndex] || {
    title: 'Vertido',
    description: 'Vierte agua según la receta',
    durationSeconds: 30,
    waterDeltaGrams: 0,
    targetWaterGrams: 0,
  };

  const stepDuration = currentStep.durationSeconds || 30;
  const stepProgress = Math.min((stepElapsed / stepDuration) * 100, 100);

  // SVG Ring Calculation
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stepProgress / 100) * circumference;

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      vibratePhaseChange();
      setCurrentStepIndex((prev) => prev + 1);
      setStepElapsed(0);
    } else {
      vibrateComplete();
      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [currentStepIndex, steps.length, vibratePhaseChange, vibrateComplete, onComplete]);

  const updateTimer = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== null && isRunning) {
        const deltaTime = (time - previousTimeRef.current) / 1000;
        setStepElapsed((prevStep) => {
          const nextStep = prevStep + deltaTime;
          if (nextStep >= stepDuration) {
            handleNextStep();
            return 0;
          }
          return nextStep;
        });
        setTotalElapsed((prev) => prev + deltaTime);
      }
      previousTimeRef.current = time;
      if (isRunning) {
        requestRef.current = requestAnimationFrame(updateTimer);
      }
    },
    [isRunning, stepDuration, handleNextStep]
  );

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updateTimer);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, updateTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setStepElapsed(0);
    setTotalElapsed(0);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto p-4 text-stone-100">
      {/* Paso Activo */}
      <div className="px-3 py-1 rounded-full bg-stone-800 border border-amber-600/30 text-amber-400 text-xs tracking-wider uppercase">
        Paso {currentStepIndex + 1} de {steps.length}: {currentStep.title}
      </div>

      {/* Temporizador Radial (Anillo SVG) */}
      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="text-stone-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            className="text-amber-600"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black tracking-tight text-white font-mono">
            {formatTime(stepElapsed)}
          </span>
          <span className="text-xs text-amber-500 font-medium mt-1">
            {Math.round(stepProgress)}% ({Math.max(0, Math.ceil(stepDuration - stepElapsed))}s)
          </span>
          <span className="text-[10px] text-stone-400 mt-2">
            Total: {formatTime(totalElapsed)}
          </span>
        </div>
      </div>

      {/* Instrucciones de Vertido */}
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl">
        <p className="text-sm text-stone-300 text-center mb-4 leading-relaxed">
          {currentStep.description}
        </p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] uppercase text-stone-400 block">Verter en este paso</span>
            <span className="text-xl font-bold text-amber-400">+{currentStep.waterDeltaGrams}g</span>
          </div>
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] uppercase text-stone-400 block">Objetivo en balanza</span>
            <span className="text-xl font-bold text-white">{currentStep.targetWaterGrams}g</span>
          </div>
        </div>
      </div>

      {/* Botones de Control */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={handleReset}
          className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          title="Reiniciar"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-stone-950 flex items-center justify-center gap-2 transition shadow-lg shadow-amber-600/20"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Pausar' : 'Iniciar Vertido'}</span>
        </button>

        <button
          onClick={handleNextStep}
          className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          title="Siguiente Paso"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
