export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import AssetWizard from '@/components/assets/AssetWizard';

export default async function NewAssetPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get user role from profile
  const userId = (session.user as { id?: string })?.id;
  if (userId) {
    const { default: prisma } = await import('@/lib/prisma');
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    
    // Redirect admins to /admin
    if (profile?.role === 'ADMIN') {
      redirect('/admin');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Create New Asset</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details about your digital asset to get started
        </p>
      </div>
      <AssetWizard />
    </div>
  );
}
