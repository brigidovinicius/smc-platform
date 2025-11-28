'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AssetsSection from '@/components/dashboard/AssetsSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { isAdmin } from '@/lib/api/permissions';

interface Asset {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  category?: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  mrr?: number | null;
  arr?: number | null;
  churnRate?: number | null;
  status?: string;
  askingPrice?: number;
  currency?: string;
  owner?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface PaginatedAssets {
  items: Asset[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdminAssetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedAssets | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [page, setPage] = useState(Number(searchParams?.get('page')) || 1);

  const adminMode = isAdmin(session);

  useEffect(() => {
    if (status === 'authenticated' && !adminMode) {
      router.push('/dashboard');
    }
  }, [status, adminMode, router]);

  const fetchAssets = async () => {
    if (!session || !adminMode) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/admin/assets?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Error loading assets');
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        router.push(`/dashboard/admin/assets?${params.toString()}`, { scroll: false });
      }
    } catch (error: any) {
      console.error('Error fetching assets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && adminMode) {
      fetchAssets();
    }
  }, [status, page, search, category, adminMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAssets();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading assets...</p>
        </div>
      </div>
    );
  }

  if (!session || !adminMode) {
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Assets</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all platform assets
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search assets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>
            
            <Select value={category || "all"} onValueChange={(value) => {
              setCategory(value === "all" ? "" : value);
              setPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="SAAS">SaaS</SelectItem>
                <SelectItem value="ECOMMERCE">E-commerce</SelectItem>
                <SelectItem value="SOFTWARE">Software</SelectItem>
                <SelectItem value="NEWSLETTER">Newsletter</SelectItem>
                <SelectItem value="COURSE_INFOPRODUCT">Course</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
              Error: {error}
            </div>
          )}

          {data && (
            <>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <AssetsSection
                  assets={data.items}
                  assetsCount={data.pagination.total}
                  isAdmin={true}
                />
              </div>

              {/* Paginação */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * data.pagination.pageSize) + 1} to{' '}
                    {Math.min(page * data.pagination.pageSize, data.pagination.total)} of{' '}
                    {data.pagination.total} assets
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={!data.pagination.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={!data.pagination.hasNext}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

