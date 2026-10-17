import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GrinderConfig,
  BrewMethodId,
  CoffeeBean,
  BrewRecord,
  CoffeeDialInState,
  TasteFeedback,
} from '@/types';
import { DEFAULT_GRINDER, POPULAR_GRINDERS, BREW_METHODS } from '@/utils/recipeCalculator';

export interface CoffeeStoreState {
  // Equipment
  grinder: GrinderConfig;
  customGrinders: GrinderConfig[];
  enabledMethods: BrewMethodId[];
  selectedMethodId: BrewMethodId;

  // Coffee Catalog
  coffees: CoffeeBean[];
  selectedCoffeeId: string | null;

  // Dial-in records & History
  dialInStates: Record<string, CoffeeDialInState>; // Key: `${coffeeId}_${methodId}`
  brewHistory: BrewRecord[];

  // App settings
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  geminiApiKey: string;

  // Active brewing state
  isBrewingActive: boolean;

  // Actions
  setGrinder: (grinder: GrinderConfig) => void;
  saveCustomGrinder: (grinder: GrinderConfig) => void;
  toggleMethod: (methodId: BrewMethodId) => void;
  setSelectedMethod: (methodId: BrewMethodId) => void;
  addCoffee: (coffee: CoffeeBean) => void;
  updateCoffee: (coffee: CoffeeBean) => void;
  deleteCoffee: (id: string) => void;
  setSelectedCoffee: (id: string) => void;
  recordBrew: (record: Omit<BrewRecord, 'id' | 'timestamp'>) => BrewRecord;
  submitFeedback: (recordId: string, feedback: TasteFeedback, notes?: string) => { adjustmentMessage: string };
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleSound: () => void;
  setGeminiApiKey: (key: string) => void;
  setBrewingActive: (active: boolean) => void;
}

const INITIAL_COFFEES: CoffeeBean[] = [
  {
    id: 'coffee-geisha-1',
    name: 'Geisha Cerro Azul',
    roaster: 'Café de Origen Specialty',
    origin: 'Valle del Cauca, Colombia',
    variety: 'Geisha',
    process: 'washed',
    roastLevel: 'light',
    altitude: 1850,
    tastingNotes: ['Jazmín', 'Bergamota', 'Melocotón dulce', 'Miel de azahar'],
    roastDate: '2026-10-05',
    notes: 'Lote de microclima de niebla. Destaca una acidez málica brillante y textura sedosa como el té.',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'coffee-ethiopia-2',
    name: 'Yirgacheffe Idido Anaeróbico',
    roaster: 'Nordic Roasters Lab',
    origin: 'Yirgacheffe, Etiopía',
    variety: 'Heirloom autóctono',
    process: 'anaerobic',
    roastLevel: 'light',
    altitude: 2150,
    tastingNotes: ['Arándanos', 'Vino tinto', 'Cacao ruby', 'Limoncillo'],
    roastDate: '2026-10-02',
    notes: 'Fermentación lenta de 72h en cereza entera. Cuerpo licoroso y explosión frutal.',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'coffee-pinkbourbon-3',
    name: 'Pink Bourbon El Paraíso',
    roaster: 'Craft Coffee Masters',
    origin: 'Huila, Colombia',
    variety: 'Pink Bourbon',
    process: 'honey',
    roastLevel: 'medium_light',
    altitude: 1900,
    tastingNotes: ['Fresa silvestre', 'Papaya', 'Caramelo tostado', 'Pomelo'],
    roastDate: '2026-09-28',
    notes: 'Variedad híbrida natural con altísima concentración de azúcares y notas florales.',
    createdAt: Date.now() - 86400000 * 12,
  },
];

export const useCoffeeStore = create<CoffeeStoreState>()(
  persist(
    (set, get) => ({
      grinder: DEFAULT_GRINDER,
      customGrinders: POPULAR_GRINDERS,
      enabledMethods: ['v60', 'aeropress', 'french_press', 'chemex', 'espresso', 'cold_brew'],
      selectedMethodId: 'v60',

      coffees: INITIAL_COFFEES,
      selectedCoffeeId: 'coffee-geisha-1',

      dialInStates: {},
      brewHistory: [],

      theme: 'dark',
      soundEnabled: true,
      geminiApiKey: '',
      isBrewingActive: false,

      setGrinder: (grinder) => set({ grinder }),

      saveCustomGrinder: (grinder) =>
        set((state) => {
          const exists = state.customGrinders.some((g) => g.id === grinder.id);
          const customGrinders = exists
            ? state.customGrinders.map((g) => (g.id === grinder.id ? grinder : g))
            : [...state.customGrinders, grinder];
          return { customGrinders, grinder };
        }),

      toggleMethod: (methodId) =>
        set((state) => {
          const current = state.enabledMethods;
          if (current.includes(methodId)) {
            if (current.length === 1) return state; // Keep at least one
            const updated = current.filter((m) => m !== methodId);
            return {
              enabledMethods: updated,
              selectedMethodId: state.selectedMethodId === methodId ? updated[0] : state.selectedMethodId,
            };
          } else {
            return { enabledMethods: [...current, methodId] };
          }
        }),

      setSelectedMethod: (selectedMethodId) => set({ selectedMethodId }),

      addCoffee: (coffee) =>
        set((state) => ({
          coffees: [coffee, ...state.coffees],
          selectedCoffeeId: coffee.id,
        })),

      updateCoffee: (updated) =>
        set((state) => ({
          coffees: state.coffees.map((c) => (c.id === updated.id ? updated : c)),
        })),

      deleteCoffee: (id) =>
        set((state) => {
          const updated = state.coffees.filter((c) => c.id !== id);
          return {
            coffees: updated,
            selectedCoffeeId: state.selectedCoffeeId === id ? (updated[0]?.id || null) : state.selectedCoffeeId,
          };
        }),

      setSelectedCoffee: (selectedCoffeeId) => set({ selectedCoffeeId }),

      recordBrew: (recordData) => {
        const id = `brew-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const record: BrewRecord = {
          ...recordData,
          id,
          timestamp: Date.now(),
        };

        set((state) => ({
          brewHistory: [record, ...state.brewHistory],
        }));

        return record;
      },

      submitFeedback: (recordId, feedback, notes) => {
        const state = get();
        const record = state.brewHistory.find((r) => r.id === recordId);
        if (!record) return { adjustmentMessage: 'Registro no encontrado' };

        const dialInKey = `${record.coffeeId}_${record.methodId}`;
        const currentDialIn = state.dialInStates[dialInKey] || {
          coffeeId: record.coffeeId,
          methodId: record.methodId,
          grindOffset: 0,
          tempOffsetCelsius: 0,
          ratioAdjustment: 0,
          updatedAt: Date.now(),
        };

        let newGrindOffset = currentDialIn.grindOffset;
        let newTempOffset = currentDialIn.tempOffsetCelsius;
        let adjustmentMessage = '';

        const stepMultiplier = 1; // 1 step of grinder

        switch (feedback) {
          case 'overextracted':
            // Bitter, astringent, dry -> Needs coarser grind (+1 step) or lower temp (-1°C)
            newGrindOffset += stepMultiplier;
            newTempOffset = Math.max(-3, newTempOffset - 1);
            adjustmentMessage = `Molienda calibrada a +${stepMultiplier} paso más GRUESA y temperatura -1°C para reducir amargor y sequedad.`;
            break;

          case 'underextracted':
            // Sour, weak, watery, sharp acidity -> Needs finer grind (-1 step) or higher temp (+1°C)
            newGrindOffset -= stepMultiplier;
            newTempOffset = Math.min(3, newTempOffset + 1);
            adjustmentMessage = `Molienda calibrada a ${stepMultiplier} paso más FINA y temperatura +1°C para aumentar dulzura y cuerpo.`;
            break;

          case 'flow_slow':
            // Clogged filter or channeling
            newGrindOffset += stepMultiplier;
            adjustmentMessage = `Molienda ajustada a +${stepMultiplier} paso más GRUESA para optimizar el caudal y evitar saturación del filtro.`;
            break;

          case 'flow_fast':
            // Water passing too fast without extracting
            newGrindOffset -= stepMultiplier;
            adjustmentMessage = `Molienda ajustada a ${stepMultiplier} paso más FINA para frenar el flujo y elevar la extracción.`;
            break;

          case 'perfect':
            adjustmentMessage = '¡Extracción óptima y perfil balanceado! Parámetros guardados y fijados como receta maestra.';
            break;
        }

        const updatedDialIn: CoffeeDialInState = {
          ...currentDialIn,
          grindOffset: newGrindOffset,
          tempOffsetCelsius: newTempOffset,
          lastFeedback: feedback,
          updatedAt: Date.now(),
        };

        const updatedHistory = state.brewHistory.map((item) =>
          item.id === recordId
            ? {
                ...item,
                feedback,
                feedbackNotes: notes,
                adjustmentApplied: adjustmentMessage,
              }
            : item
        );

        set({
          dialInStates: {
            ...state.dialInStates,
            [dialInKey]: updatedDialIn,
          },
          brewHistory: updatedHistory,
        });

        return { adjustmentMessage };
      },

      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', nextTheme === 'dark');
          }
          return { theme: nextTheme };
        }),

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        set({ theme });
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      setGeminiApiKey: (geminiApiKey) => set({ geminiApiKey }),

      setBrewingActive: (isBrewingActive) => set({ isBrewingActive }),
    }),
    {
      name: 'bloom_coffee_storage_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        grinder: state.grinder,
        customGrinders: state.customGrinders,
        enabledMethods: state.enabledMethods,
        selectedMethodId: state.selectedMethodId,
        coffees: state.coffees,
        selectedCoffeeId: state.selectedCoffeeId,
        dialInStates: state.dialInStates,
        brewHistory: state.brewHistory,
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
);
