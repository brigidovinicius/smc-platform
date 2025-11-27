export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import DashboardPageClient from '@/components/dashboard/DashboardPageClient';

export default function DashboardPage() {
  return <DashboardPageClient />;
}
