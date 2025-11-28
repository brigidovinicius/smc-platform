import { apiHandler, successResponse, errorResponse, requireMethod } from '@/lib/api/helpers';
import { requireAdmin } from '@/lib/api/admin';
import { parsePaginationParams, calculatePagination, createPaginatedResponse } from '@/lib/api/pagination';
import { parseSortParams } from '@/lib/api/filters';
import prisma from '@/lib/prisma';

export default apiHandler(async (req, res) => {
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  const session = await requireAdmin(req, res);
  if (!session) return; // Já retornou erro

  try {
    const { page, pageSize } = parsePaginationParams(req.query);
    const { search, sortBy, sortOrder } = req.query;

    // Construir filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Ordenação - User não tem createdAt, usar emailVerified ou name
    const { orderBy } = parseSortParams(
      sortBy as string,
      sortOrder as string,
      'name', // Campo padrão que existe no User
      ['name', 'email', 'emailVerified'] // Campos disponíveis no User
    );

    // Buscar dados paginados
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailVerified: true,
            profile: {
              select: {
                role: true,
                bio: true
              }
            },
            _count: {
              select: {
                newAssets: true,
                offers: true
              }
            }
          },
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize
      }),
      prisma.user.count({ where })
    ]);

    const pagination = calculatePagination(page, pageSize, total);
    const response = createPaginatedResponse(users, pagination);

    return successResponse(res, response, 200);
  } catch (error: any) {
    console.error('[API] Error fetching admin users:', error);
    return errorResponse(res, error.message || 'Error fetching users', 500, 'INTERNAL_ERROR');
  }
});

