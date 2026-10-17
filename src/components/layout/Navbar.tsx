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
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-[#2D2D34] bg-stone-50/95 dark:bg-[#121214]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between gap-4">
          {/* Logo & Brand (Larger and highlighted with copper tones) */}
          <div
            onClick={() => setActiveTab('coffees')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <BloomLogo size="header" variant="emblem" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-widest text-2xl sm:text-3xl text-stone-900 dark:text-[#C88A6E] transition-colors">
                  BLOOM
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#C88A6E]/15 text-[#C88A6E] dark:text-[#E2B49A] border border-[#C88A6E]/30">
                  Specialty Coffee
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-[#A1A1AA] tracking-wider uppercase font-medium hidden sm:block">
                Precision Extraction & Dial-In Lab
              </p>
            </div>
          </div>

          {/* Main 3 Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-200/70 dark:bg-[#1E1E22] p-1.5 rounded-2xl border border-stone-300/80 dark:border-[#2D2D34]">
            {/* Tab 1: Mis Cafés */}
            <button
              onClick={() => setActiveTab('coffees')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'coffees'
                  ? 'bg-[#C88A6E] hover:bg-[#B87556] text-white shadow-lg shadow-[#C88A6E]/25'
                  : 'text-stone-600 dark:text-[#A1A1AA] hover:text-stone-900 dark:hover:text-[#F5F5F7] hover:bg-stone-300/40 dark:hover:bg-[#25252A]'
              }`}
            >
              <Coffee className="w-4 h-4" />
              Mis Cafés
            </button>

            {/* Tab 2: Preparar Receta */}
            <button
              onClick={() => setActiveTab('recipe')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'recipe'
                  ? 'bg-[#C88A6E] hover:bg-[#B87556] text-white shadow-lg shadow-[#C88A6E]/25'
                  : 'text-stone-600 dark:text-[#A1A1AA] hover:text-stone-900 dark:hover:text-[#F5F5F7] hover:bg-stone-300/40 dark:hover:bg-[#25252A]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Preparar Receta
            </button>

            {/* Tab 3: Mi Equipo */}
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'equipment'
                  ? 'bg-[#C88A6E] hover:bg-[#B87556] text-white shadow-lg shadow-[#C88A6E]/25'
                  : 'text-stone-600 dark:text-[#A1A1AA] hover:text-stone-900 dark:hover:text-[#F5F5F7] hover:bg-stone-300/40 dark:hover:bg-[#25252A]'
              }`}
            >
              <Disc className="w-4 h-4" />
              Mi Equipo
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Active Grinder Badge button with copper rose-gold styling */}
            <button
              onClick={() => setActiveTab('equipment')}
              title={`Molinillo activo: ${grinder.name}. Haz clic para cambiar.`}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#C88A6E]/10 hover:bg-[#C88A6E]/20 border border-[#C88A6E]/30 text-[#C88A6E] dark:text-[#E2B49A] text-xs font-bold transition-colors shadow-sm"
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
              className="p-2.5 rounded-2xl bg-stone-100 dark:bg-[#1E1E22] hover:bg-stone-200 dark:hover:bg-[#25252A] border border-stone-200 dark:border-[#2D2D34] text-stone-600 dark:text-[#A1A1AA] transition-colors"
            >
              <Sparkles
                className={`w-4 h-4 ${
                  geminiApiKey ? 'text-[#C88A6E] animate-pulse' : 'text-stone-400'
                }`}
              />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonido en temporizador'}
              className="p-2.5 rounded-2xl bg-stone-100 dark:bg-[#1E1E22] hover:bg-stone-200 dark:hover:bg-[#25252A] border border-stone-200 dark:border-[#2D2D34] text-stone-600 dark:text-[#A1A1AA] transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#C88A6E] dark:text-[#E2B49A]" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {/* Theme Toggle (Dark/Light) */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Submenu (3 Tabs) */}
        <div className="grid grid-cols-3 border-t border-stone-200 dark:border-[#2D2D34] px-2 py-2 bg-stone-100/90 dark:bg-[#1E1E22]/90 md:hidden">
          <button
            onClick={() => setActiveTab('coffees')}
            className={`flex flex-col items-center gap-1 text-[11px] py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'coffees'
                ? 'text-white bg-[#C88A6E] shadow-sm'
                : 'text-stone-500 dark:text-[#A1A1AA]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            Mis Cafés
          </button>
          <button
            onClick={() => setActiveTab('recipe')}
            className={`flex flex-col items-center gap-1 text-[11px] py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'recipe'
                ? 'text-white bg-[#C88A6E] shadow-sm'
                : 'text-stone-500 dark:text-[#A1A1AA]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Preparar
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex flex-col items-center gap-1 text-[11px] py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'equipment'
                ? 'text-white bg-[#C88A6E] shadow-sm'
                : 'text-stone-500 dark:text-[#A1A1AA]'
            }`}
          >
            <Disc className="w-4 h-4" />
            Equipo
          </button>
        </div>
      </header>

      <ApiKeyModal isOpen={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
    </>
  );
};
