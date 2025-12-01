'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ASSET_TYPE_OPTIONS } from '@/lib/assetTypes';
import AssetCard from '@/components/AssetCard';
import MarketGrid from '@/components/MarketGrid';
import Link from 'next/link';

interface Asset {
  id: string;
  title: string;
  slug: string;
  type: string;
  shortDescription?: string;
  askingPrice: number;
  currency: string;
  mrr?: number;
  churnRate?: number;
  createdAt: string;
}

interface AssetCatalogProps {
  assets: Asset[];
  total: number;
  filters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  };
}

export default function AssetCatalog({ assets, total, filters: initialFilters }: AssetCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    type: initialFilters.type || '',
    minPrice: initialFilters.minPrice?.toString() || '',
    maxPrice: initialFilters.maxPrice?.toString() || '',
    sortBy: initialFilters.sortBy || 'newest',
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sortBy && filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
    router.push(`/assets?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type">Business Type</Label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              >
                <option value="">All Types</option>
                {ASSET_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="0"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="No limit"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Lowest Price</option>
                <option value="price_high">Highest Price</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {assets.length} of {total} assets
        </p>

        {assets.length > 0 ? (
          <MarketGrid
            items={assets}
            renderItem={(asset: Asset) => (
              <Link key={asset.id} href={`/assets/${asset.slug}`}>
                <AssetCard
                  asset={{
                    name: asset.title,
                    category: asset.type,
                    description: asset.shortDescription || '',
                    mrr: asset.mrr ? `$${asset.mrr.toLocaleString()}` : 'N/A',
                    churn: asset.churnRate ? `${asset.churnRate}%` : 'N/A',
                  }}
                />
              </Link>
            )}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No assets found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}


