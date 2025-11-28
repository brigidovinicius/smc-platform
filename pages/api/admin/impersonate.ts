import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse, errorResponse } from '@/lib/api';
import { requireAdmin } from '@/lib/api/admin';
import prisma from '@/lib/prisma';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'POST') {
    const { userId } = req.body;

    if (!userId) {
      return errorResponse(res, 'userId é obrigatório', 400, 'VALIDATION_ERROR');
    }

    // Verificar se o usuário existe (usar helper seguro)
    const { findUserByIdSafe } = await import('@/lib/prisma-helpers');
    const targetUser = await findUserByIdSafe(userId);

    if (!targetUser) {
      return errorResponse(res, 'Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    // Retornar sucesso - a atualização da sessão será feita no frontend
    return successResponse(res, {
      success: true,
      message: 'Impersonation iniciado',
      userId,
    });
  }

  if (req.method === 'DELETE') {
    // Parar impersonation
    return successResponse(res, {
      success: true,
      message: 'Impersonation parado',
    });
  }

  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});

