import type { Metadata } from 'next';
import { listAssets } from '@/src/core/assets/asset.service';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import AssetCatalog from '@/components/marketplace/AssetCatalog';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Asset Catalog | ${SITE_CONFIG.name}`,
  description: 'Browse available digital assets for sale',
};

export default async function AssetsCatalogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'newest';

  const result = await listAssets(
    {
      type,
      status: 'PUBLISHED',
      minPrice,
      maxPrice,
      limit: 50,
      offset: 0,
    },
    undefined // No context = public view
  );

  // Sort assets and map null to undefined for TypeScript compatibility
  // The AssetCatalog component expects Asset type with optional fields as undefined, not null
  let sortedAssets = (result.assets || []).map((asset: any) => ({
    id: asset.id,
    title: asset.title,
    slug: asset.slug,
    type: asset.type,
    shortDescription: asset.shortDescription ?? undefined,
    askingPrice: asset.askingPrice,
    currency: asset.currency,
    mrr: asset.mrr ?? undefined,
    churnRate: asset.churnRate ?? undefined,
    createdAt: asset.createdAt.toISOString(),
  }));
  
  if (sortBy === 'price_low') {
    sortedAssets.sort((a, b) => a.askingPrice - b.askingPrice);
  } else if (sortBy === 'price_high') {
    sortedAssets.sort((a, b) => b.askingPrice - a.askingPrice);
  } else {
    // newest (default)
    sortedAssets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <MarketingPageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Asset Catalog</h1>
          <p className="text-xl text-muted-foreground">
            Browse available digital assets for sale
          </p>
        </div>
        <AssetCatalog
          assets={sortedAssets}
          total={result.total}
          filters={{
            type,
            minPrice,
            maxPrice,
            sortBy,
          }}
        />
      </div>
    </MarketingPageLayout>
  );
}


