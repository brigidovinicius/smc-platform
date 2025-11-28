'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProfileCard from '@/components/dashboard/ProfileCard';
import ReadinessCard from '@/components/dashboard/ReadinessCard';
import ValuationCard from '@/components/dashboard/ValuationCard';
import AssetsSection from '@/components/dashboard/AssetsSection';
import OffersSection from '@/components/dashboard/OffersSection';
import BadgesSection from '@/components/dashboard/BadgesSection';
import MetricsSection from '@/components/dashboard/MetricsSection';
import AdminStatsSection from '@/components/dashboard/AdminStatsSection';
import { isAdmin, getUserRole } from '@/lib/api/permissions';
import { useContext7 } from '@/components/providers/Context7Provider';

type DashboardSessionUser = {
  id?: string | null;
  role?: string | null;
  email?: string | null;
  name?: string | null;
};

interface DashboardData {
  assets: any[];
  offers: any[];
  stats: {
    readinessScore: number;
    valuation: string;
    assetsCount: number;
    totalValue?: string;
    totalAssets?: number;
    totalOffers?: number;
    totalUsers?: number;
    totalMRR?: string;
  };
  badges: {
    badges: Array<{
      id: string;
      label: string;
      variant: 'default' | 'secondary' | 'outline';
      status?: 'inProgress' | 'pending' | 'done';
    }>;
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      status: 'inProgress' | 'pending' | 'done';
      statusLabel: string;
    }>;
  };
  metrics: {
    mrr: {
      value: number;
      formatted: string;
      growth: number;
      growthLabel: string;
    };
    churn: {
      value: number;
      formatted: string;
      benchmark: string;
      status: string;
    };
    cacPayback: {
      value: number;
      formatted: string;
      ideal: string;
      target: string;
    };
  };
  adminMetrics?: {
    totalAssets: number;
    totalOffers: number;
    totalUsers: number;
    totalMRR: number;
    formattedTotalMRR: string;
  } | null;
}

export default function DashboardPageClient() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const sessionUser = session?.user as DashboardSessionUser | undefined;
  const sessionUserId = sessionUser?.id ?? null;
  const { trackEvent } = useContext7();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const userRole = getUserRole(session);
  const isUserInAdminArea = pathname?.startsWith('/dashboard/admin');
  // Se estiver em /dashboard (não admin), forçar User Mode mesmo se for admin
  // adminMode será determinado pelo resultado da API e pela rota atual
  const userName = sessionUser?.name || 'User';

  const fetchDashboardData = useCallback(async () => {
    if (!sessionUserId) return;

    try {
      setLoading(true);
      setError(null);

      // Determinar se estamos em admin mode baseado na rota atual
      const currentPathIsAdmin = pathname?.startsWith('/dashboard/admin');
      
      // Se não estiver em área admin, forçar modo usuário na API
      const apiUrl = currentPathIsAdmin 
        ? '/api/dashboard' 
        : '/api/dashboard?forceUserMode=true';

      const dashboardResponse = await fetch(apiUrl, {
        credentials: 'include',
        cache: 'no-store'
      });
      
      let dashboardResult;
      try {
        dashboardResult = await dashboardResponse.json();
      } catch (parseError) {
        console.error('Failed to parse dashboard response:', parseError);
        throw new Error(`Erro ao processar resposta do servidor (${dashboardResponse.status})`);
      }
      
      if (!dashboardResponse.ok || !dashboardResult.success) {
        const errorMessage = dashboardResult?.error || dashboardResult?.message || `Erro ${dashboardResponse.status}: ${dashboardResponse.statusText}`;
        const errorDetails = dashboardResult?.details || '';
        throw new Error(errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage);
      }

      const badgesResponse = await fetch('/api/dashboard/badges', {
        credentials: 'include',
        cache: 'no-store'
      });
      const badgesResult = badgesResponse.ok ? await badgesResponse.json() : null;

      // Determinar se estamos em admin mode baseado na rota atual
      // Se estiver em /dashboard (não admin), SEMPRE forçar User Mode, mesmo se for admin
      const calculatedAdminMode = currentPathIsAdmin && 
        dashboardResult.success && 
        dashboardResult.data.isAdmin;
      
      setIsAdminMode(calculatedAdminMode);

      const metricsEndpoint = calculatedAdminMode ? '/api/admin/metrics' : '/api/me/metrics';
      const metricsResponse = await fetch(metricsEndpoint, {
        credentials: 'include',
        cache: 'no-store'
      });
      const metricsResult = metricsResponse.ok ? await metricsResponse.json() : null;

      const data: DashboardData = {
        assets: dashboardResult.success ? dashboardResult.data.assets || [] : [],
        offers: dashboardResult.success ? dashboardResult.data.offers || [] : [],
        stats: dashboardResult.success
          ? dashboardResult.data.stats || {
              readinessScore: 0,
              valuation: '$0',
              assetsCount: 0,
            }
          : {
              readinessScore: 0,
              valuation: '$0',
              assetsCount: 0,
            },
        badges: calculatedAdminMode
          ? {
              badges: [],
              tasks: [],
            }
          : badgesResult?.success
          ? badgesResult.data
          : {
              badges: [],
              tasks: [],
            },
        metrics: metricsResult?.success
          ? metricsResult.data.metrics || metricsResult.data
          : {
              mrr: { value: 0, formatted: '$0', growth: 0, growthLabel: '' },
              churn: { value: 0, formatted: '0%', benchmark: '', status: '' },
              cacPayback: {
                value: 0,
                formatted: '0 meses',
                ideal: '',
                target: '',
              },
            },
        adminMetrics:
          calculatedAdminMode && dashboardResult.success
            ? dashboardResult.data.adminMetrics
            : null,
      };

      setDashboardData(data);

      trackEvent('dashboard_data_loaded', {
        assets: data.assets.length,
        offers: data.offers.length,
        readinessScore: data.stats.readinessScore,
        adminMode: calculatedAdminMode,
        pathname: pathname || '',
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error?.message || error?.toString() || 'Erro desconhecido ao carregar dados do dashboard';
      setError(errorMessage);
      
      // Log detalhado para debug
      if (error?.stack) {
        console.error('Error stack:', error.stack);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionUserId, pathname, trackEvent]);

  useEffect(() => {
    if (status === 'authenticated' && sessionUserId) {
      fetchDashboardData();
    }
  }, [status, sessionUserId, fetchDashboardData]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !sessionUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-400">Not authenticated. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { assets, offers, stats, badges, metrics } = dashboardData;

  const safeNumber = (value?: number | null) =>
    typeof value === 'number' && Number.isFinite(value) ? value : 0;

  const safeText = (value?: string | null) =>
    typeof value === 'string' && value.trim().length > 0 ? value : '-';

  const metricsArray = [
    {
      id: 'mrr',
      label: 'Audited MRR',
      value: metrics?.mrr?.formatted ?? '-',
      sublabel: `${safeNumber(metrics?.mrr?.growth)}% growth in the last 30 days`,
      trend: safeText(metrics?.mrr?.growthLabel),
    },
    {
      id: 'churn',
      label: 'Controlled Churn',
      value: metrics?.churn?.formatted ?? '-',
      sublabel: `${safeText(metrics?.churn?.benchmark)} benchmark`,
      trend: safeText(metrics?.churn?.status),
    },
    {
      id: 'cac',
      label: 'CAC payback',
      value: metrics?.cacPayback?.formatted ?? '-',
      sublabel: `ideal < ${safeText(metrics?.cacPayback?.ideal)}`,
      trend: safeText(metrics?.cacPayback?.target),
    },
  ];

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

      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {isAdminMode
                    ? 'Administrative Dashboard'
                    : 'User Dashboard'}
                </h1>
                <p className="text-muted-foreground">
                  {isAdminMode
                    ? 'Platform overview and management of all resources'
                    : 'Track metrics, readiness score and prepare for negotiations with qualified investors.'}
                </p>
              </div>
              {isAdminMode && (
                <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-sm font-medium text-primary">
                    🔒 Admin Mode
                  </span>
                </div>
              )}
            </div>
          </div>

          {isAdminMode && dashboardData.adminMetrics && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Global Statistics</h2>
              <AdminStatsSection
                totalAssets={dashboardData.adminMetrics?.totalAssets ?? 0}
                totalOffers={dashboardData.adminMetrics?.totalOffers ?? 0}
                totalUsers={dashboardData.adminMetrics?.totalUsers ?? 0}
                totalMRR={dashboardData.adminMetrics?.formattedTotalMRR ?? '-'}
              />
            </div>
          )}

          {!isAdminMode && (
            <section className="space-y-4">
              <ProfileCard userName={userName} userLevel="Founder" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadinessCard
                  score={stats.readinessScore}
                  status="Ready for due diligence"
                  trend="+6% this month"
                  editable={false}
                />
                <ValuationCard
                  value={stats.valuation}
                  description="Based on MRR and churn"
                  updated="Updated daily"
                  editable={false}
                />
              </div>
            </section>
          )}

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {isAdminMode ? 'Latest Platform Assets' : 'My Assets'}
              </h2>
              {isAdminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Showing last 10 assets. See all in{' '}
                  <a
                    href="/dashboard/admin/assets"
                    className="text-primary hover:underline"
                  >
                    Manage Assets
                  </a>
                </p>
              )}
              {!isAdminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your digital assets and track important metrics
                </p>
              )}
            </div>
            <AssetsSection
              assets={assets}
              assetsCount={stats.assetsCount}
              totalValue={stats.totalValue ?? '-'}
              isAdmin={isAdminMode}
              userId={sessionUserId || undefined}
            />
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {isAdminMode ? 'Latest Platform Offers' : 'Active Offers'}
              </h2>
              {isAdminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Showing last 10 offers. See all in{' '}
                  <a
                    href="/dashboard/offers"
                    className="text-primary hover:underline"
                  >
                    Manage Offers
                  </a>
                </p>
              )}
              {!isAdminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Track your offers in negotiation and receive proposals from
                  buyers
                </p>
              )}
            </div>
            <OffersSection offers={offers} isAdmin={isAdminMode} />
          </div>

          {!isAdminMode && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <BadgesSection
                badges={badges.badges}
                tasks={badges.tasks}
                editable={false}
                isAdmin={false}
              />
            </div>
          )}

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <MetricsSection
              metrics={metricsArray}
              editable={false}
              isAdmin={isAdminMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

