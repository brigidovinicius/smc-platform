import { Metadata } from 'next';
import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import { FeedContent } from './_components/FeedContent';
import { listOffers } from '@/lib/services/offers';
import { SITE_URL } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Feed de oportunidades – SMC Platform | SaaS & ativos digitais',
  description:
    'Explore oportunidades de compra de SaaS, marketplaces e newsletters com métricas de MRR, churn e faixa de investimento. Prévia pública da SMC Platform.',
  keywords: 'feed de SaaS, oportunidades digitais, ativos digitais à venda, comprar SaaS, investir em SaaS',
  openGraph: {
    title: 'Feed de oportunidades – SMC Platform',
    description: 'Prévia pública com as melhores oportunidades de ativos digitais da SMC Platform.',
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
  const formattedMRR = typeof mrrValue === 'number' ? `R$ ${mrrValue.toLocaleString('pt-BR')}` : undefined;

  return {
    id: offer.id,
    slug: asset?.slug ?? offer.id,
    title: asset?.name ?? offer.asset?.slug ?? 'Ativo digital',
    summary: asset?.description ?? 'Ativo cadastrado no marketplace.',
    classification: asset?.category ?? 'Ativo',
    niche: asset?.category ?? 'Ativos digitais',
    investmentRange: {
      min: offer.price,
      max: offer.price
    },
    revenueRange: formattedMRR ? `MRR ${formattedMRR}` : 'Sob consulta',
    valuationMultiple:
      typeof arrValue === 'number' && arrValue > 0
        ? `${(offer.price / arrValue).toFixed(1)}x ARR`
        : 'Sob consulta',
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
    console.error('[feed] Falha ao carregar ofertas', error);
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Feed de oportunidades – SMC Platform',
    description:
      'Lista curada de ativos digitais, SaaS e newsletters disponíveis para aquisição com métricas de MRR, churn e ticket de investimento.',
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
        priceCurrency: 'BRL',
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
        title="Feed de Oportunidades"
        description="Explore oportunidades de compra de SaaS, marketplaces e newsletters com métricas auditadas"
        showHero={true}
      >
        <FeedContent offers={offers} />
      </MarketingPageLayout>
    </>
  );
}

