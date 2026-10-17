'use client';

import React from 'react';
import { CoffeeBean } from '@/types';
import {
  Coffee,
  Sparkles,
  Mountain,
  Calendar,
  Trash2,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface CoffeeCardProps {
  coffee: CoffeeBean;
  isSelected: boolean;
  onSelect: (coffee: CoffeeBean) => void;
  onDelete: (id: string) => void;
}

export const CoffeeCard: React.FC<CoffeeCardProps> = ({
  coffee,
  isSelected,
  onSelect,
  onDelete,
}) => {
  // Degassing calculation
  const calculateRestingDays = (roastDateStr?: string) => {
    if (!roastDateStr) return null;
    const roast = new Date(roastDateStr).getTime();
    const now = Date.now();
    const days = Math.floor((now - roast) / (1000 * 60 * 60 * 24));
    return days >= 0 ? days : 0;
  };

  const daysSinceRoast = calculateRestingDays(coffee.roastDate);

  const getDegassingBadge = (days: number | null) => {
    if (days === null) return null;
    if (days < 5) {
      return {
        label: `${days} días (Desgasificando)`,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      };
    }
    if (days <= 30) {
      return {
        label: `${days} días (Punto Óptimo)`,
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      };
    }
    return {
      label: `${days} días desde tueste`,
      color: 'text-stone-400 bg-stone-500/10 border-stone-500/20',
    };
  };

  const degassingBadge = getDegassingBadge(daysSinceRoast);

  const processLabels: Record<string, string> = {
    washed: 'Lavado',
    natural: 'Natural',
    honey: 'Honey',
    anaerobic: 'Anaeróbico',
    experimental: 'Experimental',
  };

  const roastLabels: Record<string, string> = {
    light: 'Tueste Claro',
    medium_light: 'Tueste Medio-Claro',
    medium: 'Tueste Medio',
    medium_dark: 'Tueste Medio-Oscuro',
    dark: 'Tueste Oscuro',
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        isSelected
          ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500 dark:border-amber-600 shadow-lg ring-1 ring-amber-500/50'
          : 'bg-white dark:bg-stone-900/70 border-stone-200 dark:border-stone-800 hover:border-amber-500/40 shadow-sm'
      }`}
    >
      <div>
        {/* Top Meta Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium tracking-wide uppercase text-amber-600 dark:text-amber-400">
              {coffee.roaster}
            </span>
            <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-0.5 leading-snug">
              {coffee.name}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              📍 {coffee.origin} • <span className="italic">{coffee.variety}</span>
            </p>
          </div>

          <button
            onClick={() => onDelete(coffee.id)}
            title="Eliminar café"
            className="text-stone-400 hover:text-red-400 p-1 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Process & Roast Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            {processLabels[coffee.process] || coffee.process}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            {roastLabels[coffee.roastLevel] || coffee.roastLevel}
          </span>
          {degassingBadge && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${degassingBadge.color}`}
            >
              <Clock className="w-2.5 h-2.5" />
              {degassingBadge.label}
            </span>
          )}
        </div>

        {/* Altitude & Notes */}
        <div className="mt-3 flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
          {coffee.altitude && (
            <div className="flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5 text-amber-500" />
              <span>{coffee.altitude} msnm</span>
            </div>
          )}
          {coffee.roastDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Tostado: {coffee.roastDate}</span>
            </div>
          )}
        </div>

        {/* Tasting Notes */}
        <div className="mt-3.5 pt-3 border-t border-stone-200/70 dark:border-stone-800/70">
          <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">
            Notas de Cata
          </div>
          <div className="flex flex-wrap gap-1">
            {coffee.tastingNotes.map((note) => (
              <span
                key={note}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {coffee.notes && (
          <p className="mt-2.5 text-xs text-stone-500 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-950/50 p-2 rounded-lg border border-stone-200/50 dark:border-stone-800/50">
            &ldquo;{coffee.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Select / Active Action */}
      <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
        <span className="text-[11px] text-stone-500 dark:text-stone-400">
          {isSelected ? '✓ Seleccionado' : 'Listo para preparar'}
        </span>

        <button
          type="button"
          onClick={() => onSelect(coffee)}
          className={`text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            isSelected
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/30'
              : 'bg-stone-900 dark:bg-stone-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-white dark:text-stone-200 hover:text-white'
          }`}
        >
          <span>Preparar Receta</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
};
