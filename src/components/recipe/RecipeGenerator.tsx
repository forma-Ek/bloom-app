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
  CheckCircle2,
  TrendingUp,
  Volume2,
  Layers,
  Compass,
  PlusCircle,
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
    toggleMethod,
    grinder,
    dialInStates,
  } = useCoffeeStore();

  const allAvailableMethods = Object.keys(BREW_METHODS) as BrewMethodId[];

  // Divide into Primary (owned by user) vs Secondary (other methods to explore)
  const primaryMethods = useMemo(() => {
    return allAvailableMethods.filter((mId) => enabledMethods.includes(mId));
  }, [enabledMethods]);

  const secondaryMethods = useMemo(() => {
    return allAvailableMethods.filter((mId) => !enabledMethods.includes(mId));
  }, [enabledMethods]);

  const selectedCoffee = useMemo(() => {
    return coffees.find((c) => c.id === selectedCoffeeId) || coffees[0];
  }, [coffees, selectedCoffeeId]);

  const methodDetails = BREW_METHODS[selectedMethodId] || BREW_METHODS['v60'];

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

  const isCurrentMethodInEquipment = enabledMethods.includes(selectedMethodId);

  if (!selectedCoffee || !recipe) {
    return (
      <div className="p-12 text-center text-stone-400">
        No hay cafés disponibles. Añade uno en la pestaña de Mis Cafés.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
          <Sliders className="w-7 h-7 text-copper-500" />
          Preparar Receta & Extracción
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
          Selecciona tu café y método. El algoritmo de BLOOM calculará la molienda exacta para tu molinillo y la curva de vertidos.
        </p>
      </div>

      {/* Step 1 & Step 2 (Bloque Principal de Métodos) */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
        {/* Step 1: Choose Coffee */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-copper-600 dark:text-copper-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-copper-500/20 text-copper-600 dark:text-copper-400 flex items-center justify-center text-[11px] font-black">
                1
              </span>
              Paso 1: Selecciona tu Café
            </label>
            <span className="text-xs text-stone-400 hidden sm:inline">
              Origen: {selectedCoffee.origin}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <select
                value={selectedCoffee.id}
                onChange={(e) => setSelectedCoffee(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 font-serif font-bold text-stone-900 dark:text-stone-100 text-sm focus:border-copper-500 focus:outline-none"
              >
                {coffees.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.origin} ({c.process}, {c.roastLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-stone-100/70 dark:bg-stone-950/70 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-800 text-xs">
              <div className="text-stone-600 dark:text-stone-300 leading-snug truncate">
                <span className="font-semibold">{selectedCoffee.variety}</span>
                <span className="text-stone-400 block text-[11px] truncate">
                  Notas: {selectedCoffee.tastingNotes.slice(0, 3).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: BLOQUE PRINCIPAL (ÚNICAMENTE TUS MÉTODOS) */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-copper-600 dark:text-copper-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-copper-500/20 text-copper-600 dark:text-copper-400 flex items-center justify-center text-[11px] font-black">
                2
              </span>
              Paso 2: Elige el Método (Tus Métodos Activos)
            </label>
            <span className="text-[11px] text-stone-400">
              {primaryMethods.length} {primaryMethods.length === 1 ? 'método en tu equipo' : 'métodos en tu equipo'}
            </span>
          </div>

          {/* Grid showing ONLY user's selected methods */}
          {primaryMethods.length === 0 ? (
            <div className="p-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 text-center text-xs text-stone-400">
              No tienes ningún método activo. Activa tus cafeteras en la pestaña <strong>Mi Equipo</strong>.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {primaryMethods.map((mId) => {
                const m = BREW_METHODS[mId];
                const isSelected = selectedMethodId === mId;
                return (
                  <button
                    key={mId}
                    type="button"
                    onClick={() => handleSelectMethod(mId)}
                    className={`p-3.5 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 relative ${
                      isSelected
                        ? 'bg-copper-600 text-white shadow-lg shadow-copper-900/30 ring-2 ring-copper-500 scale-[1.02]'
                        : 'bg-stone-100/90 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <span className="text-base">☕</span>
                    <span className="truncate w-full font-serif">{m.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">1:{m.defaultRatio}</span>
                  </button>
                );
              })}
            </div>
          )}

          {!isCurrentMethodInEquipment && (
            <div className="mt-3 p-2.5 rounded-xl bg-copper-500/10 border border-copper-500/20 text-xs text-copper-300 flex items-center justify-between">
              <span>
                ★ Estás preparando con <strong>{methodDetails.name}</strong> (método explorado de la sección secundaria).
              </span>
              <button
                type="button"
                onClick={() => toggleMethod(selectedMethodId)}
                className="text-[11px] underline text-copper-400 hover:text-copper-200 font-semibold"
              >
                Añadir a Mi Equipo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Parameters Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Grinder Setting (Hero focus) */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-copper-950/70 via-stone-900 to-stone-950 border border-copper-500/40 text-stone-100 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-copper-400">
                  <Sliders className="w-3.5 h-3.5" />
                  Molienda Calibrada
                </div>
                <div className="text-4xl sm:text-5xl font-serif font-black text-copper-300 mt-2">
                  {recipe.grindSettingFormatted}
                </div>
                <div className="text-xs text-stone-300 mt-1">
                  Ajuste en tu molinillo: <strong className="text-copper-200">{grinder.name}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenGrinderModal}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-copper-500/20 hover:bg-copper-500/30 text-copper-300 border border-copper-500/30 font-semibold transition-colors"
              >
                Cambiar Molinillo
              </button>
            </div>

            {/* Dial-in Auto-Adjustment notice */}
            {recipe.dialInOffset !== 0 ? (
              <div className="mt-4 p-3 rounded-2xl bg-copper-500/15 border border-copper-500/30 text-xs text-copper-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-copper-400 shrink-0" />
                <span>
                  <strong>Auto-ajustado por feedback previo:</strong>{' '}
                  {recipe.dialInOffset > 0 ? `+${recipe.dialInOffset}` : recipe.dialInOffset} paso(s){' '}
                  {recipe.dialInOffset > 0 ? 'más gruesa' : 'más fina'} para equilibrar la taza.
                </span>
              </div>
            ) : (
              <p className="mt-4 text-xs text-stone-400 leading-relaxed">
                {recipe.grindRecommendationReason}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
            Escala configurada: {grinder.minScale} a {grinder.maxScale} (paso {grinder.stepSize})
          </div>
        </div>

        {/* Card 2: Dose & Water Ratio */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-copper-500" />
              Dosis & Ratio
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black font-serif text-stone-900 dark:text-stone-100">
                {recipe.doseGrams}g
              </span>
              <span className="text-xs text-stone-400 font-medium">café en grano</span>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Ratio 1:{recipe.ratio} ➔ <strong className="text-copper-600 dark:text-copper-400 font-bold">{recipe.totalWaterGrams}g</strong> agua
            </div>
          </div>

          {/* Quick Dose Buttons */}
          <div className="mt-4 flex items-center gap-1 pt-3 border-t border-stone-100 dark:border-stone-800">
            {[12, 15, 18, 20, 25].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDoseGrams(d)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                  doseGrams === d
                    ? 'bg-copper-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                {d}g
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Water Temp & Time */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-copper-500" />
              Agua & Tiempo
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black font-serif text-copper-600 dark:text-copper-400">
                {recipe.waterTempCelsius}°C
              </span>
              <span className="text-xs text-stone-400 font-medium">temp. de hervidor</span>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Duración: ~{Math.floor(recipe.totalEstimatedTimeSeconds / 60)}:
                {String(recipe.totalEstimatedTimeSeconds % 60).padStart(2, '0')} min
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
            Filtro: <strong className="text-stone-700 dark:text-stone-300">{methodDetails.filterType}</strong>
          </div>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-copper-500" />
              Guía de Vertidos Paso a Paso ({recipe.methodName})
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              El cronómetro interactivo te guiará con avisos acústicos en cada etapa.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-copper-600 dark:text-copper-400 bg-copper-500/10 px-3 py-1.5 rounded-xl border border-copper-500/20">
            Total {recipe.totalWaterGrams}g
          </div>
        </div>

        <div className="space-y-3">
          {recipe.steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800/80"
            >
              <div className="w-8 h-8 rounded-full bg-copper-500/10 border border-copper-500/30 flex items-center justify-center font-mono font-black text-xs text-copper-600 dark:text-copper-400 shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {step.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-stone-500">⏱️ {step.durationSeconds}s</span>
                    {step.waterDeltaGrams > 0 && (
                      <span className="text-copper-600 dark:text-copper-400 font-bold">
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

        {/* Tips */}
        {recipe.tips.length > 0 && (
          <div className="p-4 rounded-2xl bg-copper-500/5 border border-copper-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-1">
            <span className="font-bold text-copper-600 dark:text-copper-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Consejo para este café:
            </span>
            {recipe.tips.map((tip, i) => (
              <p key={i} className="text-stone-600 dark:text-stone-400 leading-relaxed">
                • {tip}
              </p>
            ))}
          </div>
        )}

        {/* Main CTA to launch timer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onStartBrewing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-copper-600 via-copper-500 to-copper-600 hover:from-copper-500 hover:to-copper-400 text-stone-950 font-black text-base transition-all shadow-xl shadow-copper-900/40 flex items-center justify-center gap-3 active:scale-[0.99] group"
          >
            <Play className="w-5 h-5 fill-stone-950 group-hover:scale-110 transition-transform" />
            <span>Iniciar Cronómetro de Extracción con Sonido</span>
          </button>
          <p className="text-center text-[11px] text-stone-400 mt-2 flex items-center justify-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-copper-500" />
            Incluye beeps de cuenta atrás 3-2-1 y campanilla sintética al terminar cada paso.
          </p>
        </div>
      </div>

      {/* BLOQUE SECUNDARIO ("Otros Métodos / Explorar") EN LA PARTE INFERIOR */}
      {secondaryMethods.length > 0 && (
        <div className="p-6 rounded-3xl bg-stone-100/60 dark:bg-stone-900/40 border-2 border-dashed border-stone-300 dark:border-stone-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold font-serif text-stone-700 dark:text-stone-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-copper-500" />
                Otros Métodos / Explorar
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Métodos que no tienes en tu equipo. Puedes seleccionarlos para consultar la receta adaptada o probarlos igualmente.
              </p>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              {secondaryMethods.length} métodos disponibles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {secondaryMethods.map((mId) => {
              const m = BREW_METHODS[mId];
              const isSelected = selectedMethodId === mId;
              return (
                <button
                  key={mId}
                  type="button"
                  onClick={() => handleSelectMethod(mId)}
                  className={`p-3 rounded-2xl text-xs font-semibold transition-all text-center flex flex-col items-center justify-center gap-1 border ${
                    isSelected
                      ? 'bg-copper-600 text-white border-copper-600 shadow-md ring-2 ring-copper-500 scale-[1.02]'
                      : 'bg-white/60 dark:bg-stone-950/60 hover:bg-white dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 opacity-75 hover:opacity-100'
                  }`}
                >
                  <span className="text-sm">☕</span>
                  <span className="truncate w-full">{m.name}</span>
                  <span className="text-[10px] opacity-70">1:{m.defaultRatio}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
