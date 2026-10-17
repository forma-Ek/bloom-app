'use client';

import React, { useState } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { Key, Sparkles, X, Check, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { geminiApiKey, setGeminiApiKey } = useCoffeeStore();
  const [keyValue, setKeyValue] = useState(geminiApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setGeminiApiKey(keyValue.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-stone-900 border border-copper-900/40 rounded-2xl p-6 shadow-2xl text-stone-100">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-copper-500/10 text-copper-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-stone-100">Google Gemini 1.5 Flash</h3>
              <p className="text-xs text-stone-400">Escaneo de bolsas de café por visión artificial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-sm">
          <p className="text-stone-300 leading-relaxed">
            BLOOM utiliza <strong>gemini-1.5-flash</strong> para leer etiquetas, detectar el origen, varietal, proceso y notas de cata con una sola foto.
          </p>

          <div className="p-3 rounded-xl bg-copper-500/10 border border-copper-500/20 text-xs text-copper-200/90 leading-relaxed">
            💡 <strong>Modo Demo incluido:</strong> Si no ingresas una clave, BLOOM incluye un simulador de cata inteligente para que puedas probar la experiencia sin configurar nada.
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-copper-400" />
              Tu Gemini API Key (Opcional)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 focus:border-copper-500 focus:outline-none text-stone-100 placeholder:text-stone-600 font-mono text-sm"
            />
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-copper-400 hover:text-copper-300 hover:underline"
          >
            Obtener una clave gratis en Google AI Studio
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-copper-600 hover:bg-copper-500 text-white text-sm font-semibold transition-all shadow-lg shadow-copper-900/30 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Guardado
              </>
            ) : (
              'Guardar Clave'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
