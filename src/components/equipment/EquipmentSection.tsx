'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { BrewMethodId, GrinderConfig } from '@/types';
import { BREW_METHODS, POPULAR_GRINDERS, calculateGrindSetting } from '@/utils/recipeCalculator';
import {
  Settings,
  Disc,
  Check,
  Layers,
  Thermometer,
  Clock,
  Filter,
  Sparkles,
  Sliders,
  CheckSquare,
  Square,
  Flame,
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
    setGrinder,
    enabledMethods,
    toggleMethod,
    selectedMethodId,
    setSelectedMethod,
  } = useCoffeeStore();

  const allMethods: BrewMethodId[] = [
    'v60',
    'aeropress',
    'french_press',
    'chemex',
    'espresso',
    'kalita_wave',
    'cold_brew',
  ];

  // Test slider value in dial simulator
  const [testSliderValue, setTestSliderValue] = useState<number>(
    grinder.minScale +
      Math.round(((grinder.maxScale - grinder.minScale) * 0.5) / grinder.stepSize) *
      grinder.stepSize
  );

  const handleSelectModel = (selectedModel: GrinderConfig) => {
    setGrinder(selectedModel);
    setTestSliderValue(
      selectedModel.minScale +
        Math.round(((selectedModel.maxScale - selectedModel.minScale) * 0.5) / selectedModel.stepSize) *
        selectedModel.stepSize
    );
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* 1. Grinder Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
            <Disc className="w-7 h-7 text-copper-500" />
            Configuración de Molinillo
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            Selecciona el molinillo que utilizas. BLOOM recalculará y adaptará automáticamente las recetas para mostrarte el dial o clicks exacto.
          </p>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {POPULAR_GRINDERS.map((model) => {
            const isSelected = grinder.id === model.id || grinder.name === model.name;
            const isTimemoreS3 = model.id === 'grinder-timemore-s3';
            return (
              <div
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className={`cursor-pointer text-left p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-copper-500/10 border-copper-500 dark:border-copper-500 shadow-md ring-1 ring-copper-500/50'
                    : 'bg-white dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-copper-500/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-copper-600 dark:text-copper-400">
                      {model.scaleType === 'dial' ? 'Dial Numérico' : model.scaleType === 'clicks' ? 'Clicks' : 'Numérico'}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-copper-500 text-stone-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
                    {model.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                    {model.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-600 dark:text-stone-400">
                    Escala: <strong>{model.minScale} - {model.maxScale}</strong> (paso {model.stepSize})
                  </span>
                  {isTimemoreS3 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-copper-500/20 text-copper-500">
                      Dial 0-9
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {/* Custom scale option card */}
          <div
            onClick={onOpenGrinderModal}
            className="cursor-pointer text-left p-5 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-copper-500 bg-stone-50/50 dark:bg-stone-950/40 transition-all flex flex-col justify-center items-center text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5 text-copper-500" />
            </div>
            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">Personalizar Molinillo</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Configura tus propios rangos de dial, clicks y pasos.</p>
          </div>
        </div>

        {/* Selected Grinder Live Overview */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-copper-950/30 border border-copper-500/30 text-stone-100 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copper-400">
                <Sparkles className="w-3.5 h-3.5" />
                Molinillo Activo para Recetas
              </div>
              <h3 className="text-2xl font-black font-serif text-copper-200 mt-1">{grinder.name}</h3>
              <p className="text-xs text-stone-400 mt-0.5">{grinder.description || 'Escala configurada.'}</p>
            </div>
            <div className="flex items-center gap-2 bg-stone-950/70 p-3 rounded-2xl border border-stone-800 text-center font-mono text-xs">
              <div className="px-2">
                <div className="text-[10px] text-stone-500 uppercase">Mín - Máx</div>
                <div className="font-bold text-copper-400">{grinder.minScale} - {grinder.maxScale}</div>
              </div>
              <div className="px-2 border-l border-stone-800">
                <div className="text-[10px] text-stone-500 uppercase">Paso</div>
                <div className="font-bold text-copper-400">{grinder.stepSize}</div>
              </div>
            </div>
          </div>
          {/* Interactive Dial Simulator Slider */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-copper-400" />
                Simulador del dial ({grinder.name}):
              </span>
              <span className="font-mono text-sm px-2.5 py-0.5 rounded-lg bg-copper-500/20 text-copper-400 font-black">
                {grinder.scaleType === 'dial'
                  ? `Dial ${testSliderValue}`
                  : grinder.scaleType === 'clicks'
                  ? `${testSliderValue} Clicks`
                  : `Paso ${testSliderValue}`}
              </span>
            </div>
            <input
              type="range"
              min={grinder.minScale}
              max={grinder.maxScale}
              step={grinder.stepSize}
              value={testSliderValue}
              onChange={(e) => setTestSliderValue(Number(e.target.value))}
              className="w-full accent-copper-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>{grinder.minScale} (Fino / Espresso)</span>
              <span>{((grinder.maxScale + grinder.minScale) / 2).toFixed(1)} (Medio / Filtro)</span>
              <span>{grinder.maxScale} (Grueso / Prensa)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Methods of Preparation Section (Cards) */}
      <section className="space-y-6 pt-6 border-t border-stone-200 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-copper-500" />
              Tus Métodos de Extracción
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
              Métodos que tienes en casa. Se muestran en el bloque principal de la pestaña <strong>Preparar Receta</strong>.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-copper-500/10 text-copper-700 dark:text-copper-400 border border-copper-500/20 self-start sm:self-auto">
            {enabledMethods.length} de {allMethods.length} métodos activos
          </div>
        </div>

        {/* Main block: enabled methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enabledMethods.map((methodId) => {
            const method = BREW_METHODS[methodId];
            const grind = calculateGrindSetting(method.relativeGrindNormalized, grinder);
            const isSelected = selectedMethodId === methodId;
            return (
              <div
                key={methodId}
                onClick={() => setSelectedMethod(methodId)}
                className={`cursor-pointer rounded-2xl border-2 transition-all p-5 flex flex-col justify-between bg-white dark:bg-stone-900 border-copper-500/80 dark:border-copper-500 shadow-sm ${isSelected ? 'ring-2 ring-copper-500' : ''}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-copper-600 dark:text-copper-400">Ratio 1:{method.defaultRatio}</span>
                      <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 mt-0.5">{method.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">{method.description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                    <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                      <Thermometer className="w-3.5 h-3.5 text-copper-500 shrink-0" />
                      <span>{method.waterTempRange[0]}-{method.waterTempRange[1]}°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-copper-500 shrink-0" />
                      <span>{Math.round(method.typicalTimeSeconds / 60)} min</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-copper-600 dark:text-copper-400">
                      <Filter className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{grind.formatted}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 truncate">{method.filterType}</span>
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-copper-600 dark:text-copper-400' : 'text-stone-400 hover:text-stone-600'}`}>{isSelected ? '★ Activo en receta' : 'Clic para usar'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary block: other methods */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-stone-500" />
            Otros Métodos / Explorar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMethods
              .filter((id) => !enabledMethods.includes(id))
              .map((methodId) => {
                const method = BREW_METHODS[methodId];
                const grind = calculateGrindSetting(method.relativeGrindNormalized, grinder);
                const isSelected = selectedMethodId === methodId;
                return (
                  <div
                    key={methodId}
                    onClick={() => {
                      toggleMethod(methodId);
                      setSelectedMethod(methodId);
                    }}
                    className={`cursor-pointer rounded-2xl border-2 transition-all p-5 flex flex-col justify-between bg-stone-100/50 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800/80 opacity-70 hover:opacity-100 ${isSelected ? 'ring-2 ring-copper-500' : ''}`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-stone-600 dark:text-stone-400">Ratio 1:{method.defaultRatio}</span>
                          <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 mt-0.5">{method.name}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">{method.description}</p>
                      <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                        <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                          <Thermometer className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span>{method.waterTempRange[0]}-{method.waterTempRange[1]}°C</span>
                        </div>
                        <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                          <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span>{Math.round(method.typicalTimeSeconds / 60)} min</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono font-bold text-stone-600 dark:text-stone-400">
                          <Filter className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{grind.formatted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};
