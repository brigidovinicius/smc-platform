import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { apiHandler, requireMethod, successResponse, errorResponse } from '@/lib/api';
import { validateRegisterBody } from '@/lib/api/validators';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Validar método HTTP
  if (!requireMethod(req, res, ['POST'])) {
    return;
  }

  // Validar body
  const validation = validateRegisterBody(req.body);
  if (!validation.valid) {
    return errorResponse(res, validation.error, 400, 'VALIDATION_ERROR');
  }

  const { name, email, password } = validation.data;

  // Verificar conexão com banco de dados
  try {
    await prisma.$connect();
  } catch (dbError: any) {
    console.error('Database connection error:', dbError);
    if (dbError.code === 'P1001' || dbError.message?.includes('can\'t reach database server')) {
      return errorResponse(
        res,
        'Serviço temporariamente indisponível. Por favor, verifique a configuração do banco de dados.',
        503,
        'DATABASE_CONNECTION_ERROR'
      );
    }
    return errorResponse(
      res,
      'Erro ao conectar com o banco de dados. Verifique a configuração.',
      500,
      'DATABASE_ERROR'
    );
  }

  // Verificar se email já existe
  let existing;
  try {
    existing = await prisma.user.findUnique({ where: { email } });
  } catch (dbError: any) {
    console.error('Database query error:', dbError);
    return errorResponse(
      res,
      'Erro ao verificar e-mail. Tente novamente.',
      500,
      'DATABASE_ERROR'
    );
  }

  if (existing) {
    return errorResponse(res, 'E-mail já cadastrado', 400, 'EMAIL_EXISTS');
  }

  // Criar usuário
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        name: name?.trim(),
        email,
        password: hashedPassword,
        emailVerified: null
      }
    });
  } catch (dbError: any) {
    console.error('Database create error:', dbError);
    return errorResponse(
      res,
      'Erro ao criar usuário. Tente novamente.',
      500,
      'DATABASE_ERROR'
    );
  }

  // Gerar token de verificação
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
    }
  });

  // Enviar email de verificação
  const emailSent = await sendVerificationEmail(email, token);
  if (!emailSent) {
    return errorResponse(
      res,
      'Não foi possível enviar o e-mail de verificação. Verifique configurações SMTP.',
      500,
      'EMAIL_SEND_ERROR'
    );
  }

  return successResponse(res, { ok: true }, 201);
});
