/**
 * Site configuration
 * Centralizes URLs and site metadata for easy management
 */

// Use environment variable or fallback to Vercel deployment URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smc-platform.vercel.app';

export const SITE_CONFIG = {
    name: 'SaaS Market Cap',
    shortName: 'SMC',
    description: 'Digital assets marketplace with automated valuation, AI-assisted due diligence, and verified buyers.',
    url: SITE_URL,
    ogImage: '/images/hero-dashboard.webp',
    twitter: '@saasmarketcap',
    locale: 'en_US'
} as const;



