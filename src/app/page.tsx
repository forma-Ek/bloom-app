'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { Navbar } from '@/components/layout/Navbar';
import { RecipeGenerator } from '@/components/recipe/RecipeGenerator';
import { CoffeeCatalog } from '@/components/coffee/CoffeeCatalog';
import { EquipmentSection } from '@/components/equipment/EquipmentSection';
import { BrewHistorySection } from '@/components/history/BrewHistorySection';
import { GrinderConfigModal } from '@/components/equipment/GrinderConfigModal';
import { ExtractionTimer } from '@/components/timer/ExtractionTimer';
import { DialInFeedbackModal } from '@/components/feedback/DialInFeedbackModal';
import { BREW_METHODS, generateRecipe } from '@/utils/recipeCalculator';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'recipe' | 'catalog' | 'equipment' | 'history'>('recipe');
  const [isGrinderModalOpen, setIsGrinderModalOpen] = useState(false);
  const [isBrewingTimerOpen, setIsBrewingTimerOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [lastBrewDuration, setLastBrewDuration] = useState<number>(0);

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
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGrinderModal={() => setIsGrinderModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'recipe' && (
          <RecipeGenerator
            onStartBrewing={() => setIsBrewingTimerOpen(true)}
            onOpenGrinderModal={() => setIsGrinderModalOpen(true)}
          />
        )}

        {activeTab === 'catalog' && (
          <CoffeeCatalog
            onSelectCoffeeAndBrew={() => {
              setActiveTab('recipe');
            }}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentSection
            onOpenGrinderModal={() => setIsGrinderModalOpen(true)}
            onSelectMethodAndBrew={() => {
              setActiveTab('recipe');
            }}
          />
        )}

        {activeTab === 'history' && <BrewHistorySection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800/80 py-6 text-center text-xs text-stone-500 dark:text-stone-500">
        <p>
          BLOOM • Laboratorio de Café de Especialidad con Auto-Calibración y Visión Artificial Gemini
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
