'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { CoffeeBean } from '@/types';
import { CoffeeCard } from './CoffeeCard';
import { AddCoffeeModal } from './AddCoffeeModal';
import {
  Camera,
  PenTool,
  Search,
  Filter,
  Coffee,
  Sparkles,
  Info,
} from 'lucide-react';

interface CoffeeCatalogProps {
  onSelectCoffeeAndBrew: (coffee: CoffeeBean) => void;
}

export const CoffeeCatalog: React.FC<CoffeeCatalogProps> = ({
  onSelectCoffeeAndBrew,
}) => {
  const { coffees, selectedCoffeeId, setSelectedCoffee, deleteCoffee } = useCoffeeStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'scan' | 'manual'>('scan');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProcess, setFilterProcess] = useState<string>('all');

  const handleOpenScan = () => {
    setModalMode('scan');
    setIsAddModalOpen(true);
  };

  const handleOpenManual = () => {
    setModalMode('manual');
    setIsAddModalOpen(true);
  };

  const filteredCoffees = coffees.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tastingNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProcess = filterProcess === 'all' || c.process === filterProcess;

    return matchesSearch && matchesProcess;
  });

  const handleSelect = (coffee: CoffeeBean) => {
    setSelectedCoffee(coffee.id);
    onSelectCoffeeAndBrew(coffee);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header & Brief Intro */}
      <div>
        <h2 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
          <Coffee className="w-7 h-7 text-amber-500" />
          Mis Cafés
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
          Tu despensa de café de especialidad. Registra nuevos granos y calibra la receta perfecta para cada varietal.
        </p>
      </div>

      {/* 2. Top Action Buttons (Highlighted Prominently as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Button 1: Añadir por Foto (IA Gemini) */}
        <button
          type="button"
          onClick={handleOpenScan}
          className="group relative text-left p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border-2 border-amber-500/50 hover:border-amber-400 text-stone-100 shadow-xl shadow-amber-950/20 hover:shadow-amber-500/10 transition-all active:scale-[0.99] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                IA Gemini 1.5 Flash
              </span>
            </div>

            <h3 className="text-lg font-bold font-serif text-amber-200 group-hover:text-amber-300 transition-colors">
              Añadir por Foto (IA Gemini)
            </h3>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Fotografía la bolsa de café. La IA extraerá automáticamente origen, varietal, proceso y notas de cata.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800/80 text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Escanear etiqueta con la cámara</span>
            <span>➔</span>
          </div>
        </button>

        {/* Button 2: Añadir a Mano */}
        <button
          type="button"
          onClick={handleOpenManual}
          className="group relative text-left p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900/90 border-2 border-stone-200 dark:border-stone-800 hover:border-amber-500/60 dark:hover:border-stone-700 text-stone-900 dark:text-stone-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                Manual
              </span>
            </div>

            <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Añadir a Mano
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
              Completa el formulario tradicional especificando altitud, fecha de tueste y características sensoriales.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs font-semibold text-stone-600 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Rellenar formulario paso a paso</span>
            <span>➔</span>
          </div>
        </button>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar café por nombre, origen, varietal o notas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-amber-500 focus:outline-none text-stone-900 dark:text-stone-100 text-xs sm:text-sm shadow-sm"
            />
          </div>

          {/* Quick Process Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'washed', label: 'Lavados' },
              { id: 'natural', label: 'Naturales' },
              { id: 'honey', label: 'Honey' },
              { id: 'anaerobic', label: 'Anaeróbicos' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFilterProcess(p.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filterProcess === p.id
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Coffees List */}
        {filteredCoffees.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30 space-y-3">
            <Coffee className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">
              No tienes cafés con ese filtro
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              Utiliza uno de los botones superiores para registrar tu primer paquete de café.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCoffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                isSelected={coffee.id === selectedCoffeeId}
                onSelect={handleSelect}
                onDelete={deleteCoffee}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AddCoffeeModal
        isOpen={isAddModalOpen}
        initialMode={modalMode}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newCoffee) => {
          setSelectedCoffee(newCoffee.id);
        }}
      />
    </div>
  );
};
