/**
 * Helpers para verificação de permissões de usuário
 */

import type { Session } from 'next-auth';

export type UserRole = 'USER' | 'ADMIN';

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(session: Session | null): boolean {
  if (!session?.user) return false;
  
  const role = (session.user as { role?: string })?.role;
  return role?.toLowerCase() === 'admin';
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user;
}

/**
 * Obtém o role do usuário da sessão
 */
export function getUserRole(session: Session | null): UserRole {
  if (!session?.user) return 'USER';
  
  const role = (session.user as { role?: string })?.role;
  const normalizedRole = role?.toUpperCase();
  
  return normalizedRole === 'ADMIN' ? 'ADMIN' : 'USER';
}

/**
 * Obtém o ID do usuário da sessão
 */
export function getUserId(session: Session | null): string | null {
  if (!session?.user) return null;
  
  return (session.user as { id?: string })?.id ?? null;
}

