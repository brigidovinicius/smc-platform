'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import OffersSection from '@/components/dashboard/OffersSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
}

export default function OffersPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Error loading offers');
      }

      const result = await response.json();
      if (result.success) {
        let filteredOffers = result.data.offers || [];
        
        if (statusFilter && statusFilter !== 'ALL') {
          filteredOffers = filteredOffers.filter(
            (offer: Offer) => offer.status === statusFilter
          );
        }

        setOffers(filteredOffers);
      }
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOffers();
    }
  }, [status, statusFilter]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading offers...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />
      <DashboardSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Active Offers</h1>
              <p className="text-muted-foreground mt-1">
                Manage your offers and negotiations
              </p>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="UNDER_NEGOTIATION">Under Negotiation</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
              Error: {error}
            </div>
          )}

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <OffersSection
              offers={offers}
              isAdmin={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

