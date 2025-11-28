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
  Eye,
  DollarSign,
  Award,
  BarChart3,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { usePreviewMode } from '@/components/providers/PreviewModeProvider';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/assets', label: 'Assets', icon: Package },
  { href: '/admin/assets/new', label: 'Criar Asset', icon: Plus },
  { href: '/admin/offers', label: 'Ofertas', icon: DollarSign },
  { href: '/admin/badges', label: 'Badges', icon: Award },
  { href: '/admin/metrics', label: 'Métricas', icon: BarChart3 },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Try to get preview mode, with error handling
  let previewMode: 'admin' | 'user' = 'admin';
  let setPreviewMode: ((mode: 'admin' | 'user') => Promise<void>) | null = null;
  let isUserMode = false;
  
  try {
    const previewModeContext = usePreviewMode();
    previewMode = previewModeContext.previewMode;
    setPreviewMode = previewModeContext.setPreviewMode;
    isUserMode = previewModeContext.isUserMode;
    console.log('[AdminLayout] PreviewMode context carregado:', { previewMode, isUserMode });
  } catch (error) {
    console.error('[AdminLayout] Erro ao carregar PreviewMode context:', error);
    // Fallback: tentar ler do cookie diretamente
    if (typeof document !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('preview-mode='))
        ?.split('=')[1];
      previewMode = cookieValue === 'user' ? 'user' : 'admin';
      isUserMode = previewMode === 'user';
      console.log('[AdminLayout] Modo lido do cookie:', previewMode);
    }
  }

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
          <div className="text-center space-y-4 max-w-md mx-auto p-8">
            <div className="mb-6">
              <Eye className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Modo Usuário Ativo</h2>
              <p className="text-muted-foreground">
                Você está visualizando a plataforma como um usuário comum. 
                Navegue pelo site normalmente para ver como os usuários veem o sistema.
              </p>
            </div>
            <div className="space-y-2">
            <Button
              variant="default"
              size="lg"
              onClick={async () => {
                console.log('[AdminLayout] Botão "Retornar ao Admin" clicado');
                if (!setPreviewMode) {
                  console.error('[AdminLayout] setPreviewMode não está disponível!');
                  // Fallback: tentar definir cookie diretamente
                  if (typeof document !== 'undefined') {
                    document.cookie = 'preview-mode=admin; Path=/; Max-Age=86400; SameSite=Lax';
                    window.location.href = '/admin';
                  }
                  return;
                }
                try {
                  await setPreviewMode('admin');
                  console.log('[AdminLayout] Modo alterado para admin');
                  // Forçar refresh após mudança
                  setTimeout(() => {
                    window.location.href = '/admin';
                  }, 500);
                } catch (error) {
                  console.error('Erro ao voltar ao modo admin:', error);
                  alert('Erro ao voltar ao modo admin. Tente novamente.');
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Retornar ao Modo Admin
            </Button>
              <p className="text-xs text-muted-foreground">
                Você pode navegar pelo site normalmente. O badge amarelo no topo indica que está em modo usuário.
              </p>
            </div>
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
              
              <Link href="/admin" className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Admin Panel</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={isUserMode ? 'default' : 'outline'}
                size="sm"
                onClick={async () => {
                  console.log('[AdminLayout] Botão clicado. Modo atual:', previewMode, 'isUserMode:', isUserMode);
                  const newMode = isUserMode ? 'admin' : 'user';
                  console.log('[AdminLayout] Tentando alterar para:', newMode);
                  
                  if (!setPreviewMode) {
                    console.error('[AdminLayout] setPreviewMode não está disponível! Usando fallback...');
                    // Fallback: fazer requisição direta à API
                    try {
                      const response = await fetch('/api/preview-mode', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mode: newMode }),
                        credentials: 'include',
                      });
                      
                      if (response.ok) {
                        // Atualizar cookie manualmente
                        if (typeof document !== 'undefined') {
                          document.cookie = `preview-mode=${newMode}; Path=/; Max-Age=86400; SameSite=Lax`;
                        }
                        // Recarregar página
                        window.location.href = newMode === 'user' ? '/' : '/admin';
                      } else {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || errorData.message || 'Erro ao alterar modo');
                      }
                    } catch (error) {
                      console.error('[AdminLayout] Erro no fallback:', error);
                      alert(`Erro ao alterar modo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                    }
                    return;
                  }
                  
                  try {
                    await setPreviewMode(newMode);
                    console.log('[AdminLayout] Modo alterado com sucesso para:', newMode);
                    // Forçar refresh após mudança
                    setTimeout(() => {
                      window.location.href = newMode === 'user' ? '/' : '/admin';
                    }, 500);
                  } catch (error) {
                    console.error('[AdminLayout] Erro ao alterar modo:', error);
                    alert(`Erro ao alterar modo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                  }
                }}
                className={isUserMode ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'border-primary text-primary hover:bg-primary/10'}
                title={isUserMode ? 'Clique para voltar ao modo Admin' : 'Clique para visualizar como usuário comum'}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isUserMode ? 'Voltar ao Admin' : 'Modo Usuário'}
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

        <div className="flex relative">
          {/* Overlay para mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background overflow-y-auto
              transform transition-transform duration-200 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="p-4 border-b">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Menu
              </h2>
            </div>
            <nav className="p-4 space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                // Melhorar detecção de rota ativa
                let isActive = false;
                if (pathname) {
                  if (item.href === '/admin') {
                    // Para a rota raiz, só ativa se for exatamente /admin
                    isActive = pathname === '/admin';
                  } else {
                    // Para outras rotas, verifica se começa com o href
                    isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  }
                }
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="block"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </aside>

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
