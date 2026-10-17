'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { GeneratedRecipe, TasteFeedback } from '@/types';
import {
  Sparkles,
  X,
  Check,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DialInFeedbackModalProps {
  recipe: GeneratedRecipe;
  totalDurationSeconds: number;
  isOpen: boolean;
  onClose: () => void;
}

export const DialInFeedbackModal: React.FC<DialInFeedbackModalProps> = ({
  recipe,
  totalDurationSeconds,
  isOpen,
  onClose,
}) => {
  const { recordBrew, submitFeedback, grinder } = useCoffeeStore();

  const [selectedFeedback, setSelectedFeedback] = useState<TasteFeedback | null>(null);
  const [notes, setNotes] = useState('');
  const [adjustmentResult, setAdjustmentResult] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const feedbackOptions: Array<{
    id: TasteFeedback;
    icon: string;
    title: string;
    subtitle: string;
    color: string;
  }> = [
    {
      id: 'perfect',
      icon: '🌟',
      title: 'Perfecto & Balanceado',
      subtitle: 'Dulzor alto, acidez brillante y final limpio sin asperezas.',
      color: 'hover:border-copper-400 hover:bg-copper-500/10',
    },
    {
      id: 'overextracted',
      icon: '⚡',
      title: 'Amargo / Sobreextraído',
      subtitle: 'Seco, astringente en lengua, amargor persistente o notas a carbón.',
      color: 'hover:border-red-400 hover:bg-red-500/10',
    },
    {
      id: 'underextracted',
      icon: '🍋',
      title: 'Ácido / Subextraído',
      subtitle: 'Agrio punzante, salino, cuerpo aguado o poco desarrollado.',
      color: 'hover:border-yellow-400 hover:bg-yellow-500/10',
    },
    {
      id: 'flow_slow',
      icon: '⏱️',
      title: 'Flujo Muy Lento / Atascado',
      subtitle: 'El filtro se saturó y el drenaje demoró más de lo previsto.',
      color: 'hover:border-orange-400 hover:bg-orange-500/10',
    },
    {
      id: 'flow_fast',
      icon: '💨',
      title: 'Flujo Demasiado Rápido',
      subtitle: 'El agua bajó como cascada sin ofrecer resistencia adecuada.',
      color: 'hover:border-sky-400 hover:bg-sky-500/10',
    },
  ];

  const handleSubmit = () => {
    if (!selectedFeedback) return;

    // 1. Record brew session
    const record = recordBrew({
      coffeeId: recipe.coffeeId,
      coffeeName: recipe.coffeeName,
      methodId: recipe.methodId,
      doseGrams: recipe.doseGrams,
      waterGrams: recipe.totalWaterGrams,
      waterTempCelsius: recipe.waterTempCelsius,
      grindSettingFormatted: recipe.grindSettingFormatted,
      grindSettingValue: recipe.grindSettingValue,
      totalDurationSeconds,
    });

    // 2. Auto-adjust future recipes
    const { adjustmentMessage } = submitFeedback(record.id, selectedFeedback, notes);
    setAdjustmentResult(adjustmentMessage);
    setSubmitted(true);

    if (selectedFeedback === 'perfect') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch {
        // Ignore
      }
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl bg-stone-900 border border-copper-900/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 my-8">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-copper-400 font-bold">
                  Extracción Completada ({formatDuration(totalDurationSeconds)})
                </span>
                <h3 className="font-serif font-black text-2xl text-stone-100 mt-0.5">
                  ¿Cómo estuvo tu café?
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Tu evaluación calibrará automáticamente la molienda para tu próxima taza de{' '}
                  <strong className="text-copper-300">{recipe.coffeeName}</strong>.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Evaluation Options */}
            <div className="py-4 space-y-2.5">
              {feedbackOptions.map((opt) => {
                const isSelected = selectedFeedback === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedFeedback(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-copper-500/20 border-copper-500 text-stone-100 shadow-lg ring-1 ring-copper-500'
                        : `bg-stone-950/60 border-stone-800 text-stone-300 ${opt.color}`
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-stone-100">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{opt.subtitle}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-copper-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sensory notes */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Notas adicionales de cata (opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Mucha dulzura a melocotón, pero un final ligeramente seco al enfriarse..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-200 text-xs placeholder:text-stone-600"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-5 border-t border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-sm font-medium transition-colors"
              >
                Omitir
              </button>
              <button
                type="button"
                disabled={!selectedFeedback}
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 hover:from-copper-500 hover:to-copper-400 disabled:opacity-40 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-copper-900/30 flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                Calibrar Molienda
              </button>
            </div>
          </>
        ) : (
          /* Auto-Adjustment Result Banner */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-copper-500/20 text-copper-400 border border-copper-500/30 flex items-center justify-center mx-auto shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-black text-copper-200">
                ¡Calibración Actualizada!
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                El motor inteligente de BLOOM ha modificado los parámetros para tu siguiente preparación.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-copper-500/30 text-left space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-copper-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Auto-Ajuste Aplicado:
              </div>
              <p className="text-sm text-stone-200 leading-relaxed font-medium">
                {adjustmentResult}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-copper-600 hover:bg-copper-500 text-white font-bold text-sm transition-all shadow-lg shadow-copper-900/30"
            >
              Listo, volver a las recetas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
