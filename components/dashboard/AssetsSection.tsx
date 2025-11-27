'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import MarketGrid from '@/components/MarketGrid';
import AssetCard from '@/components/AssetCard';
import { Badge } from '@/components/ui/badge';

interface Asset {
  id: string;
  name: string;
  category: string;
  description: string;
  mrr?: number | null;
  churnRate?: number | null;
}

interface AssetsSectionProps {
  assets: Asset[];
  assetsCount: number;
  totalValue?: string;
  isAdmin?: boolean;
  userId?: string;
}

export default function AssetsSection({ 
  assets, 
  assetsCount, 
  totalValue = '--',
  isAdmin = false,
  userId 
}: AssetsSectionProps) {
  const displayAssets = isAdmin ? assets : assets.filter(a => a.id); // Para admin, mostrar todos
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">My Assets</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Listed assets: {assetsCount}
          </p>
          <p className="text-sm text-muted-foreground">
            Total in portfolio: {totalValue}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assets/new">
            <Plus className="h-4 w-4 mr-2" />
            New Asset
          </Link>
        </Button>
      </div>

      {displayAssets.length > 0 ? (
        <MarketGrid
          items={displayAssets}
          renderItem={(asset: Asset) => (
            <div key={asset.id} className="space-y-2">
              <AssetCard
                asset={{
                  name: asset.name,
                  category: asset.category,
                  description: asset.description,
                  mrr: asset.mrr ? `$${Number(asset.mrr).toLocaleString('en-US')}` : 'N/A',
                  churn: asset.churnRate ? `${asset.churnRate}%` : 'N/A'
                }}
              />
              <div className="flex gap-2 text-sm">
                <Badge variant="default">Healthy</Badge>
              </div>
            </div>
          )}
        />
      ) : (
        <EmptyState 
          title="No assets" 
          description="Register your first asset to get started." 
        />
      )}
    </section>
  );
}

