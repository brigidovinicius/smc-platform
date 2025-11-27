import { apiHandler, successResponse, errorResponse, requireMethod } from '@/lib/api/helpers';
import { requireAdmin } from '@/lib/api/admin';
import { getAdminMetrics } from '@/lib/services/metrics';

export default apiHandler(async (req, res) => {
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  const session = await requireAdmin(req, res);
  if (!session) return; // Já retornou erro

  try {
    const metrics = await getAdminMetrics();
    return successResponse(res, { metrics }, 200);
  } catch (error: any) {
    console.error('[API] Error fetching admin metrics:', error);
    return errorResponse(res, error.message || 'Error fetching metrics', 500, 'INTERNAL_ERROR');
  }
});

