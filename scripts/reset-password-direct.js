#!/usr/bin/env node

/**
 * Script para resetar senha usando cliente PostgreSQL direto
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

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
    console.log('\n📋 Execute este SQL no Supabase SQL Editor:\n');
    console.log('─'.repeat(70));
    console.log(`UPDATE "User"`);
    console.log(`SET password = '${passwordHash}'`);
    console.log(`WHERE email = '${email}';`);
    console.log('─'.repeat(70));
    process.exit(1);
  }

  // Remover quebras de linha
  databaseUrl = databaseUrl.trim().replace(/\n/g, '');

  try {
    console.log('🔍 Conectando ao banco de dados...');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Conectado!\n');

    console.log('🔍 Buscando usuário...');
    const userResult = await client.query(
      'SELECT id, email, name FROM "User" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.error(`❌ Usuário com email "${email}" não encontrado!`);
      await client.end();
      process.exit(1);
    }

    const user = userResult.rows[0];
    console.log(`✅ Usuário encontrado: ${user.name || '(sem nome)'}\n`);

    console.log('💾 Atualizando senha...');
    await client.query(
      'UPDATE "User" SET password = $1 WHERE email = $2',
      [passwordHash, email]
    );

    console.log('✅ Senha redefinida com sucesso!\n');
    console.log('─'.repeat(70));
    console.log('✅ LOGIN DISPONÍVEL:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${newPassword}`);
    console.log('─'.repeat(70));
    console.log('\n💡 Agora você pode testar o login!\n');

    await client.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
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

