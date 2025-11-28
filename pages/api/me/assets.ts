import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { apiHandler, successResponse, errorResponse, requireMethod } from '@/lib/api/helpers';
import { getUserId } from '@/lib/api/permissions';
import { parsePaginationParams, calculatePagination, createPaginatedResponse } from '@/lib/api/pagination';
import { parseSortParams, validateFilterParams } from '@/lib/api/filters';
import prisma from '@/lib/prisma';

export default apiHandler(async (req, res) => {
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    console.log('[API /me/assets] No session found');
    return errorResponse(res, 'Unauthorized - Please sign in', 401, 'UNAUTHORIZED');
  }

  const userId = getUserId(session);

  if (!userId) {
    console.log('[API /me/assets] No user ID in session:', { 
      hasUser: !!session.user, 
      userId: (session.user as { id?: string })?.id 
    });
    return errorResponse(res, 'User ID not found in session', 401, 'UNAUTHORIZED');
  }

  try {
    const paginationParams = parsePaginationParams(req.query);
    const page = paginationParams.page;
    const pageSize = paginationParams.pageSize;
    const { search, category, sortBy, sortOrder } = req.query;
    
    // Validação de filtros
    const filterValidation = validateFilterParams(
      { category: category as string },
      ['SaaS', 'E-commerce', 'Marketplace', 'Newsletter', 'Course']
    );
    
    if (!filterValidation.valid) {
      return errorResponse(res, filterValidation.error!, 400, 'INVALID_FILTER');
    }

    // Construir filtros
    const where: any = {
      ownerId: userId
    };

    if (category) {
      // Map legacy category to type
      where.type = category as any;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { shortDescription: { contains: search as string, mode: 'insensitive' } },
        { fullDescription: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Ordenação
    const { orderBy } = parseSortParams(
      sortBy as string,
      sortOrder as string,
      'createdAt',
      ['createdAt', 'title', 'mrr', 'updatedAt']
    );

    // Buscar dados paginados
    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        // Note: offers relation doesn't exist on Asset model
      }),
      prisma.asset.count({ where })
    ]);

    // Serialize Decimal to string/number for JSON serialization
    const serialize = (obj: any) => JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'object' && value !== null && 's' in value && 'e' in value ? Number(value) : value
    ));

    const pagination = calculatePagination(page, pageSize, total);
    const response = createPaginatedResponse(serialize(assets), pagination);

    return successResponse(res, response, 200);
  } catch (error: any) {
    console.error('[API] Error fetching user assets:', error);
    return errorResponse(res, error.message || 'Error fetching assets', 500, 'INTERNAL_ERROR');
  }
});

