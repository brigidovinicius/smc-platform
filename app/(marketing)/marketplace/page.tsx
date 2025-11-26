'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { ASSET_TYPE_LABELS, ASSET_TYPE_OPTIONS } from '@/lib/assetTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Asset {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  type: string;
  askingPrice: number;
  currency: string;
  mrr?: number;
  monthlyRevenue?: number;
  monthlyProfit?: number;
  performance?: {
    monthlyVisitors?: number;
  };
}

export default function MarketplacePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', 'PUBLISHED');
      
      if (selectedTypes.length > 0) {
        params.append('type', selectedTypes.join(','));
      }
      
      if (minPrice !== '') {
        params.append('minPrice', minPrice.toString());
      }
      
      if (maxPrice !== '') {
        params.append('maxPrice', maxPrice.toString());
      }

      const response = await fetch(`/api/assets?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setAssets(result.data.assets);
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTypes, minPrice, maxPrice]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <MarketingPageLayout>
      <section className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Marketplace</h1>
              <p className="text-slate-600 text-lg">
                Browse digital assets available for purchase
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-4">Business Type</h3>
                      <div className="space-y-2">
                        {ASSET_TYPE_OPTIONS.map(opt => (
                          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(opt.value)}
                              onChange={() => toggleTypeFilter(opt.value)}
                              className="rounded border-slate-300"
                            />
                            <span className="text-sm text-slate-700">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-4">Price Range</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-600 mb-1 block">Min Price</label>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : '')}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 mb-1 block">Max Price</label>
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : '')}
                            placeholder="No limit"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {(selectedTypes.length > 0 || minPrice !== '' || maxPrice !== '') && (
                      <button
                        onClick={() => {
                          setSelectedTypes([]);
                          setMinPrice('');
                          setMaxPrice('');
                        }}
                        className="w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </CardContent>
                </Card>
              </aside>

              {/* Results */}
              <main className="flex-1">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">Loading assets...</p>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">No assets found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map((asset) => (
                      <Link key={asset.id} href={`/assets/${asset.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <Badge variant="outline" className="mb-3">
                              {ASSET_TYPE_LABELS[asset.type] || asset.type}
                            </Badge>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                              {asset.title}
                            </h3>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                              {asset.shortDescription}
                            </p>
                            <div className="space-y-2 pt-4 border-t border-slate-200">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Asking Price</span>
                                <span className="font-semibold text-slate-900">
                                  {asset.currency} {asset.askingPrice.toLocaleString()}
                                </span>
                              </div>
                              {asset.mrr && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-slate-500">MRR</span>
                                  <span className="text-sm text-slate-700">
                                    {asset.currency} {asset.mrr.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {asset.monthlyProfit && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-slate-500">Monthly Profit</span>
                                  <span className="text-sm text-slate-700">
                                    {asset.currency} {asset.monthlyProfit.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
