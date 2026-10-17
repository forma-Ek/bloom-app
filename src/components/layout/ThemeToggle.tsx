'use client';

import React, { useEffect, useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useCoffeeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure document element reflects the persisted theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Cambiar tema claro/oscuro"
      className="p-2 rounded-xl transition-all duration-200 bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800/80 dark:hover:bg-stone-700 dark:text-amber-400 border border-stone-200 dark:border-stone-700/60 shadow-sm"
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
