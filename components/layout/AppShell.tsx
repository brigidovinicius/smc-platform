'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Assets', href: '/dashboard/assets', icon: Package },
  { title: 'Offers', href: '/dashboard/offers', icon: FileText },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings }
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#050711]">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-72 flex-col border-r border-[#9EA3B0]/20 bg-[#070708] lg:flex">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-[#9EA3B0]/20 px-6">
          <div className="flex items-center gap-3 group">
            <Logo variant="icon-only" href="/dashboard" width={40} height={40} className="group-hover:opacity-90 transition-opacity" />
            <Link href="/dashboard" className="text-xl font-bold text-white hover:opacity-90 transition-opacity">
              Dashboard
            </Link>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                  'transition-all duration-200',
                  isActive
                    ? 'bg-[#0044CC] text-white'
                    : 'text-[#9EA3B0] hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
                
                {item.badge && (
                  <span className="ml-auto rounded-full bg-[#0044CC]/80 px-2 py-0.5 text-xs font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User section */}
        <div className="border-t border-[#9EA3B0]/20 p-4">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/5 border border-[#9EA3B0]/20">
            <div className="h-10 w-10 rounded-full bg-[#0044CC] flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-indigo-200 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-72 bg-[#070708] border-r border-[#9EA3B0]/20">
            <div className="flex h-20 items-center justify-between border-b border-[#9EA3B0]/20 px-6">
              <div className="flex items-center gap-3">
                <Logo variant="icon-only" href="/dashboard" width={40} height={40} />
                <Link href="/dashboard" className="text-xl font-bold text-white">
                  Dashboard
                </Link>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="space-y-2 p-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#0044CC] text-white'
                        : 'text-[#9EA3B0] hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#9EA3B0]/20 bg-[#070708] px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4">
            {session && (
              <div className="hidden items-center gap-3 sm:flex px-4 py-2 rounded-lg bg-white/5 border border-[#9EA3B0]/20">
                <div className="h-9 w-9 rounded-full bg-[#0044CC] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {session.user?.name?.split(' ')[0] || 'Usuário'}
                  </p>
                  <p className="text-xs text-[#9EA3B0] font-medium">Founder Level</p>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#9EA3B0] hover:text-white hover:bg-white/5 border border-[#9EA3B0]/20"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#070708]">
          <div className="container mx-auto py-6 px-4 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

