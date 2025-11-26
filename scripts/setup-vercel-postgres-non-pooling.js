#!/usr/bin/env node

/**
 * Script Node.js para configurar POSTGRES_URL_NON_POOLING no Vercel
 * Alternativa ao script bash para sistemas que não suportam bash
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🚀 Configuração de POSTGRES_URL_NON_POOLING no Vercel');
  console.log('==================================================\n');

  // Verificar se Vercel CLI está instalado
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI encontrado\n');
  } catch (error) {
    console.error('❌ Vercel CLI não está instalado!\n');
    console.log('📦 Instale com:');
    console.log('   npm install -g vercel\n');
    console.log('Ou configure manualmente no dashboard:');
    console.log('   https://vercel.com/dashboard\n');
    process.exit(1);
  }

  // Verificar se está logado
  try {
    execSync('vercel whoami', { stdio: 'ignore' });
    console.log('✅ Logado no Vercel\n');
  } catch (error) {
    console.error('⚠️  Você não está logado no Vercel CLI\n');
    console.log('🔐 Faça login com:');
    console.log('   vercel login\n');
    process.exit(1);
  }

  // Solicitar connection string
  console.log('📝 Por favor, forneça a connection string do Supabase:\n');
  console.log('   Como obter:');
  console.log('   1. Acesse: https://app.supabase.com');
  console.log('   2. Selecione seu projeto');
  console.log('   3. Settings → Database');
  console.log('   4. Connection string → URI (NÃO Transaction Pooler)\n');
  
  const connectionString = await question('   Cole a connection string aqui: ');

  if (!connectionString || connectionString.trim() === '') {
    console.error('\n❌ Connection string não fornecida!');
    process.exit(1);
  }

  // Validar formato
  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    console.log('\n⚠️  Aviso: A connection string não parece ser válida');
    console.log('   (deve começar com postgresql:// ou postgres://)');
    const continueAnswer = await question('\n   Continuar mesmo assim? (s/n): ');
    if (continueAnswer.toLowerCase() !== 's') {
      process.exit(1);
    }
  }

  console.log('\n🔧 Configurando POSTGRES_URL_NON_POOLING no Vercel...\n');

  const environments = ['production', 'preview', 'development'];

  for (const env of environments) {
    try {
      console.log(`📦 Adicionando para ${env}...`);
      execSync(`echo "${connectionString}" | vercel env add POSTGRES_URL_NON_POOLING ${env}`, {
        stdio: 'pipe'
      });
      console.log(`   ✅ ${env} configurado\n`);
    } catch (error) {
      const errorMsg = error.message || '';
      if (errorMsg.includes('already exists') || errorMsg.includes('already set')) {
        console.log(`   ⚠️  ${env} já existe (pulando)\n`);
      } else {
        console.log(`   ⚠️  Erro ao adicionar para ${env}\n`);
      }
    }
  }

  console.log('✅ Variável POSTGRES_URL_NON_POOLING configurada!\n');
  console.log('📋 Próximos passos:');
  console.log('   1. Faça um Redeploy no Vercel Dashboard');
  console.log('   2. Ou execute: vercel --prod');
  console.log('   3. Verifique os logs do build\n');
  console.log('🔍 Para verificar as variáveis:');
  console.log('   vercel env ls\n');

  rl.close();
}

main().catch(error => {
  console.error('\n❌ Erro:', error.message);
  process.exit(1);
});

