/**
 * Helpers para API Routes
 * Padroniza tratamento de erros, validação e respostas
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * Tipos de resposta padronizados
 */
export type ApiResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * Wrapper para handlers de API com tratamento de erros
 */
export function apiHandler(
  handler: (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error('[API Error]', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };
}

/**
 * Verifica autenticação e retorna sessão ou erro
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    res.status(401).json({
      success: false,
      error: 'Não autenticado',
      code: 'UNAUTHORIZED'
    });
    return null;
  }

  return session;
}

/**
 * Valida método HTTP
 */
export function requireMethod(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  allowedMethods: string[]
) {
  if (!allowedMethods.includes(req.method || '')) {
    res.status(405).json({
      success: false,
      error: `Método ${req.method} não permitido. Use: ${allowedMethods.join(', ')}`,
      code: 'METHOD_NOT_ALLOWED'
    });
    return false;
  }
  return true;
}

/**
 * Resposta de sucesso padronizada
 */
export function successResponse<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

/**
 * Resposta de erro padronizada
 */
export function errorResponse(
  res: NextApiResponse<ApiResponse>,
  error: string,
  statusCode: number = 400,
  code?: string
) {
  return res.status(statusCode).json({
    success: false,
    error,
    code
  });
}

/**
 * Validação básica de body
 */
export function validateBody<T>(
  body: any,
  validator: (body: any) => body is T
): { valid: true; data: T } | { valid: false; error: string } {
  if (!body) {
    return { valid: false, error: 'Body é obrigatório' };
  }

  if (!validator(body)) {
    return { valid: false, error: 'Body inválido' };
  }

  return { valid: true, data: body };
}

/**
 * Validação de query parameters
 */
export function validateQuery<T>(
  query: any,
  validator: (query: any) => { valid: true; data: T } | { valid: false; error: string }
): { valid: true; data: T } | { valid: false; error: string } {
  return validator(query);
}

/**
 * Busca usuário a partir da sessão
 */
export async function getUserFromSession(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const session = await requireAuth(req, res);
  if (!session) return null;

  const prisma = (await import('@/lib/prisma')).default;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  });

  if (!user) {
    errorResponse(res, 'Usuário não encontrado', 404, 'USER_NOT_FOUND');
    return null;
  }

  return user;
}

