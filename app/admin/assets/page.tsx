'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { ASSET_TYPE_LABELS, ASSET_TYPE_OPTIONS } from '@/lib/assetTypes';

interface Asset {
  id: string;
  title: string;
  type: string;
  status: string;
  askingPrice: number;
  currency: string;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
  };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SUBMITTED: 'bg-blue-500',
  PENDING_REVIEW: 'bg-yellow-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  PUBLISHED: 'bg-green-600',
};

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    loadAssets();
  }, [filters]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      
      const response = await fetch(`/api/assets?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        let filtered = result.data.assets;
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter((asset: Asset) =>
            asset.title.toLowerCase().includes(searchLower) ||
            asset.owner.email?.toLowerCase().includes(searchLower)
          );
        }
        
        setAssets(filtered);
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Assets</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Manage all digital assets listed on the platform
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                placeholder="Search assets..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-white)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-white)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All Types</option>
              {ASSET_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-white)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assets ({assets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-secondary)]">Loading...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
              <p>No assets found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">Owner</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-white)]/5">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/assets/${asset.id}`}
                          className="text-[var(--color-primary)] hover:underline font-medium"
                        >
                          {asset.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {ASSET_TYPE_LABELS[asset.type] || asset.type}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={STATUS_COLORS[asset.status] || 'bg-gray-500'}>
                          {asset.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {asset.owner.name || asset.owner.email}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {asset.currency} {asset.askingPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)] text-sm">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/assets/${asset.id}`}>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
