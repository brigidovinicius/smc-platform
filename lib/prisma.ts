import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Verificar se DATABASE_URL está configurado e é válido
// Prioridade: POSTGRES_URL_NON_POOLING (recomendado para Supabase) > POSTGRES_URL > DATABASE_URL
// IMPORTANTE: Definir DATABASE_URL no runtime se POSTGRES_URL_NON_POOLING estiver disponível
// O Prisma schema sempre usa env("DATABASE_URL"), então precisamos garantir que esteja configurada
const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                    process.env.POSTGRES_URL || 
                    process.env.DATABASE_URL;

// Adicionar parâmetros para desabilitar prepared statements em serverless
// Isso resolve problemas de "prepared statement already exists" no Vercel
const getConnectionUrl = (url: string): string => {
  if (!url || url.includes('dummy')) {
    return url;
  }
  
  // Adicionar parâmetros essenciais para serverless
  // Isso resolve problemas com prepared statements em ambientes serverless
  try {
    const urlObj = new URL(url);
    
    // FORÇAR desabilitar prepared statements - CRÍTICO para serverless
    // Remover qualquer parâmetro existente primeiro
    urlObj.searchParams.delete('prepared_statements');
    urlObj.searchParams.set('prepared_statements', 'false');
    
    // Adicionar sslmode se não existir (necessário para Supabase)
    if (!urlObj.searchParams.has('sslmode')) {
      urlObj.searchParams.set('sslmode', 'require');
    }
    
    // Se estiver usando pgbouncer, adicionar parâmetro
    if (url.includes('pooler') || url.includes('pgbouncer')) {
      urlObj.searchParams.set('pgbouncer', 'true');
    }
    
    // Limitar conexões simultâneas para evitar conflitos em serverless
    // Isso ajuda a prevenir problemas com prepared statements compartilhados
    urlObj.searchParams.delete('connection_limit');
    urlObj.searchParams.set('connection_limit', '1');
    
    // Timeout de pool menor para serverless (evita manter conexões abertas)
    urlObj.searchParams.delete('pool_timeout');
    urlObj.searchParams.set('pool_timeout', '10');
    
    // Forçar close de conexões após uso
    urlObj.searchParams.set('connect_timeout', '10');
    
    return urlObj.toString();
  } catch {
    // Se falhar ao parsear URL, adicionar parâmetros manualmente
    let modifiedUrl = url;
    const separator = modifiedUrl.includes('?') ? '&' : '?';
    
    // Remover parâmetros existentes primeiro
    modifiedUrl = modifiedUrl.replace(/[?&]prepared_statements=[^&]*/g, '');
    modifiedUrl = modifiedUrl.replace(/[?&]connection_limit=[^&]*/g, '');
    modifiedUrl = modifiedUrl.replace(/[?&]pool_timeout=[^&]*/g, '');
    modifiedUrl = modifiedUrl.replace(/[?&]connect_timeout=[^&]*/g, '');
    
    // Adicionar parâmetros necessários
    const params = [
      'prepared_statements=false',
      'connection_limit=1',
      'pool_timeout=10',
      'connect_timeout=10'
    ];
    
    // Adicionar sslmode se não existir
    if (!modifiedUrl.includes('sslmode=')) {
      params.push('sslmode=require');
    }
    
    // Adicionar pgbouncer se necessário
    if (url.includes('pooler') || url.includes('pgbouncer')) {
      params.push('pgbouncer=true');
    }
    
    modifiedUrl = `${modifiedUrl}${separator}${params.join('&')}`;
    
    return modifiedUrl;
  }
};

// Se POSTGRES_URL_NON_POOLING estiver disponível mas DATABASE_URL não estiver (ou estiver diferente),
// definir DATABASE_URL no runtime para que o Prisma Client possa usá-la
// IMPORTANTE: Sempre aplicar prepared_statements=false antes de definir DATABASE_URL
if (process.env.POSTGRES_URL_NON_POOLING) {
  const processedUrl = getConnectionUrl(process.env.POSTGRES_URL_NON_POOLING);
  if (process.env.DATABASE_URL !== processedUrl) {
    process.env.DATABASE_URL = processedUrl;
    console.log('✅ DATABASE_URL definida automaticamente a partir de POSTGRES_URL_NON_POOLING com prepared_statements=false');
  }
} else if (process.env.POSTGRES_URL) {
  const processedUrl = getConnectionUrl(process.env.POSTGRES_URL);
  if (process.env.DATABASE_URL !== processedUrl) {
    process.env.DATABASE_URL = processedUrl;
    console.log('✅ DATABASE_URL definida automaticamente a partir de POSTGRES_URL com prepared_statements=false');
  }
} else if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('prepared_statements')) {
  // Se DATABASE_URL já existir mas não tiver o parâmetro, adicionar
  process.env.DATABASE_URL = getConnectionUrl(process.env.DATABASE_URL);
  console.log('✅ DATABASE_URL atualizada com prepared_statements=false');
}

// Atualizar databaseUrl para usar a URL processada do DATABASE_URL
const finalDatabaseUrl = process.env.DATABASE_URL || databaseUrl;

const isValidDatabaseUrl = finalDatabaseUrl && 
  !finalDatabaseUrl.includes('dummy') && 
  !finalDatabaseUrl.includes('postgres:5432') &&
  (finalDatabaseUrl.startsWith('postgresql://') || finalDatabaseUrl.startsWith('postgres://'));

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
// Usar process.env.DATABASE_URL que já foi processada acima com prepared_statements=false
// IMPORTANTE: Garantir que prepared_statements=false está presente
let prismaUrl = isValidDatabaseUrl 
  ? (process.env.DATABASE_URL || finalDatabaseUrl)
  : 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public';

// FORÇAR prepared_statements=false se não estiver presente
if (isValidDatabaseUrl && prismaUrl && !prismaUrl.includes('prepared_statements=false')) {
  prismaUrl = getConnectionUrl(prismaUrl);
  // Atualizar DATABASE_URL também
  process.env.DATABASE_URL = prismaUrl;
}

// Create Prisma Client with proper configuration
let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  try {
    // Only create Prisma Client if we have a valid database URL
    // Sempre especificar datasource explicitamente para garantir que use a URL correta
    // Isso é importante porque o Prisma pode cachear a URL do ambiente
    // IMPORTANTE: connection_limit e outras opções ajudam em ambientes serverless
    if (isValidDatabaseUrl) {
      // Garantir que a URL tenha prepared_statements=false
      // A URL já foi processada acima, mas vamos garantir novamente
      let finalUrl = prismaUrl;
      if (!finalUrl.includes('prepared_statements=false')) {
        finalUrl = getConnectionUrl(finalUrl);
        // Atualizar também no ambiente
        process.env.DATABASE_URL = finalUrl;
      }
      
      console.log('[Prisma] Initializing with URL (prepared_statements=false enforced)');
      
      // Verificar novamente se a URL tem prepared_statements=false
      if (!finalUrl.includes('prepared_statements=false')) {
        console.error('[Prisma] ERRO CRÍTICO: URL não tem prepared_statements=false!');
        console.error('[Prisma] URL:', finalUrl.replace(/:[^:@]+@/, ':****@'));
        throw new Error('DATABASE_URL deve ter prepared_statements=false para funcionar com connection pooling');
      }
      
      prismaInstance = new PrismaClient({
        datasources: {
          db: {
            url: finalUrl
          }
        },
        log: process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['warn', 'error'],
        // Configurações para ambientes serverless - prevenir reutilização de conexões com prepared statements
        // A URL já tem prepared_statements=false, mas essas configs adicionais ajudam
      });
      
      // Forçar desconexão limpa ao sair (importante para serverless)
      if (process.env.NODE_ENV === 'production') {
        prismaInstance.$on('beforeExit' as never, async () => {
          await prismaInstance.$disconnect();
        });
      }
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
    
    // SEMPRE armazenar no global em serverless para garantir singleton
    // Em serverless, cada função pode ter seu próprio contexto, mas dentro da mesma função
    // precisamos garantir que é o mesmo PrismaClient
    globalForPrisma.prisma = prismaInstance;
  } catch (error) {
    console.error('Error initializing Prisma Client:', error);
    // Create a minimal instance that won't crash
    // Tentar usar a URL válida primeiro, depois fallback para dummy
    const fallbackUrl = isValidDatabaseUrl ? (process.env.DATABASE_URL || finalDatabaseUrl) : prismaUrl;
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

// Log da URL final usada (sem senha)
if (isValidDatabaseUrl && process.env.DATABASE_URL) {
  try {
    const urlObj = new URL(process.env.DATABASE_URL);
    const safeUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}?${urlObj.searchParams.toString()}`;
    console.log('[Prisma] Using database URL:', safeUrl.replace(/password=[^&]*/gi, 'password=***'));
  } catch {
    // Ignore URL parsing errors
  }
}

export default prisma;
