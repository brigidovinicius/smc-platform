/**
 * Configuração centralizada de fontes
 * Evita duplicação entre App Router e Pages Router
 */
import { Inter, Space_Grotesk } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Mantém compatibilidade com CSS vars antigas
  fallback: ['system-ui', 'sans-serif']
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  fallback: ['Inter', 'system-ui', 'sans-serif']
});

// Classes combinadas para uso em layouts
export const fontClasses = `${inter.variable} ${spaceGrotesk.variable}`;
export const fontBodyClass = inter.className;

