import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Verificar se DATABASE_URL está configurado e é válido
// Prioridade: POSTGRES_URL_NON_POOLING (recomendado para Supabase) > POSTGRES_URL > DATABASE_URL
// IMPORTANTE: Definir DATABASE_URL no runtime se POSTGRES_URL_NON_POOLING estiver disponível
// O Prisma schema sempre usa env("DATABASE_URL"), então precisamos garantir que esteja configurada
const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                    process.env.POSTGRES_URL || 
                    process.env.DATABASE_URL;

// Se POSTGRES_URL_NON_POOLING estiver disponível mas DATABASE_URL não estiver (ou estiver diferente),
// definir DATABASE_URL no runtime para que o Prisma Client possa usá-la
if (process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL !== process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
  console.log('✅ DATABASE_URL definida automaticamente a partir de POSTGRES_URL_NON_POOLING');
} else if (process.env.POSTGRES_URL && process.env.DATABASE_URL !== process.env.POSTGRES_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL;
  console.log('✅ DATABASE_URL definida automaticamente a partir de POSTGRES_URL');
}

const isValidDatabaseUrl = databaseUrl && 
  !databaseUrl.includes('dummy') && 
  !databaseUrl.includes('postgres:5432') &&
  (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://'));

if (!isValidDatabaseUrl) {
  console.warn(
    '⚠️  DATABASE_URL não está configurado ou é inválido!\n' +
    'A aplicação funcionará em modo limitado (sem persistência de dados).\n' +
    'Para habilitar o banco de dados, configure uma das seguintes variáveis no Vercel:\n' +
    '  - POSTGRES_URL_NON_POOLING (RECOMENDADO para Supabase - sem connection pooling)\n' +
    '  - POSTGRES_URL (com connection pooling)\n' +
    '  - DATABASE_URL (fallback)\n' +
    '\n' +
    'Exemplo para Supabase (recomendado):\n' +
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
    // Sempre especificar datasource explicitamente para garantir que use a URL correta
    // Isso é importante porque o Prisma pode cachear a URL do ambiente
    if (isValidDatabaseUrl) {
      prismaInstance = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl
          }
        },
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
    // Tentar usar a URL válida primeiro, depois fallback para dummy
    const fallbackUrl = isValidDatabaseUrl ? databaseUrl : prismaUrl;
    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: fallbackUrl
        }
      },
      log: ['error']
    });
    
    // Add connection test method
    prismaInstance.$connect = async () => {
      if (!isValidDatabaseUrl) {
        throw new Error('DATABASE_URL não está configurado ou é inválido');
      }
      try {
        await prismaInstance.$queryRaw`SELECT 1`;
      } catch (err: any) {
        console.error('[Prisma] Connection test failed:', err);
        throw err;
      }
    };
  }
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
