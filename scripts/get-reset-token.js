#!/usr/bin/env node

/**
 * Script para buscar o último token de reset de senha gerado
 * 
 * Uso:
 *   node scripts/get-reset-token.js <email>
 * 
 * Este script busca o token mais recente no banco e mostra o link completo
 * para redefinir a senha.
 */

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

// Prioridade: POSTGRES_URL_NON_POOLING (recomendado para Supabase) > POSTGRES_URL > DATABASE_URL
const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                    process.env.POSTGRES_URL || 
                    process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes('dummy') || databaseUrl.includes('postgres:5432')) {
  console.error('❌ DATABASE_URL não está configurado!');
  console.error('\nExecute primeiro:');
  console.error('  npx vercel env pull .env.local');
  process.exit(1);
}

// Definir DATABASE_URL para o Prisma se necessário
if (process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL !== process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
} else if (databaseUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Uso incorreto!');
    console.error('\nUso:');
    console.error('  node scripts/get-reset-token.js <email>');
    console.error('\nExemplo:');
    console.error('  node scripts/get-reset-token.js usuario@exemplo.com');
    process.exit(1);
  }

  const email = args[0].trim().toLowerCase();

  try {
    console.log(`\n🔍 Buscando token de reset para: ${email}...\n`);

    // Buscar o token mais recente para este email
    const token = await prisma.verificationToken.findFirst({
      where: {
        identifier: email
      },
      orderBy: {
        expires: 'desc'
      }
    });

    if (!token) {
      console.error(`❌ Nenhum token encontrado para o email: ${email}`);
      console.error('\n💡 Primeiro, solicite um token de reset:');
      console.error('   1. Acesse: http://localhost:3000/auth/forgot-password');
      console.error(`   2. Digite o email: ${email}`);
      console.error('   3. Clique em "Enviar"');
      console.error('   4. Execute este script novamente\n');
      process.exit(1);
    }

    // Verificar se o token expirou
    const now = new Date();
    const isExpired = token.expires < now;
    const timeLeft = Math.max(0, Math.floor((token.expires - now) / 1000 / 60)); // minutos

    console.log('✅ Token encontrado!\n');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Token: ${token.token}`);
    console.log(`⏰ Expira em: ${token.expires.toLocaleString('pt-BR')}`);
    
    if (isExpired) {
      console.log(`❌ Status: EXPIRADO`);
      console.error('\n💡 O token expirou. Solicite um novo token em:');
      console.error('   http://localhost:3000/auth/forgot-password\n');
    } else {
      console.log(`✅ Status: VÁLIDO (${timeLeft} minutos restantes)`);
      
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     process.env.NEXTAUTH_URL || 
                     'http://localhost:3000';
      const resetUrl = `${baseUrl.replace(/\/$/, '')}/auth/reset-password?token=${token.token}`;
      
      console.log('\n🔗 Link para redefinir senha:');
      console.log(`   ${resetUrl}\n`);
      console.log('💡 Copie o link acima e abra no navegador para redefinir a senha.\n');
    }

  } catch (error) {
    console.error('\n❌ Erro ao buscar token:', error.message);
    if (error.code === 'P1001') {
      console.error('\n💡 Não foi possível conectar ao banco de dados.');
      console.error('   Verifique se:');
      console.error('   - O banco está online (Supabase não está pausado)');
      console.error('   - A connection string está correta');
      console.error('   - As variáveis de ambiente estão configuradas\n');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });

