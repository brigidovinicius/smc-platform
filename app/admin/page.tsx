import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, FileText, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | CounterX',
  description: 'Admin dashboard for managing CounterX platform',
};

const stats = [
  { label: 'Total Assets', value: '0', icon: Package, color: 'text-[var(--color-primary)]' },
  { label: 'Active Sellers', value: '0', icon: Users, color: 'text-emerald-500' },
  { label: 'Blog Posts', value: '0', icon: FileText, color: 'text-purple-500' },
  { label: 'Growth Rate', value: '0%', icon: TrendingUp, color: 'text-orange-500' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Manage assets, sellers, blog posts, and platform settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/assets" className="block p-3 rounded-lg hover:bg-[var(--color-white)] transition-colors">
              Manage Assets
            </a>
            <a href="/admin/sellers" className="block p-3 rounded-lg hover:bg-[var(--color-white)] transition-colors">
              Manage Sellers
            </a>
            <a href="/admin/blog" className="block p-3 rounded-lg hover:bg-[var(--color-white)] transition-colors">
              Manage Blog Posts
            </a>
            <a href="/admin/settings" className="block p-3 rounded-lg hover:bg-[var(--color-white)] transition-colors">
              Platform Settings
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-text-secondary)]">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

