import { Metadata } from 'next';
import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import { FeedContent } from './_components/FeedContent';
import { listOffers } from '@/lib/services/offers';
import { SITE_URL } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Opportunities Feed – SMC Platform | SaaS & Digital Assets',
  description:
    'Explore SaaS, marketplace, and newsletter buying opportunities with MRR, churn, and investment range metrics. Public preview of SMC Platform.',
  keywords: 'SaaS feed, digital opportunities, digital assets for sale, buy SaaS, invest in SaaS',
  openGraph: {
    title: 'Opportunities Feed – SMC Platform',
    description: 'Public preview with the best digital assets opportunities from SMC Platform.',
    url: `${SITE_URL}/feed`,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image'
  }
};

interface NormalizedOffer {
  id: string;
  slug: string;
  title: string;
  summary: string;
  classification: string;
  niche: string;
  investmentRange: {
    min: number;
    max: number;
  };
  revenueRange: string;
  valuationMultiple: string;
  badges: string[];
  metrics: {
    mrr?: string;
  };
}

const normalizeOffer = (offer: any): NormalizedOffer => {
  const asset = offer.asset ?? null;
  const mrrValue = asset?.mrr ?? null;
  const arrValue = asset?.arr ?? null;
  const formattedMRR = typeof mrrValue === 'number' ? `$${mrrValue.toLocaleString('en-US')}` : undefined;

  return {
    id: offer.id,
    slug: asset?.slug ?? offer.id,
    title: asset?.name ?? offer.asset?.slug ?? 'Digital asset',
    summary: asset?.description ?? 'Asset listed on the marketplace.',
    classification: asset?.category ?? 'Asset',
    niche: asset?.category ?? 'Digital assets',
    investmentRange: {
      min: offer.price,
      max: offer.price
    },
    revenueRange: formattedMRR ? `MRR ${formattedMRR}` : 'Custom',
    valuationMultiple:
      typeof arrValue === 'number' && arrValue > 0
        ? `${(offer.price / arrValue).toFixed(1)}x ARR`
        : 'Custom',
    badges: [],
    metrics: {
      mrr: formattedMRR
    }
  };
};

export default async function FeedPage() {
  let offers: NormalizedOffer[] = [];
  
  try {
    const offerResult = await listOffers({ pageSize: 50 });
    offers = offerResult.items.map(normalizeOffer);
  } catch (error) {
    console.error('[feed] Failed to load offers', error);
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Opportunities Feed – SMC Platform',
    description:
      'Curated list of digital assets, SaaS, and newsletters available for acquisition with MRR, churn, and investment ticket metrics.',
    mainEntity: offers.map((offer, index: number) => ({
      '@type': 'Offer',
      position: index + 1,
      url: `${SITE_URL}/offers/${offer.slug}`,
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
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <MarketingPageLayout
        title="Opportunities Feed"
        description="Explore SaaS, marketplace, and newsletter buying opportunities with audited metrics"
        showHero={true}
      >
        <FeedContent offers={offers} />
      </MarketingPageLayout>
    </>
  );
}

