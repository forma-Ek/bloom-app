'use client';

import React, { useState, useMemo } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { BrewMethodId } from '@/types';
import { BREW_METHODS, generateRecipe } from '@/utils/recipeCalculator';
import {
  Coffee,
  Sliders,
  Play,
  RotateCcw,
  Thermometer,
  Scale,
  Sparkles,
  Info,
  Clock,
  ChevronRight,
  Flame,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface RecipeGeneratorProps {
  onStartBrewing: () => void;
  onOpenGrinderModal: () => void;
}

export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({
  onStartBrewing,
  onOpenGrinderModal,
}) => {
  const {
    coffees,
    selectedCoffeeId,
    setSelectedCoffee,
    selectedMethodId,
    setSelectedMethod,
    enabledMethods,
    grinder,
    dialInStates,
  } = useCoffeeStore();

  const selectedCoffee = useMemo(() => {
    return coffees.find((c) => c.id === selectedCoffeeId) || coffees[0];
  }, [coffees, selectedCoffeeId]);

  const methodDetails = BREW_METHODS[selectedMethodId];

  // Custom recipe overrides
  const [doseGrams, setDoseGrams] = useState<number>(methodDetails?.defaultDoseGrams || 15);
  const [ratio, setRatio] = useState<number>(methodDetails?.defaultRatio || 16.0);

  // Sync defaults when method changes
  const handleSelectMethod = (mId: BrewMethodId) => {
    setSelectedMethod(mId);
    const m = BREW_METHODS[mId];
    if (m) {
      setDoseGrams(m.defaultDoseGrams);
      setRatio(m.defaultRatio);
    }
  };

  // Dial-in key
  const dialInKey = selectedCoffee ? `${selectedCoffee.id}_${selectedMethodId}` : '';
  const currentDialIn = dialInStates[dialInKey];

  // Generate recipe with dial-in
  const recipe = useMemo(() => {
    if (!selectedCoffee) return null;
    return generateRecipe(
      selectedCoffee,
      selectedMethodId,
      grinder,
      doseGrams,
      ratio,
      currentDialIn
    );
  }, [selectedCoffee, selectedMethodId, grinder, doseGrams, ratio, currentDialIn]);

  if (!selectedCoffee || !recipe) {
    return (
      <div className="p-8 text-center text-stone-400">
        No hay cafés disponibles. Añade uno en el catálogo.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Coffee and Method Pickers */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coffee Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-500" />
              Café Seleccionado
            </label>
            <select
              value={selectedCoffee.id}
              onChange={(e) => setSelectedCoffee(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 font-serif font-bold text-stone-900 dark:text-stone-100 text-sm focus:border-amber-500 focus:outline-none"
            >
              {coffees.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.origin} ({c.process})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Info Chip */}
          <div className="flex items-center gap-3 bg-stone-100/60 dark:bg-stone-950/60 p-3 rounded-xl border border-stone-200/60 dark:border-stone-800 text-xs">
            <div className="space-y-1">
              <div className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                {selectedCoffee.variety} • {selectedCoffee.altitude ? `${selectedCoffee.altitude}m` : 'Especialidad'}
              </div>
              <div className="text-stone-800 dark:text-stone-200 font-medium">
                Notas: {selectedCoffee.tastingNotes.slice(0, 3).join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Method Horizontal Pills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Método de Extracción
          </label>
          <div className="flex flex-wrap gap-2">
            {enabledMethods.map((mId) => {
              const m = BREW_METHODS[mId];
              const isSelected = selectedMethodId === mId;
              return (
                <button
                  key={mId}
                  onClick={() => handleSelectMethod(mId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 ring-1 ring-amber-500'
                      : 'bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recipe Parameters Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Grinder Dial (Highlighted Hero) */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-amber-950/70 via-stone-900 to-stone-950 border border-amber-500/40 text-stone-100 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Sliders className="w-3.5 h-3.5" />
                Molienda Calibrada
              </div>
              <div className="text-4xl font-serif font-black text-amber-300 mt-2">
                {recipe.grindSettingFormatted}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Para tu molinillo: <strong className="text-stone-200">{grinder.name}</strong>
              </div>
            </div>

            <button
              onClick={onOpenGrinderModal}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium transition-colors"
            >
              Cambiar
            </button>
          </div>

          {/* Auto Dial-in status indicator */}
          {recipe.dialInOffset !== 0 ? (
            <div className="mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Ajuste de cata activo:</strong>{' '}
                {recipe.dialInOffset > 0 ? `+${recipe.dialInOffset}` : recipe.dialInOffset} paso(s){' '}
                {recipe.dialInOffset > 0 ? 'más gruesa' : 'más fina'} tras tu último feedback.
              </span>
            </div>
          ) : (
            <p className="mt-4 text-xs text-stone-400 leading-relaxed">
              {recipe.grindRecommendationReason}
            </p>
          )}
        </div>

        {/* Card 2: Water & Dose */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              Dosis & Ratio
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100">
                {recipe.doseGrams}g
              </span>
              <span className="text-xs text-stone-500">café</span>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Ratio 1:{recipe.ratio} ➔ <strong className="text-amber-600 dark:text-amber-400">{recipe.totalWaterGrams}g</strong> agua
            </div>
          </div>

          {/* Quick dose adjusters */}
          <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-stone-200 dark:border-stone-800">
            {[12, 15, 18, 20, 25].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDoseGrams(d)}
                className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  doseGrams === d
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                {d}g
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Water Temp & Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Agua & Tiempo
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black font-serif text-amber-600 dark:text-amber-400">
                {recipe.waterTempCelsius}°C
              </span>
              <span className="text-xs text-stone-500">agua</span>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>
                Tiempo est.: ~{Math.floor(recipe.totalEstimatedTimeSeconds / 60)}:
                {String(recipe.totalEstimatedTimeSeconds % 60).padStart(2, '0')} min
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
            Ajustada para tueste <strong>{selectedCoffee.roastLevel}</strong> y proceso <strong>{selectedCoffee.process}</strong>.
          </div>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-bold font-serif text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Guía de Vertidos Paso a Paso
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Sigue el cronómetro en el Modo Extracción interactivo.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl">
            Total {recipe.totalWaterGrams}g
          </div>
        </div>

        <div className="space-y-3">
          {recipe.steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex items-start gap-4 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800/80"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs text-amber-600 dark:text-amber-400 shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                    {step.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-stone-500">⏱️ {step.durationSeconds}s</span>
                    {step.waterDeltaGrams > 0 && (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        +{step.waterDeltaGrams}g (hasta {step.targetWaterGrams}g)
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Barista Tips */}
        {recipe.tips.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Consejos del Barista:
            </span>
            {recipe.tips.map((tip, i) => (
              <p key={i} className="text-stone-600 dark:text-stone-400">
                • {tip}
              </p>
            ))}
          </div>
        )}

        {/* Big Action Button */}
        <div className="pt-4">
          <button
            onClick={onStartBrewing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-bold text-base transition-all shadow-xl shadow-amber-900/30 hover:shadow-amber-500/20 flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            Iniciar Modo Extracción (Temporizador y Balanza)
          </button>
        </div>
      </div>
    </div>
  );
};
