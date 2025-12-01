#!/usr/bin/env node

/**
 * Script para executar o reset de senha diretamente no banco
 * Codifica corretamente a connection string
 */

require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const email = 'brigido254@gmail.com';
const newPassword = 'Teste1234';
const passwordHash = '$2b$10$hftS1P5l/UltVL6ASmmTl.yI11HQSqelFJkHYXm1SWD1iJy35V7GW';

async function main() {
  console.log('\n🔐 Executando reset de senha...\n');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Nova senha: ${newPassword}\n`);

  // Prioridade: POSTGRES_URL_NON_POOLING > POSTGRES_URL > DATABASE_URL
  let databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                   process.env.POSTGRES_URL || 
                   process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('dummy') || databaseUrl.includes('postgres:5432')) {
    console.error('❌ DATABASE_URL não encontrado!');
    process.exit(1);
  }

  // Remover quebras de linha e espaços extras
  databaseUrl = databaseUrl.trim().replace(/\n/g, '');

  // Codificar caracteres especiais na senha da connection string
  // O # precisa ser codificado como %23
  try {
    // Extrair partes da URL
    const urlMatch = databaseUrl.match(/^(postgresql?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (urlMatch) {
      const [, protocol, user, password, rest] = urlMatch;
      // Codificar a senha
      const encodedPassword = encodeURIComponent(password);
      // Reconstruir a URL
      databaseUrl = `${protocol}${user}:${encodedPassword}@${rest}`;
    }
  } catch (error) {
    console.error('⚠️  Erro ao codificar connection string, tentando usar original...');
  }

  // Definir DATABASE_URL
  process.env.DATABASE_URL = databaseUrl;

  try {
    console.log('🔍 Conectando ao banco de dados...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });

    console.log('🔍 Buscando usuário...');
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`❌ Usuário com email "${email}" não encontrado!`);
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user.name || '(sem nome)'}\n`);

    console.log('💾 Atualizando senha...');
    await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash }
    });

    console.log('✅ Senha redefinida com sucesso!\n');
    console.log('─'.repeat(70));
    console.log('✅ LOGIN DISPONÍVEL:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${newPassword}`);
    console.log('─'.repeat(70));
    console.log('\n💡 Agora você pode testar o login!\n');

    await prisma.$disconnect();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 Não foi possível conectar ao banco.');
      console.error('   Verifique se:');
      console.error('   - O banco está online (Supabase não está pausado)');
      console.error('   - A connection string está correta');
    }
    
    // Mostrar SQL como fallback
    console.log('\n📋 Como alternativa, execute este SQL no Supabase SQL Editor:\n');
    console.log('─'.repeat(70));
    console.log(`UPDATE "User"`);
    console.log(`SET password = '${passwordHash}'`);
    console.log(`WHERE email = '${email}';`);
    console.log('─'.repeat(70));
    console.log();
    
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });


