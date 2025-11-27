#!/usr/bin/env node

/**
 * Script para redefinir senha de usuário diretamente no banco de dados
 * 
 * Uso:
 *   node scripts/reset-user-password.js <email> <nova-senha>
 * 
 * Exemplo:
 *   node scripts/reset-user-password.js usuario@exemplo.com MinhaNovaSenha123
 */

require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

// Usar o Prisma do projeto (que já tem toda a lógica de connection string)
// Precisa usar require dinâmico porque é TypeScript
let prisma;
try {
  // Tentar usar o Prisma do projeto
  prisma = require('../lib/prisma').default || require('../lib/prisma').prisma;
} catch (error) {
  // Se não conseguir, usar Prisma Client diretamente
  const { PrismaClient } = require('@prisma/client');
  
  // Prioridade: POSTGRES_URL_NON_POOLING (recomendado para Supabase) > POSTGRES_URL > DATABASE_URL
  const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                      process.env.POSTGRES_URL || 
                      process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('dummy') || databaseUrl.includes('postgres:5432')) {
    console.error('❌ DATABASE_URL não está configurado!');
    console.error('\nConfigure uma das seguintes variáveis no .env.local:');
    console.error('  - POSTGRES_URL_NON_POOLING (recomendado para Supabase)');
    console.error('  - POSTGRES_URL');
    console.error('  - DATABASE_URL');
    console.error('\nOu execute: npx vercel env pull .env.local');
    process.exit(1);
  }

  // Definir DATABASE_URL para o Prisma se necessário
  if (process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL !== process.env.POSTGRES_URL_NON_POOLING) {
    process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
  } else if (databaseUrl && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }

  prisma = new PrismaClient();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📋 Listando todos os usuários...\n');
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          password: true
        },
        orderBy: {
          email: 'asc'
        }
      });

      if (users.length === 0) {
        console.log('   Nenhum usuário encontrado no banco de dados.');
        return;
      }

      console.log(`   Encontrados ${users.length} usuário(s):\n`);
      users.forEach((user, index) => {
        const hasPassword = user.password ? '✅' : '❌';
        const verified = user.emailVerified ? '✅' : '❌';
        console.log(`   ${index + 1}. ${user.email || '(sem email)'}`);
        console.log(`      Nome: ${user.name || '(não informado)'}`);
        console.log(`      Senha: ${hasPassword} ${user.password ? 'Configurada' : 'Não configurada'}`);
        console.log(`      Email verificado: ${verified}`);
        console.log(`      ID: ${user.id}\n`);
      });

      console.log('\n💡 Para redefinir a senha de um usuário, use:');
      console.log('   node scripts/reset-user-password.js <email> <nova-senha>\n');
      return;
    } catch (error) {
      console.error('❌ Erro ao listar usuários:', error.message);
      process.exit(1);
    }
  }

  if (args.length < 2) {
    console.error('❌ Uso incorreto!');
    console.error('\nUso:');
    console.error('  node scripts/reset-user-password.js <email> <nova-senha>');
    console.error('\nExemplo:');
    console.error('  node scripts/reset-user-password.js usuario@exemplo.com MinhaNovaSenha123');
    console.error('\nPara listar todos os usuários:');
    console.error('  node scripts/reset-user-password.js');
    process.exit(1);
  }

  const email = args[0].trim().toLowerCase();
  const newPassword = args[1];

  // Validar email
  if (!email.includes('@')) {
    console.error('❌ Email inválido!');
    process.exit(1);
  }

  // Validar senha
  if (newPassword.length < 8) {
    console.error('❌ A senha deve ter pelo menos 8 caracteres!');
    process.exit(1);
  }

  if (newPassword.length > 128) {
    console.error('❌ A senha deve ter no máximo 128 caracteres!');
    process.exit(1);
  }

  try {
    console.log(`\n🔍 Buscando usuário com email: ${email}...`);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`❌ Usuário com email "${email}" não encontrado!`);
      console.error('\n💡 Use o comando sem argumentos para listar todos os usuários:');
      console.error('   node scripts/reset-user-password.js');
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user.name || '(sem nome)'} (${user.email})`);

    // Hash da nova senha
    console.log('\n🔐 Gerando hash da nova senha...');
    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

    // Atualizar senha
    console.log('💾 Atualizando senha no banco de dados...');
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('\n✅ Senha redefinida com sucesso!');
    console.log(`\n📧 Email: ${user.email}`);
    console.log(`👤 Nome: ${user.name || '(não informado)'}`);
    console.log(`🔑 Nova senha: ${newPassword}`);
    console.log('\n💡 Agora você pode fazer login com a nova senha!');

  } catch (error) {
    console.error('\n❌ Erro ao redefinir senha:', error.message);
    if (error.code) {
      console.error(`   Código do erro: ${error.code}`);
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

