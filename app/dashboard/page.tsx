'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const sessionUser = session?.user as DashboardSessionUser | undefined;
  const sessionUserId = sessionUser?.id ?? null;
  const { trackEvent } = useContext7();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userRole = getUserRole(session);
  const adminMode = isAdmin(session);
  const userName = sessionUser?.name || 'User';

  const fetchDashboardData = useCallback(async () => {
    if (!sessionUserId) return;

    try {
      setLoading(true);
      setError(null);

      // Buscar dados do dashboard (assets, offers, stats)
      const dashboardResponse = await fetch('/api/dashboard');
      if (!dashboardResponse.ok) {
        throw new Error('Error loading dashboard data');
      }
      const dashboardResult = await dashboardResponse.json();

      // Buscar badges e tarefas
      const badgesResponse = await fetch('/api/dashboard/badges');
      const badgesResult = badgesResponse.ok ? await badgesResponse.json() : null;

      // Buscar métricas (diferente para admin vs user)
      const metricsEndpoint = adminMode ? '/api/admin/metrics' : '/api/me/metrics';
      const metricsResponse = await fetch(metricsEndpoint);
      const metricsResult = metricsResponse.ok ? await metricsResponse.json() : null;

      const isAdminMode = dashboardResult.success && dashboardResult.data.isAdmin;

      const data: DashboardData = {
        assets: dashboardResult.success ? dashboardResult.data.assets || [] : [],
        offers: dashboardResult.success ? dashboardResult.data.offers || [] : [],
        stats: dashboardResult.success ? dashboardResult.data.stats || {
          readinessScore: 0,
          valuation: '$0',
          assetsCount: 0
        } : {
          readinessScore: 0,
          valuation: '$0',
          assetsCount: 0
        },
        badges: isAdminMode ? {
          badges: [],
          tasks: []
        } : (badgesResult?.success ? badgesResult.data : {
          badges: [],
          tasks: []
        }),
        metrics: metricsResult?.success ? (metricsResult.data.metrics || metricsResult.data) : {
          mrr: { value: 0, formatted: '$0', growth: 0, growthLabel: '' },
          churn: { value: 0, formatted: '0%', benchmark: '', status: '' },
          cacPayback: { value: 0, formatted: '0 meses', ideal: '', target: '' }
        },
        adminMetrics: isAdminMode && dashboardResult.success ? dashboardResult.data.adminMetrics : null
      };

      setDashboardData(data);

      trackEvent('dashboard_data_loaded', {
        assets: data.assets.length,
        offers: data.offers.length,
        readinessScore: data.stats.readinessScore,
        adminMode
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [sessionUserId, adminMode, trackEvent]);

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

  // Preparar métricas para o componente
  const metricsArray = [
    {
      id: 'mrr',
      label: 'Audited MRR',
      value: metrics.mrr.formatted,
      sublabel: `${metrics.mrr.growth}% growth in the last 30 days`,
      trend: metrics.mrr.growthLabel
    },
    {
      id: 'churn',
      label: 'Controlled Churn',
      value: metrics.churn.formatted,
      sublabel: `${metrics.churn.benchmark} benchmark`,
      trend: metrics.churn.status
    },
    {
      id: 'cac',
      label: 'CAC payback',
      value: metrics.cacPayback.formatted,
      sublabel: `ideal < ${metrics.cacPayback.ideal}`,
      trend: metrics.cacPayback.target
    }
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
      
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Header Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {adminMode ? 'Administrative Dashboard' : 'Digital Assets Dashboard'}
                </h1>
                <p className="text-muted-foreground">
                  {adminMode 
                    ? 'Platform overview and management of all resources'
                    : 'Track metrics, readiness score and prepare for negotiations with qualified investors.'}
                </p>
              </div>
              {adminMode && (
                <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-sm font-medium text-primary">🔒 Admin Mode</span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Stats Section */}
          {adminMode && dashboardData.adminMetrics && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Global Statistics</h2>
              <AdminStatsSection
                totalAssets={dashboardData.adminMetrics.totalAssets}
                totalOffers={dashboardData.adminMetrics.totalOffers}
                totalUsers={dashboardData.adminMetrics.totalUsers}
                totalMRR={dashboardData.adminMetrics.formattedTotalMRR}
              />
            </div>
          )}

          {/* Profile Section - User Mode: Informações do usuário */}
          {!adminMode && (
            <section className="space-y-4">
              <ProfileCard 
                userName={userName}
                userLevel="Founder"
              />
              
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

          {/* Assets Section - User Mode: Meus ativos pessoais */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {adminMode ? 'Latest Platform Assets' : 'My Assets'}
              </h2>
              {adminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Showing last 10 assets. See all in <a href="/dashboard/admin/assets" className="text-primary hover:underline">Manage Assets</a>
                </p>
              )}
              {!adminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your digital assets and track important metrics
                </p>
              )}
            </div>
            <AssetsSection
              assets={assets}
              assetsCount={stats.assetsCount}
              totalValue={stats.totalValue}
              isAdmin={false}
              userId={sessionUserId || undefined}
            />
          </div>

          {/* Offers Section - User Mode: Minhas ofertas pessoais */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {adminMode ? 'Latest Platform Offers' : 'Active Offers'}
              </h2>
              {adminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Showing last 10 offers. See all in <a href="/dashboard/offers" className="text-primary hover:underline">Manage Offers</a>
                </p>
              )}
              {!adminMode && (
                <p className="text-sm text-muted-foreground mt-1">
                  Track your offers in negotiation and receive proposals from buyers
                </p>
              )}
            </div>
            <OffersSection
              offers={offers}
              isAdmin={false}
            />
          </div>

          {/* Badges Section - User Mode: Gamificação pessoal */}
          {!adminMode && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <BadgesSection
                badges={badges.badges}
                tasks={badges.tasks}
                editable={false}
                isAdmin={false}
              />
            </div>
          )}

          {/* Metrics Section - User Mode: Minhas métricas pessoais */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <MetricsSection
              metrics={metricsArray}
              editable={false}
              isAdmin={false}
            />
        </div>
        </div>
      </main>
    </div>
  );
}
