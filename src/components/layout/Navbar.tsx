'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { soundManager } from '@/utils/audio';
import { ThemeToggle } from './ThemeToggle';
import { ApiKeyModal } from '@/components/common/ApiKeyModal';
import {
  Coffee,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  History,
  BookOpen,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'recipe' | 'catalog' | 'equipment' | 'history';
  setActiveTab: (tab: 'recipe' | 'catalog' | 'equipment' | 'history') => void;
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
    soundManager.setMuted(soundEnabled); // toggle current
    if (!soundEnabled) {
      soundManager.playToggleSound();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-900/20">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black tracking-wider text-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 dark:from-amber-200 dark:via-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
                  BLOOM
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Specialty
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 tracking-tight hidden sm:block">
                Precision Extraction & Dial-In Lab
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-200/50 dark:bg-stone-900/50 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setActiveTab('recipe')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'recipe'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Receta & Timer
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Cafés
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'equipment'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Equipo & Molinillo
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Historial Dial-In
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Grinder Quick Badge */}
            <button
              onClick={onOpenGrinderModal}
              title="Configurar Molinillo y Escala"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[11px] max-w-[120px] truncate">
                {grinder.name}
              </span>
              <span className="text-[10px] bg-amber-500/20 px-1 py-0.2 rounded font-mono">
                {grinder.minScale}-{grinder.maxScale}
              </span>
            </button>

            {/* AI Vision Status */}
            <button
              onClick={() => setApiKeyModalOpen(true)}
              title="Configurar Gemini 1.5 Flash Vision"
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
            >
              <Sparkles
                className={`w-4 h-4 ${
                  geminiApiKey ? 'text-amber-500 animate-pulse' : 'text-stone-400'
                }`}
              />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? 'Silenciar sonidos de extracción' : 'Activar sonidos de aviso'}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="flex md:hidden items-center justify-around border-t border-stone-200 dark:border-stone-800/80 px-2 py-1.5 bg-stone-100/90 dark:bg-stone-900/90">
          <button
            onClick={() => setActiveTab('recipe')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-lg font-medium ${
              activeTab === 'recipe'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Receta
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-lg font-medium ${
              activeTab === 'catalog'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Cafés
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-lg font-medium ${
              activeTab === 'equipment'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <Settings className="w-4 h-4" />
            Equipo
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-lg font-medium ${
              activeTab === 'history'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <History className="w-4 h-4" />
            Historial
          </button>
        </div>
      </header>

      <ApiKeyModal isOpen={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
    </>
  );
};
