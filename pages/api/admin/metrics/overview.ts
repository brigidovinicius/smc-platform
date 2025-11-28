import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalAssets,
      assetsLast30Days,
      totalLeads,
      totalOffers,
      assetTypeDistribution,
      totalValue,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.lead.count(),
      prisma.offer.count(),
      prisma.asset.groupBy({
        by: ['type'],
        _count: true,
      }),
      prisma.offer.aggregate({
        _sum: {
          price: true,
        },
      }),
    ]);

    // Calcular crescimento
    const previousPeriod = await prisma.asset.count({
      where: {
        createdAt: {
          gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
          lt: thirtyDaysAgo,
        },
      },
    });

    const assetGrowth = previousPeriod > 0
      ? ((assetsLast30Days - previousPeriod) / previousPeriod) * 100
      : assetsLast30Days > 0 ? 100 : 0;

    // Calcular taxa de conversão (leads para ofertas)
    const conversionRate = totalLeads > 0
      ? (totalOffers / totalLeads) * 100
      : 0;

    // Transformar distribuição de tipos
    const typeDistribution: Record<string, number> = {};
    assetTypeDistribution.forEach(item => {
      typeDistribution[item.type] = item._count;
    });

    return successResponse(res, {
      totalAssets,
      assetGrowth: {
        count: assetsLast30Days,
        percentage: Math.round(assetGrowth * 100) / 100,
      },
      totalLeads,
      totalOffers,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalValue: totalValue._sum.price || 0,
      assetTypeDistribution: typeDistribution,
    });
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

