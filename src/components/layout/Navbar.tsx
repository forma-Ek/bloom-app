'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { soundManager } from '@/utils/audio';
import { ThemeToggle } from './ThemeToggle';
import { ApiKeyModal } from '@/components/common/ApiKeyModal';
import { BloomLogo } from '@/components/common/BloomLogo';
import {
  Coffee,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Settings,
  Disc,
} from 'lucide-react';

export type MainTab = 'coffees' | 'recipe' | 'equipment';

interface NavbarProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  onOpenGrinderModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGrinderModal,
}) => {
  const { grinder, soundEnabled, toggleSound, geminiApiKey } = useCoffeeStore();
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const handleSoundToggle = () => {
    toggleSound();
    soundManager.setMuted(soundEnabled);
    if (!soundEnabled) {
      soundManager.playToggleSound();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('coffees')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <BloomLogo size="md" variant="emblem" className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black tracking-wider text-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 dark:from-amber-200 dark:via-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
                  BLOOM
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Specialty Coffee
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 tracking-tight hidden sm:block">
                Precision Extraction & Dial-In Lab
              </p>
            </div>
          </div>

          {/* Main 3 Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-200/60 dark:bg-stone-900/70 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
            {/* Tab 1: Mis Cafés */}
            <button
              onClick={() => setActiveTab('coffees')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'coffees'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Coffee className="w-4 h-4" />
              Mis Cafés
            </button>

            {/* Tab 2: Preparar Receta */}
            <button
              onClick={() => setActiveTab('recipe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'recipe'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Preparar Receta
            </button>

            {/* Tab 3: Mi Equipo */}
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'equipment'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Disc className="w-4 h-4" />
              Mi Equipo
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Active Grinder Badge button */}
            <button
              onClick={() => setActiveTab('equipment')}
              title={`Molinillo activo: ${grinder.name}. Haz clic para cambiar.`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold transition-colors"
            >
              <Disc className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[11px] max-w-[120px] truncate">
                {grinder.name}
              </span>
            </button>

            {/* AI Vision Status Button */}
            <button
              onClick={() => setApiKeyModalOpen(true)}
              title="Configuración de IA Gemini (Escaneo de bolsas)"
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
            >
              <Sparkles
                className={`w-4 h-4 ${
                  geminiApiKey ? 'text-amber-500 animate-pulse' : 'text-stone-400'
                }`}
              />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonido en temporizador'}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {/* Theme Toggle (Dark/Light) */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Submenu (3 Tabs) */}
        <div className="grid grid-cols-3 border-t border-stone-200 dark:border-stone-800/80 px-2 py-1.5 bg-stone-100/90 dark:bg-stone-900/90 md:hidden">
          <button
            onClick={() => setActiveTab('coffees')}
            className={`flex flex-col items-center gap-1 text-[11px] py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'coffees'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <Coffee className="w-4 h-4" />
            Mis Cafés
          </button>
          <button
            onClick={() => setActiveTab('recipe')}
            className={`flex flex-col items-center gap-1 text-[11px] py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'recipe'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Preparar Receta
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex flex-col items-center gap-1 text-[11px] py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'equipment'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <Disc className="w-4 h-4" />
            Mi Equipo
          </button>
        </div>
      </header>

      <ApiKeyModal isOpen={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
    </>
  );
};
