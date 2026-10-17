'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  PenTool,
  Info,
} from 'lucide-react';

interface AddCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (coffee: CoffeeBean) => void;
  initialMode?: 'scan' | 'manual';
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
  initialMode = 'manual',
}) => {
  const { addCoffee, geminiApiKey } = useCoffeeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSubTab, setActiveSubTab] = useState<'scan' | 'manual'>(initialMode);

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setActiveSubTab(initialMode);
  }, [initialMode, isOpen]);

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
        setPreviewImage(base64Data);

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

            setScanMessage('¡Etiqueta identificada con éxito! Revisa los campos abajo y guarda.');
            if (json.notice) {
              setScanNotice(json.notice);
            }
            // Switch to form so user sees results clearly
            setActiveSubTab('manual');
          } else {
            setScanMessage('No se pudo extraer el texto de la foto. Puedes rellenar los datos a mano.');
          }
        } catch (err) {
          console.error(err);
          setScanMessage('Error al contactar con Gemini. Puedes rellenar los datos a mano.');
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
      id: `coffee-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      roaster: roaster.trim() || 'Tostador Artesanal',
      origin: origin.trim() || 'Origen de Especialidad',
      variety: variety.trim() || 'Arábica',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-stone-900 border border-copper-900/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <h3 className="font-serif font-black text-2xl text-stone-100">Añadir Café</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Registra un nuevo café de especialidad en tu estante
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs: Foto vs Manual */}
        <div className="flex items-center gap-2 p-1 bg-stone-950 rounded-2xl border border-stone-800 my-5">
          <button
            type="button"
            onClick={() => setActiveSubTab('scan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'scan'
                ? 'bg-copper-600 text-white shadow-md shadow-copper-900/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-4 h-4 text-copper-300" />
            Escanear Bolsa (IA Gemini)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'manual'
                ? 'bg-copper-600 text-white shadow-md shadow-copper-900/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Escribir a Mano
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageFile}
        />

        {/* Scan Mode Panel */}
        {activeSubTab === 'scan' && (
          <div className="space-y-4 py-2">
            <div
              onClick={handleScanClick}
              className="cursor-pointer border-2 border-dashed border-copper-500/40 hover:border-copper-400 rounded-2xl p-8 text-center bg-gradient-to-b from-copper-500/5 to-transparent transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-copper-500/10 text-copper-400 border border-copper-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                {isScanning ? (
                  <Loader2 className="w-8 h-8 animate-spin text-copper-400" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-copper-400" />
                )}
              </div>

              <h4 className="text-base font-bold text-stone-100">
                {isScanning ? 'Analizando etiqueta con Gemini 1.5 Flash...' : 'Toca para subir o fotografiar la bolsa'}
              </h4>
              <p className="text-xs text-stone-400 mt-1.5 max-w-md mx-auto">
                La IA detectará automáticamente el origen, variedad botánica, proceso de beneficio, nivel de tueste y notas de cata.
              </p>

              <button
                type="button"
                disabled={isScanning}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-copper-600 hover:bg-copper-500 text-white text-xs font-bold transition-all shadow-lg shadow-copper-900/30"
              >
                <Camera className="w-4 h-4" />
                {isScanning ? 'Procesando...' : 'Tomar Foto / Seleccionar Archivo'}
              </button>
            </div>

            {scanMessage && (
              <div className="p-3 rounded-xl bg-copper-500/10 border border-copper-500/30 text-xs text-copper-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-copper-400 shrink-0" />
                <span>{scanMessage}</span>
              </div>
            )}

            {scanNotice && (
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5 px-1">
                <Info className="w-3.5 h-3.5 text-copper-500 shrink-0" />
                <span>{scanNotice}</span>
              </div>
            )}
          </div>
        )}

        {/* Manual Form (Also used to review scan results) */}
        {activeSubTab === 'manual' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {scanMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Datos extraídos por IA. Puedes afinarlos a continuación:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('scan')}
                  className="text-copper-400 hover:underline text-[11px]"
                >
                  Volver a escanear
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nombre del Café o Finca *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Geisha Cerro Azul"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tostador
                </label>
                <input
                  type="text"
                  value={roaster}
                  onChange={(e) => setRoaster(e.target.value)}
                  placeholder="Ej: Hola Coffee, Nomad, San Alberto..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Origen (País, Región)
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ej: Colombia, Huila / Etiopía, Yirgacheffe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Variedad Botánica
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="Ej: Geisha, Bourbon, Castillo, SL28..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-sm"
                />
              </div>
            </div>

            {/* Process & Roast Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Proceso de Beneficio
                </label>
                <select
                  value={process}
                  onChange={(e) => setProcess(e.target.value as ProcessMethod)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-xs"
                >
                  <option value="washed">Lavado / Washed (Limpio y floral)</option>
                  <option value="natural">Natural (Dulce y afrutado)</option>
                  <option value="honey">Honey / Miel (Acaramelado)</option>
                  <option value="anaerobic">Anaeróbico (Fermentación controlada)</option>
                  <option value="experimental">Experimental / Maceración Carbónica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nivel de Tueste
                </label>
                <select
                  value={roastLevel}
                  onChange={(e) => setRoastLevel(e.target.value as RoastLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-xs"
                >
                  <option value="light">Claro / Light (Alta acidez, notas sutiles)</option>
                  <option value="medium_light">Medio-Claro / Cinnamon</option>
                  <option value="medium">Medio / Medium (Balanceado omniroast)</option>
                  <option value="medium_dark">Medio-Oscuro</option>
                  <option value="dark">Oscuro / Dark (Mayor cuerpo y amargor)</option>
                </select>
              </div>
            </div>

            {/* Altitude & Roast Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-copper-500" />
                  Altitud (msnm)
                </label>
                <input
                  type="number"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value ? Number(e.target.value) : '')}
                  placeholder="1850"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-copper-500" />
                  Fecha de Tueste
                </label>
                <input
                  type="date"
                  value={roastDate}
                  onChange={(e) => setRoastDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-sm"
                />
              </div>
            </div>

            {/* Tasting Notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-copper-500" />
                Notas de Cata
              </label>

              {/* Selected Notes Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 bg-stone-950 rounded-xl border border-stone-800">
                {tastingNotes.length === 0 ? (
                  <span className="text-xs text-stone-500">Selecciona o escribe notas abajo...</span>
                ) : (
                  tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-copper-500/20 text-copper-300 border border-copper-500/30"
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
                        ? 'bg-copper-600 text-white border-copper-600'
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
                  className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-copper-500 focus:outline-none text-stone-100 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(customNote)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                >
                  Añadir
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-copper-600 hover:bg-copper-500 text-white text-sm font-bold transition-all shadow-lg shadow-copper-900/30 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Guardar Café
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
