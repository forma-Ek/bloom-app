'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { GrinderConfig, ScaleType } from '@/types';
import { POPULAR_GRINDERS } from '@/utils/recipeCalculator';
import { Sliders, X, Check, Disc, Info } from 'lucide-react';

interface GrinderConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrinderConfigModal: React.FC<GrinderConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { grinder, setGrinder, saveCustomGrinder, customGrinders } = useCoffeeStore();

  const [name, setName] = useState(grinder.name);
  const [scaleType, setScaleType] = useState<ScaleType>(grinder.scaleType);
  const [minScale, setMinScale] = useState(grinder.minScale);
  const [maxScale, setMaxScale] = useState(grinder.maxScale);
  const [stepSize, setStepSize] = useState(grinder.stepSize);
  const [description, setDescription] = useState(grinder.description || '');

  // Live preview slider value
  const [previewValue, setPreviewValue] = useState<number>(
    minScale + Math.round(((maxScale - minScale) * 0.5) / stepSize) * stepSize
  );

  if (!isOpen) return null;

  const handleSelectPreset = (preset: GrinderConfig) => {
    setName(preset.name);
    setScaleType(preset.scaleType);
    setMinScale(preset.minScale);
    setMaxScale(preset.maxScale);
    setStepSize(preset.stepSize);
    setDescription(preset.description || '');
    setPreviewValue(preset.minScale + Math.round(((preset.maxScale - preset.minScale) * 0.5) / preset.stepSize) * preset.stepSize);
  };

  const handleSave = () => {
    const newGrinder: GrinderConfig = {
      id: `grinder-${Date.now()}`,
      name: name.trim() || 'Molinillo Personalizado',
      scaleType,
      minScale: Number(minScale),
      maxScale: Number(maxScale),
      stepSize: Number(stepSize) || 0.5,
      description: description.trim(),
    };

    saveCustomGrinder(newGrinder);
    setGrinder(newGrinder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="w-full max-w-xl bg-stone-900 border border-copper-900/40 rounded-2xl p-6 shadow-2xl text-stone-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-copper-500/10 text-copper-400 border border-copper-500/20">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-stone-100">Calibración de Molinillo</h3>
              <p className="text-xs text-stone-400">Escala de dial, clicks y pasos personalizables</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="py-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            Molinillos Populares o Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_GRINDERS.map((preset) => {
              const isCurrent = grinder.name === preset.name;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-copper-950/40 border-copper-500/60 text-copper-200 shadow-sm'
                      : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:border-stone-600'
                  }`}
                >
                  <div className="font-medium flex items-center justify-between">
                    <span>{preset.name}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-copper-400" />}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Escala: {preset.minScale} a {preset.maxScale} (Paso {preset.stepSize})
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Configuration Form */}
        <div className="space-y-4 pt-2 border-t border-stone-800 text-sm">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Nombre del Molinillo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Fellow Ode Gen 2, Timemore C3..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-copper-500 focus:outline-none text-stone-100 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Tipo de Escala
              </label>
              <select
                value={scaleType}
                onChange={(e) => setScaleType(e.target.value as ScaleType)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-copper-500 focus:outline-none text-stone-100 text-xs"
              >
                <option value="dial">Dial (0 - 9, con medios pasos)</option>
                <option value="clicks">Clicks (1, 2, 3... clicks)</option>
                <option value="numbers">Numérico continuo (0.1...)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Mínimo - Máximo
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={minScale}
                  onChange={(e) => setMinScale(Number(e.target.value))}
                  className="w-1/2 px-2.5 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-copper-500 focus:outline-none text-stone-100 text-xs text-center"
                />
                <span className="text-stone-500">-</span>
                <input
                  type="number"
                  value={maxScale}
                  onChange={(e) => setMaxScale(Number(e.target.value))}
                  className="w-1/2 px-2.5 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-copper-500 focus:outline-none text-stone-100 text-xs text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Tamaño del Paso
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={stepSize}
                onChange={(e) => setStepSize(Number(e.target.value))}
                placeholder="0.5"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-copper-500 focus:outline-none text-stone-100 text-xs"
              />
            </div>
          </div>

          {/* Interactive Dial Simulator */}
          <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-copper-400" />
                Simulador interactivo del Dial
              </span>
              <span className="font-mono px-2 py-0.5 rounded bg-copper-500/20 text-copper-400 font-bold">
                {scaleType === 'clicks'
                  ? `${previewValue} clicks`
                  : scaleType === 'dial'
                  ? `Dial ${previewValue}`
                  : `${previewValue}`}
              </span>
            </div>

            <input
              type="range"
              min={minScale}
              max={maxScale}
              step={stepSize}
              value={previewValue}
              onChange={(e) => setPreviewValue(Number(e.target.value))}
              className="w-full accent-copper-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>{minScale} (Más Fino)</span>
              <span>{((maxScale + minScale) / 2).toFixed(1)} (Medio)</span>
              <span>{maxScale} (Más Grueso)</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-stone-400 bg-stone-800/40 p-3 rounded-xl">
            <Info className="w-4 h-4 text-copper-400 shrink-0 mt-0.5" />
            <span>
              El algoritmo de BLOOM traducirá cualquier receta de café directamente a las marcas exactas de tu molinillo.
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-5 border-t border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-sm font-medium transition-colors"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-copper-600 hover:bg-copper-500 text-white text-sm font-semibold transition-all shadow-lg shadow-copper-900/30 flex items-center justify-center gap-2"
          >
            Guardar Molinillo
          </button>
        </div>
      </div>
    </div>
  );
};
