/**
 * Helpers para queries Prisma que evitam prepared statements
 * Útil para ambientes serverless onde prepared statements causam conflitos
 */

import prisma from '@/lib/prisma';

/**
 * Executa count de forma segura, com fallback para $queryRaw
 * Em produção/serverless, usa $queryRaw diretamente para evitar erros
 */
async function safeCount<T>(
  model: string,
  where?: any,
  fallbackQuery: string = ''
): Promise<number> {
  // Em produção ou quando há problemas com prepared statements, usar $queryRaw diretamente
  const isProduction = process.env.NODE_ENV === 'production';
  const forceRawQueries = process.env.FORCE_RAW_QUERIES === 'true' || isProduction;
  
  if (forceRawQueries) {
    // Usar query raw diretamente em produção
    try {
      let query = `SELECT COUNT(*) as count FROM "${model === 'asset' ? 'Asset' : model === 'offer' ? 'Offer' : 'User'}"`;
      if (where) {
        // Construir WHERE clause básico (simplificado)
        const conditions: string[] = [];
        if (where.ownerId) {
          conditions.push(`"ownerId" = '${where.ownerId}'`);
        }
        if (where.sellerId) {
          conditions.push(`"sellerId" = '${where.sellerId}'`);
        }
        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }
      }
      
      const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(query);
      return Number(result[0]?.count || 0);
    } catch (error: any) {
      console.error(`[Prisma Helper] Error in $queryRaw ${model}.count():`, error);
      throw error;
    }
  }
  
  // Em desenvolvimento, tentar query normal primeiro
  try {
    if (model === 'asset') {
      return await prisma.asset.count(where || {});
    } else if (model === 'offer') {
      return await prisma.offer.count(where || {});
    } else if (model === 'user') {
      return await prisma.user.count(where || {});
    }
    return 0;
  } catch (error: any) {
    // Se der erro de prepared statement, usar query raw
    if (
      error?.message?.includes('prepared statement') ||
      error?.code === '42P05' ||
      error?.code === '26000'
    ) {
      console.log(`[Prisma Helper] Using $queryRaw fallback for ${model}.count()`);
      
      if (fallbackQuery) {
        const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(fallbackQuery);
        return Number(result[0]?.count || 0);
      }
      
      // Query padrão se não fornecido
      let query = `SELECT COUNT(*) as count FROM "${model === 'asset' ? 'Asset' : model === 'offer' ? 'Offer' : 'User'}"`;
      if (where) {
        // Construir WHERE clause básico (simplificado)
        const conditions: string[] = [];
        if (where.ownerId) {
          conditions.push(`"ownerId" = '${where.ownerId}'`);
        }
        if (where.sellerId) {
          conditions.push(`"sellerId" = '${where.sellerId}'`);
        }
        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }
      }
      
      const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(query);
      return Number(result[0]?.count || 0);
    }
    
    throw error;
  }
}

/**
 * Busca usuário por email sem usar prepared statements
 * Em produção/serverless, usa $queryRaw diretamente para evitar erros
 */
export async function findUserByEmailSafe(email: string) {
  // SEMPRE usar $queryRaw para evitar prepared statements
  // Isso é crítico quando usando connection pooling (pgBouncer/Supabase)
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  const usingPooling = databaseUrl && (databaseUrl.includes('pooler') || databaseUrl.includes('pgbouncer'));
  const forceRawQueries = process.env.FORCE_RAW_QUERIES === 'true' || isProduction || usingPooling;
  
  if (forceRawQueries) {
    // Usar query raw diretamente em produção para evitar problemas com prepared statements
    try {
      const users = await prisma.$queryRaw<Array<{
        id: string;
        email: string | null;
        name: string | null;
        password: string | null;
        image: string | null;
        emailVerified: Date | null;
        role: string | null;
      }>>`
        SELECT 
          u.id,
          u.email,
          u.name,
          u.password,
          u.image,
          u."emailVerified",
          p.role
        FROM "User" u
        LEFT JOIN "Profile" p ON p."userId" = u.id
        WHERE LOWER(u.email) = LOWER(${email})
        LIMIT 1
      `;
      
      if (users.length === 0) {
        return null;
      }
      
      const user = users[0];
      
      // Retornar no formato esperado
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        image: user.image,
        emailVerified: user.emailVerified,
        profile: user.role ? {
          role: user.role
        } : null
      };
    } catch (error: any) {
      console.error('[Prisma Helper] Error in $queryRaw user lookup:', error);
      throw error;
    }
  }
  
  // Em desenvolvimento, tentar query normal primeiro (mas só se não estiver usando pooling)
  if (!usingPooling) {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          profile: {
            select: { role: true }
          }
        }
      });
    } catch (error: any) {
      // Se der erro de prepared statement, usar query raw
      if (
        error?.message?.includes('prepared statement') ||
        error?.code === '42P05' ||
        error?.code === '26000'
      ) {
      console.log('[Prisma Helper] Using $queryRaw fallback for user lookup');
      
      // Usar query raw que não cria prepared statements
      const users = await prisma.$queryRaw<Array<{
        id: string;
        email: string | null;
        name: string | null;
        password: string | null;
        image: string | null;
        emailVerified: Date | null;
        role: string | null;
      }>>`
        SELECT 
          u.id,
          u.email,
          u.name,
          u.password,
          u.image,
          u."emailVerified",
          p.role
        FROM "User" u
        LEFT JOIN "Profile" p ON p."userId" = u.id
        WHERE LOWER(u.email) = LOWER(${email})
        LIMIT 1
      `;
      
      if (users.length === 0) {
        return null;
      }
      
      const user = users[0];
      
      // Retornar no formato esperado
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        image: user.image,
        emailVerified: user.emailVerified,
        profile: user.role ? {
          role: user.role
        } : null
      };
      }
      
      // Re-throw outros erros
      throw error;
    }
  }
  
  // Se estiver usando pooling, sempre usar $queryRaw
  // (código já executado acima no if (forceRawQueries))
  return null;
}

/**
 * Busca profile por userId sem usar prepared statements
 * Em produção/serverless, usa $queryRaw diretamente para evitar erros
 */
export async function findProfileByUserIdSafe(userId: string) {
  // SEMPRE usar $queryRaw para evitar prepared statements
  // Isso é crítico quando usando connection pooling (pgBouncer/Supabase)
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  const usingPooling = databaseUrl && (databaseUrl.includes('pooler') || databaseUrl.includes('pgbouncer'));
  const forceRawQueries = process.env.FORCE_RAW_QUERIES === 'true' || isProduction || usingPooling;
  
  if (forceRawQueries) {
    // Usar query raw diretamente em produção
    try {
      const profiles = await prisma.$queryRaw<Array<{
        role: string;
      }>>`
        SELECT role
        FROM "Profile"
        WHERE "userId" = ${userId}
        LIMIT 1
      `;
      
      if (profiles.length === 0) {
        return null;
      }
      
      return {
        role: profiles[0].role
      };
    } catch (error: any) {
      console.error('[Prisma Helper] Error in $queryRaw profile lookup:', error);
      throw error;
    }
  }
  
  // Em desenvolvimento, tentar query normal primeiro (mas só se não estiver usando pooling)
  if (!usingPooling) {
    try {
      return await prisma.profile.findUnique({
        where: { userId },
        select: { role: true }
      });
    } catch (error: any) {
      // Se der erro de prepared statement, usar query raw
      if (
        error?.message?.includes('prepared statement') ||
        error?.code === '42P05' ||
        error?.code === '26000'
      ) {
      console.log('[Prisma Helper] Using $queryRaw fallback for profile lookup');
      
      const profiles = await prisma.$queryRaw<Array<{
        role: string;
      }>>`
        SELECT role
        FROM "Profile"
        WHERE "userId" = ${userId}
        LIMIT 1
      `;
      
      if (profiles.length === 0) {
        return null;
      }
      
      return {
        role: profiles[0].role
      };
      }
      
      throw error;
    }
  }
  
  // Se estiver usando pooling, sempre usar $queryRaw
  // (código já executado acima no if (forceRawQueries))
  return null;
}

/**
 * Count seguro de assets
 */
export async function countAssetsSafe(where?: { ownerId?: string }): Promise<number> {
  return safeCount('asset', where);
}

/**
 * Count seguro de offers
 */
export async function countOffersSafe(where?: { sellerId?: string }): Promise<number> {
  return safeCount('offer', where);
}

/**
 * Count seguro de users
 */
export async function countUsersSafe(): Promise<number> {
  return safeCount('user');
}

/**
 * Aggregate seguro de MRR total
 * Em produção/serverless, usa $queryRaw diretamente para evitar erros
 */
export async function aggregateMRRSafe(): Promise<number> {
  // Em produção ou quando há problemas com prepared statements, usar $queryRaw diretamente
  const isProduction = process.env.NODE_ENV === 'production';
  const forceRawQueries = process.env.FORCE_RAW_QUERIES === 'true' || isProduction;
  
  if (forceRawQueries) {
    // Usar query raw diretamente em produção
    try {
      const result = await prisma.$queryRawUnsafe<Array<{ sum: number | null }>>(
        'SELECT COALESCE(SUM(mrr), 0) as sum FROM "Asset" WHERE mrr IS NOT NULL'
      );
      return Number(result[0]?.sum || 0);
    } catch (error: any) {
      console.error('[Prisma Helper] Error in $queryRaw MRR aggregate:', error);
      throw error;
    }
  }
  
  // Em desenvolvimento, tentar aggregate normal primeiro
  try {
    const result = await prisma.asset.aggregate({
      _sum: {
        mrr: true
      }
    });
    return Number(result._sum.mrr) || 0;
  } catch (error: any) {
    // Se der erro de prepared statement, usar query raw
    if (
      error?.message?.includes('prepared statement') ||
      error?.code === '42P05' ||
      error?.code === '26000'
    ) {
      console.log('[Prisma Helper] Using $queryRaw fallback for MRR aggregate');
      
      const result = await prisma.$queryRawUnsafe<Array<{ sum: number | null }>>(
        'SELECT COALESCE(SUM(mrr), 0) as sum FROM "Asset" WHERE mrr IS NOT NULL'
      );
      return Number(result[0]?.sum || 0);
    }
    
    throw error;
  }
}

