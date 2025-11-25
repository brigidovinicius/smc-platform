/**
 * Site configuration
 * Centralizes URLs and site metadata for easy management
 * 
 * This is the SINGLE SOURCE OF TRUTH for all site configuration.
 * Always import from this file instead of hardcoding values.
 */

// Use environment variable or fallback to custom domain
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://counterx.io';

export const SITE_CONFIG = {
    name: 'CounterX – The Digital Deal Desk',
    shortName: 'CounterX',
    description: 'CounterX is the modern platform for buying, selling, and valuing SaaS and digital assets.',
    url: SITE_URL,
    keywords: [
        'SaaS marketplace',
        'buy SaaS',
        'sell SaaS',
        'automated valuation',
        'AI due diligence',
        'digital assets M&A',
        'digital assets marketplace',
        'invest in SaaS',
        'ARR multiples',
        'MRR',
        'micro-SaaS',
        'paid newsletters',
        'digital apps',
        'deal room',
        'verified buyers'
    ],
    ogImage: '/images/hero-dashboard.webp',
    openGraph: {
        baseUrl: SITE_URL,
        siteName: 'CounterX – The Digital Deal Desk',
        locale: 'en_US',
        type: 'website'
    },
    twitter: {
        handle: '@counterxio',
        baseUrl: 'https://twitter.com/counterxio'
    },
    locale: 'en_US'
} as const;



