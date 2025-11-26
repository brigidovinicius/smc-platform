#!/usr/bin/env node

/**
 * Script Node.js para configurar POSTGRES_URL_NON_POOLING no Vercel
 * Usa npx vercel se vercel não estiver no PATH
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

// Detectar comando vercel (pode ser 'vercel' ou 'npx vercel')
function getVercelCommand() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return 'vercel';
  } catch (error) {
    try {
      execSync('npx vercel --version', { stdio: 'ignore' });
      return 'npx vercel';
    } catch (error2) {
      return null;
    }
  }
}

async function main() {
  console.log('🚀 Configuração de POSTGRES_URL_NON_POOLING no Vercel');
  console.log('==================================================\n');

  // Detectar comando vercel
  const vercelCmd = getVercelCommand();
  
  if (!vercelCmd) {
    console.error('❌ Vercel CLI não está instalado!\n');
    console.log('📦 Instale com:');
    console.log('   npm install -g vercel\n');
    console.log('Ou use npx (será instalado automaticamente):');
    console.log('   npx vercel --version\n');
    console.log('Ou configure manualmente no dashboard:');
    console.log('   https://vercel.com/dashboard\n');
    process.exit(1);
  }

  console.log(`✅ Vercel CLI encontrado (usando: ${vercelCmd})\n`);

  // Verificar se está logado
  try {
    execSync(`${vercelCmd} whoami`, { stdio: 'ignore' });
    console.log('✅ Logado no Vercel\n');
  } catch (error) {
    console.error('⚠️  Você não está logado no Vercel CLI\n');
    console.log('🔐 Faça login com:');
    console.log(`   ${vercelCmd} login\n`);
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
      // Usar método que funciona melhor com npx
      const command = process.platform === 'win32' 
        ? `echo ${connectionString} | ${vercelCmd} env add POSTGRES_URL_NON_POOLING ${env}`
        : `echo "${connectionString}" | ${vercelCmd} env add POSTGRES_URL_NON_POOLING ${env}`;
      
      execSync(command, {
        stdio: 'pipe',
        shell: true
      });
      console.log(`   ✅ ${env} configurado\n`);
    } catch (error) {
      const errorMsg = error.message || error.stdout?.toString() || error.stderr?.toString() || '';
      if (errorMsg.includes('already exists') || errorMsg.includes('already set') || errorMsg.includes('already configured')) {
        console.log(`   ⚠️  ${env} já existe (pulando)\n`);
      } else {
        console.log(`   ⚠️  Erro ao adicionar para ${env}`);
        console.log(`   Mensagem: ${errorMsg.substring(0, 100)}\n`);
      }
    }
  }

  console.log('✅ Variável POSTGRES_URL_NON_POOLING configurada!\n');
  console.log('📋 Próximos passos:');
  console.log('   1. Faça um Redeploy no Vercel Dashboard');
  console.log(`   2. Ou execute: ${vercelCmd} --prod`);
  console.log('   3. Verifique os logs do build\n');
  console.log('🔍 Para verificar as variáveis:');
  console.log(`   ${vercelCmd} env ls\n`);

  rl.close();
}

main().catch(error => {
  console.error('\n❌ Erro:', error.message);
  process.exit(1);
});

