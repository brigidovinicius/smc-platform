#!/usr/bin/env node

require('dotenv').config({ path: '.env.vercel.tmp', override: true });
const { Client } = require('pg');

const email = 'brigido254@gmail.com';
const passwordHash = '$2b$10$hftS1P5l/UltVL6ASmmTl.yI11HQSqelFJkHYXm1SWD1iJy35V7GW';

async function main() {
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
  
  if (!url || url.includes('[YOUR') || url.includes('dummy')) {
    console.error('❌ Connection string inválida');
    process.exit(1);
  }

  console.log('\n🔐 Executando SQL no Supabase...\n');
  
  try {
    const client = new Client({ 
      connectionString: url.trim(), 
      ssl: { rejectUnauthorized: false } 
    });
    
    await client.connect();
    console.log('✅ Conectado!\n');
    
    const result = await client.query(
      'UPDATE "User" SET password = $1 WHERE email = $2',
      [passwordHash, email]
    );
    
    console.log(`✅ Senha atualizada! (${result.rowCount} linha(s))\n`);
    console.log('─'.repeat(70));
    console.log('✅ LOGIN DISPONÍVEL:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: Teste1234`);
    console.log('─'.repeat(70));
    console.log();
    
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();


