#!/usr/bin/env node

/**
 * Script para executar SQL no Supabase usando a connection string
 */

require('dotenv').config({ path: '.env.local' });
// Tentar carregar também do .env.vercel.tmp se existir
try {
  require('dotenv').config({ path: '.env.vercel.tmp' });
} catch {}

const { Client } = require('pg');

const email = 'brigido254@gmail.com';
const passwordHash = '$2b$10$hftS1P5l/UltVL6ASmmTl.yI11HQSqelFJkHYXm1SWD1iJy35V7GW';

async function executeUpdate(config) {
  try {
    console.log('🔍 Conectando ao banco de dados...');
    const client = new Client(config);

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

    const userData = userResult.rows[0];
    console.log(`✅ Usuário encontrado: ${userData.name || '(sem nome)'}\n`);

    console.log('💾 Atualizando senha...');
    const updateResult = await client.query(
      'UPDATE "User" SET password = $1 WHERE email = $2',
      [passwordHash, email]
    );

    console.log(`✅ Senha atualizada! (${updateResult.rowCount} linha(s) afetada(s))\n`);
    console.log('─'.repeat(70));
    console.log('✅ LOGIN DISPONÍVEL:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: Teste1234`);
    console.log('─'.repeat(70));
    console.log('\n💡 Agora você pode testar o login!\n');

    await client.end();
    process.exit(0);
  } catch (error) {
    throw error;
  }
}

function showSQL() {
  console.log('\n📋 Execute este SQL no Supabase SQL Editor:\n');
  console.log('─'.repeat(70));
  console.log(`UPDATE "User"`);
  console.log(`SET password = '${passwordHash}'`);
  console.log(`WHERE email = '${email}';`);
  console.log('─'.repeat(70));
  console.log();
}

async function main() {
  console.log('\n🔐 Executando SQL no Supabase...\n');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Nova senha: Teste1234\n`);

  // Prioridade: POSTGRES_URL_NON_POOLING > POSTGRES_URL > DATABASE_URL
  let databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                   process.env.POSTGRES_URL || 
                   process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes('dummy') || databaseUrl.includes('postgres:5432') || databaseUrl.includes('[YOUR')) {
    console.error('❌ DATABASE_URL não encontrado ou tem placeholder!');
    showSQL();
    process.exit(1);
  }

  // Limpar a URL
  databaseUrl = databaseUrl.trim().replace(/\n/g, '').replace(/\\n/g, '');

  // Parsear a URL
  try {
    let urlObj;
    try {
      urlObj = new URL(databaseUrl);
    } catch {
      // Se falhar, tentar regex
      const urlMatch = databaseUrl.match(/^(postgresql?:\/\/)([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
      if (!urlMatch) {
        throw new Error('Formato de URL inválido');
      }
      const [, , dbUser, password, host, port, database] = urlMatch;
      
      const queryMatch = database.match(/^([^?]+)(\?.+)?$/);
      const dbName = queryMatch ? queryMatch[1] : database;
      
      const config = {
        user: decodeURIComponent(dbUser),
        password: decodeURIComponent(password),
        host: host,
        port: parseInt(port),
        database: dbName,
        ssl: {
          rejectUnauthorized: false
        }
      };
      
      await executeUpdate(config);
      return;
    }
    
    // Usar URL.parse
    const dbUser = decodeURIComponent(urlObj.username);
    const password = decodeURIComponent(urlObj.password);
    const host = urlObj.hostname;
    const port = urlObj.port || '5432';
    const database = urlObj.pathname.replace(/^\//, '');
    
    const config = {
      user: dbUser,
      password: password,
      host: host,
      port: parseInt(port),
      database: database,
      ssl: {
        rejectUnauthorized: false
      }
    };
    
    await executeUpdate(config);
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('\n💡 Não foi possível conectar ao banco.');
      console.error('   Verifique se:');
      console.error('   - O banco está online (Supabase não está pausado)');
      console.error('   - A connection string está correta');
    }
    
    showSQL();
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    showSQL();
    process.exit(1);
  });
