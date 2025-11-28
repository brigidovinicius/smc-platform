import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const { type, status, ownerId, search, page = '1', pageSize = '50' } = req.query;

    const where: any = {};
    
    if (type) where.type = type;
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { slug: { contains: search as string, mode: 'insensitive' } },
        { shortDescription: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);
    const skip = (pageNum - 1) * pageSizeNum;

    const [items, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: pageSizeNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    return successResponse(res, {
      items,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

