import { randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { getUserAssets, getUserOffers, getDashboardStats } from '@/lib/services/dashboard';
import { getAdminMetrics } from '@/lib/services/metrics';
import { apiHandler, successResponse, requireMethod, type ApiResponse } from '@/lib/api/helpers';
import { isAdmin } from '@/lib/api/permissions';
import { recordServerAction } from '@/lib/context7';
import prisma from '@/lib/prisma';

type DashboardStatsPayload = {
  readinessScore: number;
  valuation: string;
  assetsCount: number;
  offersCount?: number;
  totalValue?: string;
  totalAssets?: number;
  totalOffers?: number;
  totalUsers?: number;
  totalMRR?: string | number;
};

type DashboardResponsePayload = {
  isAdmin: boolean;
  assets: unknown[];
  offers: unknown[];
  stats: DashboardStatsPayload;
  adminMetrics?: Awaited<ReturnType<typeof getAdminMetrics>> | null;
};

type SessionUser = {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  role?: string | null;
};

const LOG_PREFIX = '[API][/api/dashboard]';

export default apiHandler(async (req, res) => {
  const traceId = randomUUID();

  log(traceId, 'Incoming request', { method: req.method, query: req.query });

  if (!requireMethod(req, res, ['GET'])) {
    log(traceId, 'Method not allowed', { method: req.method });
    return;
  }

  const session = await resolveSession(req, res, traceId);
  if (!session) {
    log(traceId, 'Session could not be resolved, returning 401');
    return respondUnauthorized(res, traceId, 'Session not found');
  }

  const sessionUser = session.user as SessionUser;
  const userId = await resolveUserId(session, sessionUser, traceId);

  if (!userId) {
    log(traceId, 'User ID missing in session, returning 401');
    return respondUnauthorized(res, traceId, 'User not authorized');
  }

  // Verificar se há parâmetro para forçar modo usuário (útil quando admin quer ver como usuário)
  const forceUserMode = req.query.forceUserMode === 'true' || req.query.mode === 'user';
  
  const adminMode = isAdmin(session) && !forceUserMode;
  log(traceId, 'Session resolved', {
    userId,
    adminMode,
    forceUserMode,
    email: sessionUser?.email ?? null
  });

  try {
    const payload = adminMode
      ? await buildAdminPayload(traceId)
      : await buildUserPayload(userId, traceId);

    log(traceId, 'Dashboard payload prepared', {
      adminMode,
      assets: payload.assets.length,
      offers: payload.offers.length
    });

    recordServerAction({
      action: 'dashboard_fetch',
      user: {
        id: userId,
        email: sessionUser?.email ?? undefined,
        name: sessionUser?.name ?? undefined
      },
      metadata: {
        mode: adminMode ? 'admin' : 'user',
        assets: payload.assets.length,
        offers: payload.offers.length,
        readinessScore: payload.stats.readinessScore
      },
      result: 'success'
    }).catch(() => undefined);

    return successResponse(res, payload, 200);
  } catch (error) {
    log(traceId, 'Dashboard route failed', {
      adminMode,
      error: sanitizeError(error)
    });

    return respondWithDashboardError(res, traceId, error);
  }
});

async function resolveSession(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  traceId: string
) {
  try {
    log(traceId, 'Resolving NextAuth session');
    const session = await getServerSession(req, res, authOptions);
    log(traceId, 'Session resolved successfully', { hasSession: !!session });
    return session;
  } catch (error) {
    log(traceId, 'Failed to resolve session', { error: sanitizeError(error) });
    return null;
  }
}

async function resolveUserId(session: Session, sessionUser: SessionUser, traceId: string) {
  if (sessionUser?.id) {
    return sessionUser.id;
  }

  if (!sessionUser?.email) {
    return null;
  }

  try {
    log(traceId, 'Fallback lookup for user ID via email');
    // Usar helper seguro que evita prepared statements
    const { findUserByEmailSafe } = await import('@/lib/prisma-helpers');
    const user = await findUserByEmailSafe(sessionUser.email);
    return user?.id ?? null;
  } catch (error) {
    log(traceId, 'Failed to resolve user ID from database', { error: sanitizeError(error) });
    return null;
  }
}

async function buildAdminPayload(traceId: string): Promise<DashboardResponsePayload> {
  log(traceId, 'Fetching admin dashboard data');

  const [latestAssets, latestOffers, adminMetrics] = await Promise.all([
    prisma.asset.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        leads: {
          select: {
            id: true,
            status: true,
            createdAt: true
          },
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    prisma.offer.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }),
    getAdminMetrics()
  ]);

  log(traceId, 'Admin data fetched', {
    assets: latestAssets.length,
    offers: latestOffers.length
  });

  return {
    isAdmin: true,
    assets: serializePrismaData(latestAssets),
    offers: serializePrismaData(latestOffers),
    stats: {
      readinessScore: 100,
      valuation: 'Global overview',
      assetsCount: adminMetrics.totalAssets,
      offersCount: adminMetrics.totalOffers,
      totalAssets: adminMetrics.totalAssets,
      totalOffers: adminMetrics.totalOffers,
      totalUsers: adminMetrics.totalUsers,
      totalMRR: adminMetrics.formattedTotalMRR
    },
    adminMetrics
  };
}

async function buildUserPayload(userId: string, traceId: string): Promise<DashboardResponsePayload> {
  log(traceId, 'Fetching user dashboard data', { userId });

  // Garantir valores default mesmo em caso de erro
  let assets: unknown[] = [];
  let offers: unknown[] = [];
  let stats: Awaited<ReturnType<typeof getDashboardStats>>;

  try {
    [assets, offers, stats] = await Promise.all([
      getUserAssets(userId).catch(() => []),
      getUserOffers(userId).catch(() => []),
      getDashboardStats(userId).catch(() => ({
        readinessScore: 0,
        valuation: '$0',
        assetsCount: 0,
        offersCount: 0,
        totalValue: '$0'
      }))
    ]);
  } catch (error) {
    log(traceId, 'Error fetching user data, using defaults', { error: sanitizeError(error) });
    assets = [];
    offers = [];
    stats = {
      readinessScore: 0,
      valuation: '$0',
      assetsCount: 0,
      offersCount: 0,
      totalValue: '$0'
    };
  }

  log(traceId, 'User data fetched', {
    assets: assets.length,
    offers: offers.length
  });

  // Garantir que todos os valores sejam definidos (nunca undefined)
  const normalizedStats: DashboardStatsPayload = {
    readinessScore: typeof stats?.readinessScore === 'number' ? stats.readinessScore : 0,
    valuation: typeof stats?.valuation === 'string' && stats.valuation.length > 0 ? stats.valuation : '$0',
    assetsCount: typeof stats?.assetsCount === 'number' ? stats.assetsCount : (Array.isArray(assets) ? assets.length : 0),
    offersCount: typeof stats?.offersCount === 'number' ? stats.offersCount : (Array.isArray(offers) ? offers.length : 0),
    totalValue: typeof stats?.totalValue === 'string' && stats.totalValue.length > 0 ? stats.totalValue : '$0'
  };

  return {
    isAdmin: false,
    assets: Array.isArray(assets) ? serializePrismaData(assets) : [],
    offers: Array.isArray(offers) ? serializePrismaData(offers) : [],
    stats: normalizedStats,
    adminMetrics: null
  };
}

function respondUnauthorized(res: NextApiResponse<ApiResponse>, traceId: string, reason: string) {
  const response: ApiResponse = {
    success: false,
    error: `Unauthorized: ${reason}`,
    code: 'UNAUTHORIZED'
  };
  return res.status(401).json(response);
}

function respondWithDashboardError(res: NextApiResponse<ApiResponse>, traceId: string, error: unknown) {
  const errorMessage = sanitizeError(error);
  log(traceId, 'Dashboard route failed', { error: errorMessage });
  const response: ApiResponse = {
    success: false,
    error: `Dashboard route failed: ${errorMessage}`,
    code: 'DASHBOARD_ROUTE_FAILED'
  };
  return res.status(500).json(response);
}

function serializePrismaData<T>(payload: T): T {
  try {
    return JSON.parse(
      JSON.stringify(payload, (_key, value) => {
        // Handle BigInt
        if (typeof value === 'bigint') {
          return Number(value);
        }

        // Handle Prisma Decimal
        if (
          value &&
          typeof value === 'object' &&
          value.constructor &&
          value.constructor.name === 'Decimal' &&
          typeof (value as { toNumber?: () => number }).toNumber === 'function'
        ) {
          try {
            return (value as { toNumber: () => number }).toNumber();
          } catch {
            return 0;
          }
        }

        // Handle Date objects (DateTime from Prisma)
        if (value instanceof Date) {
          return value.toISOString();
        }

        // Handle undefined (convert to null for JSON)
        if (value === undefined) {
          return null;
        }

        return value;
      })
    );
  } catch (error) {
    console.error('[serializePrismaData] Error serializing data:', error);
    // Fallback: return as-is if serialization fails
    // This might cause issues but prevents complete failure
    return payload;
  }
}

function sanitizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unexpected error';
}

function log(traceId: string, message: string, extra?: Record<string, unknown>) {
  if (extra) {
    console.log(`${LOG_PREFIX}[${traceId}] ${message}`, extra);
  } else {
    console.log(`${LOG_PREFIX}[${traceId}] ${message}`);
  }
}
