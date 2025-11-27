/**
 * Helpers para tratamento de erros padronizado em APIs
 */

import type { NextApiResponse } from 'next';
import type { ApiResponse } from './helpers';

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

/**
 * Cria erro padronizado da API
 */
export function createApiError(
  message: string,
  code: string = 'INTERNAL_ERROR',
  statusCode: number = 500,
  details?: any
): ApiError {
  return {
    message,
    code,
    statusCode,
    details
  };
}

/**
 * Erros comuns da API
 */
export const ApiErrors = {
  UNAUTHORIZED: () => createApiError('Não autenticado', 'UNAUTHORIZED', 401),
  FORBIDDEN: () => createApiError('Acesso negado', 'FORBIDDEN', 403),
  NOT_FOUND: (resource: string = 'Recurso') => createApiError(
    `${resource} não encontrado`,
    'NOT_FOUND',
    404
  ),
  VALIDATION_ERROR: (message: string) => createApiError(
    message,
    'VALIDATION_ERROR',
    400
  ),
  INTERNAL_ERROR: (message: string = 'Erro interno do servidor') => createApiError(
    message,
    'INTERNAL_ERROR',
    500
  ),
  DATABASE_ERROR: (message: string = 'Erro ao acessar o banco de dados') => createApiError(
    message,
    'DATABASE_ERROR',
    500
  )
};

/**
 * Handler de erro para APIs que loga e retorna resposta padronizada
 */
export function handleApiError(
  res: NextApiResponse<ApiResponse>,
  error: unknown,
  context: string = 'API'
): void {
  console.error(`[${context}] Error:`, error);

  // Se já é um ApiError, usar diretamente
  if (error && typeof error === 'object' && 'code' in error && 'statusCode' in error) {
    const apiError = error as ApiError;
    res.status(apiError.statusCode).json({
      success: false,
      error: apiError.message,
      code: apiError.code
    });
    return;
  }

  // Se é um Error do Prisma
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    if (prismaError.code === 'P2002') {
      res.status(400).json({
        success: false,
        error: 'Este registro já existe',
        code: 'DUPLICATE_ENTRY'
      });
      return;
    }

    if (prismaError.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Registro não encontrado',
        code: 'NOT_FOUND'
      });
      return;
    }
  }

  // Erro genérico
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'Erro interno do servidor';

  res.status(500).json({
    success: false,
    error: errorMessage,
    code: 'INTERNAL_ERROR'
  });
}

/**
 * Wrapper para promises que captura erros automaticamente
 */
export async function safeApiCall<T>(
  fn: () => Promise<T>,
  errorContext: string = 'API'
): Promise<{ data?: T; error?: ApiError }> {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    console.error(`[${errorContext}] Error:`, error);
    
    if (error && typeof error === 'object' && 'code' in error && 'statusCode' in error) {
      return { error: error as ApiError };
    }

    return {
      error: createApiError(
        error instanceof Error ? error.message : 'Erro desconhecido',
        'INTERNAL_ERROR',
        500
      )
    };
  }
}

