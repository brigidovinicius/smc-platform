#!/usr/bin/env node

/**
 * Script de diagnóstico completo para testar conexão com banco de dados
 * Verifica se o problema é com senha, usuário, host, etc.
 */

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE CONEXÃO COM BANCO DE DADOS\n');
  console.log('='.repeat(60));

  // 1. Verificar variáveis de ambiente
  console.log('\n📋 1. VERIFICANDO VARIÁVEIS DE AMBIENTE\n');
  
  const postgresUrlNonPooling = process.env.POSTGRES_URL_NON_POOLING;
  const postgresUrl = process.env.POSTGRES_URL;
  const databaseUrl = process.env.DATABASE_URL;

  console.log('POSTGRES_URL_NON_POOLING:', postgresUrlNonPooling ? `✅ Configurada (${postgresUrlNonPooling.substring(0, 30)}...)` : '❌ Não configurada');
  console.log('POSTGRES_URL:', postgresUrl ? `✅ Configurada (${postgresUrl.substring(0, 30)}...)` : '❌ Não configurada');
  console.log('DATABASE_URL:', databaseUrl ? `✅ Configurada (${databaseUrl.substring(0, 30)}...)` : '❌ Não configurada');

  // Determinar qual URL usar (prioridade: POSTGRES_URL_NON_POOLING > POSTGRES_URL > DATABASE_URL)
  const urlToUse = postgresUrlNonPooling || postgresUrl || databaseUrl;

  if (!urlToUse) {
    console.error('\n❌ ERRO: Nenhuma variável de banco de dados encontrada!');
    console.log('\nConfigure uma das seguintes variáveis:');
    console.log('  - POSTGRES_URL_NON_POOLING (RECOMENDADO para Supabase)');
    console.log('  - POSTGRES_URL');
    console.log('  - DATABASE_URL');
    process.exit(1);
  }

  // 2. Analisar a URL
  console.log('\n📋 2. ANÁLISE DA CONNECTION STRING\n');
  
  try {
    const urlObj = new URL(urlToUse);
    console.log('Protocolo:', urlObj.protocol);
    console.log('Host:', urlObj.hostname);
    console.log('Porta:', urlObj.port || '5432 (padrão)');
    console.log('Database:', urlObj.pathname.replace('/', ''));
    console.log('Usuário:', urlObj.username || '❌ Não especificado');
    console.log('Senha:', urlObj.password ? '✅ Configurada' : '❌ NÃO CONFIGURADA (PODE SER O PROBLEMA!)');
    
    if (urlObj.password === '[YOUR-PASSWORD]' || !urlObj.password) {
      console.error('\n⚠️  ATENÇÃO: A senha não está configurada ou está como placeholder!');
      console.error('   Isso pode ser a causa do erro de autenticação.');
      console.error('   Verifique se a senha foi substituída na connection string.');
    }
  } catch (error) {
    console.error('❌ Erro ao analisar URL:', error.message);
    process.exit(1);
  }

  // 3. Validar formato da URL
  console.log('\n📋 3. VALIDAÇÃO DO FORMATO\n');
  
  if (urlToUse.includes('dummy')) {
    console.error('❌ URL contém "dummy" - URL inválida');
    process.exit(1);
  }
  
  if (urlToUse.includes('postgres:5432')) {
    console.error('❌ URL contém "postgres:5432" - URL inválida (Docker)');
    process.exit(1);
  }

  if (!urlToUse.startsWith('postgresql://') && !urlToUse.startsWith('postgres://')) {
    console.error('❌ URL não é uma connection string PostgreSQL válida');
    process.exit(1);
  }

  console.log('✅ Formato da URL é válido');

  // 4. Testar conexão
  console.log('\n📋 4. TESTE DE CONEXÃO\n');
  console.log('Tentando conectar...\n');

  // Garantir que DATABASE_URL está configurada para o Prisma
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL !== urlToUse) {
    process.env.DATABASE_URL = urlToUse;
    console.log('✅ DATABASE_URL definida para o teste\n');
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: urlToUse
      }
    },
    log: ['error', 'warn']
  });

  try {
    // Tentar conectar
    await prisma.$connect();
    console.log('✅ CONEXÃO ESTABELECIDA COM SUCESSO!\n');

    // 5. Verificar tabelas
    console.log('📋 5. VERIFICANDO TABELAS\n');
    
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      console.log(`✅ Encontradas ${tables.length} tabelas:`);
      tables.forEach((t: any) => {
        console.log(`   - ${t.table_name}`);
      });

      // Verificar tabela User especificamente
      const userTable = tables.find((t: any) => t.table_name === 'User');
      if (userTable) {
        console.log('\n✅ Tabela User existe');
        
        const userCount = await prisma.user.count();
        console.log(`✅ Total de usuários: ${userCount}`);
      } else {
        console.warn('\n⚠️  Tabela User não encontrada!');
        console.warn('   Execute as migrations: npx prisma migrate deploy');
      }
    } catch (tableError: any) {
      console.error('❌ Erro ao verificar tabelas:', tableError.message);
      console.error('   Isso pode indicar que as migrations não foram executadas');
    }

    await prisma.$disconnect();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DIAGNÓSTICO CONCLUÍDO - BANCO DE DADOS FUNCIONANDO!');
    console.log('='.repeat(60));
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ ERRO AO CONECTAR AO BANCO DE DADOS\n');
    console.error('Código do erro:', error.code || 'N/A');
    console.error('Mensagem:', error.message || 'Erro desconhecido');
    
    console.log('\n' + '='.repeat(60));
    console.log('🔍 DIAGNÓSTICO DO ERRO\n');

    // Erros específicos do Prisma
    if (error.code === 'P1000') {
      console.error('❌ ERRO DE AUTENTICAÇÃO (P1000)');
      console.error('\n💡 PROBLEMA: Senha ou usuário incorretos');
      console.error('\nSoluções:');
      console.error('1. Verifique se a senha na connection string está correta');
      console.error('2. Se estiver usando Supabase:');
      console.error('   - Vá em Settings → Database → Database password');
      console.error('   - Clique em "Reset database password"');
      console.error('   - Copie a nova senha');
      console.error('   - Atualize POSTGRES_URL_NON_POOLING no Vercel com a senha correta');
      console.error('3. Verifique se o usuário está correto (geralmente "postgres")');
    } else if (error.code === 'P1001') {
      console.error('❌ ERRO DE CONEXÃO (P1001)');
      console.error('\n💡 PROBLEMA: Não foi possível alcançar o servidor');
      console.error('\nSoluções:');
      console.error('1. Verifique se o host está correto na connection string');
      console.error('2. Se estiver usando Supabase:');
      console.error('   - Verifique se o projeto não está pausado');
      console.error('   - Verifique se o host é: db.xxxxx.supabase.co');
      console.error('3. Verifique se o firewall permite conexões na porta 5432');
    } else if (error.code === 'P1003') {
      console.error('❌ ERRO DE BANCO DE DADOS (P1003)');
      console.error('\n💡 PROBLEMA: O banco de dados especificado não existe');
      console.error('\nSoluções:');
      console.error('1. Verifique se o nome do banco está correto (geralmente "postgres")');
      console.error('2. Verifique a URL - deve terminar com /postgres ou /nome-do-banco');
    } else if (error.message?.includes('SSL') || error.message?.includes('certificate')) {
      console.error('❌ ERRO DE SSL/CERTIFICADO');
      console.error('\n💡 PROBLEMA: Falha na validação SSL');
      console.error('\nSoluções:');
      console.error('1. Adicione ?sslmode=require ao final da connection string');
      console.error('2. Exemplo: postgresql://user:pass@host:5432/db?sslmode=require');
    } else {
      console.error('❌ ERRO DESCONHECIDO');
      console.error('\n💡 Mensagem completa:', error.message);
      console.error('\nSoluções gerais:');
      console.error('1. Verifique se a connection string está completa e correta');
      console.error('2. Verifique se todas as credenciais estão corretas');
      console.error('3. Verifique se o servidor está online e acessível');
    }

    console.log('\n' + '='.repeat(60));
    
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

testConnection();


