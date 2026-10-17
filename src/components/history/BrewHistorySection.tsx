'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { BREW_METHODS } from '@/utils/recipeCalculator';
import {
  History,
  Coffee,
  Calendar,
  Clock,
  Sliders,
  Scale,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';

export const BrewHistorySection: React.FC = () => {
  const { brewHistory } = useCoffeeStore();
  const [filterCoffee, setFilterCoffee] = useState<string>('all');

  const filteredHistory = brewHistory.filter((b) => {
    return filterCoffee === 'all' || b.coffeeId === filterCoffee;
  });

  const getFeedbackBadge = (feedback?: string) => {
    switch (feedback) {
      case 'perfect':
        return {
          icon: '🌟',
          text: 'Perfecto & Balanceado',
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'overextracted':
        return {
          icon: '⚡',
          text: 'Amargo / Sobreextraído',
          style: 'bg-red-500/10 text-red-400 border-red-500/30',
        };
      case 'underextracted':
        return {
          icon: '🍋',
          text: 'Ácido / Subextraído',
          style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        };
      case 'flow_slow':
        return {
          icon: '⏱️',
          text: 'Flujo Muy Lento',
          style: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        };
      case 'flow_fast':
        return {
          icon: '💨',
          text: 'Flujo Demasiado Rápido',
          style: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        };
      default:
        return {
          icon: '☕',
          text: 'Sin evaluar',
          style: 'bg-stone-500/10 text-stone-400 border-stone-500/30',
        };
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
            <History className="w-6 h-6 text-amber-500" />
            Historial de Extracciones & Dial-In
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Registro cronológico de tus tazas, notas de cata y calibraciones automáticas.
          </p>
        </div>
      </div>

      {brewHistory.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30">
          <Coffee className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-700 dark:text-stone-300">
            Aún no has registrado ninguna extracción
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Ve a la pestaña de Receta, inicia el modo extracción y evalúa tu café para ver los registros aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((record) => {
            const method = BREW_METHODS[record.methodId];
            const badge = getFeedbackBadge(record.feedback);

            return (
              <div
                key={record.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 transition-all hover:border-amber-500/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                      {record.coffeeName}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                      {method?.name || record.methodId}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {formatDate(record.timestamp)}
                  </span>
                </div>

                {/* Parameters row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-stone-100 dark:border-stone-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Scale className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      {record.doseGrams}g café ➔ <strong>{record.waterGrams}g</strong> agua
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Molienda: <strong className="text-amber-600 dark:text-amber-400">{record.grindSettingFormatted}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Tiempo: <strong>{Math.floor(record.totalDurationSeconds / 60)}m {record.totalDurationSeconds % 60}s</strong>
                    </span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${badge.style}`}>
                      <span>{badge.icon}</span>
                      <span>{badge.text}</span>
                    </span>
                  </div>
                </div>

                {/* Adjustment Applied or Sensory Notes */}
                {record.adjustmentApplied && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                    <span>{record.adjustmentApplied}</span>
                  </div>
                )}

                {record.feedbackNotes && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                    &ldquo;{record.feedbackNotes}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
