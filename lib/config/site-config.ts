/**
 * Site configuration
 * Centralizes URLs and site metadata for easy management
 */

// Use environment variable or fallback to Vercel deployment URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smc-platform.vercel.app';

export const SITE_CONFIG = {
    name: 'SaaS Market Cap',
    shortName: 'SMC',
    description: 'Marketplace de ativos digitais com valuation automático, due diligence assistida por IA e compradores verificados.',
    url: SITE_URL,
    ogImage: '/images/hero-dashboard.webp',
    twitter: '@saasmarketcap',
    locale: 'pt_BR'
} as const;

