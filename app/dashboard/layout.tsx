'use client';

import { ReactNode, useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { NoIndexMeta } from '@/components/SEO/NoIndexMeta';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings,
  Plus,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/assets/new', label: 'New Asset', icon: Plus },
];

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050711]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <NoIndexMeta />
      <div className="min-h-screen bg-[#050711] text-white">
        {/* Top Navbar */}
        <header className="bg-[#0a0f1f] border-b border-slate-800 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-800"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Logo variant="white" href="/dashboard" width={120} height={28} />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden sm:inline">
                {session.user?.name || session.user?.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-30
              w-64 bg-[#0a0f1f] border-r border-slate-800
              transform transition-transform duration-200 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              pt-16 lg:pt-0
            `}
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-[#0044CC] transition-colors"
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Overlay for mobile */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SessionProvider>
  );
}


