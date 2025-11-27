#!/usr/bin/env node

/**
 * Script interativo completo para configurar connection string do banco de dados no Vercel
 * Inclui verificação, validação e teste de conexão
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

function printHeader(text) {
  console.log('\n' + '='.repeat(60));
  console.log(text);
  console.log('='.repeat(60) + '\n');
}

function printStep(step, text) {
  console.log(`\n📋 Passo ${step}: ${text}\n`);
}

function getVercelCommand() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return 'vercel';
  } catch (error) {
    try {
      execSync('npx vercel --version', { stdio: 'ignore' });
      return 'npx vercel';
    } catch (e) {
      return null;
    }
  }
}

async function checkVercelCLI() {
  printStep(1, 'VERIFICANDO VERCEL CLI');
  
  const vercelCmd = getVercelCommand();
  
  if (!vercelCmd) {
    console.error('❌ Vercel CLI não está disponível!\n');
    console.log('📦 Instale com:');
    console.log('   npm install -g vercel\n');
    console.log('Ou use npx (já deve funcionar automaticamente)\n');
    return null;
  }
  
  try {
    const version = execSync(`${vercelCmd} --version`, { encoding: 'utf-8' }).trim();
    console.log(`✅ Vercel CLI encontrado: ${version}`);
    if (vercelCmd.includes('npx')) {
      console.log('   (usando npx)');
    }
    return vercelCmd;
  } catch (error) {
    console.error('❌ Erro ao verificar Vercel CLI');
    return null;
  }
}

async function checkVercelLogin(vercelCmd) {
  try {
    const user = execSync(`${vercelCmd} whoami`, { encoding: 'utf-8' }).trim();
    console.log(`✅ Logado como: ${user}`);
    return true;
  } catch (error) {
    console.error('⚠️  Você não está logado no Vercel CLI\n');
    console.log('🔐 Faça login com:');
    console.log(`   ${vercelCmd} login\n`);
    return false;
  }
}

function parseConnectionString(connStr) {
  try {
    const url = new URL(connStr);
    return {
      protocol: url.protocol,
      username: url.username,
      password: url.password,
      hostname: url.hostname,
      port: url.port || '5432',
      database: url.pathname.replace('/', ''),
      searchParams: url.searchParams
    };
  } catch (error) {
    return null;
  }
}

async function getConnectionString() {
  printStep(2, 'OBTER CONNECTION STRING DO SUPABASE');
  
  console.log('📝 Para obter a connection string:\n');
  console.log('   1. Acesse: https://app.supabase.com');
  console.log('   2. Selecione seu projeto');
  console.log('   3. Vá em: Settings → Database');
  console.log('   4. Role até: "Connection string"');
  console.log('   5. Clique na aba: "URI" (NÃO Transaction Pooler!)');
  console.log('   6. Copie a connection string completa\n');
  
  console.log('⚠️  IMPORTANTE:');
  console.log('   - Substitua [YOUR-PASSWORD] pela senha real');
  console.log('   - A senha geralmente está em: Settings → Database → Database password');
  console.log('   - Se não souber, resete a senha no Supabase primeiro\n');

  const useExisting = await question('Já tem a connection string pronta? (s/n): ');
  
  if (useExisting.toLowerCase() === 's') {
    const connectionString = await question('\nCole a connection string aqui: ');
    
    if (!connectionString || connectionString.trim() === '') {
      console.error('\n❌ Connection string não fornecida!');
      return null;
    }
    
    return connectionString.trim();
  } else {
    // Construir connection string passo a passo
    console.log('\n🔧 Vamos construir a connection string passo a passo:\n');
    
    const host = await question('Host (ex: db.xxxxx.supabase.co): ');
    if (!host) {
      console.error('\n❌ Host é obrigatório!');
      return null;
    }
    
    const database = await question('Database (geralmente "postgres"): ') || 'postgres';
    const username = await question('Username (geralmente "postgres"): ') || 'postgres';
    const password = await question('Password (senha do banco): ');
    
    if (!password) {
      console.error('\n❌ Senha é obrigatória!');
      return null;
    }
    
    // Codificar a senha para URL (caso tenha caracteres especiais)
    const encodedPassword = encodeURIComponent(password);
    
    const connectionString = `postgresql://${username}:${encodedPassword}@${host}:5432/${database}?sslmode=require`;
    
    console.log('\n✅ Connection string construída:');
    console.log(`   ${connectionString.replace(password, '***')}\n`);
    
    const confirm = await question('Confirmar e usar esta connection string? (s/n): ');
    
    if (confirm.toLowerCase() !== 's') {
      return null;
    }
    
    return connectionString;
  }
}

async function validateConnectionString(connStr) {
  printStep(3, 'VALIDANDO CONNECTION STRING');
  
  // Verificar formato básico
  if (!connStr.startsWith('postgresql://') && !connStr.startsWith('postgres://')) {
    console.error('❌ Connection string deve começar com postgresql:// ou postgres://');
    return false;
  }
  
  // Verificar se não é dummy
  if (connStr.includes('dummy') || connStr.includes('postgres:5432')) {
    console.error('❌ Connection string parece ser inválida (dummy ou Docker)');
    return false;
  }
  
  // Verificar se tem placeholder de senha
  if (connStr.includes('[YOUR-PASSWORD]')) {
    console.error('❌ Connection string ainda tem [YOUR-PASSWORD] como placeholder!');
    console.error('   Substitua pela senha real antes de continuar.');
    return false;
  }
  
  // Parsear e validar componentes
  const parsed = parseConnectionString(connStr);
  if (!parsed) {
    console.error('❌ Erro ao parsear connection string. Formato inválido.');
    return false;
  }
  
  console.log('✅ Formato válido');
  console.log(`   Host: ${parsed.hostname}`);
  console.log(`   Porta: ${parsed.port}`);
  console.log(`   Database: ${parsed.database}`);
  console.log(`   Usuário: ${parsed.username}`);
  console.log(`   Senha: ${parsed.password ? '✅ Configurada' : '❌ NÃO CONFIGURADA'}`);
  
  if (!parsed.password) {
    console.error('\n⚠️  ATENÇÃO: Senha não encontrada na connection string!');
    const continueAnyway = await question('Continuar mesmo assim? (s/n): ');
    if (continueAnyway.toLowerCase() !== 's') {
      return false;
    }
  }
  
  // Verificar se tem sslmode=require (recomendado para Supabase)
  if (!parsed.searchParams.has('sslmode')) {
    console.log('\n⚠️  Aviso: Não encontrado sslmode=require');
    console.log('   Adicionando automaticamente...');
    const url = new URL(connStr);
    url.searchParams.set('sslmode', 'require');
    return url.toString();
  }
  
  return connStr;
}

async function configureVercel(connectionString, vercelCmd) {
  printStep(4, 'CONFIGURANDO NO VERCEL');
  
  const environments = [
    { name: 'Production', value: 'production' },
    { name: 'Preview', value: 'preview' },
    { name: 'Development', value: 'development' }
  ];
  
  console.log('Configurando POSTGRES_URL_NON_POOLING para todos os ambientes...\n');
  
  for (const env of environments) {
    try {
      console.log(`📦 ${env.name}...`);
      
      // Remover se já existe
      try {
        execSync(`${vercelCmd} env rm POSTGRES_URL_NON_POOLING ${env.value} --yes`, {
          stdio: 'ignore'
        });
      } catch (e) {
        // Ignorar erro se não existe
      }
      
      // Adicionar nova - usar método que funciona melhor
      execSync(`echo "${connectionString}" | ${vercelCmd} env add POSTGRES_URL_NON_POOLING ${env.value}`, {
        stdio: 'pipe'
      });
      
      console.log(`   ✅ ${env.name} configurado`);
    } catch (error) {
      const errorMsg = error.message || '';
      if (errorMsg.includes('already exists')) {
        console.log(`   ⚠️  ${env.name} já existe (removendo e recriando...)`);
        try {
          execSync(`${vercelCmd} env rm POSTGRES_URL_NON_POOLING ${env.value} --yes`, {
            stdio: 'ignore'
          });
          execSync(`echo "${connectionString}" | ${vercelCmd} env add POSTGRES_URL_NON_POOLING ${env.value}`, {
            stdio: 'pipe'
          });
          console.log(`   ✅ ${env.name} atualizado`);
        } catch (e) {
          console.log(`   ❌ Erro ao atualizar ${env.name}`);
        }
      } else {
        console.log(`   ❌ Erro ao configurar ${env.name}: ${error.message}`);
      }
    }
  }
  
  console.log('\n✅ Variável POSTGRES_URL_NON_POOLING configurada!');
}

async function verifyConfiguration(vercelCmd) {
  printStep(5, 'VERIFICANDO CONFIGURAÇÃO');
  
  try {
    const output = execSync(`${vercelCmd} env ls`, { encoding: 'utf-8' });
    const lines = output.split('\n');
    
    let found = false;
    console.log('Variáveis encontradas:\n');
    
    for (const line of lines) {
      if (line.includes('POSTGRES_URL_NON_POOLING')) {
        console.log(`   ✅ ${line.trim()}`);
        found = true;
      }
    }
    
    if (!found) {
      console.log('   ⚠️  POSTGRES_URL_NON_POOLING não encontrada');
    }
  } catch (error) {
    console.log('   ⚠️  Não foi possível verificar (mas pode estar configurado)');
  }
}

async function testConnection(connectionString) {
  printStep(6, 'TESTAR CONEXÃO (OPCIONAL)');
  
  const testNow = await question('Deseja testar a conexão agora? (s/n): ');
  
  if (testNow.toLowerCase() !== 's') {
    return;
  }
  
  console.log('\n🧪 Testando conexão...\n');
  
  // Salvar temporariamente para o teste
  const originalDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = connectionString;
  process.env.POSTGRES_URL_NON_POOLING = connectionString;
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString
        }
      }
    });
    
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query simples
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Query de teste executada com sucesso');
    
    await prisma.$disconnect();
    console.log('\n✅ Banco de dados está acessível e funcionando!');
  } catch (error) {
    console.error('\n❌ Erro ao testar conexão:');
    console.error(`   Código: ${error.code || 'N/A'}`);
    console.error(`   Mensagem: ${error.message || 'Erro desconhecido'}`);
    
    if (error.code === 'P1000') {
      console.error('\n💡 Erro de autenticação (P1000)');
      console.error('   Verifique se a senha está correta na connection string');
    } else if (error.code === 'P1001') {
      console.error('\n💡 Erro de conexão (P1001)');
      console.error('   Verifique se o host está correto e o projeto Supabase não está pausado');
    }
  } finally {
    // Restaurar
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  }
}

async function main() {
  printHeader('🚀 CONFIGURAÇÃO DE CONNECTION STRING DO BANCO DE DADOS');
  
  // Verificar Vercel CLI
  const vercelCmd = await checkVercelCLI();
  if (!vercelCmd) {
    process.exit(1);
  }
  
  if (!(await checkVercelLogin(vercelCmd))) {
    process.exit(1);
  }
  
  // Obter connection string
  let connectionString = await getConnectionString();
  if (!connectionString) {
    console.error('\n❌ Operação cancelada.');
    process.exit(1);
  }
  
  // Validar
  const validated = await validateConnectionString(connectionString);
  if (!validated) {
    console.error('\n❌ Connection string inválida. Operação cancelada.');
    process.exit(1);
  }
  
  // Se validation retornou uma string modificada (adicionou sslmode)
  if (validated !== connectionString) {
    connectionString = validated;
    console.log('\n✅ Connection string atualizada com sslmode=require');
  }
  
  // Confirmar antes de configurar
  console.log('\n⚠️  Você está prestes a configurar a connection string no Vercel.');
  console.log('   Isso substituirá a configuração existente.\n');
  const confirm = await question('Continuar? (s/n): ');
  
  if (confirm.toLowerCase() !== 's') {
    console.log('\n❌ Operação cancelada.');
    process.exit(0);
  }
  
  // Configurar no Vercel
  await configureVercel(connectionString, vercelCmd);
  
  // Verificar
  await verifyConfiguration(vercelCmd);
  
  // Testar (opcional)
  await testConnection(connectionString);
  
  // Próximos passos
  printHeader('✅ CONFIGURAÇÃO CONCLUÍDA!');
  
  console.log('📋 Próximos passos:\n');
  console.log('   1. Faça um Redeploy no Vercel:');
  console.log(`      ${vercelCmd} --prod\n`);
  console.log('   2. Ou faça via Dashboard:');
  console.log('      https://vercel.com/dashboard → Deployments → Redeploy\n');
  console.log('   3. Após o deploy, teste:');
  console.log('      https://counterx.io/auth/register\n');
  console.log('🔍 Para verificar variáveis:');
  console.log(`   ${vercelCmd} env ls\n`);
  
  rl.close();
}

main().catch(error => {
  console.error('\n❌ Erro inesperado:', error.message);
  console.error(error.stack);
  rl.close();
  process.exit(1);
});

