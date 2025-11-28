'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import BadgesSection from '@/components/dashboard/BadgesSection';

interface BadgeData {
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
}

export default function BadgesPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/badges', {
        credentials: 'include',
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Error loading badges');
      }

      const result = await response.json();
      if (result.success) {
        setBadgeData(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching badges:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBadges();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading badges...</p>
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gamification & Badges</h1>
            <p className="text-muted-foreground mt-1">
              Earn badges by completing critical tasks and improve your readiness score
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
              Error: {error}
            </div>
          )}

          {badgeData && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <BadgesSection
                badges={badgeData.badges}
                tasks={badgeData.tasks}
                editable={false}
                isAdmin={false}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

