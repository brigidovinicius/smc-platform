import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendWelcomeEmail, isSmtpConfigured } from '@/lib/email';
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

  // Verificar se banco de dados está configurado
  // Prioridade: POSTGRES_URL_NON_POOLING (recomendado para Supabase) > POSTGRES_URL > DATABASE_URL
  const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                     process.env.POSTGRES_URL || 
                     process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes('dummy') || databaseUrl.includes('postgres:5432')) {
    return errorResponse(
      res,
      'Banco de dados não configurado. Configure DATABASE_URL ou POSTGRES_URL no Vercel.',
      503,
      'DATABASE_NOT_CONFIGURED'
    );
  }

  // Verificar conexão com banco de dados
  try {
    await prisma.$connect();
  } catch (dbError: any) {
    console.error('Database connection error:', dbError);
    const errorCode = dbError.code || '';
    const errorMessage = dbError.message || '';
    
    // Erros específicos do Prisma
    if (errorCode === 'P1001' || errorMessage.includes("can't reach database server")) {
      return errorResponse(
        res,
        'Não foi possível conectar ao banco de dados. Verifique se o servidor está online e acessível. Se estiver usando Supabase, verifique se o projeto não está pausado.',
        503,
        'DATABASE_CONNECTION_ERROR'
      );
    }
    
    if (errorCode === 'P1000' || errorMessage.includes('Authentication failed')) {
      return errorResponse(
        res,
        'Erro de autenticação no banco de dados. Verifique as credenciais (usuário e senha) no DATABASE_URL.',
        500,
        'DATABASE_AUTH_ERROR'
      );
    }
    
    if (errorCode === 'P1003' || errorMessage.includes('database') && errorMessage.includes('does not exist')) {
      return errorResponse(
        res,
        'O banco de dados especificado não existe. Verifique o nome do banco no DATABASE_URL.',
        500,
        'DATABASE_NOT_FOUND'
      );
    }
    
    return errorResponse(
      res,
      `Erro ao conectar com o banco de dados: ${errorMessage || 'Erro desconhecido'}. Verifique a configuração do DATABASE_URL.`,
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

  // Verificar se SMTP está configurado
  const smtpConfigured = isSmtpConfigured();
  
  // Sempre marcar email como verificado automaticamente para não bloquear login
  // O email será enviado se SMTP estiver configurado, mas não é obrigatório para login
  const emailVerified = new Date();

  // Criar usuário
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        name: name?.trim(),
        email,
        password: hashedPassword,
        emailVerified
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

  // Sempre tentar enviar email quando SMTP estiver configurado
  if (smtpConfigured) {
    try {
      // Enviar email de boas-vindas (email já está verificado automaticamente)
      const emailSent = await sendWelcomeEmail(email, name?.trim());
      if (emailSent) {
        // Welcome email sent successfully
      } else {
        console.warn(`[register] Falha ao enviar email de boas-vindas para ${email}`);
      }
    } catch (emailError) {
      console.error('[register] Erro ao enviar email de boas-vindas:', emailError);
      // Não bloquear cadastro se falhar ao enviar email
    }
  } else {
    // SMTP not configured, email marked as verified automatically
  }

  return successResponse(res, { 
    ok: true, 
    emailVerified: true,
    emailSent: smtpConfigured
  }, 201);
});
