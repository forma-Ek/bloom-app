'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { Navbar, MainTab } from '@/components/layout/Navbar';
import { RecipeGenerator } from '@/components/recipe/RecipeGenerator';
import { CoffeeCatalog } from '@/components/coffee/CoffeeCatalog';
import { EquipmentSection } from '@/components/equipment/EquipmentSection';
import { BrewHistorySection } from '@/components/history/BrewHistorySection';
import { GrinderConfigModal } from '@/components/equipment/GrinderConfigModal';
import { ExtractionTimer } from '@/components/timer/ExtractionTimer';
import { DialInFeedbackModal } from '@/components/feedback/DialInFeedbackModal';
import { generateRecipe } from '@/utils/recipeCalculator';
import { BloomLogo } from '@/components/common/BloomLogo';
import { History, ChevronDown, ChevronUp } from 'lucide-react';

export default function HomePage() {
  // 3 Primary Tabs as requested: 'coffees' (default) | 'recipe' | 'equipment'
  const [activeTab, setActiveTab] = useState<MainTab>('coffees');
  const [isGrinderModalOpen, setIsGrinderModalOpen] = useState(false);
  const [isBrewingTimerOpen, setIsBrewingTimerOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [lastBrewDuration, setLastBrewDuration] = useState<number>(0);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const {
    coffees,
    selectedCoffeeId,
    selectedMethodId,
    grinder,
    dialInStates,
  } = useCoffeeStore();

  const activeCoffee = coffees.find((c) => c.id === selectedCoffeeId) || coffees[0];
  const dialInKey = activeCoffee ? `${activeCoffee.id}_${selectedMethodId}` : '';
  const currentDialIn = dialInStates[dialInKey];

  const currentRecipe = activeCoffee
    ? generateRecipe(activeCoffee, selectedMethodId, grinder, undefined, undefined, currentDialIn)
    : null;

  const handleFinishTimer = (totalSecondsElapsed: number) => {
    setLastBrewDuration(totalSecondsElapsed);
    setIsBrewingTimerOpen(false);
    setIsFeedbackModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 transition-colors flex flex-col">
      {/* Top 3-Tab Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGrinderModal={() => setIsGrinderModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Pestaña 1: Mis Cafés (Default) */}
        {activeTab === 'coffees' && (
          <CoffeeCatalog
            onSelectCoffeeAndBrew={() => {
              setActiveTab('recipe');
            }}
          />
        )}

        {/* Pestaña 2: Preparar Receta */}
        {activeTab === 'recipe' && (
          <div className="space-y-8">
            <RecipeGenerator
              onStartBrewing={() => setIsBrewingTimerOpen(true)}
              onOpenGrinderModal={() => setIsGrinderModalOpen(true)}
            />

            {/* Optional Collapsible History Drawer inside Recipe Tab */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:border-amber-500/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-500" />
                  Ver Historial de Extracciones y Calibraciones Previas
                </span>
                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showHistory && (
                <div className="mt-4">
                  <BrewHistorySection />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pestaña 3: Mi Equipo */}
        {activeTab === 'equipment' && (
          <EquipmentSection
            onOpenGrinderModal={() => setIsGrinderModalOpen(true)}
            onSelectMethodAndBrew={() => {
              setActiveTab('recipe');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800/80 py-8 text-center text-xs text-stone-500 dark:text-stone-500 flex flex-col items-center justify-center gap-3">
        <BloomLogo size="sm" variant="full" className="opacity-80 hover:opacity-100 transition-opacity" />
        <p>
          BLOOM • Laboratorio de Café de Especialidad • Precisión de Molienda & Visión Artificial Gemini
        </p>
      </footer>

      {/* Modals & Fullscreen Overlays */}
      <GrinderConfigModal
        isOpen={isGrinderModalOpen}
        onClose={() => setIsGrinderModalOpen(false)}
      />

      {isBrewingTimerOpen && currentRecipe && (
        <ExtractionTimer
          recipe={currentRecipe}
          onFinish={handleFinishTimer}
          onClose={() => setIsBrewingTimerOpen(false)}
        />
      )}

      {isFeedbackModalOpen && currentRecipe && (
        <DialInFeedbackModal
          recipe={currentRecipe}
          totalDurationSeconds={lastBrewDuration}
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
        />
      )}
    </div>
  );
}
