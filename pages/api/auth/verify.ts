import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { apiHandler, requireMethod, errorResponse, validateToken } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Validar método HTTP
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  // Validar token
  const tokenValidation = validateToken(req.query.token);
  if (!tokenValidation.valid) {
    // Para verificação de email, redirecionamos mesmo com erro para melhor UX
    return res.redirect(302, '/auth/login?error=invalid_token');
  }

  const { token } = tokenValidation;

  // Buscar token no banco
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return res.redirect(302, '/auth/login?error=expired_token');
  }

  // Verificar email do usuário
  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() }
  });

  // Remover token usado
  await prisma.verificationToken.delete({ where: { token } });

  // Redirecionar para login com sucesso
  return res.redirect(302, '/auth/login?verified=1');
});
