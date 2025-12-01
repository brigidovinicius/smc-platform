#!/usr/bin/env node

/**
 * Script simplificado para redefinir senha via API
 * 
 * Uso:
 *   node scripts/reset-password-simple.js <email> <nova-senha>
 * 
 * Exemplo:
 *   node scripts/reset-password-simple.js usuario@exemplo.com MinhaNovaSenha123
 */

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Uso incorreto!');
  console.error('\nUso:');
  console.error('  node scripts/reset-password-simple.js <email> <nova-senha>');
  console.error('\nExemplo:');
  console.error('  node scripts/reset-password-simple.js usuario@exemplo.com MinhaNovaSenha123');
  process.exit(1);
}

const email = args[0].trim();
const newPassword = args[1];

console.log('\n🔐 Redefinindo senha via API...\n');
console.log(`📧 Email: ${email}`);
console.log(`🔑 Nova senha: ${newPassword}\n`);

// Primeiro, solicitar token de reset
console.log('📨 1. Solicitando token de reset...');
fetch('http://localhost:3000/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
})
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('✅ Token de reset solicitado com sucesso!');
      console.log('\n💡 Se o SMTP estiver configurado, você receberá um email.');
      console.log('   Caso contrário, você precisará buscar o token no banco de dados.\n');
      console.log('📋 Para buscar o token manualmente:');
      console.log('   1. Acesse o Supabase Dashboard');
      console.log('   2. Vá em Table Editor > verification_tokens');
      console.log('   3. Busque pelo email:', email);
      console.log('   4. Copie o token e use na URL:');
      console.log(`      http://localhost:3000/auth/reset-password?token=<TOKEN>`);
      console.log('\n   Ou use o script reset-user-password.js se conseguir conectar ao banco.\n');
    } else {
      console.error('❌ Erro:', data.error || 'Erro desconhecido');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Erro ao solicitar token:', error.message);
    console.error('\n💡 Certifique-se de que o servidor está rodando:');
    console.error('   npm run dev');
    process.exit(1);
  });


