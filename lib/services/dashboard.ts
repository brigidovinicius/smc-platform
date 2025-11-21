import prisma from '@/lib/prisma';

export async function getUserAssets(userId: string) {
    return prisma.saaSAsset.findMany({
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
    // Placeholder for future stats calculation
    // For now we can return some basic counts or calculated values
    const assetsCount = await prisma.saaSAsset.count({ where: { ownerId: userId } });
    const offersCount = await prisma.offer.count({ where: { sellerId: userId } });

    return {
        assetsCount,
        offersCount,
        readinessScore: 82, // Mocked for now as logic is complex
        valuation: 'R$ 950k' // Mocked
    };
}
