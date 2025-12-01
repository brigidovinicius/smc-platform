'use client';

import { useState } from 'react';
import AssetsSection from '@/components/dashboard/AssetsSection';
import LeadsSection from '@/components/dashboard/LeadsSection';
import ProfileSection from '@/components/dashboard/ProfileSection';
import { Package, Mail, User } from 'lucide-react';

interface UserDashboardTabsProps {
  assets: any[];
  assetsCount: number;
  totalValue?: string;
  userId: string;
}

export default function UserDashboardTabs({
  assets,
  assetsCount,
  totalValue,
  userId,
}: UserDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'assets' | 'leads' | 'profile'>('assets');

  const tabs = [
    { id: 'assets' as const, label: 'My Assets', icon: Package },
    { id: 'leads' as const, label: 'My Leads', icon: Mail },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'assets' && (
          <AssetsSection
            assets={assets}
            assetsCount={assetsCount}
            totalValue={totalValue}
            userId={userId}
          />
        )}
        {activeTab === 'leads' && <LeadsSection userId={userId} />}
        {activeTab === 'profile' && <ProfileSection />}
      </div>
    </div>
  );
}


