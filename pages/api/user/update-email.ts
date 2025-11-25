import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { apiHandler, requireMethod, successResponse, errorResponse } from '@/lib/api';
import { validateEmail } from '@/lib/api/validators';
import type { ApiResponse } from '@/lib/api';

async function handleUpdateEmail(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return errorResponse(res, 'Não autenticado', 401, 'UNAUTHORIZED');
  }

  const { newEmail } = req.body;

  if (!newEmail) {
    return errorResponse(res, 'Novo email é obrigatório', 400, 'VALIDATION_ERROR');
  }

  const emailValidation = validateEmail(newEmail);
  if (!emailValidation.valid) {
    return errorResponse(res, emailValidation.error || 'Email inválido', 400, 'VALIDATION_ERROR');
  }

  const normalizedEmail = newEmail.trim().toLowerCase();

  // Verificar se é o mesmo email
  if (normalizedEmail === session.user.email.toLowerCase()) {
    return errorResponse(res, 'Este já é o seu email atual', 400, 'SAME_EMAIL');
  }

  try {
    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return errorResponse(res, 'Este email já está em uso', 400, 'EMAIL_EXISTS');
    }

    // Buscar usuário atual
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return errorResponse(res, 'Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    // Atualizar email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: normalizedEmail,
        emailVerified: null, // Requer verificação novamente
      },
    });

    return successResponse(
      res,
      {
        message: 'Email atualizado com sucesso. Você precisará verificar o novo email.',
        email: normalizedEmail,
      },
      200
    );
  } catch (error: any) {
    console.error('[Update Email] Error:', error);
    if (error.code === 'P2002') {
      return errorResponse(res, 'Este email já está em uso', 400, 'EMAIL_EXISTS');
    }
    return errorResponse(res, 'Erro ao atualizar email', 500, 'INTERNAL_ERROR');
  }
}

export default apiHandler(handleUpdateEmail);

