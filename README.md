# ☕ BLOOM — Laboratorio de Café de Especialidad & Dial-In

Una aplicación web moderna y completa construida con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons** y **Zustand** con persistencia en **LocalStorage**, diseñada para baristas y entusiastas del café de especialidad.

---

## 🌟 Funcionalidades Principales

### 1. ⚙️ Configuración de Equipo y Molinillo
- **Escala de molienda 100% personalizable**:
  - Diales numéricos con medios pasos (ej. dial externo 0 al 9 con pasos de 0.5 para Fellow Ode o Baratza).
  - Clicks enteros desde el punto cero (ej. Comandante C40 MK4 con escala 0-40, Timemore C2/C3 con 0-30).
  - Escalas micrométricas decimales (ej. 1Zpresso K-Ultra con pasos de 0.1, DF64 Gen 2 con marcas 0-90).
  - **Simulador interactivo del dial** en tiempo real.
- **Selección de métodos de preparación**:
  - Hario V60, AeroPress, Chemex, Prensa Francesa, Espresso y Cold Brew.
  - Conmutadores para activar los métodos que posees en tu estación de café.
  - Mapa de calibración que muestra cómo se traduce cada método a la escala de tu molinillo.

### 2. 🫘 Catálogo de Café & Escaneo con Visión Artificial
- **Formulario manual de especialidad**:
  - Nombre/Finca, Tostador, Origen (País y Región), Variedad botánica (Geisha, Bourbon, Castillo, etc.), Proceso (Lavado, Natural, Honey, Anaeróbico, Experimental), Nivel de Tueste (Claro, Medio-Claro, Medio, etc.), Altitud (msnm), Fecha de tueste y Notas de cata interactivas.
- **Lectura por foto con Google Gemini 1.5 Flash (`gemini-1.5-flash`)**:
  - Sube una foto de la bolsa de café o etiqueta.
  - Gemini analiza la imagen y extrae automáticamente los datos en formato estructurado para autocompletar el formulario.
  - Soporte de API Key personal y **modo demo inteligente** integrado.
- **Control de Desgasificación (Degassing)**:
  - Cálculo automático de días transcurridos desde la fecha de tueste con indicador del punto óptimo de consumo.

### 3. 🧪 Generador de Recetas Inteligente
- Cálculo adaptativo de temperatura de agua y molienda según:
  - Nivel de tueste (los tuestes claros extraen mejor con agua más caliente y molienda fina; los oscuros con menor temperatura).
  - Proceso de beneficio (granos anaeróbicos y naturales producen más finos; el algoritmo compensa el caudal).
  - Dosis ajustable en gramos con recálculo dinámico del ratio agua/café.
  - **Ajuste exacto de molienda**: Traducido a las marcas o clicks de tu molinillo.
  - Desglose cronológico de vertidos (Bloom, vertidos de estructura, reposo y drawdown final).

### 4. ⏱️ Modo Extracción (Temporizador Paso a Paso a Pantalla Completa)
- Pantalla completa interactiva de inmersión total.
- Cronómetro digital gigante de alta precisión (MM:SS) y cuenta regresiva por paso.
- Balanza virtual con cantidad a verter en el paso actual (`+X g`) y peso objetivo acumulado.
- **Avisos sonoros sintéticos con Web Audio API nativa**:
  - Blips sonoros en la cuenta atrás (3, 2, 1).
  - Campanilla armónica de dos tonos al concluir cada paso de vertido.
  - Acorde mayor de finalización con animación de confeti.
  - Control de volumen / silenciar sonido.

### 5. 🎯 Feedback Sensorial & Auto-Ajuste (Dial-In Engine)
- Al terminar la receta, pregunta: *¿Cómo estuvo tu café?*
  - 🌟 *Perfecto & Balanceado*
  - ⚡ *Amargo / Sobreextraído*
  - 🍋 *Ácido / Subextraído*
  - ⏱️ *Flujo Muy Lento / Atascado*
  - 💨 *Flujo Demasiado Rápido*
- **Auto-Ajuste**: Calibra automáticamente la molienda (más gruesa o más fina) y la temperatura del agua para la siguiente vez que prepares ese mismo café con ese método.
- **Historial de Extracciones**: Registro de preparaciones anteriores y evolución de los parámetros.

### 6. 🎨 Diseño & Persistencia
- **Tema Oscuro por defecto** con paleta de café de especialidad (tonos espresso, ámbar, crema y carbón) y conmutador a **Tema Claro**.
- Persistencia total en el navegador mediante **Zustand** y **LocalStorage**.
- Pre-cargado con cafés de especialidad de ejemplo (Geisha Cerro Azul, Yirgacheffe Idido Anaeróbico, Pink Bourbon El Paraíso).

---

## 🚀 Cómo Ejecutar la Aplicación

```bash
# Instalar dependencias (ya instaladas)
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Compilar para producción
npm run build

# Iniciar en producción
npm start
```

---

## 📁 Estructura del Código

```
BLOOM-Coffee/
├── src/
│   ├── app/
│   │   ├── api/scan-bag/route.ts  # Endpoint de escaneo con Gemini 1.5 Flash
│   │   ├── globals.css            # Estilos globales y temas oscuro/claro
│   │   ├── layout.tsx             # Metadatos y fuentes tipográficas
│   │   └── page.tsx               # Orquestador principal de la aplicación
│   ├── components/
│   │   ├── coffee/
│   │   │   ├── AddCoffeeModal.tsx # Formulario manual + escáner IA
│   │   │   ├── CoffeeCard.tsx     # Tarjeta de café con notas y reposo
│   │   │   └── CoffeeCatalog.tsx  # Catálogo con buscador y filtros
│   │   ├── common/
│   │   │   └── ApiKeyModal.tsx    # Configuración de Gemini API Key
│   │   ├── equipment/
│   │   │   ├── EquipmentSection.tsx    # Métodos activos y vista de equipo
│   │   │   └── GrinderConfigModal.tsx  # Calibración de molinillo y dial
│   │   ├── feedback/
│   │   │   └── DialInFeedbackModal.tsx # Evaluación sensorial y auto-ajuste
│   │   ├── history/
│   │   │   └── BrewHistorySection.tsx  # Historial de preparaciones
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Barra superior con accesos rápidos
│   │   │   └── ThemeToggle.tsx    # Conmutador de tema claro/oscuro
│   │   ├── recipe/
│   │   │   └── RecipeGenerator.tsx# Generador de recetas y parámetros
│   │   └── timer/
│   │       └── ExtractionTimer.tsx# Temporizador fullscreen con Web Audio
│   ├── store/
│   │   └── coffeeStore.ts         # Estado Zustand con LocalStorage
│   ├── types/
│   │   └── index.ts               # Definición de tipos TypeScript
│   └── utils/
│       ├── audio.ts               # Sintetizador Web Audio API nativo
│       └── recipeCalculator.ts    # Motor de calibración de molienda y recetas
├── tailwind.config.ts             # Paleta de colores specialty coffee
├── tsconfig.json
└── package.json
```
