/**
 * Script para testar login do admin
 * Verifica se a senha está correta
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin(email, password) {
  try {
    console.log(`\n🔐 Testando login para: ${email}\n`);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { profile: true },
    });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return false;
    }

    console.log(`✅ Usuário encontrado:`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Nome: ${user.name}`);
    console.log(`   - Email verificado: ${user.emailVerified ? 'Sim' : 'Não'}`);
    console.log(`   - Tem senha: ${user.password ? 'Sim' : 'Não'}`);

    if (!user.password) {
      console.log('❌ Usuário não tem senha configurada');
      return false;
    }

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log(`✅ Senha CORRETA!`);
      console.log(`\n📊 Perfil:`);
      if (user.profile) {
        console.log(`   - Role: ${user.profile.role}`);
      } else {
        console.log(`   - ⚠️ SEM PERFIL (precisa criar Profile com role ADMIN)`);
      }
      console.log(`\n🎉 Login funcionaria perfeitamente!\n`);
      return true;
    } else {
      console.log(`❌ Senha INCORRETA`);
      console.log(`\n💡 Execute: node scripts/reset-admin-password.js "novasenha123"\n`);
      return false;
    }

  } catch (error) {
    console.error('❌ Erro ao testar login:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const email = process.argv[2] || 'brigido254@gmail.com';
  const password = process.argv[3] || 'admin123456';

  await testLogin(email, password);
}

main();



