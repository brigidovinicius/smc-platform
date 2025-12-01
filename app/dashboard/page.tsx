export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import DashboardPageClient from '@/components/dashboard/DashboardPageClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get user role from profile
  const userId = (session.user as { id?: string })?.id;
  if (userId) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    
    // Redirect admins to /admin
    if (profile?.role === 'ADMIN') {
      redirect('/admin');
    }
  }

  return <DashboardPageClient />;
}
