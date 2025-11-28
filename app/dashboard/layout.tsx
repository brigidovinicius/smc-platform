export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import type { ReactNode } from 'react';
import { SidebarProvider } from '@/contexts/SidebarContext';

// Layout vazio - cada página do dashboard gerencia seu próprio header e sidebar
// Isso evita conflitos de layout duplicado
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}


