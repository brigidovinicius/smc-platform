import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { apiHandler, requireMethod, successResponse, errorResponse } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

async function handleUpdatePassword(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return errorResponse(res, 'Não autenticado', 401, 'UNAUTHORIZED');
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, 'Senha atual e nova senha são obrigatórias', 400, 'VALIDATION_ERROR');
  }

  if (newPassword.length < 8) {
    return errorResponse(res, 'Nova senha deve ter no mínimo 8 caracteres', 400, 'VALIDATION_ERROR');
  }

  try {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, password: true },
    });

    if (!user) {
      return errorResponse(res, 'Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    // Verificar se tem senha (pode ser usuário do Google sem senha)
    if (!user.password) {
      return errorResponse(
        res,
        'Este usuário não tem senha configurada. Use a opção de recuperação de senha.',
        400,
        'NO_PASSWORD'
      );
    }

    // Verificar senha atual
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return errorResponse(res, 'Senha atual incorreta', 400, 'INVALID_PASSWORD');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return successResponse(res, { message: 'Senha alterada com sucesso' }, 200);
  } catch (error: any) {
    console.error('[Update Password] Error:', error);
    return errorResponse(res, 'Erro ao atualizar senha', 500, 'INTERNAL_ERROR');
  }
}

export default apiHandler(handleUpdatePassword);

