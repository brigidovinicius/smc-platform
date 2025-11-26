#!/usr/bin/env node

/**
 * Script para verificar conexão com banco de dados
 * Útil para diagnosticar problemas de conexão
 */

const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  console.log('🔍 Verificando configuração do banco de dados...\n');

  // Verificar variáveis de ambiente
  // Prioridade: POSTGRES_URL_NON_POOLING (recomendado para Supabase) > POSTGRES_URL > DATABASE_URL
  const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                     process.env.POSTGRES_URL || 
                     process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ Nenhuma variável de banco de dados encontrada!');
    console.log('\nConfigure uma das seguintes variáveis no Vercel:');
    console.log('  - POSTGRES_URL_NON_POOLING (RECOMENDADO para Supabase - sem connection pooling)');
    console.log('  - POSTGRES_URL (com connection pooling)');
    console.log('  - DATABASE_URL (fallback)');
    process.exit(1);
  }

  console.log('✅ Variável de banco encontrada:', databaseUrl.substring(0, 20) + '...');
  
  // Verificar se é uma URL válida
  if (databaseUrl.includes('dummy') || databaseUrl.includes('postgres:5432')) {
    console.error('❌ URL do banco parece ser inválida (dummy ou postgres:5432)');
    process.exit(1);
  }

  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.error('❌ URL do banco não é uma connection string PostgreSQL válida');
    process.exit(1);
  }

  console.log('✅ URL do banco parece válida\n');

  // Tentar conectar
  console.log('🔌 Tentando conectar ao banco de dados...');
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Verificar se as tabelas existem
    console.log('📊 Verificando tabelas...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`✅ Encontradas ${tables.length} tabelas no banco`);
    
    // Verificar se a tabela User existe
    const userTable = tables.find((t: any) => t.table_name === 'User');
    if (userTable) {
      console.log('✅ Tabela User encontrada');
      
      // Contar usuários
      const userCount = await prisma.user.count();
      console.log(`✅ Total de usuários: ${userCount}`);
    } else {
      console.warn('⚠️  Tabela User não encontrada. Execute as migrations:');
      console.log('   npx prisma migrate deploy');
    }

    await prisma.$disconnect();
    console.log('\n✅ Verificação concluída com sucesso!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro ao conectar ao banco de dados:');
    console.error('   Código:', error.code || 'N/A');
    console.error('   Mensagem:', error.message || 'Erro desconhecido');
    
    if (error.code === 'P1001') {
      console.error('\n💡 Dica: Verifique se o servidor do banco está online');
      console.error('   Se estiver usando Supabase, verifique se o projeto não está pausado');
    } else if (error.code === 'P1000') {
      console.error('\n💡 Dica: Verifique as credenciais (usuário e senha) na URL');
    } else if (error.code === 'P1003') {
      console.error('\n💡 Dica: Verifique se o nome do banco de dados está correto');
    }

    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

checkDatabase();

