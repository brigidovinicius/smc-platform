import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Sellers | Admin | CounterX',
  description: 'Admin panel for managing sellers',
};

export default function SellersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Sellers</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Manage all sellers registered on the platform</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search sellers..."
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-white)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sellers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-[var(--color-text-secondary)]">
            <p>No sellers found.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

