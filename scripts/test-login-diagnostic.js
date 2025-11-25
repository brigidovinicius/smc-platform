/**
 * Script de diagnóstico para testar login
 * Verifica se o usuário existe, se a senha está correta, etc.
 * 
 * Uso:
 *   node scripts/test-login-diagnostic.js "email@exemplo.com" "senha123"
 */

// Carregar variáveis de ambiente
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  try {
    require('dotenv').config();
  } catch (e2) {
    // Ignorar se não conseguir carregar
  }
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !email.includes('@')) {
    console.error('❌ Por favor, forneça um email válido');
    console.error('Uso: node scripts/test-login-diagnostic.js "email@exemplo.com" "senha123"');
    process.exit(1);
  }

  if (!password) {
    console.error('❌ Por favor, forneça uma senha');
    console.error('Uso: node scripts/test-login-diagnostic.js "email@exemplo.com" "senha123"');
    process.exit(1);
  }

  try {
    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`\n🔍 DIAGNÓSTICO DE LOGIN\n`);
    console.log(`📧 Email original: ${email}`);
    console.log(`📧 Email normalizado: ${normalizedEmail}`);
    console.log(`🔑 Senha recebida (length): ${password.length}`);
    console.log(`🔑 Senha normalizada (trim, length): ${password.trim().length}\n`);

    // Buscar usuário
    console.log('🔍 Buscando usuário no banco de dados...');
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      console.error(`\n❌ Usuário não encontrado com email: ${normalizedEmail}`);
      console.error('\n💡 Verifique se o email está correto ou crie um novo usuário:');
      console.error('   node scripts/create-admin-user.js "Nome" "email@exemplo.com" "senha123"');
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado!`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Nome: ${user.name || 'N/A'}`);
    console.log(`   Email no banco: ${user.email}`);
    console.log(`   Email verificado: ${user.emailVerified ? '✅ Sim' : '❌ Não'}`);
    console.log(`   Tem senha: ${user.password ? '✅ Sim' : '❌ Não'}`);
    console.log(`   Perfil: ${user.profile ? `✅ ${user.profile.role}` : '❌ SEM PERFIL'}\n`);

    if (!user.password) {
      console.error('❌ Usuário não tem senha cadastrada!');
      console.error('\n💡 Use o script fix-user-login para definir uma senha:');
      console.error(`   node scripts/fix-user-login.js "${normalizedEmail}" "${password}"`);
      process.exit(1);
    }

    // Testar comparação de senha
    console.log('🔐 Testando comparação de senha...');
    const normalizedPassword = password.trim();
    const passwordHash = user.password;
    
    console.log(`   Senha normalizada (trim): "${normalizedPassword}"`);
    console.log(`   Hash no banco (primeiros 20 chars): ${passwordHash.substring(0, 20)}...`);
    
    const isValid = await bcrypt.compare(normalizedPassword, passwordHash);
    
    if (isValid) {
      console.log(`\n✅ SENHA CORRETA! O login deveria funcionar.\n`);
      console.log('💡 Se o login ainda não funciona, verifique:');
      console.log('   1. Se o servidor Next.js está rodando (npm run dev)');
      console.log('   2. Se as variáveis de ambiente estão corretas (.env.local)');
      console.log('   3. Se o NEXTAUTH_SECRET está configurado');
      console.log('   4. Os logs do servidor durante a tentativa de login');
    } else {
      console.log(`\n❌ SENHA INCORRETA!\n`);
      console.log('💡 Use o script fix-user-login para redefinir a senha:');
      console.log(`   node scripts/fix-user-login.js "${normalizedEmail}" "${password}"`);
    }

    // Verificar se email está verificado
    if (!user.emailVerified) {
      console.log('\n⚠️  AVISO: Email não está verificado');
      console.log('   (Mas isso não deveria bloquear o login no código atual)');
    }

    // Verificar se tem perfil
    if (!user.profile) {
      console.log('\n⚠️  AVISO: Usuário não tem perfil');
      console.log('   Isso pode causar problemas. Criando perfil...');
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          role: 'USER',
        },
      });
      console.log('   ✅ Perfil criado!');
    }

  } catch (error) {
    console.error('\n❌ Erro durante diagnóstico:', error.message);
    if (error.code === 'P1001') {
      console.error('   Erro de conexão com o banco de dados. Verifique se o PostgreSQL está rodando.');
      console.error('   Execute: docker compose up -d db');
    }
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

