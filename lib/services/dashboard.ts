import prisma from '@/lib/prisma';
import { countAssetsSafe, countOffersSafe } from '@/lib/prisma-helpers';

export async function getUserAssets(userId: string) {
    try {
        return await prisma.asset.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error('[getUserAssets] Error:', error);
        throw new Error(`Failed to get user assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getUserOffers(userId: string) {
    try {
        // Note: Offer.asset still points to SaaSAsset (legacy relation)
        // For now, we'll return offers without asset relation to avoid errors
        // TODO: Migrate Offer model to use Asset instead of SaaSAsset
        return await prisma.offer.findMany({
            where: { sellerId: userId },
            // Temporarily exclude asset to avoid relation errors
            // include: { asset: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error('[getUserOffers] Error:', error);
        throw new Error(`Failed to get user offers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getDashboardStats(userId: string) {
    try {
        // Em serverless, executar queries sequencialmente pode evitar conflitos
        // de prepared statements quando há connection pooling
        // Executar em paralelo pode causar "prepared statement already exists"
        
        // Executar queries sequencialmente para evitar conflitos
        // Usar helpers seguros que evitam problemas com prepared statements
        const assetsCount = await countAssetsSafe({ ownerId: userId });
        const offersCount = await countOffersSafe({ sellerId: userId });
        const assets = await prisma.asset.findMany({
            where: { ownerId: userId },
            select: {
                mrr: true,
                arr: true
            }
        });

        // Helper para converter valores numéricos de forma segura
        const safeNumber = (value: number | null | undefined): number => {
            if (value === null || value === undefined) return 0;
            const num = Number(value);
            return isNaN(num) || !isFinite(num) ? 0 : num;
        };

        // Calcular total em carteira (soma de ARR ou MRR * 12)
        const totalValue = assets.reduce((sum, asset) => {
            const arr = safeNumber(asset.arr);
            const mrr = safeNumber(asset.mrr);
            const value = arr > 0 ? arr : (mrr > 0 ? mrr * 12 : 0);
            return sum + value;
        }, 0);

        // Calcular readiness score baseado em completude dos dados
        // Por enquanto, um cálculo simples baseado em quantos ativos têm dados completos
        const assetsWithCompleteData = assets.filter(a => {
            const mrr = safeNumber(a.mrr);
            return mrr > 0;
        }).length;
        const completenessRatio = assetsCount > 0 ? assetsWithCompleteData / assetsCount : 0;
        const readinessScore = Math.round(50 + (completenessRatio * 50)); // 50% base + até 50% por completude

        // Calcular valuation sugerido (baseado em múltiplo de MRR)
        // Múltiplo padrão: 3-5x MRR anual
        const totalARR = assets.reduce((sum, asset) => sum + safeNumber(asset.arr), 0);
        const totalMRR = assets.reduce((sum, asset) => sum + safeNumber(asset.mrr), 0);
        const annualizedMRR = totalMRR * 12;
        const annualRevenue = totalARR > 0 ? totalARR : annualizedMRR;
        
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
    } catch (error) {
        console.error('[getDashboardStats] Error:', error);
        throw new Error(`Failed to get dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
