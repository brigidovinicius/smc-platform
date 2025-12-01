import { SITE_CONFIG } from '@/lib/site-config';

export function StructuredData({ faq }: { faq?: Array<{ question: string; answer: string }> }) {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        alternateName: SITE_CONFIG.shortName,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/counterx-primary.svg`,
        description: SITE_CONFIG.description,
        sameAs: [
            SITE_CONFIG.twitter.baseUrl,
            'https://linkedin.com/company/counterx'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['English', 'Portuguese']
        }
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_CONFIG.url}/feed?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };

    const marketplaceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'CounterX Digital Assets Marketplace',
        description: SITE_CONFIG.description,
        brand: {
            '@type': 'Brand',
            name: SITE_CONFIG.name
        },
        offers: {
            '@type': 'AggregateOffer',
            offerCount: '2400+',
            lowPrice: '20000',
            highPrice: '2000000',
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock'
        },
        category: 'Digital Asset Marketplace',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '326'
        }
    };

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'CounterX - Digital Assets Marketplace',
        provider: {
            '@type': 'Organization',
            name: SITE_CONFIG.name
        },
        serviceType: 'Digital Asset Marketplace',
        description: SITE_CONFIG.description,
        areaServed: {
            '@type': 'Country',
            name: 'Global'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Digital Assets',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Automated Valuation',
                        description:
                            'Proprietary model that cross-references MRR, churn, CAC, LTV, and growth to recommend valuation multiples.'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'AI-Powered Due Diligence',
                        description:
                            'Intelligent checklist that flags anomalies in revenue, cohorts, and dependencies with complete metrics history.'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Secure Deal Room',
                        description:
                            'Encrypted uploads, automatic blur, and access logs to share sensitive data securely.'
                    }
                }
            ]
        }
    };

    // FAQ Schema for rich results
    const faqSchema = faq ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    } : null;

    // Render JSON-LD directly in HTML (Server Component)
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
