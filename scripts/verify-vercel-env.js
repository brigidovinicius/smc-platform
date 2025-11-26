#!/usr/bin/env node

/**
 * Script para verificar e sugerir configuração de variáveis no Vercel
 * Útil para garantir que POSTGRES_URL_NON_POOLING está configurada
 */

console.log('🔍 Verificador de Variáveis de Ambiente do Vercel\n');
console.log('=' .repeat(60));
console.log('');

// Verificar variáveis disponíveis
const envVars = {
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  POSTGRES_URL: process.env.POSTGRES_URL,
  DATABASE_URL: process.env.DATABASE_URL,
};

console.log('📋 Variáveis de Ambiente Detectadas:\n');

let foundVars = [];
let recommendedVar = null;

Object.entries(envVars).forEach(([name, value]) => {
  if (value) {
    const preview = value.substring(0, 30) + '...';
    const isValid = !value.includes('dummy') && 
                   !value.includes('postgres:5432') &&
                   (value.startsWith('postgresql://') || value.startsWith('postgres://'));
    
    foundVars.push({ name, value, isValid });
    
    console.log(`  ✅ ${name}`);
    console.log(`     Valor: ${preview}`);
    console.log(`     Válida: ${isValid ? '✅ Sim' : '❌ Não'}`);
    console.log('');
    
    if (name === 'POSTGRES_URL_NON_POOLING' && isValid) {
      recommendedVar = name;
    }
  } else {
    console.log(`  ❌ ${name} - Não configurada`);
    console.log('');
  }
});

console.log('=' .repeat(60));
console.log('');

// Análise e recomendações
if (recommendedVar) {
  console.log('✅ CONFIGURAÇÃO CORRETA!');
  console.log('');
  console.log(`   A variável ${recommendedVar} está configurada e será usada.`);
  console.log('   Esta é a configuração recomendada para Supabase.');
} else if (foundVars.length > 0) {
  console.log('⚠️  ATENÇÃO: Variável não recomendada detectada');
  console.log('');
  console.log('   Você está usando uma variável que não é a recomendada.');
  console.log('   Recomendação: Configure POSTGRES_URL_NON_POOLING no Vercel.');
  console.log('');
  console.log('   Como configurar:');
  console.log('   1. Acesse: https://vercel.com/dashboard');
  console.log('   2. Selecione seu projeto');
  console.log('   3. Settings → Environment Variables');
  console.log('   4. Adicione: POSTGRES_URL_NON_POOLING');
  console.log('   5. Use o mesmo valor da variável atual');
  console.log('   6. Remova a variável antiga após adicionar a nova');
} else {
  console.log('❌ NENHUMA VARIÁVEL DE BANCO CONFIGURADA');
  console.log('');
  console.log('   Configure POSTGRES_URL_NON_POOLING no Vercel:');
  console.log('');
  console.log('   1. Acesse: https://vercel.com/dashboard');
  console.log('   2. Selecione seu projeto');
  console.log('   3. Settings → Environment Variables');
  console.log('   4. Adicione: POSTGRES_URL_NON_POOLING');
  console.log('   5. Valor: Connection string do Supabase (URI)');
  console.log('   6. Environment: Todas (Production, Preview, Development)');
  console.log('');
  console.log('   📖 Guia completo: docs/SUPABASE-SETUP.md');
}

console.log('');
console.log('=' .repeat(60));
console.log('');

// Verificar se há variáveis com nomes antigos (SMC, etc)
const allEnvKeys = Object.keys(process.env);
const possibleDbVars = allEnvKeys.filter(key => 
  key.includes('POSTGRES') || 
  key.includes('DATABASE') || 
  key.includes('DB_') ||
  key.includes('SUPABASE')
);

if (possibleDbVars.length > 0) {
  console.log('🔍 Outras variáveis relacionadas encontradas:');
  possibleDbVars.forEach(key => {
    if (!envVars[key]) {
      console.log(`   - ${key} (não está sendo usada)`);
    }
  });
  console.log('');
}

console.log('💡 Dica: O nome do projeto (SMC, CounterX, etc) não importa.');
console.log('   O importante é o NOME DA VARIÁVEL: POSTGRES_URL_NON_POOLING');
console.log('');

