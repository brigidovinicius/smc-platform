import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { getUserAssets, getUserOffers, getDashboardStats } from '@/lib/services/dashboard';
import { getAdminMetrics } from '@/lib/services/metrics';
import { apiHandler, successResponse, errorResponse, requireMethod } from '@/lib/api/helpers';
import { getUserId, isAdmin } from '@/lib/api/permissions';
import { recordServerAction } from '@/lib/context7';
import prisma from '@/lib/prisma';

export default apiHandler(async (req, res) => {
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  const sessionUser = session?.user as { id?: string; email?: string | null; name?: string | null; role?: string } | undefined;
  const user = sessionUser;
  
  if (!user?.id) {
    return errorResponse(res, 'Unauthorized', 401, 'UNAUTHORIZED');
  }

  const adminMode = isAdmin(session);

  try {
    const userId = user.id;
    
    if (adminMode) {
      // Admin Mode: Buscar dados globais da plataforma
      const [allAssets, allOffers, adminMetrics] = await Promise.all([
        prisma.asset.findMany({
          take: 10, // Últimos 10 ativos
          orderBy: { createdAt: 'desc' },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }),
        prisma.offer.findMany({
          take: 10, // Últimas 10 ofertas
          // Note: offer.asset relation points to SaaSAsset, not Asset
          // This is a legacy relation that may need migration
          include: { 
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        getAdminMetrics()
      ]);

      const totalAssets = await prisma.asset.count();
      const totalOffers = await prisma.offer.count();
      const totalUsers = await prisma.user.count();

      // Serialize Decimal to string/number for JSON serialization
      const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'object' && value !== null && 's' in value && 'e' in value ? Number(value) : value
      ));

      const payload = {
        isAdmin: true,
        assets: serialize(allAssets),
        offers: serialize(allOffers),
        stats: {
          totalAssets,
          totalOffers,
          totalUsers,
          totalMRR: adminMetrics.formattedTotalMRR,
          readinessScore: 100, // Admin tem acesso total
          valuation: 'Global',
          assetsCount: totalAssets
        },
        adminMetrics: {
          totalAssets,
          totalOffers,
          totalUsers,
          totalMRR: adminMetrics.totalMRR,
          formattedTotalMRR: adminMetrics.formattedTotalMRR
        }
      };

      recordServerAction({
        action: 'dashboard_fetch',
        user: {
          id: userId,
          email: sessionUser?.email ?? undefined,
          name: sessionUser?.name ?? undefined
        },
        metadata: {
          mode: 'admin',
          assets: payload.assets?.length ?? 0,
          offers: payload.offers?.length ?? 0
        },
        result: 'success'
      }).catch(() => undefined);

      return successResponse(res, payload, 200);
    } else {
      // User Mode: Buscar APENAS dados do próprio usuário (sem informações globais)
      const [assets, offers, stats] = await Promise.all([
        getUserAssets(userId),
        getUserOffers(userId),
        getDashboardStats(userId)
      ]);
      
      // Garantir que são apenas dados pessoais do usuário

      // Serialize Decimal to string/number for JSON serialization
      const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'object' && value !== null && 's' in value && 'e' in value ? Number(value) : value
      ));

      const payload = {
        isAdmin: false,
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
          mode: 'user',
          assets: payload.assets?.length ?? 0,
          offers: payload.offers?.length ?? 0,
          readinessScore: payload.stats?.readinessScore
        },
        result: 'success'
      }).catch(() => undefined);

      return successResponse(res, payload, 200);
    }
  } catch (error: any) {
    console.error('[API] Error fetching dashboard data:', error);
    return errorResponse(res, error.message || 'Error fetching dashboard data', 500, 'INTERNAL_ERROR');
  }
});
