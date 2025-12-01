#!/usr/bin/env node

require('dotenv').config({ path: '.env.vercel.tmp', override: true });
const { Client } = require('pg');

const email = 'brigido254@gmail.com';
const passwordHash = '$2b$10$hftS1P5l/UltVL6ASmmTl.yI11HQSqelFJkHYXm1SWD1iJy35V7GW';

async function main() {
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!url) {
    console.error('❌ Connection string não encontrada no .env.vercel.tmp');
    process.exit(1);
  }

  const cleanUrl = url.trim().replace(/\n/g, '').replace(/\\n/g, '');
  
  if (cleanUrl.includes('[YOUR') || cleanUrl.includes('dummy') || cleanUrl.includes('postgres:5432')) {
    console.error('❌ Connection string inválida (tem placeholder)');
    console.log('\n📋 Execute este SQL manualmente no Supabase:\n');
    console.log(`UPDATE "User" SET password = '${passwordHash}' WHERE email = '${email}';`);
    process.exit(1);
  }

  console.log('\n🔐 Executando SQL no Supabase...\n');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Nova senha: Teste1234\n`);
  
  try {
    console.log('🔍 Conectando...');
    const client = new Client({ 
      connectionString: cleanUrl, 
      ssl: { rejectUnauthorized: false } 
    });
    
    await client.connect();
    console.log('✅ Conectado!\n');
    
    console.log('💾 Atualizando senha...');
    const result = await client.query(
      'UPDATE "User" SET password = $1 WHERE email = $2',
      [passwordHash, email]
    );
    
    console.log(`✅ Senha atualizada! (${result.rowCount} linha(s) afetada(s))\n`);
    console.log('─'.repeat(70));
    console.log('✅ LOGIN DISPONÍVEL:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: Teste1234`);
    console.log('─'.repeat(70));
    console.log('\n💡 Agora você pode testar o login!\n');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.code) console.error('   Código:', error.code);
    
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

main();


