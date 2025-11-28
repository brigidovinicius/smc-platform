import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';

/**
 * Verifica se o banco de dados está disponível
 */
function isDatabaseAvailable(): boolean {
  const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                      process.env.POSTGRES_URL || 
                      process.env.DATABASE_URL;
  return Boolean(
    databaseUrl && 
    !databaseUrl.includes('dummy') &&
    !databaseUrl.includes('postgres:5432') &&
    (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://'))
  );
}

/**
 * Verifica se o usuário atual é admin
 * Retorna a sessão se for admin, null caso contrário
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/admin');
  }

  const role = (session.user as { role?: string })?.role?.toLowerCase();
  if (role !== 'admin') {
    redirect('/not-authorized');
  }

  return session;
}

/**
 * Obtém estatísticas globais para o dashboard admin
 */
export async function getAdminStats() {
  // Verificar se o banco está disponível
  if (!isDatabaseAvailable()) {
    console.warn('[getAdminStats] Database not configured');
    return {
      totalAssets: 0,
      assetsByStatus: {},
      totalUsers: 0,
      totalLeads: 0,
      totalOffers: 0,
      pendingAssets: []
    };
  }

  try {
    const prisma = (await import('@/lib/prisma')).default;

    const [
      totalAssets,
      assetsByStatus,
      totalUsers,
      totalLeads,
      totalOffers,
      pendingAssets
    ] = await Promise.all([
      // Total de assets
      prisma.asset.count().catch(() => 0),
      
      // Assets por status
      prisma.asset.groupBy({
        by: ['status'],
        _count: true
      }).catch(() => []),
      
      // Total de usuários
      prisma.user.count().catch(() => 0),
      
      // Total de leads
      prisma.lead.count().catch(() => 0),
      
      // Total de ofertas
      prisma.offer.count().catch(() => 0),
      
      // Assets pendentes de revisão
      prisma.asset.findMany({
        where: {
          status: {
            in: ['PENDING_REVIEW', 'SUBMITTED']
          }
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }).catch(() => [])
    ]);

    // Transformar assetsByStatus em objeto
    const statusCounts: Record<string, number> = {};
    if (Array.isArray(assetsByStatus)) {
      assetsByStatus.forEach(item => {
        statusCounts[item.status] = item._count;
      });
    }

    return {
      totalAssets: totalAssets || 0,
      assetsByStatus: statusCounts,
      totalUsers: totalUsers || 0,
      totalLeads: totalLeads || 0,
      totalOffers: totalOffers || 0,
      pendingAssets: Array.isArray(pendingAssets) ? pendingAssets : []
    };
  } catch (error: any) {
    console.error('[getAdminStats] Error:', error);
    
    // Verificar se é erro de modelo não encontrado (migrations não executadas)
    const errorMessage = error?.message || '';
    const errorCode = error?.code || '';
    const isMigrationError = errorMessage.includes('does not exist') || 
                            errorMessage.includes('Unknown table') ||
                            errorMessage.includes('relation') ||
                            errorCode === 'P2021' || // Table does not exist
                            errorCode === 'P2001'; // Record not found (mas pode ser tabela)
    
    if (isMigrationError) {
      console.warn('[getAdminStats] Database tables may not exist. Run migrations: npx prisma migrate dev');
    }
    
    // Retornar valores padrão em caso de erro
    return {
      totalAssets: 0,
      assetsByStatus: {},
      totalUsers: 0,
      totalLeads: 0,
      totalOffers: 0,
      pendingAssets: []
    };
  }
}

