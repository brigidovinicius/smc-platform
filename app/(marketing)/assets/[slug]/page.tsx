import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAssetByIdOrSlug } from '@/src/core/assets/asset.service';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import AssetLeadForm from '@/components/marketplace/AssetLeadForm';
import { SITE_CONFIG } from '@/lib/site-config';

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const asset = await getAssetByIdOrSlug(params.slug);
  
  if (!asset || asset.status !== 'PUBLISHED') {
    return {
      title: 'Asset not found',
    };
  }

  return {
    title: `${asset.title} | ${SITE_CONFIG.name}`,
    description: asset.shortDescription,
  };
}

export default async function AssetPage({ params }: Params) {
  const asset = await getAssetByIdOrSlug(params.slug);

  if (!asset || asset.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <MarketingPageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Asset Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{asset.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{asset.shortDescription}</p>
              <div className="prose prose-invert max-w-none">
                <p>{asset.fullDescription}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-card rounded-lg border">
              {asset.mrr && (
                <div>
                  <p className="text-sm text-muted-foreground">MRR</p>
                  <p className="text-2xl font-semibold">${asset.mrr.toLocaleString()}</p>
                </div>
              )}
              {asset.monthlyRevenue && (
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-semibold">${asset.monthlyRevenue.toLocaleString()}</p>
                </div>
              )}
              {asset.churnRate && (
                <div>
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                  <p className="text-2xl font-semibold">{asset.churnRate}%</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Asking Price</p>
                <p className="text-2xl font-semibold">
                  {asset.currency || 'USD'} {asset.askingPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Lead Form */}
          <div className="sticky top-8">
            <AssetLeadForm assetId={asset.id} assetTitle={asset.title} />
          </div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
