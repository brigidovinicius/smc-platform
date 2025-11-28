import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
// Importar prisma DEPOIS que a URL foi processada
// Isso garante que prepared_statements=false está aplicado
import prisma from '@/lib/prisma';
import { findUserByEmailSafe, findProfileByUserIdSafe } from '@/lib/prisma-helpers';

// Only use PrismaAdapter if DATABASE_URL is configured
// Prioridade: POSTGRES_URL_NON_POOLING (recomendado para Supabase) > POSTGRES_URL > DATABASE_URL
// IMPORTANTE: Usar process.env.DATABASE_URL que já foi processada em lib/prisma.ts
const databaseUrl = process.env.DATABASE_URL || 
                    process.env.POSTGRES_URL_NON_POOLING || 
                    process.env.POSTGRES_URL;
const hasDatabase = Boolean(
  databaseUrl && 
  !databaseUrl.includes('dummy') &&
  !databaseUrl.includes('postgres:5432') &&
  (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://'))
);

// IMPORTANTE: Desabilitar PrismaAdapter em produção/serverless quando usando connection pooling
// O PrismaAdapter cria prepared statements que causam conflitos com pgBouncer
// Usar apenas JWT strategy que não depende do adapter
const useAdapter = hasDatabase && 
                   databaseUrl && 
                   databaseUrl.includes('prepared_statements=false') &&
                   !databaseUrl.includes('pooler') &&
                   !databaseUrl.includes('pgbouncer') &&
                   process.env.NODE_ENV !== 'production';

// Only create adapter if database is available and safe to use
// IMPORTANTE: Criar adapter DEPOIS que prisma foi inicializado com URL correta
let adapter = undefined;
if (useAdapter && databaseUrl) {
  try {
    // Verificar se a URL tem prepared_statements=false
    const finalUrl = process.env.DATABASE_URL || databaseUrl;
    if (finalUrl && !finalUrl.includes('prepared_statements=false')) {
      console.warn('[NextAuth] DATABASE_URL não tem prepared_statements=false. Desabilitando adapter.');
    } else {
      adapter = PrismaAdapter(prisma);
      console.log('[NextAuth] PrismaAdapter habilitado');
    }
  } catch (error) {
    console.error('Error creating PrismaAdapter:', error);
    adapter = undefined;
  }
} else if (hasDatabase) {
  console.log('[NextAuth] PrismaAdapter desabilitado (usando connection pooling ou produção)');
}

export const authOptions: NextAuthOptions = {
  ...(adapter ? { adapter } : {}),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login'
  },
  providers: [
    // Google Provider só é adicionado se as credenciais estiverem configuradas
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('[AUTH] === INÍCIO AUTENTICAÇÃO ===');
          console.log('[AUTH] Email recebido:', credentials?.email);
          console.log('[AUTH] Senha recebida (length):', credentials?.password?.length);
          
          // Validar credenciais
          if (!credentials?.email || !credentials.password || typeof credentials.email !== 'string') {
            console.error('[AUTH] ❌ Credenciais inválidas - campos faltando');
            throw new Error('Credenciais inválidas');
          }

          // Normalizar email (trim e lowercase)
          const normalizedEmail = credentials.email.trim().toLowerCase();
          console.log('[AUTH] Email normalizado:', normalizedEmail);

          // Check if database is available
          if (!hasDatabase) {
            throw new Error('Autenticação não disponível. Banco de dados não configurado.');
          }

          let user;
          let role = 'user';
          
          try {
            // Usar helper seguro que evita prepared statements
            user = await findUserByEmailSafe(normalizedEmail);
            
            // Extrair role do profile
            if (user?.profile) {
              role = user.profile.role?.toLowerCase() ?? 'user';
            } else if (user && hasDatabase) {
              // Se não encontrou profile no include, buscar separadamente
              try {
                const profile = await findProfileByUserIdSafe(user.id);
                role = profile?.role?.toLowerCase() ?? 'user';
              } catch (profileError) {
                console.error('Error fetching profile in authorize:', profileError);
              }
            }
          } catch (dbError: any) {
            console.error('[AUTH] Database error:', dbError);
            console.error('[AUTH] Error code:', dbError.code);
            console.error('[AUTH] Error message:', dbError.message);
            
            if (dbError.code === 'P1001' || dbError.message?.includes('can\'t reach database server')) {
              throw new Error('Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.');
            } else if (dbError.code === 'P1000' || dbError.message?.includes('authentication')) {
              throw new Error('Erro de autenticação no banco de dados. Verifique as credenciais no Vercel.');
            } else if (dbError.code === 'P1017' || dbError.message?.includes('connection closed')) {
              throw new Error('Conexão com o banco de dados foi fechada. Tente novamente.');
            } else {
              const errorMsg = dbError.message || 'Erro desconhecido';
              throw new Error(`Erro ao acessar o banco de dados: ${errorMsg}. Verifique a configuração do servidor.`);
            }
          }

          if (!user) {
            console.error(`[AUTH] Usuário não encontrado: ${normalizedEmail}`);
            throw new Error('Usuário não encontrado');
          }

          // Verificar se o usuário tem email (não pode ser null)
          if (!user.email) {
            console.error('[AUTH] User found but email is null:', user.id);
            throw new Error('Usuário sem email válido');
          }

          if (!user.password) {
            console.error(`[AUTH] Usuário sem senha: ${normalizedEmail}`);
            throw new Error('Usuário sem senha cadastrada. Use o método de login original (Google, etc).');
          }

          // Email sempre é marcado como verificado no registro
          // Não é necessário verificar emailVerified aqui

          // Remover espaços da senha
          const trimmedPassword = credentials.password.trim();
          console.log('[AUTH] Comparando senha...');
          
          const isValid = await bcrypt.compare(trimmedPassword, user.password);
          if (!isValid) {
            console.error(`[AUTH] Senha incorreta para: ${normalizedEmail}`);
            throw new Error('Senha incorreta');
          }

          console.log(`[AUTH] ✅ Login bem-sucedido: ${normalizedEmail}`);
          console.log(`[AUTH] Role do usuário: ${role}`);

          // Retornar objeto compatível com NextAuth
          return {
            id: user.id,
            email: user.email || '',
            name: user.name || null,
            image: user.image || null,
            role: role
          };
        } catch (error) {
          console.error('[AUTH] ❌ Erro na autenticação:', error);
          // Se for erro de email não verificado, propagar
          if (error instanceof Error && error.message.includes('E-mail não verificado')) {
            throw error;
          }
          // Para outros erros, lançar para que o NextAuth possa capturar
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Erro desconhecido na autenticação');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: sessionData }) {
      if (user) {
        token.sub = user.id;
        // Tentar usar o role do objeto user (credentials provider)
        const userRole = (user as { role?: string }).role;
        
        if (userRole) {
          token.role = userRole;
        } else if (hasDatabase && user.id) {
          // Se não houver role no user (ex: Google OAuth), buscar do Profile
          // Usar helper seguro que evita prepared statements
          try {
            const profile = await findProfileByUserIdSafe(user.id);
            token.role = profile?.role?.toLowerCase() ?? 'user';
          } catch (error) {
            console.error('Error fetching profile role in JWT callback:', error);
            token.role = 'user';
          }
        } else {
          token.role = 'user';
        }
        
        // Armazenar o ID do admin original para impersonation (só se for admin)
        if (token.role?.toLowerCase() === 'admin') {
          (token as any).originalAdminId = user.id;
        }
      } else if (token.sub && hasDatabase) {
        // Atualizar role do token se já existir (para refresh de sessão)
        // Isso garante que o role está sempre atualizado mesmo após refresh
        // Usar helper seguro que evita prepared statements
        try {
          if (token.sub) {
            const profile = await findProfileByUserIdSafe(token.sub);
            if (profile?.role) {
              token.role = profile.role.toLowerCase();
            }
          }
        } catch (error) {
          console.error('Error refreshing profile role in JWT callback:', error);
        }
      }
      
      // Suporte para impersonation via session update
      if (trigger === 'update' && sessionData?.impersonateUserId) {
        const impersonateUserId = sessionData.impersonateUserId as string;
        const currentRole = (token as { role?: string }).role?.toLowerCase();
        
        // Só permitir impersonation se for admin
        if (currentRole === 'admin') {
          // Se já estava impersonando, restaurar o admin original
          if (impersonateUserId === 'stop') {
            const originalAdminId = (token as any).originalAdminId;
            if (originalAdminId) {
              token.sub = originalAdminId;
              token.role = 'admin';
              delete (token as any).impersonateUserId;
            }
          } else {
            // Impersonar novo usuário
            // Manter o admin original antes de mudar
            if (!(token as any).originalAdminId && token.sub) {
              (token as any).originalAdminId = token.sub;
            }
            
            const impersonatedProfile = await findProfileByUserIdSafe(impersonateUserId);
            token.sub = impersonateUserId;
            token.role = impersonatedProfile?.role?.toLowerCase() ?? 'user';
            (token as any).impersonateUserId = impersonateUserId;
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { role?: string }).role = (token as { role?: string }).role ?? 'user';
        
        // Adicionar informação de impersonation
        const impersonateUserId = (token as { impersonateUserId?: string }).impersonateUserId;
        if (impersonateUserId) {
          (session.user as { impersonating?: boolean; impersonateUserId?: string }).impersonating = true;
          (session.user as { impersonating?: boolean; impersonateUserId?: string }).impersonateUserId = impersonateUserId;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Permite redirects relativos
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Permite redirects para o mesmo domínio
      if (new URL(url).origin === baseUrl) return url;
      // Default: redirecionar para dashboard
      return `${baseUrl}/dashboard`;
    }
  }
};

export default NextAuth(authOptions);
