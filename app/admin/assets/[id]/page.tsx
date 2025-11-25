'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ASSET_TYPE_LABELS } from '@/lib/assetTypes';
import Link from 'next/link';

interface AssetDetail {
  id: string;
  title: string;
  type: string;
  status: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  askingPrice: number;
  currency: string;
  suggestedMinPrice?: number;
  suggestedMaxPrice?: number;
  valuationNote?: string;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
  };
  performance?: any;
  verification?: any;
  moderation?: any;
  media?: any[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminAssetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusComment, setStatusComment] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const loadAsset = useCallback(async () => {
    try {
      const response = await fetch(`/api/assets/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setAsset(result.data.asset);
        setNewStatus(result.data.asset.status);
      }
    } catch (error) {
      console.error('Failed to load asset:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadAsset();
  }, [loadAsset]);

  const handleStatusUpdate = async () => {
    if (!asset || !newStatus) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          // Add moderation comment if provided
        }),
      });

      const result = await response.json();
      if (result.success) {
        await loadAsset();
        alert('Status updated successfully');
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!asset) {
    return <div className="text-center py-12">Asset not found</div>;
  }

  const verificationFlags = asset.verification?.flags 
    ? JSON.parse(asset.verification.flags)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/assets" className="text-[var(--color-primary)] hover:underline mb-2 inline-block">
            ← Back to Assets
          </Link>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">{asset.title}</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">{asset.shortDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--color-text-secondary)]">Type</label>
                <p className="text-[var(--color-text)]">{ASSET_TYPE_LABELS[asset.type] || asset.type}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--color-text-secondary)]">Full Description</label>
                <p className="text-[var(--color-text)] whitespace-pre-wrap">{asset.fullDescription}</p>
              </div>
              {asset.performance && (
                <div>
                  <label className="text-sm font-semibold text-[var(--color-text-secondary)]">Performance Metrics</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {asset.performance.monthlyVisitors && (
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)]">Monthly Visitors</p>
                        <p className="text-[var(--color-text)] font-semibold">{asset.performance.monthlyVisitors.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Flags */}
          {verificationFlags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Verification Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {verificationFlags.map((flag: any, index: number) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      flag.severity === 'high' ? 'bg-red-900/20 border-red-700' :
                      flag.severity === 'medium' ? 'bg-yellow-900/20 border-yellow-700' :
                      'bg-blue-900/20 border-blue-700'
                    }`}>
                      <p className="text-sm font-semibold">{flag.code}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{flag.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--color-text-secondary)]">Asking Price</label>
                <p className="text-[var(--color-text)] text-xl font-bold">
                  {asset.currency} {asset.askingPrice.toLocaleString()}
                </p>
              </div>
              {asset.suggestedMinPrice && asset.suggestedMaxPrice && (
                <div>
                  <label className="text-sm font-semibold text-[var(--color-text-secondary)]">Suggested Range</label>
                  <p className="text-[var(--color-text)]">
                    {asset.currency} {asset.suggestedMinPrice.toLocaleString()} – {asset.suggestedMaxPrice.toLocaleString()}
                  </p>
                  {asset.valuationNote && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">{asset.valuationNote}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & Moderation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 block">Current Status</label>
                <Badge>{asset.status.replace('_', ' ')}</Badge>
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 block">Change Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-white)] text-[var(--color-text)]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === asset.status}
                className="w-full"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--color-text)]">{asset.owner.name || asset.owner.email}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{asset.owner.email}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


