/**
 * Prisma Client Singleton
 * 
 * Provides a single instance of PrismaClient across the application.
 * Uses a global variable in development to prevent multiple instances during hot reload.
 * 
 * @module lib/prisma
 * @example
 * import prisma from '@/lib/prisma';
 * const users = await prisma.user.findMany();
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Verificar se DATABASE_URL está configurado
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    '❌ DATABASE_URL não está configurado!\n' +
    'Por favor, configure a variável DATABASE_URL no arquivo .env.local\n' +
    'Exemplo para Supabase:\n' +
    'DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"\n' +
    'Ou para PostgreSQL local:\n' +
    'DATABASE_URL="postgresql://user:password@localhost:5432/database"'
  );
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: databaseUrl ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
