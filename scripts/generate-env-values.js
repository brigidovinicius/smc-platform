/**
 * Script para gerar valores de variáveis de ambiente
 * Ajuda a configurar as variáveis necessárias no Vercel
 * 
 * Uso:
 *   node scripts/generate-env-values.js
 */

const crypto = require('crypto');

console.log('\n🔧 GERADOR DE VALORES PARA VARIÁVEIS DE AMBIENTE\n');
console.log('═'.repeat(60));
console.log('\n📋 VARIÁVEIS OBRIGATÓRIAS\n');

// 1. NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('1. NEXTAUTH_SECRET');
console.log('   Valor gerado:');
console.log(`   ${nextAuthSecret}`);
console.log('   ⚠️  IMPORTANTE: Use este valor no Vercel\n');

// 2. NEXTAUTH_URL
console.log('2. NEXTAUTH_URL');
console.log('   Valor sugerido:');
console.log('   https://smc-platform.vercel.app');
console.log('   ⚠️  IMPORTANTE: Sem barra no final!\n');

// 3. DATABASE_URL
console.log('3. DATABASE_URL');
console.log('   ⚠️  Você precisa obter este valor do seu provedor de banco:');
console.log('   - Supabase: Settings → Database → Connection String (URI mode)');
console.log('   - Formato: postgresql://usuario:senha@host:porta/banco?sslmode=require');
console.log('   - Exemplo: postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres?sslmode=require\n');

console.log('═'.repeat(60));
console.log('\n📋 VARIÁVEIS OPCIONAIS (mas recomendadas)\n');

// 4. GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
console.log('4. GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET');
console.log('   ⚠️  Para login com Google:');
console.log('   - Acesse: https://console.cloud.google.com/');
console.log('   - Crie um projeto ou selecione um existente');
console.log('   - Vá em: APIs & Services → Credentials');
console.log('   - Crie OAuth 2.0 Client ID');
console.log('   - Adicione authorized redirect URIs:');
console.log('     https://smc-platform.vercel.app/api/auth/callback/google\n');

// 5. SMTP (opcional)
console.log('5. SMTP_* (Opcional - para envio de emails)');
console.log('   Variáveis necessárias:');
console.log('   - SMTP_HOST (ex: smtp.gmail.com)');
console.log('   - SMTP_PORT (ex: 587 ou 465)');
console.log('   - SMTP_USER (seu email)');
console.log('   - SMTP_PASS (senha do app ou token)');
console.log('   - EMAIL_FROM (ex: CounterX <no-reply@counterx.io>)\n');

console.log('═'.repeat(60));
console.log('\n🚀 PRÓXIMOS PASSOS\n');
console.log('1. Copie o NEXTAUTH_SECRET gerado acima');
console.log('2. Acesse: https://vercel.com/brigidovinicius-projects/smc-platform');
console.log('3. Vá em: Settings → Environment Variables');
console.log('4. Adicione cada variável:');
console.log('   - DATABASE_URL (obtenha do seu banco)');
console.log('   - NEXTAUTH_SECRET (use o valor gerado acima)');
console.log('   - NEXTAUTH_URL (https://smc-platform.vercel.app)');
console.log('   - GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET (se usar Google OAuth)');
console.log('5. Marque todas para "Production" (e Preview/Development se quiser)');
console.log('6. Faça um novo deploy ou force redeploy');
console.log('\n📖 Para mais detalhes, consulte: docs/CONFIGURAR-VARIAVEIS-VERCEL.md\n');
console.log('═'.repeat(60));
console.log('\n');

