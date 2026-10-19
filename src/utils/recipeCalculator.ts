import {
  BrewMethodId,
  BrewMethodDetails,
  CoffeeBean,
  GrinderConfig,
  GeneratedRecipe,
  RecipeStep,
  CoffeeDialInState,
} from '@/types';

export const BREW_METHODS: Record<BrewMethodId, BrewMethodDetails> = {
  v60: {
    id: 'v60',
    name: 'Hario V60',
    tagline: 'Claridad, acidez brillante y perfil limpio',
    icon: 'Cone',
    defaultRatio: 16.0,
    minRatio: 14.0,
    maxRatio: 17.5,
    defaultDoseGrams: 15,
    waterTempRange: [92, 96],
    grindCategory: 'medium_fine',
    relativeGrindNormalized: 0.45,
    typicalTimeSeconds: 195, // 3:15 min
    filterType: 'Papel cónico 02 lavado',
    description: 'El método rey de la especialidad. Extracción por gravedad que resalta las notas florales y frutales de cafés lavados y geishas.',
  },
  aeropress: {
    id: 'aeropress',
    name: 'AeroPress',
    tagline: 'Versatilidad, cuerpo jugoso y dulzor concentrado',
    icon: 'Cylinder',
    defaultRatio: 14.5,
    minRatio: 12.0,
    maxRatio: 16.0,
    defaultDoseGrams: 14,
    waterTempRange: [88, 93],
    grindCategory: 'medium_fine',
    relativeGrindNormalized: 0.38,
    typicalTimeSeconds: 150, // 2:30 min
    filterType: 'Microfiltro de papel circular',
    description: 'Extracción por inmersión y presión manual de aire. Perdona errores y permite extraer tazas densas, dulces y redondas.',
  },
  chemex: {
    id: 'chemex',
    name: 'Chemex',
    tagline: 'Taza ultra limpia, notas sutiles y sedosidad',
    icon: 'FlaskConical',
    defaultRatio: 16.0,
    minRatio: 15.0,
    maxRatio: 17.0,
    defaultDoseGrams: 25,
    waterTempRange: [93, 96],
    grindCategory: 'medium_coarse',
    relativeGrindNormalized: 0.62,
    typicalTimeSeconds: 270, // 4:30 min
    filterType: 'Filtro Chemex de triple pliegue',
    description: 'Filtro un 30% más grueso que retiene la mayoría de aceites y finos, produciendo una infusión cristalina y elegante.',
  },
  french_press: {
    id: 'french_press',
    name: 'Prensa Francesa',
    tagline: 'Cuerpo completo, untuosidad y profundidad aromática',
    icon: 'Coffee',
    defaultRatio: 15.0,
    minRatio: 14.0,
    maxRatio: 16.0,
    defaultDoseGrams: 20,
    waterTempRange: [92, 95],
    grindCategory: 'coarse',
    relativeGrindNormalized: 0.80,
    typicalTimeSeconds: 360, // 6:00 min (Hoffmann technique)
    filterType: 'Malla metálica de acero',
    description: 'Inmersión total clásica. Con la técnica moderna de rotura de costra y retirada de espuma, logras un perfil denso sin sedimentos arenosos.',
  },
  espresso: {
    id: 'espresso',
    name: 'Espresso',
    tagline: 'Intensidad, crema sedosa y complejidad aromática',
    icon: 'Gauge',
    defaultRatio: 2.2,
    minRatio: 1.8,
    maxRatio: 2.5,
    defaultDoseGrams: 18,
    waterTempRange: [91, 94],
    grindCategory: 'fine',
    relativeGrindNormalized: 0.12,
    typicalTimeSeconds: 32, // 32 seconds
    filterType: 'Portafiltro de precisión 58mm',
    description: 'Extracción a 9 bares de presión. Pura concentración de sólidos solubles y emulsión de aceites esenciales.',
  },

  cold_drip: {
    id: 'cold_drip',
    name: 'Cold Drip',
    tagline: 'Acidez suave, cuerpo aterciopelado y notas chocolatosas',
    icon: 'Droplets',
    defaultRatio: 10.0,
    minRatio: 8.0,
    maxRatio: 12.0,
    defaultDoseGrams: 40,
    waterTempRange: [18, 22],
    grindCategory: 'coarse',
    relativeGrindNormalized: 0.90,
    typicalTimeSeconds: 600, // Demostración interactiva en timer (modo preparación de lote)
    filterType: 'Bolsa de filtrado o papel grueso',
    description: 'Maceración lenta en agua fría por 16-24 horas. Resalta la dulzura natural reduciendo drásticamente la acidez y el amargor.',
  },
  cold_brew: {
    id: 'cold_brew',
    name: 'Cold Brew',
    tagline: 'Infusión en frío por inmersión prolongada',
    icon: 'Snowflake',
    defaultRatio: 10.0,
    minRatio: 8.0,
    maxRatio: 12.0,
    defaultDoseGrams: 30,
    waterTempRange: [20, 25],
    grindCategory: 'coarse',
    relativeGrindNormalized: 0.85,
    typicalTimeSeconds: 43200, // 12 horas
    filterType: 'Filtro grueso o bolsa de café',
    description: 'Maceración prolongada en agua fría de 12 a 24 horas, ideal para obtener una taza suave y baja acidez.',
  }
};

export const DEFAULT_GRINDER: GrinderConfig = {
  id: 'grinder-timemore-s3',
  name: 'Timemore S3',
  scaleType: 'dial',
  minScale: 0,
  maxScale: 9,
  stepSize: 0.5,
  description: 'Dial externo de precisión con escala de 0 al 9 en medios pasos (ej. Dial 5.5, Dial 6).',
};

export const POPULAR_GRINDERS: GrinderConfig[] = [
  {
    id: 'grinder-timemore-s3',
    name: 'Timemore S3',
    scaleType: 'dial',
    minScale: 0,
    maxScale: 9,
    stepSize: 0.5,
    description: 'Dial externo de precisión (0 al 9 con medios pasos: Dial 5.5, Dial 6...).',
  },
  {
    id: 'grinder-comandante',
    name: 'Comandante C40 MK4',
    scaleType: 'clicks',
    minScale: 0,
    maxScale: 40,
    stepSize: 1,
    description: 'Escala de clicks desde cero. Espresso 8-12, V60 22-26, Prensa 28-32.',
  },
  {
    id: 'grinder-baratza-encore',
    name: 'Baratza Encore / ESP',
    scaleType: 'numbers',
    minScale: 1,
    maxScale: 40,
    stepSize: 1,
    description: 'Tolva graduada de 40 posiciones (Filtro 15-28, Prensa 28-36).',
  },
  {
    id: 'grinder-1zpresso',
    name: '1Zpresso K-Ultra',
    scaleType: 'numbers',
    minScale: 1,
    maxScale: 9,
    stepSize: 0.1,
    description: 'Anillo de ajuste micrométrico externo de 1.0 a 9.0 con pasos de 0.1.',
  },
  {
    id: 'grinder-fellow-ode',
    name: 'Fellow Ode Gen 2',
    scaleType: 'dial',
    minScale: 1,
    maxScale: 11,
    stepSize: 0.5,
    description: 'Dial frontal de 1 a 11 con pasos medios optimizado para filtro.',
  },
  {
    id: 'grinder-timemore-c3',
    name: 'Timemore Chestnut C2 / C3',
    scaleType: 'clicks',
    minScale: 0,
    maxScale: 30,
    stepSize: 1,
    description: 'Clicks internos. V60 16-19 clicks, Prensa 22-25 clicks.',
  },
];

/**
 * Maps normalized grind factor [0.0 - 1.0] to a specific grinder scale
 */
export function calculateGrindSetting(
  normalized: number,
  grinder: GrinderConfig,
  offsetSteps: number = 0
): { numericValue: number; formatted: string; reason: string } {
  const range = grinder.maxScale - grinder.minScale;
  let rawValue = grinder.minScale + normalized * range;

  // Apply step size quantization
  let steppedValue = Math.round(rawValue / grinder.stepSize) * grinder.stepSize;

  // Apply dial-in offset from feedback
  steppedValue += offsetSteps * grinder.stepSize;

  // Clamp within grinder bounds
  steppedValue = Math.max(grinder.minScale, Math.min(grinder.maxScale, steppedValue));

  // Round to avoid floating point issues like 4.50000000001
  const decimals = grinder.stepSize < 1 ? (grinder.stepSize.toString().split('.')[1] || '').length : 0;
  steppedValue = Number(steppedValue.toFixed(decimals));

  let formatted = '';
  switch (grinder.scaleType) {
    case 'dial':
      formatted = `Dial ${steppedValue}`;
      break;
    case 'clicks':
      formatted = `${steppedValue} Clicks`;
      break;
    case 'numbers':
      formatted = `Paso ${steppedValue}`;
      break;
    default:
      formatted = `${steppedValue}`;
      break;
  }

  let reason = '';
  if (normalized < 0.25) {
    reason = 'Molienda muy fina para retener la presión adecuada.';
  } else if (normalized < 0.42) {
    reason = 'Molienda media-fina para extracción rápida y aromática.';
  } else if (normalized < 0.58) {
    reason = 'Molienda media balanceada para goteo uniforme.';
  } else if (normalized < 0.75) {
    reason = 'Molienda media-gruesa para evitar que el filtro grueso se tape.';
  } else {
    reason = 'Molienda gruesa para inmersión prolongada sin amargor.';
  }

  return {
    numericValue: steppedValue,
    formatted,
    reason,
  };
}

/**
 * Calculates optimal water temperature based on roast level and coffee process
 */
export function calculateWaterTemp(coffee: CoffeeBean, method: BrewMethodDetails): number {
  if (method.id === 'cold_drip') {
    return 20; // Room temp / cold
  }

  const [minTemp, maxTemp] = method.waterTempRange;
  let baseTemp = (minTemp + maxTemp) / 2;

  // Temperature based on roast level
  switch (coffee.roastLevel) {
    case 'light':
      // Denser, harder to extract -> high temp
      baseTemp = maxTemp;
      break;
    case 'medium_light':
      baseTemp = maxTemp - 1;
      break;
    case 'medium':
      baseTemp = Math.round((minTemp + maxTemp) / 2);
      break;
    case 'medium_dark':
      baseTemp = minTemp + 1;
      break;
    case 'dark':
      // High solubility, prone to astringency -> low temp
      baseTemp = minTemp;
      break;
  }

  // Adjust slightly for process
  if (coffee.process === 'washed') {
    // Washed coffees handle heat well
    baseTemp = Math.min(maxTemp, baseTemp + 0.5);
  } else if (coffee.process === 'natural' || coffee.process === 'anaerobic') {
    // Fermented and naturals can extract bitter edges quickly
    baseTemp = Math.max(minTemp, baseTemp - 0.5);
  }

  return Math.round(baseTemp);
}

/**
 * Main recipe generator engine
 */
export function generateRecipe(
  coffee: CoffeeBean,
  methodId: BrewMethodId,
  grinder: GrinderConfig,
  customDose?: number,
  customRatio?: number,
  dialInState?: CoffeeDialInState
): GeneratedRecipe {
  const method = BREW_METHODS[methodId];
  const doseGrams = customDose || method.defaultDoseGrams;
  const ratio = customRatio || method.defaultRatio;
  const totalWaterGrams = Math.round(doseGrams * ratio);

  // Normalize base grind
  let normalizedGrind = method.relativeGrindNormalized;

  // Adjust normalized grind slightly for roast and process
  if (coffee.roastLevel === 'light') {
    normalizedGrind -= 0.03; // Light roasts: slightly finer to aid extraction
  } else if (coffee.roastLevel === 'dark') {
    normalizedGrind += 0.04; // Dark roasts: slightly coarser to curb astringency
  }

  if (coffee.process === 'natural' || coffee.process === 'anaerobic') {
    normalizedGrind += 0.02; // Naturals produce more fines
  }

  normalizedGrind = Math.max(0.02, Math.min(0.98, normalizedGrind));

  // Apply user dial-in offset if exists
  const offsetSteps = dialInState?.grindOffset || 0;
  const grindResult = calculateGrindSetting(normalizedGrind, grinder, offsetSteps);

  // Water temp
  let waterTemp = calculateWaterTemp(coffee, method);
  if (dialInState?.tempOffsetCelsius) {
    waterTemp += dialInState.tempOffsetCelsius;
  }

  // Build steps tailored to the method
  const steps: RecipeStep[] = [];
  const tips: string[] = [];

  if (methodId === 'v60') {
    const bloomWater = Math.round(doseGrams * 3); // 3x dose for bloom
    const remainingWater = totalWaterGrams - bloomWater;
    const pour1Delta = Math.round(remainingWater * 0.55);
    const pour2Delta = remainingWater - pour1Delta;

    const pour1Target = bloomWater + pour1Delta;
    const pour2Target = totalWaterGrams;

    // Bloom step
    steps.push({
      id: 'step-1',
      title: 'Bloom & Pre-infusión',
      description: `Vierte ${bloomWater}g de agua en círculos suaves desde el centro. Realiza un leve giro/swirl del cono para asegurar que todo el grano quede húmedo.`,
      durationSeconds: 45,
      waterDeltaGrams: bloomWater,
      targetWaterGrams: bloomWater,
      pourType: 'bloom',
    });

    // Pour 1
    steps.push({
      id: 'step-2',
      title: 'Primer Vertido Principal',
      description: `Vierte ${pour1Delta}g con flujo suave y constante en círculos concéntricos sin tocar las paredes de papel hasta alcanzar ${pour1Target}g.`,
      durationSeconds: 45,
      waterDeltaGrams: pour1Delta,
      targetWaterGrams: pour1Target,
      pourType: 'pour',
    });

    // Pour 2
    steps.push({
      id: 'step-3',
      title: 'Segundo Vertido de Estructura',
      description: `Vierte los últimos ${pour2Delta}g hacia el centro para mantener la turbulencia controlada hasta completar los ${pour2Target}g.`,
      durationSeconds: 45,
      waterDeltaGrams: pour2Delta,
      targetWaterGrams: pour2Target,
      pourType: 'pour',
    });

    // Drawdown
    steps.push({
      id: 'step-4',
      title: 'Drenaje Final (Drawdown)',
      description: 'Da un último swirl suave para una cama de café perfectamente plana. Deja que el café filtre por completo.',
      durationSeconds: 60,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'drain',
    });

    tips.push('Enjuaga el filtro de papel con agua caliente antes de agregar el café para eliminar notas de celulosa.');
    tips.push(`Para este tueste ${coffee.roastLevel === 'light' ? 'claro' : 'especial'}, el vertido suave mantiene la acidez viva y sedosa.`);
  } else if (methodId === 'aeropress') {
    steps.push({
      id: 'step-1',
      title: 'Infusión Inicial y Agitación',
      description: `Vierte ${totalWaterGrams}g de agua caliente a ${waterTemp}°C de forma enérgica sobre el café seco.`,
      durationSeconds: 30,
      waterDeltaGrams: totalWaterGrams,
      targetWaterGrams: totalWaterGrams,
      pourType: 'pour',
    });

    steps.push({
      id: 'step-2',
      title: 'Turbulencia / Mezcla',
      description: 'Remueve con la espátula o cuchara haciendo movimientos circulares de adelante a atrás durante 10 segundos.',
      durationSeconds: 20,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'stir',
    });

    steps.push({
      id: 'step-3',
      title: 'Reposo e Inserción del Émbolo',
      description: 'Coloca el émbolo ligeramente en la parte superior para crear sello de vacío y deja que el café infusione.',
      durationSeconds: 60,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'wait',
    });

    steps.push({
      id: 'step-4',
      title: 'Prensado Suave y Constante',
      description: 'Presiona el émbolo con la palma de la mano de forma suave y controlada hasta escuchar el primer siseo de aire.',
      durationSeconds: 40,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'press',
    });

    tips.push('Detén el prensado tan pronto escuches el silbido de aire ("hiss") para evitar notas amargas finales.');
  } else if (methodId === 'chemex') {
    const bloomWater = Math.round(doseGrams * 2.5);
    const pour1 = Math.round((totalWaterGrams - bloomWater) * 0.5);
    const pour2 = totalWaterGrams - bloomWater - pour1;

    steps.push({
      id: 'step-1',
      title: 'Bloom Generoso',
      description: `Vierte ${bloomWater}g humedeciendo uniformemente todo el lecho. Observa la liberación de CO2.`,
      durationSeconds: 50,
      waterDeltaGrams: bloomWater,
      targetWaterGrams: bloomWater,
      pourType: 'bloom',
    });

    steps.push({
      id: 'step-2',
      title: 'Primer Vertido Espiral',
      description: `Vierte ${pour1}g en círculos constantes manteniendo el nivel del agua a 2 cm del borde del filtro. Llega a ${bloomWater + pour1}g.`,
      durationSeconds: 60,
      waterDeltaGrams: pour1,
      targetWaterGrams: bloomWater + pour1,
      pourType: 'pour',
    });

    steps.push({
      id: 'step-3',
      title: 'Segundo Vertido Final',
      description: `Vierte los ${pour2}g restantes al centro con flujo fino hasta alcanzar los ${totalWaterGrams}g totales.`,
      durationSeconds: 60,
      waterDeltaGrams: pour2,
      targetWaterGrams: totalWaterGrams,
      pourType: 'pour',
    });

    steps.push({
      id: 'step-4',
      title: 'Filtrado y Oxigenación',
      description: 'Espera el drenaje total del cuello. Retira el filtro y oxigena la jarra con movimientos circulares antes de servir.',
      durationSeconds: 100,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'drain',
    });

    tips.push('El filtro grueso de Chemex requiere una molienda más gruesa para evitar que se atasque el flujo.');
  } else if (methodId === 'french_press') {
    steps.push({
      id: 'step-1',
      title: 'Vertido Total y Saturación',
      description: `Vierte los ${totalWaterGrams}g de agua sobre los ${doseGrams}g de café asegurando empapar todos los granos.`,
      durationSeconds: 30,
      waterDeltaGrams: totalWaterGrams,
      targetWaterGrams: totalWaterGrams,
      pourType: 'pour',
    });

    steps.push({
      id: 'step-2',
      title: 'Infusión en Reposo',
      description: 'Deja reposar sin colocar la tapa. Se formará una costra aromática en la superficie.',
      durationSeconds: 210, // 3:30 min
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'wait',
    });

    steps.push({
      id: 'step-3',
      title: 'Rotura de Costra y Limpieza',
      description: 'Con una cuchara, rompe suavemente la costra superficial. Los granos caerán al fondo. Retira la espuma blanca sobrante.',
      durationSeconds: 40,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'stir',
    });

    steps.push({
      id: 'step-4',
      title: 'Asentamiento y Filtrado (Técnica Hoffmann)',
      description: 'Inserta el émbolo solo en la superficie como colador, sin empujar al fondo. Sirve despacio sin agitar.',
      durationSeconds: 80,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'press',
    });

    tips.push('No bajes el émbolo hasta el fondo para evitar que los sedimentos finos se dispersen en la taza.');
  } else if (methodId === 'espresso') {
    steps.push({
      id: 'step-1',
      title: 'Distribución y Prensado (Tamping)',
      description: `Pesa exactamente ${doseGrams}g, distribuye con WDT si tienes y prensa nivelado con 15kg de fuerza constante.`,
      durationSeconds: 15,
      waterDeltaGrams: 0,
      targetWaterGrams: 0,
      pourType: 'wait',
    });

    steps.push({
      id: 'step-2',
      title: 'Pre-infusión a Baja Presión',
      description: 'Activa la bomba a 2-3 bares para saturar la pastilla uniformemente antes del pico de presión.',
      durationSeconds: 6,
      waterDeltaGrams: Math.round(totalWaterGrams * 0.15),
      targetWaterGrams: Math.round(totalWaterGrams * 0.15),
      pourType: 'pour',
    });

    steps.push({
      id: 'step-3',
      title: 'Extracción a 9 Bares',
      description: `Observa la caída en cola de ratón con crema atigrada hasta alcanzar ${totalWaterGrams}g en taza.`,
      durationSeconds: 25,
      waterDeltaGrams: Math.round(totalWaterGrams * 0.85),
      targetWaterGrams: totalWaterGrams,
      pourType: 'pour',
    });

    tips.push(`Tiempo ideal en taza: 26-30 segundos para un ratio 1:${ratio}.`);
  // Kalita Wave method removed
  } else {
    // cold brew
    steps.push({
      id: 'step-1',
      title: 'Maceración Inicial',
      description: `Mezcla ${doseGrams}g de café molienda gruesa con ${totalWaterGrams}g de agua filtrada fría en tu recipiente.`,
      durationSeconds: 60,
      waterDeltaGrams: totalWaterGrams,
      targetWaterGrams: totalWaterGrams,
      pourType: 'pour',
    });

    steps.push({
      id: 'step-2',
      title: 'Maceración en Frío (18-24 horas)',
      description: 'Tapa herméticamente y deja reposar en refrigerador o temperatura fresca de 16 a 24 horas.',
      durationSeconds: 300,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'wait',
    });

    steps.push({
      id: 'step-3',
      title: 'Filtrado Doble',
      description: 'Pasa el concentrado por filtro de papel para obtener una bebida translúcida y brillante.',
      durationSeconds: 240,
      waterDeltaGrams: 0,
      targetWaterGrams: totalWaterGrams,
      pourType: 'drain',
    });

    tips.push('Sirve sobre hielo con una rodaja de naranja deshidratada o leche vegetal.');
  }

  const totalEstimatedTimeSeconds = steps.reduce((sum, s) => sum + s.durationSeconds, 0);

  return {
    coffeeId: coffee.id,
    coffeeName: coffee.name,
    methodId,
    methodName: method.name,
    doseGrams,
    totalWaterGrams,
    ratio,
    waterTempCelsius: waterTemp,
    grindSettingFormatted: grindResult.formatted,
    grindSettingValue: grindResult.numericValue,
    grindRecommendationReason: grindResult.reason,
    totalEstimatedTimeSeconds,
    steps,
    tips,
    dialInOffset: offsetSteps,
  };
}
