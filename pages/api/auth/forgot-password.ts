import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail, isSmtpConfigured } from '@/lib/email';
import { apiHandler, requireMethod, successResponse, errorResponse } from '@/lib/api';
import { validateEmail } from '@/lib/api/validators';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Validar método HTTP
  if (!requireMethod(req, res, ['POST'])) {
    return;
  }

  const { email } = req.body;

  // Validar email
  if (!email || typeof email !== 'string') {
    return errorResponse(res, 'E-mail é obrigatório', 400, 'VALIDATION_ERROR');
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return errorResponse(res, emailValidation.error || 'E-mail inválido', 400, 'VALIDATION_ERROR');
  }

  const normalizedEmail = email.trim().toLowerCase();

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

  // Buscar usuário
  let user;
  try {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch (dbError: any) {
    console.error('Database query error:', dbError);
    return errorResponse(
      res,
      'Erro ao verificar e-mail. Tente novamente.',
      500,
      'DATABASE_ERROR'
    );
  }

  // Sempre retornar sucesso para não expor se o email existe ou não (segurança)
  // Mas só enviar email se o usuário existir e tiver senha (não é OAuth-only)
  if (user && user.password) {
    // Gerar token de reset
    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token válido por 1 hora

    try {
      // Remover tokens antigos para o mesmo email
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: normalizedEmail
        }
      });

      // Criar novo token
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires
        }
      });

      // Enviar email se SMTP estiver configurado
      if (isSmtpConfigured()) {
        try {
          const emailSent = await sendPasswordResetEmail(normalizedEmail, token, user.name || undefined);
          if (emailSent) {
            // Email sent successfully
          } else {
            console.warn(`[forgot-password] Falha ao enviar email de reset para ${normalizedEmail}`);
          }
        } catch (emailError) {
          console.error('[forgot-password] Erro ao enviar email de reset:', emailError);
          // Não bloquear a resposta, mas logar o erro
        }
      } else {
        // SMTP not configured, token generated
      }
    } catch (dbError: any) {
      console.error('Database create error:', dbError);
      return errorResponse(
        res,
        'Erro ao gerar token de reset. Tente novamente.',
        500,
        'DATABASE_ERROR'
      );
    }
  } else {
    // Log para debug, mas não expor ao usuário
    // Email not found or OAuth-only user
  }

  // Sempre retornar sucesso (não expor se email existe)
  return successResponse(res, {
    ok: true,
    message: 'Se o email existir, você receberá instruções para redefinir sua senha.'
  }, 200);
});


