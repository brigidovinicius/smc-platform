import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllOffers, getOfferBySlug } from '@/lib/offers';
import { SITE_CONFIG, SITE_URL } from '@/lib/config/site-config';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';

const metricsList = [
  { key: 'mrr', label: 'MRR' },
  { key: 'churn', label: 'Churn' },
  { key: 'cac', label: 'CAC' },
  { key: 'ltv', label: 'LTV' }
];

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  const offers = getAllOffers();
  return offers.map((offer) => ({
    slug: offer.slug
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const offer = getOfferBySlug(params.slug);

  if (!offer) {
    return {
      title: 'Asset not found | CounterX'
    };
  }

  const canonical = `${SITE_URL}/asset/${offer.slug}`;

  return {
    title: `${offer.title} | CounterX`,
    description: offer.summary,
    keywords: `buy SaaS, digital assets, ${offer.niche}, ${offer.classification}, SaaS multiples`,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical
    },
    openGraph: {
      title: `${offer.title} | CounterX`,
      description: offer.summary,
      url: canonical,
      type: 'website',
      siteName: SITE_CONFIG.name
    },
    twitter: {
      card: 'summary_large_image',
      title: `${offer.title} | CounterX`,
      description: offer.summary,
      creator: SITE_CONFIG.twitter.handle
    }
  };
}

export default function AssetPage({ params }: Params) {
  const offer = getOfferBySlug(params.slug);

  if (!offer) {
    notFound();
  }

  const canonical = `${SITE_URL}/asset/${offer.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    url: canonical,
    priceCurrency: 'USD',
    itemOffered: {
      '@type': 'Product',
      name: offer.title,
      category: offer.classification,
      description: offer.summary
    },
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      minPrice: offer.investmentRange?.min ?? undefined,
      maxPrice: offer.investmentRange?.max ?? undefined
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'MRR', value: offer.metrics?.mrr },
      { '@type': 'PropertyValue', name: 'Churn', value: offer.metrics?.churn },
      { '@type': 'PropertyValue', name: 'CAC', value: offer.metrics?.cac },
      { '@type': 'PropertyValue', name: 'LTV', value: offer.metrics?.ltv }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <MarketingPageLayout>
        <section className="py-16 bg-white min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <nav className="text-sm text-[#0044CC] flex items-center gap-2" aria-label="breadcrumb">
                <Link href="/" className="hover:underline">Home</Link>
                <span>›</span>
                <Link href="/marketplace" className="hover:underline">Marketplace</Link>
                <span>›</span>
                <span className="text-slate-600">{offer.title}</span>
              </nav>

              <header className="space-y-4">
                <p className="uppercase tracking-[0.4em] text-xs text-[#0044CC]">{offer.classification}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{offer.title}</h1>
                <p className="text-slate-600 text-lg">{offer.summary}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>{offer.niche}</span>
                  <span>•</span>
                  <span>{offer.valuationMultiple}</span>
                  <span>•</span>
                  <span>{offer.revenueRange}</span>
                </div>
              </header>

              <section className="grid md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <div>
                  <p className="text-slate-500 text-xs uppercase mb-1">Estimated investment</p>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {offer.investmentRange
                      ? `$${(offer.investmentRange.min / 1000).toFixed(0)}k – $${(offer.investmentRange.max / 1000).toFixed(0)}k`
                      : 'Custom'}
                  </h2>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase mb-1">Current MRR</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{offer.metrics?.mrr || 'N/A'}</h2>
                </div>
                {metricsList.map(({ key, label }) => (
                  <div key={key}>
                    <p className="text-slate-500 text-xs uppercase mb-1">{label}</p>
                    <p className="text-slate-900">{(offer.metrics as any)?.[key] || 'N/A'}</p>
                  </div>
                ))}
              </section>

              <section className="space-y-4 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-slate-900">Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {offer.badges?.map((badge) => (
                    <span key={badge} className="px-3 py-1 rounded-full text-xs bg-[#0044CC]/10 text-[#0044CC] border border-[#0044CC]/20">
                      {badge}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
                <p className="text-slate-600">
                  This area is exclusive for logged-in members. By proceeding, you&apos;ll receive the complete memorandum, financial data, and
                  technical checkpoints for due diligence.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/auth/login?callbackUrl=/profile" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0044CC] text-white font-medium hover:bg-[#0033AA] transition-colors">
                    Talk to an advisor
                  </Link>
                  <Link href="/wizard" className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-[#0044CC] text-[#0044CC] font-medium hover:bg-[#0044CC]/5 transition-colors">
                    I want to list my asset
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </section>
      </MarketingPageLayout>
    </>
  );
}

