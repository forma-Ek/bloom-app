import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Luxury Specialty Coffee Copper / Rose Gold Palette (Matching BLOOM Logo)
        copper: {
          50: "#FAF5F2",
          100: "#F5EAE4",
          200: "#EBD4C8",
          300: "#E2B49A", // Cobre suave / Destacados
          400: "#D49A7E", // Oro rosa medio
          500: "#C88A6E", // Color de Acento Principal (Cobrizo / Oro Rosa)
          600: "#B87556",
          700: "#9E5E41",
          800: "#804A32",
          900: "#5A311F",
          950: "#32190E",
        },
        // Harmonize amber utility classes with the copper rose-gold scale
        amber: {
          50: "#FAF5F2",
          100: "#F5EAE4",
          200: "#EBD4C8",
          300: "#E2B49A",
          400: "#D49A7E",
          500: "#C88A6E", // Acento principal
          600: "#B87556", // Botones primarios hover
          700: "#9E5E41",
          800: "#804A32",
          900: "#5A311F",
          950: "#32190E",
        },
        // Minimalist charcoal and matte black surfaces
        stone: {
          50:  "#FAF7F4", // Fondo modo claro suave
          100: "#F3EDE8",
          200: "#E5DDD5",
          300: "#D4C7BC",
          400: "#A1A1AA", // Gris tenue para legibilidad
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#2A2A30", // Bordes sutiles y divisores
          900: "#1E1E22", // Tarjetas y componentes (Negro mate)
          950: "#121214", // Fondo Tema Oscuro (Carbón profundo minimalista)
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ripple": "ripple 2s linear infinite",
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
