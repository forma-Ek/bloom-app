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
        coffee: {
          50: "#fbf8f5",
          100: "#f4ede4",
          200: "#e9dac9",
          300: "#dac0a3",
          400: "#c7a07c",
          500: "#b8875e",
          600: "#aa714f",
          700: "#8e5a40",
          800: "#734937",
          900: "#241812",
          950: "#140c09",
        },
        crema: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        roast: {
          dark: "#0b0908",
          card: "#17120e",
          border: "#2d231c",
          hover: "#251d17",
        }
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
