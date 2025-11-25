/**
 * Centralized Design Tokens
 * 
 * Design token system to maintain visual consistency
 * across the entire application. Used by components and global styles.
 * 
 * Neo Finance Identity - CounterX Platform
 */

export const colors = {
  // CounterX Brand Colors (Neo Finance Identity)
  primary: {
    50: '#e6f0ff',
    100: '#b3d1ff',
    200: '#80b3ff',
    300: '#4d94ff',
    400: '#1a75ff',
    500: '#0044CC', // CounterX Primary Blue
    600: '#0033AA',
    700: '#002288',
    800: '#001166',
    900: '#000044',
    950: '#000022'
  },
  // Neo Finance Accent Colors
  accent: {
    electric: '#0044CC', // Primary blue
    dark: '#050711', // Dark background
    surface: '#0b1224', // Surface dark
    gray: '#9EA3B0', // Neutral gray
    white: '#FFFFFF' // Pure white
  },
  // Semantic Colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  // Neutral Colors
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  }
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem' // 64px
} as const;

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px'
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgba(99, 102, 241, 0.15)'
} as const;

export const typography = {
  fontFamily: {
    primary: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif']
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

/**
 * Z-index scale para camadas da aplicação
 */
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
} as const;

/**
 * Configuração de tema (claro/escuro)
 */
export const theme = {
  light: {
    background: colors.slate[50],
    surface: '#ffffff',
    text: colors.slate[900],
    textSecondary: colors.slate[600],
    border: colors.slate[200]
  },
  dark: {
    background: colors.slate[950],
    surface: colors.slate[900],
    text: colors.slate[50],
    textSecondary: colors.slate[400],
    border: colors.slate[700]
  }
} as const;




