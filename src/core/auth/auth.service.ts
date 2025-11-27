/**
 * Auth Domain Service
 * 
 * Centralized authentication and authorization logic.
 */

import type { Session } from 'next-auth';
import prisma from '@/lib/prisma';

export type UserRole = 'USER' | 'ADMIN';

export interface AuthContext {
  userId: string;
  email: string | null;
  name: string | null;
  role: UserRole;
  isAdmin: boolean;
}

/**
 * Get user ID from session
 */
export function getUserIdFromSession(session: Session | null): string | null {
  if (!session?.user) return null;
  return (session.user as { id?: string })?.id ?? null;
}

/**
 * Get user role from session
 */
export async function getUserRole(session: Session | null): Promise<UserRole> {
  if (!session?.user) return 'USER';
  
  const userId = getUserIdFromSession(session);
  if (!userId) return 'USER';

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  return profile?.role === 'ADMIN' ? 'ADMIN' : 'USER';
}

/**
 * Check if user has a specific role
 */
export async function userHasRole(session: Session | null, role: UserRole): Promise<boolean> {
  const userRole = await getUserRole(session);
  return userRole === role;
}

/**
 * Require authenticated user - throws if not authenticated
 */
export async function requireUser(session: Session | null): Promise<AuthContext> {
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = getUserIdFromSession(session);
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const role = user.profile?.role === 'ADMIN' ? 'ADMIN' : 'USER';

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role,
    isAdmin: role === 'ADMIN',
  };
}

/**
 * Require admin - throws if not admin
 */
export async function requireAdmin(session: Session | null): Promise<AuthContext> {
  const context = await requireUser(session);
  
  if (!context.isAdmin) {
    throw new Error('Forbidden: Admin access required');
  }

  return context;
}

/**
 * Get auth context from session (non-throwing)
 */
export async function getAuthContext(session: Session | null): Promise<AuthContext | null> {
  if (!session?.user) return null;

  const userId = getUserIdFromSession(session);
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user) return null;

  const role = user.profile?.role === 'ADMIN' ? 'ADMIN' : 'USER';

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role,
    isAdmin: role === 'ADMIN',
  };
}

