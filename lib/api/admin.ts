/**
 * Helpers para verificação de permissões admin em API routes
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { ApiResponse } from './helpers';
import { errorResponse } from './helpers';

/**
 * Verifica se o usuário é admin e retorna erro se não for
 */
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return errorResponse(res, 'Não autenticado', 401, 'UNAUTHORIZED');
  }

  const role = (session.user as { role?: string })?.role;
  const isAdmin = role?.toLowerCase() === 'admin';

  if (!isAdmin) {
    return errorResponse(res, 'Acesso negado. Apenas administradores.', 403, 'FORBIDDEN');
  }

  return session;
}


