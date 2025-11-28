import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, slug, description, type, automatic, criteria, icon, color } = req.body;

    const badge = await prisma.badgeDefinition.update({
      where: { id: id as string },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(automatic !== undefined && { automatic }),
        ...(criteria !== undefined && { criteria: criteria ? JSON.stringify(criteria) : null }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
      },
    });

    // Log da ação admin (opcional - pode falhar se migrations não foram executadas)
    const adminId = (session.user as { id?: string })?.id;
    if (adminId) {
      try {
        await prisma.adminActionLog.create({
          data: {
            adminId,
            action: 'BADGE_UPDATED',
            targetType: 'BADGE',
            targetId: badge.id,
            details: JSON.stringify({ name, slug }),
          },
        });
      } catch (error: any) {
        console.warn('[Admin] Failed to log admin action:', error?.message);
      }
    }

    return successResponse(res, badge);
  }

  if (req.method === 'DELETE') {
    await prisma.badgeDefinition.delete({
      where: { id: id as string },
    });

    // Log da ação admin (opcional - pode falhar se migrations não foram executadas)
    const adminId = (session.user as { id?: string })?.id;
    if (adminId) {
      try {
        await prisma.adminActionLog.create({
          data: {
            adminId,
            action: 'BADGE_DELETED',
            targetType: 'BADGE',
            targetId: id as string,
          },
        });
      } catch (error: any) {
        console.warn('[Admin] Failed to log admin action:', error?.message);
      }
    }

    return successResponse(res, { deleted: true });
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

