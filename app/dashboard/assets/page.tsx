'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AssetsSection from '@/components/dashboard/AssetsSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Asset {
  id: string;
  name: string;
  category: string;
  description: string;
  mrr?: number | null;
  churnRate?: number | null;
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

export default function AssetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedAssets | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams?.get('search') || '');
  // Usar "all" como valor padrão em vez de "" para evitar erro do Select
  const categoryParam = searchParams?.get('category') || '';
  const [category, setCategory] = useState(categoryParam || '');
  const [page, setPage] = useState(Number(searchParams?.get('page')) || 1);

  const fetchAssets = async () => {
    if (!session) {
      console.log('[AssetsPage] No session, redirecting to login');
      router.push('/auth/login?callbackUrl=/dashboard/assets');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/me/assets?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (!response.ok) {
        // Se for erro 401, redirecionar para login
        if (response.status === 401) {
          console.log('[AssetsPage] Unauthorized, redirecting to login');
          router.push('/auth/login?callbackUrl=/dashboard/assets');
          return;
        }
        throw new Error(result.error || result.message || 'Error loading assets');
      }

      if (result.success) {
        setData(result.data);
        // Atualizar URL sem recarregar
        router.push(`/dashboard/assets?${params.toString()}`, { scroll: false });
      } else {
        throw new Error(result.error || 'Error loading assets');
      }
    } catch (error: any) {
      console.error('[AssetsPage] Error fetching assets:', error);
      setError(error.message || 'Failed to load assets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchAssets();
    } else if (status === 'unauthenticated') {
      console.log('[AssetsPage] User not authenticated, redirecting to login');
      router.push('/auth/login?callbackUrl=/dashboard/assets');
    }
  }, [status, session, page, search, category]);

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
              <h1 className="text-3xl font-bold text-foreground">My Assets</h1>
              <p className="text-muted-foreground mt-1">
                Manage your digital assets and metrics
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/assets/new">
                <Plus className="h-4 w-4 mr-2" />
                New Asset
              </Link>
            </Button>
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
            
            <Select 
              value={category === "" ? "all" : category} 
              onValueChange={(value) => {
                setCategory(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Marketplace">Marketplace</SelectItem>
                <SelectItem value="Newsletter">Newsletter</SelectItem>
                <SelectItem value="Course">Course</SelectItem>
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
                  isAdmin={false}
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

