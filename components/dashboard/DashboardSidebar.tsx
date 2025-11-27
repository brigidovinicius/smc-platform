'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FileText, Trophy, BarChart3, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { isAdmin } from '@/lib/api/permissions';
import { useSession } from 'next-auth/react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Assets', href: '/dashboard/assets', icon: Package },
  { label: 'Offers', href: '/dashboard/offers', icon: FileText },
  { label: 'Badges', href: '/dashboard/badges', icon: Trophy },
  { label: 'Metrics', href: '/dashboard/metrics', icon: BarChart3 },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users, adminOnly: true },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const admin = isAdmin(session);

  const visibleItems = navItems.filter(item => !item.adminOnly || admin);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

