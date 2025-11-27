import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { apiHandler, successResponse, errorResponse, requireMethod } from '@/lib/api/helpers';
import { getUserId } from '@/lib/api/permissions';
import { getUserMetrics } from '@/lib/services/metrics';

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
    const metrics = await getUserMetrics(userId);
    return successResponse(res, { metrics }, 200);
  } catch (error: any) {
    console.error('[API] Error fetching user metrics:', error);
    return errorResponse(res, error.message || 'Error fetching metrics', 500, 'INTERNAL_ERROR');
  }
});

