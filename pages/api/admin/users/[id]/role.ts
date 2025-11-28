import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'PATCH') {
    const { id } = req.query;
    const { role } = req.body;

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return errorResponse(res, 'Role inválido. Use USER ou ADMIN', 400, 'VALIDATION_ERROR');
    }

    // Verificar se o usuário existe (usar helper seguro)
    const { findUserByIdWithProfileSafe } = await import('@/lib/prisma-helpers');
    const user = await findUserByIdWithProfileSafe(id as string);

    if (!user) {
      return errorResponse(res, 'Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    // Atualizar ou criar profile
    // O helper retorna profile como { role: string } | null
    const hasProfile = user.profile && typeof user.profile === 'object' && 'role' in user.profile;
    if (hasProfile) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: { role },
      });
    } else {
      await prisma.profile.create({
        data: {
          userId: user.id,
          role,
        },
      });
    }

    // Log da ação admin (opcional - pode falhar se migrations não foram executadas)
    const adminId = (session.user as { id?: string })?.id;
    if (adminId) {
      try {
        await prisma.adminActionLog.create({
          data: {
            adminId,
            action: 'USER_ROLE_CHANGED',
            targetType: 'USER',
            targetId: user.id,
            details: JSON.stringify({ 
              oldRole: hasProfile ? (user.profile as { role: string }).role : null, 
              newRole: role 
            }),
          },
        });
      } catch (error: any) {
        console.warn('[Admin] Failed to log admin action:', error?.message);
      }
    }

    return successResponse(res, { success: true, role });
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

