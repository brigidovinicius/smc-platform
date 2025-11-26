import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile?.role !== 'ADMIN') {
    return null;
  }

  return { session, user, profile };
}


