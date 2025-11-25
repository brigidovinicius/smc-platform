import Script from 'next/script';
import { SITE_CONFIG } from '@/lib/config/site-config';

export function StructuredData({ faq }: { faq?: Array<{ question: string; answer: string }> }) {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        alternateName: SITE_CONFIG.shortName,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
        description: SITE_CONFIG.description,
        sameAs: [
            SITE_CONFIG.twitter.baseUrl,
            'https://linkedin.com/company/counterx'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['English']
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

    return (
        <>
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="service-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            {faqSchema && (
                <Script
                    id="faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
