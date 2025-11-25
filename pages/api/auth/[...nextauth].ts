import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validar credenciais
          if (!credentials?.email || !credentials.password || typeof credentials.email !== 'string') {
            console.error('[AUTH] Credenciais inválidas - campos faltando');
            return null;
          }

          // Normalizar email (trim e lowercase)
          const normalizedEmail = credentials.email.trim().toLowerCase();

          let user;
          try {
            user = await prisma.user.findUnique({ 
              where: { email: normalizedEmail } 
            });
          } catch (dbError: any) {
            console.error('[AUTH] Database error:', dbError);
            if (dbError.code === 'P1001' || dbError.message?.includes('can\'t reach database server')) {
              throw new Error('Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.');
            }
            throw new Error('Erro ao acessar o banco de dados. Verifique a configuração.');
          }

          if (!user) {
            console.error(`[AUTH] Usuário não encontrado: ${normalizedEmail}`);
            return null;
          }

          // Verificar se o usuário tem email (não pode ser null)
          if (!user.email) {
            console.error('[AUTH] User found but email is null:', user.id);
            return null;
          }

          if (!user.password) {
            console.error(`[AUTH] Usuário sem senha: ${normalizedEmail}`);
            return null;
          }

          // Email sempre é marcado como verificado no registro
          // Não é necessário verificar emailVerified aqui

          // Remover espaços da senha
          const trimmedPassword = credentials.password.trim();
          
          const isValid = await bcrypt.compare(trimmedPassword, user.password);
          if (!isValid) {
            console.error(`[AUTH] Senha incorreta para: ${normalizedEmail}`);
            return null;
          }

          console.log(`[AUTH] Login bem-sucedido: ${normalizedEmail}`);

          // Buscar o role do Profile
          let role = 'user';
          try {
            const profile = await prisma.profile.findUnique({
              where: { userId: user.id },
              select: { role: true },
            });
            role = profile?.role?.toLowerCase() ?? 'user';
          } catch (error) {
            console.error('Error fetching profile in authorize:', error);
          }

          // Retornar objeto compatível com NextAuth
          return {
            id: user.id,
            email: user.email || '',
            name: user.name || null,
            image: user.image || null,
            role: role
          };
        } catch (error) {
          console.error('Auth error:', error);
          // Se for erro de email não verificado, propagar
          if (error instanceof Error && error.message.includes('E-mail não verificado')) {
            throw error;
          }
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // Tentar usar o role do objeto user (credentials provider)
        const userRole = (user as { role?: string }).role;
        
        if (userRole) {
          token.role = userRole;
        } else {
          // Se não houver role no user (ex: Google OAuth), buscar do Profile
          try {
            const profile = await prisma.profile.findUnique({
              where: { userId: user.id },
              select: { role: true },
            });
            token.role = profile?.role?.toLowerCase() ?? 'user';
          } catch (error) {
            console.error('Error fetching profile role in JWT callback:', error);
            token.role = 'user';
          }
        }
      } else if (token.sub) {
        // Atualizar role do token se já existir (para refresh de sessão)
        // Isso garante que o role está sempre atualizado mesmo após refresh
        try {
          const profile = await prisma.profile.findUnique({
            where: { userId: token.sub },
            select: { role: true },
          });
          if (profile?.role) {
            token.role = profile.role.toLowerCase();
          }
        } catch (error) {
          console.error('Error refreshing profile role in JWT callback:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { role?: string }).role = (token as { role?: string }).role ?? 'user';
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
