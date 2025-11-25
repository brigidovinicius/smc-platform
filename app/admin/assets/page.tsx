import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Assets | Admin | CounterX',
  description: 'Admin panel for managing digital assets',
};

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Assets</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Manage all digital assets listed on the platform</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
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
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-white)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <select className="px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-white)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <option>All Categories</option>
              <option>SaaS</option>
              <option>Marketplace</option>
              <option>Newsletter</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-[var(--color-text-secondary)]">
            <p>No assets found. Start by adding your first asset.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

