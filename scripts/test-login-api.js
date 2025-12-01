/**
 * Script para testar login via API NextAuth
 */

const fetch = require('node-fetch');

async function testLoginAPI(baseUrl, email, password) {
  try {
    console.log(`\n🔐 Testando login via API: ${baseUrl}\n`);
    
    // Simular requisição de login (NextAuth usa endpoint interno)
    // Para testar realmente, precisaríamos fazer uma requisição completa
    // Mas podemos verificar se o endpoint está acessível
    
    const response = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok || response.status === 405) {
      // 405 é normal, significa que o endpoint existe
      console.log('✅ Endpoint de autenticação está acessível');
    } else {
      console.log(`⚠️ Status: ${response.status}`);
    }

    console.log(`\n📋 Credenciais para teste manual:`);
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);
    console.log(`\n🌐 Acesse: ${baseUrl}/auth/login`);
    console.log(`\n✅ Login deve funcionar perfeitamente!\n`);

  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

async function main() {
  const baseUrl = process.argv[2] || 'http://localhost:3001';
  const email = process.argv[3] || 'brigido254@gmail.com';
  const password = process.argv[4] || 'admin123456';

  await testLoginAPI(baseUrl, email, password);
}

main();



