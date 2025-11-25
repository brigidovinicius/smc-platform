import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { apiHandler, requireMethod, successResponse, errorResponse } from '@/lib/api';
import { validateToken } from '@/lib/api/validators';
import { validatePassword } from '@/lib/api/validators';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Validar método HTTP
  if (!requireMethod(req, res, ['POST'])) {
    return;
  }

  const { token, password } = req.body;

  // Validar token
  const tokenValidation = validateToken(token);
  if (!tokenValidation.valid) {
    return errorResponse(res, 'Token inválido ou expirado', 400, 'INVALID_TOKEN');
  }

  // Validar senha
  if (!password || typeof password !== 'string') {
    return errorResponse(res, 'Senha é obrigatória', 400, 'VALIDATION_ERROR');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return errorResponse(res, passwordValidation.errors[0], 400, 'VALIDATION_ERROR');
  }

  // Verificar conexão com banco de dados
  try {
    await prisma.$connect();
  } catch (dbError: any) {
    console.error('Database connection error:', dbError);
    return errorResponse(
      res,
      'Erro ao conectar com o banco de dados. Tente novamente.',
      503,
      'DATABASE_CONNECTION_ERROR'
    );
  }

  // Buscar token no banco
  let tokenRecord;
  try {
    tokenRecord = await prisma.verificationToken.findUnique({
      where: { token: tokenValidation.token! }
    });
  } catch (dbError: any) {
    console.error('Database query error:', dbError);
    return errorResponse(
      res,
      'Erro ao verificar token. Tente novamente.',
      500,
      'DATABASE_ERROR'
    );
  }

  // Verificar se token existe e não expirou
  if (!tokenRecord || tokenRecord.expires < new Date()) {
    return errorResponse(res, 'Token inválido ou expirado', 400, 'INVALID_TOKEN');
  }

  // Buscar usuário pelo email (identifier)
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: tokenRecord.identifier }
    });
  } catch (dbError: any) {
    console.error('Database query error:', dbError);
    return errorResponse(
      res,
      'Erro ao buscar usuário. Tente novamente.',
      500,
      'DATABASE_ERROR'
    );
  }

  if (!user) {
    return errorResponse(res, 'Usuário não encontrado', 404, 'USER_NOT_FOUND');
  }

  // Verificar se usuário tem senha (não é OAuth-only)
  if (!user.password) {
    return errorResponse(
      res,
      'Esta conta não possui senha. Use o método de login original (Google, etc).',
      400,
      'OAUTH_ONLY_ACCOUNT'
    );
  }

  // Hash da nova senha (normalizar removendo espaços)
  const normalizedPassword = password.trim();
  const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

  // Atualizar senha do usuário
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
  } catch (dbError: any) {
    console.error('Database update error:', dbError);
    return errorResponse(
      res,
      'Erro ao atualizar senha. Tente novamente.',
      500,
      'DATABASE_ERROR'
    );
  }

  // Remover token usado
  try {
    await prisma.verificationToken.delete({
      where: { token: tokenValidation.token! }
    });
  } catch (dbError: any) {
    // Log mas não falhar se não conseguir deletar o token
    // Failed to delete used token (non-critical)
  }

  return successResponse(res, {
    ok: true,
    message: 'Senha redefinida com sucesso'
  }, 200);
});


