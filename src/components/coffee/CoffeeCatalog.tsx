'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { CoffeeBean } from '@/types';
import { CoffeeCard } from './CoffeeCard';
import { AddCoffeeModal } from './AddCoffeeModal';
import {
  Plus,
  Sparkles,
  Search,
  Filter,
  Coffee,
  BookOpen,
} from 'lucide-react';

interface CoffeeCatalogProps {
  onSelectCoffeeAndBrew: (coffee: CoffeeBean) => void;
}

export const CoffeeCatalog: React.FC<CoffeeCatalogProps> = ({
  onSelectCoffeeAndBrew,
}) => {
  const { coffees, selectedCoffeeId, setSelectedCoffee, deleteCoffee } = useCoffeeStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProcess, setFilterProcess] = useState<string>('all');

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-500" />
            Catálogo de Cafés de Especialidad
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Gestiona tus orígenes, varietales, notas de cata y calibración específica por lote.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-md shadow-amber-900/20"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          Añadir Café / Escanear Bolsa
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por finca, varietal, origen, notas de cata..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-amber-500 focus:outline-none text-stone-900 dark:text-stone-100 text-sm shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 hidden sm:block" />
          <select
            value={filterProcess}
            onChange={(e) => setFilterProcess(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-amber-500 focus:outline-none text-stone-900 dark:text-stone-100 text-xs shadow-sm"
          >
            <option value="all">Todos los procesos</option>
            <option value="washed">Lavados</option>
            <option value="natural">Naturales</option>
            <option value="honey">Honey</option>
            <option value="anaerobic">Anaeróbicos</option>
            <option value="experimental">Experimentales</option>
          </select>
        </div>
      </div>

      {/* Coffee Cards Grid */}
      {filteredCoffees.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30">
          <Coffee className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-700 dark:text-stone-300">
            No se encontraron cafés con estos filtros
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Prueba a limpiar la búsqueda o agrega un nuevo café con el botón superior.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Añadir Café
          </button>
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

      {/* Add Modal */}
      <AddCoffeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newCoffee) => {
          setSelectedCoffee(newCoffee.id);
        }}
      />
    </div>
  );
};
