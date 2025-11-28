'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, FileText, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminStats {
  totalAssets: number;
  assetsByStatus: Record<string, number>;
  totalUsers: number;
  totalLeads: number;
  totalOffers: number;
  pendingAssets: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    owner: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }>;
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Rascunho',
  SUBMITTED: 'Enviado',
  PENDING_REVIEW: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  PUBLISHED: 'Publicado'
};

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/admin');
      return;
    }

    if (status === 'authenticated') {
      const user = session?.user as { role?: string } | undefined;
      const userRole = user?.role ? String(user.role).toLowerCase() : '';
      if (userRole !== 'admin') {
        router.push('/not-authorized');
        return;
      }

      // Carregar estatísticas
      loadStats();
    }
  }, [status, session, router]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/metrics/overview', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Buscar assets pendentes separadamente
        const assetsResponse = await fetch('/api/admin/assets?status=PENDING_REVIEW&pageSize=10', {
          credentials: 'include',
          cache: 'no-store',
        });

        let pendingAssets: AdminStats['pendingAssets'] = [];
        if (assetsResponse.ok) {
          const assetsResult = await assetsResponse.json();
          if (assetsResult.success) {
            pendingAssets = (assetsResult.data.items || []).map((asset: any) => ({
              id: asset.id,
              title: asset.title,
              status: asset.status,
              createdAt: asset.createdAt,
              owner: asset.owner || { id: '', name: null, email: null },
            }));
          }
        }

        // Buscar contagens por status
        const statusResponse = await fetch('/api/admin/assets', {
          credentials: 'include',
          cache: 'no-store',
        });

        let assetsByStatus: Record<string, number> = {};
        if (statusResponse.ok) {
          const statusResult = await statusResponse.json();
          if (statusResult.success) {
            const allAssets = statusResult.data.items || [];
            allAssets.forEach((asset: any) => {
              assetsByStatus[asset.status] = (assetsByStatus[asset.status] || 0) + 1;
            });
          }
        }

        setStats({
          totalAssets: result.data.totalAssets || 0,
          assetsByStatus,
          totalUsers: result.data.totalUsers || 0,
          totalLeads: result.data.totalLeads || 0,
          totalOffers: result.data.totalOffers || 0,
          pendingAssets,
        });
      } else {
        throw new Error(result.error || 'Erro ao carregar estatísticas');
      }
    } catch (error: any) {
      console.error('Error loading admin stats:', error);
      setError(error.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Erro ao Carregar Dashboard</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
        <Button onClick={loadStats}>Tentar Novamente</Button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral da plataforma e ações rápidas
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              Assets cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Leads gerados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ofertas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOffers}</div>
            <p className="text-xs text-muted-foreground">
              Ofertas criadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assets por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Assets por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.assetsByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">
                  {statusLabels[status] || status}
                </div>
              </div>
            ))}
            {Object.keys(stats.assetsByStatus).length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">
                Nenhum asset encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fila de Revisão */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Fila de Revisão Pendente
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/assets?status=PENDING_REVIEW">Ver Todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.pendingAssets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum asset pendente de revisão
            </p>
          ) : (
            <div className="space-y-3">
              {stats.pendingAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div className="flex-1">
                    <Link
                      href={`/admin/assets/${asset.id}`}
                      className="font-medium hover:underline"
                    >
                      {asset.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Por {asset.owner.name || asset.owner.email} • {new Date(asset.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {statusLabels[asset.status] || asset.status}
                    </Badge>
                    <Button asChild size="sm">
                      <Link href={`/admin/assets/${asset.id}`}>Revisar</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/assets/new">
                <Package className="h-4 w-4 mr-2" />
                Criar Asset
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Usuários
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/settings">
                <FileText className="h-4 w-4 mr-2" />
                Configurações
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/metrics">
                <DollarSign className="h-4 w-4 mr-2" />
                Métricas
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
