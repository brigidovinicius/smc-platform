#!/usr/bin/env node

/**
 * Script para configurar DATABASE_URL e executar migrations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV_FILE = path.join(process.cwd(), '.env.local');
const ENV_EXAMPLE = path.join(process.cwd(), '.env.example');

console.log('🔧 Configuração do Banco de Dados - SMC Platform\n');

// Verificar se .env.local existe
let envContent = '';
if (fs.existsSync(ENV_FILE)) {
  envContent = fs.readFileSync(ENV_FILE, 'utf8');
  console.log('✅ Arquivo .env.local encontrado\n');
} else {
  console.log('📝 Criando arquivo .env.local...\n');
  fs.writeFileSync(ENV_FILE, '');
}

// Verificar DATABASE_URL atual
const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m);
const currentDbUrl = dbUrlMatch ? dbUrlMatch[1].replace(/^["']|["']$/g, '') : null;

if (currentDbUrl && !currentDbUrl.startsWith('file:')) {
  console.log('✅ DATABASE_URL já está configurado');
  console.log(`📋 URL: ${currentDbUrl.substring(0, 50)}...\n`);
  
  // Tentar executar migrations
  console.log('🔄 Gerando Prisma Client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('\n🔄 Executando migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('\n✅ Banco de dados configurado com sucesso!');
    console.log('🚀 Você pode iniciar o servidor com: npm run dev\n');
  } catch (error) {
    console.error('\n❌ Erro ao executar migrations!');
    console.error('Verifique se:');
    console.error('  1. O DATABASE_URL está correto');
    console.error('  2. O servidor PostgreSQL está acessível');
    console.error('  3. As credenciais estão corretas\n');
    process.exit(1);
  }
} else {
  console.log('⚠️  DATABASE_URL não está configurado ou está usando SQLite\n');
  console.log('📝 Para configurar, você tem 3 opções:\n');
  console.log('1️⃣  SUPABASE (Recomendado - Gratuito):');
  console.log('   - Acesse https://supabase.com');
  console.log('   - Crie uma conta e um novo projeto');
  console.log('   - Vá em Settings → Database → Connection string');
  console.log('   - Copie a string URI');
  console.log('   - Adicione ao .env.local:\n');
  console.log('     DATABASE_URL="postgresql://postgres:[SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres"\n');
  console.log('2️⃣  POSTGRESQL LOCAL:');
  console.log('   - Instale PostgreSQL');
  console.log('   - Crie um banco: createdb smc_platform');
  console.log('   - Adicione ao .env.local:\n');
  console.log('     DATABASE_URL="postgresql://usuario:senha@localhost:5432/smc_platform"\n');
  console.log('3️⃣  DOCKER (Rápido):');
  console.log('   docker run --name smc-postgres \\');
  console.log('     -e POSTGRES_PASSWORD=postgres \\');
  console.log('     -e POSTGRES_DB=smc_platform \\');
  console.log('     -p 5432:5432 -d postgres:14');
  console.log('   - Adicione ao .env.local:\n');
  console.log('     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smc_platform"\n');
  console.log('📚 Consulte docs/CONFIGURAR-BANCO-DADOS.md para mais detalhes\n');
  process.exit(1);
}



