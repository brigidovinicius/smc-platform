import prisma from '@/lib/prisma';

export async function getUserAssets(userId: string) {
    return prisma.asset.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getUserOffers(userId: string) {
    return prisma.offer.findMany({
        where: { sellerId: userId },
        include: { asset: true },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getDashboardStats(userId: string) {
    // Buscar contagens
    const [assetsCount, offersCount, assets] = await Promise.all([
        prisma.asset.count({ where: { ownerId: userId } }),
        prisma.offer.count({ where: { sellerId: userId } }),
        prisma.asset.findMany({
            where: { ownerId: userId },
            select: {
                mrr: true,
                arr: true
            }
        })
    ]);

    // Calcular total em carteira (soma de ARR ou MRR * 12)
    const totalValue = assets.reduce((sum, asset) => {
        const value = asset.arr || (asset.mrr ? Number(asset.mrr) * 12 : 0);
        return sum + value;
    }, 0);

    // Calcular readiness score baseado em completude dos dados
    // Por enquanto, um cálculo simples baseado em quantos ativos têm dados completos
    const assetsWithCompleteData = assets.filter(a => a.mrr && a.mrr > 0).length;
    const completenessRatio = assetsCount > 0 ? assetsWithCompleteData / assetsCount : 0;
    const readinessScore = Math.round(50 + (completenessRatio * 50)); // 50% base + até 50% por completude

    // Calcular valuation sugerido (baseado em múltiplo de MRR)
    // Múltiplo padrão: 3-5x MRR anual
    const totalARR = assets.reduce((sum, asset) => sum + (Number(asset.arr) || 0), 0);
    const totalMRR = assets.reduce((sum, asset) => sum + (Number(asset.mrr) || 0), 0);
    const annualizedMRR = totalMRR * 12;
    const annualRevenue = totalARR || annualizedMRR;
    
    // Múltiplo conservador de 3x
    const valuation = annualRevenue * 3;
    const formattedValuation = valuation >= 1000000
        ? `$${(valuation / 1000000).toFixed(1)}M`
        : valuation >= 1000
        ? `$${(valuation / 1000).toFixed(0)}k`
        : `$${valuation.toFixed(0)}`;

    return {
        assetsCount,
        offersCount,
        readinessScore: Math.max(0, Math.min(100, readinessScore)),
        valuation: formattedValuation,
        totalValue: totalValue >= 1000
            ? `$${(totalValue / 1000).toFixed(0)}k`
            : `$${totalValue.toFixed(0)}`
    };
}
