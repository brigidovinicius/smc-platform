'use client';

import { useEffect, useState } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { NoIndexMeta } from '@/components/SEO/NoIndexMeta';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { usePreviewMode } from '@/components/providers/PreviewModeProvider';

const adminNavItems = [
  { href: '/admin/assets', label: 'Assets', icon: Package },
  { href: '/admin/leads', label: 'Leads', icon: Users },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { previewMode, setPreviewMode, isUserMode } = usePreviewMode();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(pathname || '/admin'));
    } else if (status === 'authenticated') {
      const user = session?.user as { role?: string } | undefined;
      const userRole = user?.role ? String(user.role).toLowerCase() : '';
      if (userRole !== 'admin') {
        router.push('/dashboard');
        return;
      }
      // If in user preview mode, redirect to homepage (but allow toggle button to work)
      // Only redirect if we're actually on an admin route
      if (isUserMode && pathname?.startsWith('/admin')) {
        router.push('/');
      }
    }
  }, [status, session, router, pathname, isUserMode]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const user = session?.user as { role?: string } | undefined;
  const userRole = user?.role ? String(user.role).toLowerCase() : '';
  if (!session || userRole !== 'admin') {
    return null;
  }

  // If in user preview mode, show a minimal layout with just the toggle button
  // This allows the admin to switch back to admin mode
  if (isUserMode) {
    return (
      <>
        <NoIndexMeta />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Você está visualizando como usuário</p>
            <Button
              variant="default"
              size="lg"
              onClick={() => setPreviewMode('admin')}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Eye className="h-4 w-4 mr-2" />
              Retornar ao modo Admin
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NoIndexMeta />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <Link href="/admin/assets" className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Admin Panel</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={isUserMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode(isUserMode ? 'admin' : 'user')}
                className={isUserMode ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isUserMode ? 'Voltando ao modo Admin' : 'Visualizar como Usuário'}
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background
              transform transition-transform duration-200 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <nav className="p-4 space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname ? (pathname === item.href || pathname.startsWith(item.href + '/')) : false;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Overlay para mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
