import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { apiHandler, successResponse, errorResponse, requireMethod } from '@/lib/api/helpers';
import { getUserId } from '@/lib/api/permissions';
import { getUserBadges } from '@/lib/services/badges';

export default apiHandler(async (req, res) => {
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = getUserId(session);

  if (!userId) {
    return errorResponse(res, 'Unauthorized', 401, 'UNAUTHORIZED');
  }

  try {
    const badges = await getUserBadges(userId);
    return successResponse(res, badges, 200);
  } catch (error: any) {
    console.error('[API] Error fetching user badges:', error);
    return errorResponse(res, error.message || 'Error fetching badges', 500, 'INTERNAL_ERROR');
  }
});

