/**
 * Helpers para sistema de impersonation
 * Permite que admins visualizem a plataforma como outros usuários
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * Verifica se o usuário atual está impersonando outro usuário
 */
export async function isImpersonating(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { impersonating?: boolean })?.impersonating || false;
}

/**
 * Obtém o ID do usuário sendo impersonado
 */
export async function getImpersonatedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const impersonateUserId = (session?.user as { impersonateUserId?: string })?.impersonateUserId;
  return impersonateUserId || null;
}

/**
 * Obtém o ID do admin original (quando está impersonando)
 */
export async function getOriginalAdminId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  // Em uma implementação completa, isso viria do token
  // Por enquanto, retornamos null
  return null;
}

