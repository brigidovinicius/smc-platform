#!/usr/bin/env node

/**
 * Script para redefinir senha automaticamente
 * Email: brigido254@gmail.com
 * Senha: Teste1234
 */

require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const email = 'brigido254@gmail.com';
const newPassword = 'Teste1234';

async function main() {
  console.log('\n🔐 Redefinindo senha...\n');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Nova senha: ${newPassword}\n`);

  // Prioridade: POSTGRES_URL_NON_POOLING > POSTGRES_URL > DATABASE_URL
  const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                    process.env.POSTGRES_URL || 
                    process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('dummy') || databaseUrl.includes('postgres:5432')) {
    console.error('❌ DATABASE_URL não está configurado localmente!');
    console.log('\n📋 Gere o hash e execute no Supabase:\n');
    
    // Gerar hash mesmo assim para mostrar SQL
    const hash = await bcrypt.hash(newPassword, 10);
    console.log('─'.repeat(70));
    console.log(`UPDATE "User"`);
    console.log(`SET password = '${hash}'`);
    console.log(`WHERE email = '${email}';`);
    console.log('─'.repeat(70));
    console.log('\n💡 Execute este SQL no Supabase SQL Editor\n');
    process.exit(1);
  }

  // Definir DATABASE_URL
  if (process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL !== process.env.POSTGRES_URL_NON_POOLING) {
    process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
  } else if (databaseUrl && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }

  try {
    console.log('⏳ Gerando hash bcrypt...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('✅ Hash gerado\n');

    console.log('🔍 Conectando ao banco de dados...');
    const prisma = new PrismaClient();
    
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
      data: { password: hashedPassword }
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
      console.error('   Tentando gerar SQL para executar manualmente...\n');
      
      try {
        const hash = await bcrypt.hash(newPassword, 10);
        console.log('─'.repeat(70));
        console.log(`UPDATE "User"`);
        console.log(`SET password = '${hash}'`);
        console.log(`WHERE email = '${email}';`);
        console.log('─'.repeat(70));
        console.log('\n💡 Execute este SQL no Supabase SQL Editor\n');
      } catch (hashError) {
        console.error('❌ Erro ao gerar hash:', hashError.message);
      }
    }
    
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });

