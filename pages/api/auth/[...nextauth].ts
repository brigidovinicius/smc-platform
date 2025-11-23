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
            return null;
          }

          let user;
          try {
            user = await prisma.user.findUnique({ 
              where: { email: credentials.email } 
            });
          } catch (dbError: any) {
            console.error('Database error:', dbError);
            if (dbError.code === 'P1001' || dbError.message?.includes('can\'t reach database server')) {
              throw new Error('Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.');
            }
            throw new Error('Erro ao acessar o banco de dados. Verifique a configuração.');
          }

          if (!user) {
            return null;
          }

          // Verificar se o usuário tem email (não pode ser null)
          if (!user.email) {
            console.error('User found but email is null:', user.id);
            return null;
          }

          if (!user.password) {
            return null;
          }

          // Email sempre é marcado como verificado no registro
          // Não é necessário verificar emailVerified aqui

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          // Retornar objeto compatível com NextAuth
          return {
            id: user.id,
            email: user.email || '',
            name: user.name || null,
            image: user.image || null
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
        token.role = (user as { role?: string }).role ?? 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { role?: string }).role = (token as { role?: string }).role ?? 'user';
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
