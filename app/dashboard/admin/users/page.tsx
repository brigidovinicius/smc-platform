'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { isAdmin } from '@/lib/api/permissions';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  profile: {
    role: string;
    bio: string | null;
  } | null;
  _count: {
    newAssets: number;
    offers: number;
  };
}

interface PaginatedUsers {
  items: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const adminMode = isAdmin(session);

  useEffect(() => {
    if (status === 'authenticated' && !adminMode) {
      router.push('/dashboard');
    }
  }, [status, adminMode, router]);

  const fetchUsers = async () => {
    if (!session || !adminMode) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', String(page));
      params.append('pageSize', '20');

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error loading users');
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && adminMode) {
      fetchUsers();
    }
  }, [status, page, search, adminMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading users...</p>
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
            <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all platform users
            </p>
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
              Error: {error}
            </div>
          )}

          {data && (
            <>
              <div className="rounded-lg border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Assets</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Offers</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.items.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {user.image && (
                                <img
                                  src={user.image}
                                  alt={user.name || 'User'}
                                  className="h-8 w-8 rounded-full"
                                />
                              )}
                              <span className="text-sm font-medium">{user.name || 'No name'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={user.profile?.role === 'ADMIN' ? 'default' : 'secondary'}>
                              {user.profile?.role || 'USER'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{user._count.newAssets}</td>
                          <td className="px-4 py-3 text-sm">{user._count.offers}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {user.emailVerified 
                              ? new Date(user.emailVerified).toLocaleDateString('en-US')
                              : 'Not verified'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Paginação */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * data.pagination.pageSize) + 1} to{' '}
                    {Math.min(page * data.pagination.pageSize, data.pagination.total)} of{' '}
                    {data.pagination.total} users
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

