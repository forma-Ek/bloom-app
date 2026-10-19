import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GeneratedRecipe, RecipeStep } from '@/types';
import { useVibration } from '@/hooks/useVibration';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

/**
 * PhaseTimer
 * ---------
 * A high‑precision timer that walks through the phases (steps) of a coffee
 * recipe. It uses `requestAnimationFrame` for smooth updates, renders a radial
 * progress indicator with Framer Motion, and triggers haptic feedback via the
 * Web Vibration API when a phase ends or the whole extraction finishes.
 *
 * Props
 * -----
 * - `recipe`: The `GeneratedRecipe` containing an ordered array of `steps`.
 * - `onComplete?`: Optional callback executed when the entire timer completes.
 *
 * Controls
 * --------
 *   • Start / Pause – toggles the running state.
 *   • Reset       – returns to the first phase and clears elapsed time.
 *   • Next        – manually advance to the next phase (if any).
 */
interface PhaseTimerProps {
  recipe: GeneratedRecipe;
  onComplete?: () => void;
}

export const PhaseTimer: React.FC<PhaseTimerProps> = ({ recipe, onComplete }) => {
  // --- Vibration helpers ---------------------------------------------------
  const { vibratePhaseChange, vibrateComplete } = useVibration();

  // --- Timer state --------------------------------------------------------
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0); // seconds elapsed in current phase

  const rafId = useRef<number>();
  const lastTimestamp = useRef<number>(0);

  const steps = recipe.steps;
  const totalPhases = steps.length;

  const currentStep: RecipeStep = steps[currentPhaseIdx];
  const phaseDuration = currentStep.durationSeconds;

  // --- Helpers ------------------------------------------------------------
  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setCurrentPhaseIdx(0);
    setPhaseElapsed(0);
  };

  const advancePhase = useCallback(() => {
    // vibrate for phase transition
    vibratePhaseChange();
    if (currentPhaseIdx + 1 < totalPhases) {
      setCurrentPhaseIdx((i) => i + 1);
      setPhaseElapsed(0);
    } else {
      // finished all phases
      setIsRunning(false);
      vibrateComplete();
      onComplete?.();
    }
  }, [currentPhaseIdx, totalPhases, vibratePhaseChange, vibrateComplete, onComplete]);

  // --- Animation loop -----------------------------------------------------
  useEffect(() => {
    if (!isRunning) return;
    const tick = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const delta = (timestamp - lastTimestamp.current) / 1000; // seconds
      lastTimestamp.current = timestamp;

      setPhaseElapsed((prev) => {
        const newElapsed = prev + delta;
        if (newElapsed >= phaseDuration) {
          // Phase finished – move to next
          advancePhase();
          return 0; // will be reset by advancePhase
        }
        return newElapsed;
      });
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      lastTimestamp.current = 0;
    };
  }, [isRunning, phaseDuration, advancePhase]);

  // --- UI calculations ----------------------------------------------------
  const totalElapsed = steps
    .slice(0, currentPhaseIdx)
    .reduce((sum, s) => sum + s.durationSeconds, 0) + phaseElapsed;
  const totalDuration = steps.reduce((sum, s) => sum + s.durationSeconds, 0);
  const remainingPhase = Math.max(0, phaseDuration - phaseElapsed);
  const progressRatio = totalElapsed / totalDuration; // 0..1
  const stepProgress = Math.min(100, (phaseElapsed / phaseDuration) * 100); // percent of current step

  // --- Render ------------------------------------------------------------
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-stone-900/60 rounded-xl text-stone-100">
      {/* Radial progress */}
      <svg className="w-48 h-48" viewBox="0 0 36 36">
        <motion.circle
          cx="18"
          cy="18"
          r="15.915"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <motion.circle
          cx="18"
          cy="18"
          r="15.915"
          fill="none"
          stroke="var(--color-copper, #b87333)"
          strokeWidth="3"
          strokeDasharray="100"
          strokeDashoffset={100 - progressRatio * 100}
          strokeLinecap="round"
        />
        {/* Center text */}
        <text
          x="18"
          y="20.35"
          textAnchor="middle"
          className="fill-current text-base font-mono"
        >
          {Math.round(remainingPhase)}s
        </text>
      </svg>

      {/* Phase label */}
      <div className="text-lg font-semibold text-copper-300">
        {currentStep.title}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {isRunning ? (
          <button
            onClick={pause}
            className="p-2 rounded-full bg-copper-500/20 hover:bg-copper-500/30"
            aria-label="Pause"
          >
            <Pause className="w-5 h-5 text-copper-200" />
          </button>
        ) : (
          <button
            onClick={start}
            className="p-2 rounded-full bg-copper-500/20 hover:bg-copper-500/30"
            aria-label="Start"
          >
            <Play className="w-5 h-5 text-copper-200" />
          </button>
        )}
        <button
          onClick={reset}
          className="p-2 rounded-full bg-copper-500/20 hover:bg-copper-500/30"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5 text-copper-200" />
        </button>
        <button
          onClick={advancePhase}
          className="p-2 rounded-full bg-copper-500/20 hover:bg-copper-500/30"
          aria-label="Next Phase"
        >
          <FastForward className="w-5 h-5 text-copper-200" />
        </button>
      </div>
    </div>
  );
};
