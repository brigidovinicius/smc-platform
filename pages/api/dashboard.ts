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

  const adminMode = isAdmin(session);
  log(traceId, 'Session resolved', {
    userId,
    adminMode,
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
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email },
      select: { id: true }
    });
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

  const [assets, offers, stats] = await Promise.all([
    getUserAssets(userId),
    getUserOffers(userId),
    getDashboardStats(userId)
  ]);

  log(traceId, 'User data fetched', {
    assets: assets.length,
    offers: offers.length
  });

  const normalizedStats: DashboardStatsPayload = {
    readinessScore: stats.readinessScore ?? 0,
    valuation: stats.valuation ?? '$0',
    assetsCount: stats.assetsCount ?? assets.length,
    offersCount: stats.offersCount ?? offers.length,
    totalValue: stats.totalValue ?? '$0'
  };

  return {
    isAdmin: false,
    assets: serializePrismaData(assets),
    offers: serializePrismaData(offers),
    stats: normalizedStats,
    adminMetrics: null
  };
}

function respondUnauthorized(res: NextApiResponse<ApiResponse>, traceId: string, reason: string) {
  return res.status(401).json({
    success: false,
    error: true,
    message: 'Unauthorized',
    details: reason,
    code: 'UNAUTHORIZED',
    traceId
  } as ApiResponse);
}

function respondWithDashboardError(res: NextApiResponse<ApiResponse>, traceId: string, error: unknown) {
  return res.status(500).json({
    success: false,
    error: true,
    message: 'Dashboard route failed',
    details: sanitizeError(error),
    code: 'DASHBOARD_ROUTE_FAILED',
    traceId
  } as ApiResponse);
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
