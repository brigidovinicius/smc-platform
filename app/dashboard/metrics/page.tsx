'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MetricsSection from '@/components/dashboard/MetricsSection';
import { isAdmin } from '@/lib/api/permissions';

interface MetricsData {
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
}

export default function MetricsPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adminMode = isAdmin(session);

  const fetchMetrics = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);

      const endpoint = adminMode ? '/api/admin/metrics' : '/api/me/metrics';
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Error loading metrics');
      }

      const result = await response.json();
      if (result.success) {
        setMetrics(result.data.metrics || result.data);
      }
    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMetrics();
    }
  }, [status, adminMode]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!metrics) {
    return null;
  }

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
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {adminMode ? 'Global Metrics' : 'Valuations & Metrics'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {adminMode 
                ? 'Overview of metrics across the entire platform'
                : 'Summary of automated analyses based on MRR, churn, and CAC'}
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
              Error: {error}
            </div>
          )}

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <MetricsSection
              metrics={metricsArray}
              editable={adminMode}
              isAdmin={adminMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

