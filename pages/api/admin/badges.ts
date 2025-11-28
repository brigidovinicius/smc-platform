import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const badges = await prisma.badgeDefinition.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { badges });
  }

  if (req.method === 'POST') {
    const { name, slug, description, type, automatic, criteria, icon, color } = req.body;

    if (!name || !slug || !type) {
      return errorResponse(res, 'Campos obrigatórios faltando', 400, 'VALIDATION_ERROR');
    }

    // Verificar se slug já existe
    const existing = await prisma.badgeDefinition.findUnique({
      where: { slug },
    });

    if (existing) {
      return errorResponse(res, 'Slug já existe', 400, 'SLUG_EXISTS');
    }

    const badge = await prisma.badgeDefinition.create({
      data: {
        name,
        slug,
        description,
        type,
        automatic: automatic || false,
        criteria: criteria ? JSON.stringify(criteria) : null,
        icon,
        color,
      },
    });

    // Log da ação admin (opcional - pode falhar se migrations não foram executadas)
    const adminId = (session.user as { id?: string })?.id;
    if (adminId) {
      try {
        await prisma.adminActionLog.create({
          data: {
            adminId,
            action: 'BADGE_CREATED',
            targetType: 'BADGE',
            targetId: badge.id,
            details: JSON.stringify({ name, slug, type }),
          },
        });
      } catch (error: any) {
        console.warn('[Admin] Failed to log admin action:', error?.message);
      }
    }

    return successResponse(res, badge, 201);
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

