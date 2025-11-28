'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FileText, Trophy, BarChart3, Settings, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { isAdmin } from '@/lib/api/permissions';
import { useSession } from 'next-auth/react';
import { useSidebar } from '@/contexts/SidebarContext';

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
  const { isCollapsed, toggleCollapse } = useSidebar();

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
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] border-r border-border bg-background transition-all duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {/* Botão de toggle collapse - apenas em desktop */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex mb-2 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors self-end"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
          
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
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

