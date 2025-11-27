#!/usr/bin/env node

/**
 * Script para executar SQL no Supabase via API REST
 * Requer: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 */

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const email = 'brigido254@gmail.com';
const passwordHash = '$2b$10$hftS1P5l/UltVL6ASmmTl.yI11HQSqelFJkHYXm1SWD1iJy35V7GW';

// Tentar extrair URL do Supabase da connection string
const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                   process.env.POSTGRES_URL || 
                   process.env.DATABASE_URL;

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Se não tiver SUPABASE_URL, tentar extrair da connection string
if (!supabaseUrl && databaseUrl) {
  const match = databaseUrl.match(/@([^:]+):/);
  if (match) {
    const host = match[1];
    // Extrair project ref do host (db.xxxxx.supabase.co -> xxxxx)
    const projectRef = host.replace('db.', '').replace('.supabase.co', '');
    supabaseUrl = `https://${projectRef}.supabase.co`;
    console.log(`📡 URL do Supabase detectada: ${supabaseUrl}`);
  }
}

if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL não encontrado!');
  console.error('\nConfigure no .env.local:');
  console.error('  SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key');
  console.error('\nOu execute o SQL manualmente no Supabase Dashboard:\n');
  console.log('─'.repeat(70));
  console.log(`UPDATE "User"`);
  console.log(`SET password = '${passwordHash}'`);
  console.log(`WHERE email = '${email}';`);
  console.log('─'.repeat(70));
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrado!');
  console.error('\nPara executar SQL via API, você precisa:');
  console.error('  1. Acesse: https://app.supabase.com');
  console.error('  2. Vá em: Settings → API');
  console.error('  3. Copie o "service_role" key (secret)');
  console.error('  4. Adicione no .env.local: SUPABASE_SERVICE_ROLE_KEY=seu-key');
  console.error('\nOu execute o SQL manualmente no Supabase Dashboard:\n');
  console.log('─'.repeat(70));
  console.log(`UPDATE "User"`);
  console.log(`SET password = '${passwordHash}'`);
  console.log(`WHERE email = '${email}';`);
  console.log('─'.repeat(70));
  process.exit(1);
}

const sql = `UPDATE "User" SET password = '${passwordHash}' WHERE email = '${email}';`;

console.log('\n🔐 Executando SQL no Supabase via API...\n');
console.log(`📧 Email: ${email}`);
console.log(`🔑 Nova senha: Teste1234\n`);

// Executar SQL via Supabase REST API (rpc)
const url = new URL(`${supabaseUrl}/rest/v1/rpc/exec_sql`);
const postData = JSON.stringify({ query: sql });

const options = {
  hostname: url.hostname,
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
      console.log('✅ SQL executado com sucesso!\n');
      console.log('─'.repeat(70));
      console.log('✅ LOGIN DISPONÍVEL:');
      console.log(`   Email: ${email}`);
      console.log(`   Senha: Teste1234`);
      console.log('─'.repeat(70));
      console.log('\n💡 Agora você pode testar o login!\n');
    } else {
      console.error(`❌ Erro ao executar SQL (status ${res.statusCode}):`);
      console.error(data);
      console.error('\n💡 Tente executar manualmente no Supabase SQL Editor:\n');
      console.log('─'.repeat(70));
      console.log(sql);
      console.log('─'.repeat(70));
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
  console.error('\n💡 Tente executar manualmente no Supabase SQL Editor:\n');
  console.log('─'.repeat(70));
  console.log(sql);
  console.log('─'.repeat(70));
  process.exit(1);
});

req.write(postData);
req.end();

