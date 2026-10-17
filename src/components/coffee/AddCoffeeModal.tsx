'use client';

import React, { useState, useRef } from 'react';
import { useCoffeeStore } from '@/store/coffeeStore';
import { CoffeeBean, ProcessMethod, RoastLevel } from '@/types';
import {
  X,
  Camera,
  Sparkles,
  Plus,
  Loader2,
  Check,
  Tag,
  Calendar,
  Mountain,
  AlertCircle,
  UploadCloud,
} from 'lucide-react';

interface AddCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (coffee: CoffeeBean) => void;
}

const COMMON_TASTING_NOTES = [
  'Jazmín', 'Bergamota', 'Melocotón', 'Cítricos', 'Limoncillo',
  'Frutas rojas', 'Fresa silvestre', 'Mora', 'Manzana verde',
  'Chocolate negro', 'Caramelo toffee', 'Miel', 'Vainilla',
  'Avellana', 'Vino tinto', 'Papaya', 'Canela'
];

export const AddCoffeeModal: React.FC<AddCoffeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addCoffee, geminiApiKey } = useCoffeeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [roaster, setRoaster] = useState('');
  const [origin, setOrigin] = useState('');
  const [variety, setVariety] = useState('');
  const [process, setProcess] = useState<ProcessMethod>('washed');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('light');
  const [altitude, setAltitude] = useState<number | ''>(1800);
  const [roastDate, setRoastDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [tastingNotes, setTastingNotes] = useState<string[]>(['Floral', 'Cítrico']);
  const [customNote, setCustomNote] = useState('');
  const [notes, setNotes] = useState('');

  // Scanning states
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddNote = (noteToAdd: string) => {
    const trimmed = noteToAdd.trim();
    if (trimmed && !tastingNotes.includes(trimmed)) {
      setTastingNotes([...tastingNotes, trimmed]);
      setCustomNote('');
    }
  };

  const handleRemoveNote = (noteToRemove: string) => {
    setTastingNotes(tastingNotes.filter((n) => n !== noteToRemove));
  };

  // Trigger file selection for Gemini Vision scan
  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanMessage('Analizando etiqueta con Gemini 1.5 Flash...');
    setScanNotice(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          const res = await fetch('/api/scan-bag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Data,
              mimeType: file.type || 'image/jpeg',
              userApiKey: geminiApiKey,
            }),
          });

          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.name) setName(d.name);
            if (d.roaster) setRoaster(d.roaster);
            if (d.origin) setOrigin(d.origin);
            if (d.variety) setVariety(d.variety);
            if (d.process) setProcess(d.process as ProcessMethod);
            if (d.roastLevel) setRoastLevel(d.roastLevel as RoastLevel);
            if (d.altitude) setAltitude(Number(d.altitude));
            if (d.roastDate) setRoastDate(d.roastDate);
            if (Array.isArray(d.tastingNotes) && d.tastingNotes.length > 0) {
              setTastingNotes(d.tastingNotes);
            }
            if (d.notes) setNotes(d.notes);

            setScanMessage('¡Etiqueta leída exitosamente! Revisa los campos antes de guardar.');
            if (json.notice) {
              setScanNotice(json.notice);
            }
          } else {
            setScanMessage('No se pudo extraer la información automáticamente. Puedes completarla a mano.');
          }
        } catch (err) {
          console.error(err);
          setScanMessage('Error al contactar con la IA. Puedes ingresar los datos manualmente.');
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCoffee: CoffeeBean = {
      id: `coffee-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      roaster: roaster.trim() || 'Tostador Artesanal',
      origin: origin.trim() || 'Origen Especial',
      variety: variety.trim() || 'Especialidad',
      process,
      roastLevel,
      altitude: altitude ? Number(altitude) : undefined,
      tastingNotes,
      roastDate: roastDate || undefined,
      notes: notes.trim() || undefined,
      createdAt: Date.now(),
    };

    addCoffee(newCoffee);
    if (onSuccess) onSuccess(newCoffee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-900/40 rounded-2xl p-6 shadow-2xl text-stone-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <h3 className="font-semibold text-xl text-stone-100">Añadir Nuevo Café</h3>
            <p className="text-xs text-stone-400">
              Registra tu café manualmente o escanea la etiqueta con IA
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini Vision Scan Banner */}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-stone-900 border border-amber-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-200 flex items-center gap-1.5">
                  Lectura Inteligente con Gemini 1.5 Flash
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Sube una foto de tu bolsa de café para autocompletar origen, varietal, proceso y notas de cata.
                </p>
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageFile}
              />
              <button
                type="button"
                onClick={handleScanClick}
                disabled={isScanning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-all shadow-md shadow-amber-900/40 disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    Analizando bolsa...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Escanear Foto de Bolsa
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scan feedback notification */}
          {scanMessage && (
            <div className="mt-3 text-xs p-2.5 rounded-lg bg-stone-900/80 border border-amber-500/30 text-amber-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}
          {scanNotice && (
            <div className="mt-2 text-[11px] text-stone-400 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{scanNotice}</span>
            </div>
          )}
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Nombre del Café / Finca *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Geisha Cerro Azul"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Tostador
              </label>
              <input
                type="text"
                value={roaster}
                onChange={(e) => setRoaster(e.target.value)}
                placeholder="Ej: Hola Coffee, Nomad, San Alberto..."
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Origen (País, Región)
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ej: Huila, Colombia / Yirgacheffe, Etiopía"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Variedad Botánica
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="Ej: Geisha, Pink Bourbon, Castillo, SL28..."
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-sm"
              />
            </div>
          </div>

          {/* Process & Roast Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Proceso de Beneficio
              </label>
              <select
                value={process}
                onChange={(e) => setProcess(e.target.value as ProcessMethod)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-xs"
              >
                <option value="washed">Lavado / Washed (Limpio y brillante)</option>
                <option value="natural">Natural (Dulce y afrutado)</option>
                <option value="honey">Honey / Miel (Acaramelado)</option>
                <option value="anaerobic">Anaeróbico / Fermentación controlada</option>
                <option value="experimental">Experimental / Maceración Carbónica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Nivel de Tueste
              </label>
              <select
                value={roastLevel}
                onChange={(e) => setRoastLevel(e.target.value as RoastLevel)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-xs"
              >
                <option value="light">Claro / Light (Filtro, alta acidez)</option>
                <option value="medium_light">Medio-Claro / Cinnamon</option>
                <option value="medium">Medio / Medium (Omniroast)</option>
                <option value="medium_dark">Medio-Oscuro</option>
                <option value="dark">Oscuro / Dark (Espresso clásico)</option>
              </select>
            </div>
          </div>

          {/* Altitude & Roast Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-amber-500" />
                Altitud (msnm)
              </label>
              <input
                type="number"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value ? Number(e.target.value) : '')}
                placeholder="1850"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Fecha de Tueste
              </label>
              <input
                type="date"
                value={roastDate}
                onChange={(e) => setRoastDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-sm"
              />
            </div>
          </div>

          {/* Tasting Notes */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Notas de Cata
            </label>

            {/* Selected Notes Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[30px] p-2 bg-stone-950 rounded-xl border border-stone-800">
              {tastingNotes.length === 0 ? (
                <span className="text-xs text-stone-500">Selecciona o escribe notas abajo...</span>
              ) : (
                tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    {note}
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(note)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1 mb-2">
              {COMMON_TASTING_NOTES.slice(0, 10).map((note) => (
                <button
                  key={note}
                  type="button"
                  onClick={() => handleAddNote(note)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                    tastingNotes.includes(note)
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-800/80 hover:bg-stone-800 text-stone-400 border-stone-700/60'
                  }`}
                >
                  +{note}
                </button>
              ))}
            </div>

            {/* Custom note input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote(customNote);
                  }
                }}
                placeholder="Añadir otra nota..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 focus:border-amber-500 focus:outline-none text-stone-100 text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddNote(customNote)}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium"
              >
                Añadir
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Guardar Café
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
