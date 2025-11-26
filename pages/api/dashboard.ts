import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { getUserAssets, getUserOffers, getDashboardStats } from '@/lib/services/dashboard';
import { apiHandler, successResponse, errorResponse, requireMethod } from '@/lib/api/helpers';
import { recordServerAction } from '@/lib/context7';

export default apiHandler(async (req, res) => {
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  const sessionUser = session?.user as { id?: string; email?: string | null; name?: string | null } | undefined;
  const user = sessionUser;
  if (!user?.id) {
    return errorResponse(res, 'Unauthorized', 401, 'UNAUTHORIZED');
  }

  try {
    const userId = user.id;
    
    const [assets, offers, stats] = await Promise.all([
      getUserAssets(userId),
      getUserOffers(userId),
      getDashboardStats(userId)
    ]);

    // Serialize Decimal to string/number for JSON serialization
    const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'object' && value !== null && 's' in value && 'e' in value ? Number(value) : value
    ));

    const payload = {
      assets: serialize(assets),
      offers: serialize(offers),
      stats: serialize(stats)
    };

    recordServerAction({
      action: 'dashboard_fetch',
      user: {
        id: userId,
        email: sessionUser?.email ?? undefined,
        name: sessionUser?.name ?? undefined
      },
      metadata: {
        assets: payload.assets?.length ?? 0,
        offers: payload.offers?.length ?? 0
      },
      result: 'success'
    }).catch(() => undefined);

    return successResponse(res, payload, 200);
  } catch (error: any) {
    console.error('[API] Error fetching dashboard data:', error);
    return errorResponse(res, error.message || 'Error fetching dashboard data', 500, 'INTERNAL_ERROR');
  }
});

