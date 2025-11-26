import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Verificar se DATABASE_URL está configurado e é válido
// Supabase pode usar POSTGRES_URL ou POSTGRES_URL_NON_POOLING
const databaseUrl = process.env.DATABASE_URL || 
                    process.env.POSTGRES_URL_NON_POOLING || 
                    process.env.POSTGRES_URL;
const isValidDatabaseUrl = databaseUrl && 
  !databaseUrl.includes('dummy') && 
  !databaseUrl.includes('postgres:5432') &&
  (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://'));

if (!isValidDatabaseUrl) {
  console.warn(
    '⚠️  DATABASE_URL não está configurado ou é inválido!\n' +
    'A aplicação funcionará em modo limitado (sem persistência de dados).\n' +
    'Para habilitar o banco de dados, configure uma das seguintes variáveis no Vercel:\n' +
    '  - DATABASE_URL\n' +
    '  - POSTGRES_URL_NON_POOLING (recomendado para Supabase)\n' +
    '  - POSTGRES_URL\n' +
    '\n' +
    'Exemplo para Supabase:\n' +
    'POSTGRES_URL_NON_POOLING="postgresql://user:password@host:5432/database?sslmode=require"\n' +
    '\n' +
    'Ou para PostgreSQL local:\n' +
    'DATABASE_URL="postgresql://user:password@localhost:5432/database"'
  );
}

// Criar Prisma Client apenas se DATABASE_URL for válido
// Caso contrário, criar com URL dummy para evitar erros de inicialização
const prismaUrl = isValidDatabaseUrl 
  ? databaseUrl 
  : 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public';

// Create Prisma Client with proper configuration
let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  try {
    // Only create Prisma Client if we have a valid database URL
    // Otherwise, create a minimal instance that won't try to connect
    if (isValidDatabaseUrl) {
      prismaInstance = new PrismaClient({
        log: ['warn', 'error']
      });
    } else {
      // Create instance with dummy URL - it won't actually connect
      prismaInstance = new PrismaClient({
        datasources: {
          db: {
            url: prismaUrl
          }
        },
        log: []
      });
    }
    
    // Only store in global if not in production (to avoid memory leaks)
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (error) {
    console.error('Error initializing Prisma Client:', error);
    // Create a minimal instance that won't crash
    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: prismaUrl
        }
      },
      log: []
    });
  }
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
