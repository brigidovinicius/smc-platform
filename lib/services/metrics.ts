import prisma from '@/lib/prisma';

/**
 * Calcula métricas agregadas dos ativos do usuário
 */
export async function getUserMetrics(userId: string) {
  const assets = await prisma.asset.findMany({
    where: { ownerId: userId },
    select: {
      mrr: true,
      churnRate: true,
      arr: true,
    }
  });

  // Calcular MRR total auditado
  const totalMRR = assets.reduce((sum, asset) => sum + (Number(asset.mrr) || 0), 0);
  
  // Calcular churn médio
  const validChurns = assets.filter(a => a.churnRate !== null && a.churnRate !== undefined);
  const avgChurn = validChurns.length > 0
    ? validChurns.reduce((sum, asset) => sum + (Number(asset.churnRate) || 0), 0) / validChurns.length
    : 0;

  // Calcular crescimento (mockado por enquanto - poderia usar AssetFinancials)
  const growth = 9; // TODO: calcular baseado em histórico

  // Calcular CAC payback médio (mockado por enquanto)
  const cacPayback = 5.2; // TODO: calcular baseado em dados reais

  return {
    mrr: {
      value: totalMRR,
      formatted: `$${totalMRR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: growth,
      growthLabel: `+${growth}% vs last month`
    },
    churn: {
      value: avgChurn,
      formatted: `${avgChurn.toFixed(1)}%`,
      benchmark: 'SaaS B2B',
      status: 'In line with industry'
    },
    cacPayback: {
      value: cacPayback,
      formatted: `${cacPayback} months`,
      ideal: '< 7 months',
      target: 'Target < 6 months'
    }
  };
}

/**
 * Calcula métricas globais (admin)
 */
export async function getAdminMetrics() {
  const [
    totalAssets,
    totalOffers,
    totalUsers,
    totalMRR
  ] = await Promise.all([
    prisma.asset.count(),
    prisma.offer.count(),
    prisma.user.count(),
    prisma.asset.aggregate({
      _sum: {
        mrr: true
      }
    })
  ]);

  return {
    totalAssets,
    totalOffers,
    totalUsers,
    totalMRR: Number(totalMRR._sum.mrr) || 0,
    formattedTotalMRR: `$${(Number(totalMRR._sum.mrr) || 0).toLocaleString('en-US')}`
  };
}

