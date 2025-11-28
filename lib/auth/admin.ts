import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { findUserByEmailSafe, findProfileByUserIdSafe } from '@/lib/prisma-helpers';

export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  // Usar helpers seguros que evitam prepared statements
  const user = await findUserByEmailSafe(session.user.email);

  if (!user) {
    return null;
  }

  const profile = await findProfileByUserIdSafe(user.id);

  if (!profile || profile.role !== 'ADMIN') {
    return null;
  }

  return { session, user, profile };
}


