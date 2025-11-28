import prisma from '@/lib/prisma';
import { countAssetsSafe, countOffersSafe, countUsersSafe, aggregateMRRSafe } from '@/lib/prisma-helpers';

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
 * Usa helpers seguros para evitar problemas com prepared statements
 */
export async function getAdminMetrics() {
  // Executar queries sequencialmente para evitar conflitos de prepared statements
  // Em serverless, queries paralelas podem causar problemas
  const totalAssets = await countAssetsSafe();
  const totalOffers = await countOffersSafe();
  const totalUsers = await countUsersSafe();
  const totalMRR = await aggregateMRRSafe();

  return {
    totalAssets,
    totalOffers,
    totalUsers,
    totalMRR,
    formattedTotalMRR: `$${totalMRR.toLocaleString('en-US')}`
  };
}

