export type BrewMethodId = 'v60' | 'aeropress' | 'french_press' | 'chemex' | 'espresso' | 'kalita_wave' | 'cold_brew';

export type ScaleType = 'dial' | 'clicks' | 'numbers';

export interface GrinderConfig {
  id: string;
  name: string;
  scaleType: ScaleType;
  minScale: number;
  maxScale: number;
  stepSize: number; // e.g. 0.5 for dial, 1 for clicks, 0.1 for micro-stepped
  description?: string;
  // Calibration baseline: relative fine to coarse anchor (0.0 to 1.0)
  // 0.0 = finest possible, 1.0 = coarsest
}

export type RoastLevel = 'light' | 'medium_light' | 'medium' | 'medium_dark' | 'dark';
export type ProcessMethod = 'washed' | 'natural' | 'honey' | 'anaerobic' | 'experimental';

export interface CoffeeBean {
  id: string;
  name: string;
  roaster: string;
  origin: string; // e.g. "Colombia, Huila"
  variety: string; // e.g. "Geisha", "Castillo"
  process: ProcessMethod;
  roastLevel: RoastLevel;
  altitude?: number; // meters above sea level
  tastingNotes: string[];
  roastDate?: string; // YYYY-MM-DD
  notes?: string;
  bagImageUrl?: string;
  createdAt: number;
}

export interface BrewMethodDetails {
  id: BrewMethodId;
  name: string;
  tagline: string;
  icon: string;
  defaultRatio: number; // e.g. 16 for 1:16
  minRatio: number;
  maxRatio: number;
  defaultDoseGrams: number;
  waterTempRange: [number, number]; // [min, max] °C
  grindCategory: 'extra_fine' | 'fine' | 'medium_fine' | 'medium' | 'medium_coarse' | 'coarse';
  relativeGrindNormalized: number; // 0.0 to 1.0
  typicalTimeSeconds: number;
  filterType: string;
  description: string;
}

export interface RecipeStep {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  targetWaterGrams: number; // cumulative water at end of step
  waterDeltaGrams: number; // water poured in this specific step
  pourType?: 'bloom' | 'pour' | 'stir' | 'wait' | 'press' | 'drain';
  cueSound?: 'chime' | 'beep' | 'tick';
}

export interface GeneratedRecipe {
  coffeeId: string;
  coffeeName: string;
  methodId: BrewMethodId;
  methodName: string;
  doseGrams: number;
  totalWaterGrams: number;
  ratio: number; // 1:ratio
  waterTempCelsius: number;
  grindSettingFormatted: string;
  grindSettingValue: number;
  grindRecommendationReason: string;
  totalEstimatedTimeSeconds: number;
  steps: RecipeStep[];
  tips: string[];
  dialInOffset: number; // offset applied from previous feedback (e.g. +0.5 or -0.5 steps)
}

export type TasteFeedback = 'perfect' | 'overextracted' | 'underextracted' | 'flow_slow' | 'flow_fast';

export interface BrewRecord {
  id: string;
  timestamp: number;
  coffeeId: string;
  coffeeName: string;
  methodId: BrewMethodId;
  doseGrams: number;
  waterGrams: number;
  waterTempCelsius: number;
  grindSettingFormatted: string;
  grindSettingValue: number;
  totalDurationSeconds: number;
  feedback?: TasteFeedback;
  feedbackNotes?: string;
  adjustmentApplied?: string;
}

export interface CoffeeDialInState {
  coffeeId: string;
  methodId: BrewMethodId;
  grindOffset: number; // in grinder steps (e.g. +1.0 step coarser or -0.5 finer)
  tempOffsetCelsius: number; // e.g. -2°C
  ratioAdjustment: number;
  lastFeedback?: TasteFeedback;
  updatedAt: number;
}
