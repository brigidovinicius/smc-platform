/**
 * Script para testar autenticação diretamente
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAuth(email, password) {
  console.log(`\n🔐 Testando autenticação para: ${email}\n`);
  
  try {
    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`📧 Email normalizado: "${normalizedEmail}"`);
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      console.log('❌ Usuário não encontrado no banco');
      console.log('💡 Verificando emails similares...');
      const allUsers = await prisma.user.findMany({
        select: { email: true },
      });
      console.log('📋 Emails no banco:', allUsers.map(u => u.email));
      return false;
    }

    console.log(`✅ Usuário encontrado:`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Email no banco: "${user.email}"`);
    console.log(`   - Tem senha: ${user.password ? 'Sim' : 'Não'}`);

    if (!user.password) {
      console.log('❌ Usuário não tem senha configurada');
      return false;
    }

    // Normalizar senha
    const trimmedPassword = password.trim();
    console.log(`\n🔑 Testando senha (comprimento: ${trimmedPassword.length})...`);

    // Testar diferentes variações da senha
    const testPasswords = [
      trimmedPassword,
      password, // original
      'admin123456',
      'Admin123456',
      'ADMIN123456',
    ];

    let found = false;
    for (const testPass of testPasswords) {
      const isValid = await bcrypt.compare(testPass, user.password);
      if (isValid) {
        console.log(`✅ Senha CORRETA encontrada!`);
        console.log(`   Senha que funcionou: "${testPass}"`);
        found = true;
        break;
      } else {
        console.log(`   ❌ Senha não confere: "${testPass}"`);
      }
    }

    if (!found) {
      console.log('\n❌ Nenhuma variação da senha funcionou');
      console.log('\n💡 Solução: Resetar a senha');
      console.log('   Execute: node scripts/reset-admin-password.js "admin123456"');
    }

    console.log(`\n📊 Perfil:`);
    if (user.profile) {
      console.log(`   - Role: ${user.profile.role}`);
    } else {
      console.log(`   - ⚠️ SEM PERFIL`);
    }

    return found;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const email = process.argv[2] || 'brigido254@gmail.com';
  const password = process.argv[3] || 'admin123456';

  await testAuth(email, password);
}

main();


