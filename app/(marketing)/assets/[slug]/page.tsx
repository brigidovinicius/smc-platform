import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { SITE_CONFIG, SITE_URL } from '@/lib/config/site-config';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/prisma';
import { ASSET_TYPE_LABELS } from '@/lib/assetTypes';
import { LeadInterestForm } from '@/components/marketplace/LeadInterestForm';

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const asset = await prisma.asset.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: { owner: { select: { name: true } } },
  });

  if (!asset) {
    return {
      title: 'Asset not found | CounterX',
    };
  }

  const canonical = `${SITE_URL}/assets/${asset.slug}`;
  const typeLabel = ASSET_TYPE_LABELS[asset.type] || 'Digital Asset';

  return {
    title: `${asset.title} | ${typeLabel} for Sale | CounterX`,
    description: asset.shortDescription,
    keywords: `buy ${asset.type.toLowerCase()}, digital assets, ${typeLabel}, ${asset.type}`,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${asset.title} | CounterX`,
      description: asset.shortDescription,
      url: canonical,
      type: 'website',
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${asset.title} | CounterX`,
      description: asset.shortDescription,
      creator: SITE_CONFIG.twitter?.handle,
    },
  };
}

export default async function AssetPage({ params }: Params) {
  const asset = await prisma.asset.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      performance: true,
      media: true,
    },
  });

  if (!asset) {
    notFound();
  }

  const canonical = `${SITE_URL}/assets/${asset.slug}`;
  const typeLabel = ASSET_TYPE_LABELS[asset.type] || 'Digital Asset';

  // JSON-LD structured data
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: asset.title,
    description: asset.shortDescription,
    category: typeLabel,
    offers: {
      '@type': 'Offer',
      price: asset.askingPrice,
      priceCurrency: asset.currency,
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
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
              {/* Breadcrumb */}
              <nav className="text-sm text-[#0044CC] flex items-center gap-2" aria-label="breadcrumb">
                <Link href="/" className="hover:underline">Home</Link>
                <span>›</span>
                <Link href="/marketplace" className="hover:underline">Marketplace</Link>
                <span>›</span>
                <span className="text-slate-600">{asset.title}</span>
              </nav>

              {/* Header */}
              <header className="space-y-4">
                <Badge variant="outline">{typeLabel}</Badge>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{asset.title}</h1>
                <p className="text-slate-600 text-lg">{asset.shortDescription}</p>
              </header>

              {/* Pricing & Key Metrics */}
              <section className="grid md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <div>
                  <p className="text-slate-500 text-xs uppercase mb-1">Asking Price</p>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {asset.currency} {asset.askingPrice.toLocaleString()}
                  </h2>
                </div>
                {asset.mrr && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">MRR</p>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {asset.currency} {asset.mrr.toLocaleString()}
                    </h2>
                  </div>
                )}
                {asset.monthlyRevenue && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Monthly Revenue</p>
                    <p className="text-slate-900">{asset.currency} {asset.monthlyRevenue.toLocaleString()}</p>
                  </div>
                )}
                {asset.monthlyProfit && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Monthly Profit</p>
                    <p className="text-slate-900">{asset.currency} {asset.monthlyProfit.toLocaleString()}</p>
                  </div>
                )}
                {asset.performance?.monthlyVisitors && (
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Monthly Visitors</p>
                    <p className="text-slate-900">{asset.performance.monthlyVisitors.toLocaleString()}</p>
                  </div>
                )}
              </section>

              {/* Description */}
              <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">About This Asset</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 whitespace-pre-wrap">{asset.fullDescription}</p>
                </div>
              </section>

              {/* Advisory Valuation (if available) */}
              {asset.suggestedMinPrice && asset.suggestedMaxPrice && (
                <section className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Advisory Valuation</h2>
                  <p className="text-slate-600 mb-2">
                    Based on similar deals, the estimated value range is{' '}
                    <strong>{asset.currency} {asset.suggestedMinPrice.toLocaleString()}</strong> –{' '}
                    <strong>{asset.currency} {asset.suggestedMaxPrice.toLocaleString()}</strong>.
                  </p>
                  {asset.valuationNote && (
                    <p className="text-sm text-slate-500 italic">{asset.valuationNote}</p>
                  )}
                </section>
              )}

              {/* Media Gallery */}
              {asset.media && asset.media.length > 0 && (
                <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Media Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {asset.media.map((media) => (
                      <div key={media.id} className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                        <img
                          src={media.url}
                          alt={media.label || 'Asset media'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <LeadInterestForm assetId={asset.id} assetTitle={asset.title} assetSlug={asset.slug} />
            </div>
          </div>
        </section>
      </MarketingPageLayout>
    </>
  );
}


