import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BLOOM | Laboratorio de Café de Especialidad & Dial-In',
  description:
    'Generador de recetas inteligentes para café de especialidad con calibración exacta de molinillo, temporizador paso a paso con Web Audio API y visión Gemini 1.5 Flash.',
  icons: {
    icon: '/favicon.png',
    apple: '/bloom-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`dark ${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-[#FAF7F4] dark:bg-[#121214] text-stone-900 dark:text-[#F5F5F7] selection:bg-[#C88A6E] selection:text-white">
        {children}
      </body>
    </html>
  );
}
