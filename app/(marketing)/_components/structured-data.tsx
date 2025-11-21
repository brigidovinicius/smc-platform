import Script from 'next/script';
import { SITE_CONFIG } from '@/lib/site-config';

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
            `https://twitter.com/${SITE_CONFIG.twitter.replace('@', '')}`,
            'https://linkedin.com/company/saasmarketcap'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['Portuguese', 'English']
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
        name: 'SaaS Market Cap - Marketplace de Ativos Digitais',
        provider: {
            '@type': 'Organization',
            name: SITE_CONFIG.name
        },
        serviceType: 'Digital Asset Marketplace',
        description: SITE_CONFIG.description,
        areaServed: {
            '@type': 'Country',
            name: 'Brazil'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Ativos Digitais',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Valuation Automático',
                        description:
                            'Modelo proprietário que cruza MRR, churn, CAC, LTV e crescimento para recomendar múltiplos de valuation.'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Due Diligence com IA',
                        description:
                            'Checklist inteligente que sinaliza anomalias em receitas, cohort e dependências com histórico completo de métricas.'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Deal-Room Seguro',
                        description:
                            'Uploads criptografados, blur automático e logs de acesso para compartilhar dados sensíveis com segurança.'
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
