'use client';

import React from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { BrewMethodId } from '@/types';
import { BREW_METHODS, calculateGrindSetting } from '@/utils/recipeCalculator';
import {
  Settings,
  Disc,
  CheckCircle2,
  Circle,
  Thermometer,
  Clock,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';

interface EquipmentSectionProps {
  onOpenGrinderModal: () => void;
  onSelectMethodAndBrew?: (methodId: BrewMethodId) => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  onOpenGrinderModal,
  onSelectMethodAndBrew,
}) => {
  const {
    grinder,
    enabledMethods,
    toggleMethod,
    selectedMethodId,
    setSelectedMethod,
  } = useCoffeeStore();

  const allMethods: BrewMethodId[] = ['v60', 'aeropress', 'french_press', 'chemex', 'espresso', 'cold_brew'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Grinder Section Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
              <Disc className="w-6 h-6 text-amber-500" />
              Tu Molinillo Principal
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Escala calibrada para traducir cualquier receta a tus pasos exactos.
            </p>
          </div>
          <button
            onClick={onOpenGrinderModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md shadow-amber-900/20"
          >
            <Settings className="w-4 h-4" />
            Configurar Escala
          </button>
        </div>

        {/* Grinder Hero Card */}
        <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-900/30 text-stone-100 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                Molinillo Activo
              </div>
              <h3 className="text-2xl font-bold font-serif text-stone-100 mt-1">
                {grinder.name}
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-lg">
                {grinder.description || 'Escala configurada para ajuste de molienda en tiempo real.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-center">
              <div className="px-3">
                <div className="text-[10px] uppercase font-bold text-stone-500">Escala</div>
                <div className="text-base font-mono font-bold text-amber-400">
                  {grinder.minScale} - {grinder.maxScale}
                </div>
              </div>
              <div className="px-3 border-x border-stone-800">
                <div className="text-[10px] uppercase font-bold text-stone-500">Paso</div>
                <div className="text-base font-mono font-bold text-amber-400">
                  {grinder.stepSize}
                </div>
              </div>
              <div className="px-3">
                <div className="text-[10px] uppercase font-bold text-stone-500">Tipo</div>
                <div className="text-base font-mono font-bold capitalize text-amber-400">
                  {grinder.scaleType}
                </div>
              </div>
            </div>
          </div>

          {/* Grinder Scale Distribution Map */}
          <div className="mt-6 pt-5 border-t border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Mapa de Calibración en tu Molinillo:</span>
              <span className="text-[11px] font-mono text-stone-500">Fino ◄────────► Grueso</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {allMethods.map((mId) => {
                const method = BREW_METHODS[mId];
                const grind = calculateGrindSetting(method.relativeGrindNormalized, grinder);
                const isSelected = selectedMethodId === mId;

                return (
                  <div
                    key={mId}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                        : 'bg-stone-950/40 border-stone-800 text-stone-400'
                    }`}
                  >
                    <div className="text-[11px] font-medium truncate">{method.name}</div>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                      {grind.formatted}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Methods Section */}
      <div>
        <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
          <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-500" />
            Métodos de Preparación
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Activa los métodos que tienes en tu estación de café para personalizar tus recetas.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMethods.map((methodId) => {
            const method = BREW_METHODS[methodId];
            const isEnabled = enabledMethods.includes(methodId);
            const isSelected = selectedMethodId === methodId;
            const grind = calculateGrindSetting(method.relativeGrindNormalized, grinder);

            return (
              <div
                key={methodId}
                className={`relative rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500 dark:border-amber-600 shadow-md'
                    : isEnabled
                    ? 'bg-white dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-amber-500/40'
                    : 'bg-stone-100/50 dark:bg-stone-950/40 border-dashed border-stone-300 dark:border-stone-800 opacity-60'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                        Ratio 1:{method.defaultRatio}
                      </span>
                      <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 mt-0.5">
                        {method.name}
                      </h3>
                    </div>

                    {/* Toggle Ownership switch */}
                    <button
                      type="button"
                      onClick={() => toggleMethod(methodId)}
                      title={isEnabled ? 'Desactivar método' : 'Activar método'}
                      className="text-stone-400 hover:text-amber-500 transition-colors"
                    >
                      {isEnabled ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-400" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    {method.description}
                  </p>

                  {/* Method parameters badge row */}
                  <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 text-[11px]">
                    <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{method.waterTempRange[0]}-{method.waterTempRange[1]}°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{Math.round(method.typicalTimeSeconds / 60)} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400 font-mono font-semibold text-amber-600 dark:text-amber-400">
                      <Filter className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{grind.formatted}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {method.filterType}
                  </span>
                  {isEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMethod(methodId);
                        if (onSelectMethodAndBrew) onSelectMethodAndBrew(methodId);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-600 text-white font-semibold'
                          : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {isSelected ? 'Seleccionado' : 'Preparar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
