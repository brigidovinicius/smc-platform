'use client';

import StatBlock from '@/components/ui/StatBlock';

interface AdminStatsSectionProps {
  totalAssets: number;
  totalOffers: number;
  totalUsers: number;
  totalMRR: string;
}

export default function AdminStatsSection({
  totalAssets,
  totalOffers,
  totalUsers,
  totalMRR
}: AdminStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatBlock
        label="Total Assets"
        value={totalAssets.toLocaleString('en-US')}
        sublabel="On platform"
        trend="All listed assets"
      />
      <StatBlock
        label="Total Offers"
        value={totalOffers.toLocaleString('en-US')}
        sublabel="Active on platform"
        trend="All offers"
      />
      <StatBlock
        label="Total Users"
        value={totalUsers.toLocaleString('en-US')}
        sublabel="Registered"
        trend="Active users"
      />
      <StatBlock
        label="Total MRR"
        value={totalMRR}
        sublabel="Monthly recurring revenue"
        trend="Sum of all assets"
      />
    </div>
  );
}

