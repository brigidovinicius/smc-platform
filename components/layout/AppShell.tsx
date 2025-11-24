'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
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
      {/* Sidebar - Desktop com gradiente e efeitos */}
      <aside className="hidden w-72 flex-col border-r border-indigo-500/20 bg-gradient-to-b from-[#0b1230] via-[#0f1a3a] to-[#0b1230] lg:flex shadow-2xl shadow-indigo-900/20">
        {/* Logo com gradiente */}
        <div className="flex h-20 items-center border-b border-indigo-500/20 px-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">SMC</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Dashboard
            </span>
          </Link>
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
                  'transition-all duration-300 relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white hover:scale-105'
                )}
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                {/* Brilho no hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
                
                <Icon className={cn(
                  'h-5 w-5 relative z-10',
                  isActive && 'drop-shadow-lg'
                )} />
                <span className="relative z-10">{item.title}</span>
                
                {item.badge && (
                  <span className="ml-auto rounded-full bg-indigo-500/80 px-2 py-0.5 text-xs font-semibold shadow-md">
                    {item.badge}
                  </span>
                )}
                
                {/* Indicador ativo */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-lg" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User section com gradiente */}
        <div className="border-t border-indigo-500/20 p-4 bg-gradient-to-t from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
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
          <aside className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-[#0b1230] via-[#0f1a3a] to-[#0b1230] border-r border-indigo-500/20 shadow-2xl">
            <div className="flex h-20 items-center justify-between border-b border-indigo-500/20 px-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">SMC</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </Link>
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
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white hover:scale-105'
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
        {/* Header com gradiente */}
        <header className="flex h-16 items-center justify-between border-b border-indigo-500/20 bg-gradient-to-r from-[#0b1230] via-[#0f1a3a] to-[#0b1230] px-4 lg:px-6 shadow-lg shadow-indigo-900/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4">
            {session && (
              <div className="hidden items-center gap-3 sm:flex px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {session.user?.name?.split(' ')[0] || 'Usuário'}
                  </p>
                  <p className="text-xs text-indigo-300 font-medium">Founder Level</p>
                </div>
              </div>
            )}
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10 border border-indigo-500/20">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#050711]">
          <div className="container mx-auto py-6 px-4 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

