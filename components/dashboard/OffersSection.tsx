'use client';

import EmptyState from '@/components/EmptyState';
import MarketGrid from '@/components/MarketGrid';
import OfferCard from '@/components/OfferCard';

interface Offer {
  id: string;
  price: number;
  status: string;
  asset?: {
    id: string;
    name: string;
    description: string;
    category: string;
    mrr?: number | null;
  };
  sellerId?: string;
}

interface OffersSectionProps {
  offers: Offer[];
  isAdmin?: boolean;
}

export default function OffersSection({ offers, isAdmin = false }: OffersSectionProps) {
  const displayOffers = isAdmin ? offers : offers; // Para admin, mostrar todas
  
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Active Offers</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {displayOffers.length} offer(s) in negotiation
        </p>
      </div>

      {displayOffers.length > 0 ? (
        <MarketGrid
          items={displayOffers}
          renderItem={(offer: Offer) => (
            <OfferCard
              key={offer.id}
              offer={{
                ...offer,
                title: offer.asset?.name ?? 'Oferta',
                summary: offer.asset?.description ?? '',
                classification: offer.asset?.category ?? 'SaaS',
                revenueRange: offer.asset?.mrr 
                  ? `MRR $${Number(offer.asset.mrr).toLocaleString('en-US')}` 
                  : 'Upon request',
                investmentRange: { min: Number(offer.price), max: Number(offer.price) },
                valuationMultiple: 'N/A'
              }}
            />
          )}
        />
      ) : (
        <EmptyState 
          title="No offers" 
          description="Publish your asset to receive proposals." 
        />
      )}
    </section>
  );
}

