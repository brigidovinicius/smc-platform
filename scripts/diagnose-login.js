/**
 * Script para diagnosticar problemas de login
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🔍 DIAGNÓSTICO DE LOGIN\n');
  
  try {
    // 1. Verificar usuário admin
    const adminUser = await prisma.user.findFirst({
      where: {
        profile: {
          role: 'ADMIN',
        },
      },
      include: {
        profile: true,
      },
    });

    if (!adminUser) {
      console.log('❌ Nenhum usuário admin encontrado');
      return;
    }

    console.log('✅ Usuário Admin encontrado:');
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Nome: ${adminUser.name}`);
    console.log(`   - ID: ${adminUser.id}`);
    console.log(`   - Email verificado: ${adminUser.emailVerified ? 'Sim' : 'Não'}`);
    console.log(`   - Tem senha: ${adminUser.password ? 'Sim' : 'Não'}`);
    console.log(`   - Role: ${adminUser.profile?.role || 'SEM PERFIL'}`);

    // 2. Testar senha
    if (adminUser.password) {
      const testPasswords = ['admin123456', 'Admin123456', 'ADMIN123456'];
      let found = false;
      
      for (const testPass of testPasswords) {
        const isValid = await bcrypt.compare(testPass, adminUser.password);
        if (isValid) {
          console.log(`\n✅ Senha correta encontrada: "${testPass}"`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.log('\n⚠️  Nenhuma das senhas padrão funcionou.');
        console.log('💡 Execute: node scripts/reset-admin-password.js "novasenha123"');
      }
    }

    // 3. Verificar variáveis de ambiente
    console.log('\n📋 Verifique as variáveis de ambiente:');
    console.log('   - NEXTAUTH_SECRET deve estar configurado');
    console.log('   - NEXTAUTH_URL deve apontar para a URL da aplicação');
    console.log('   - DATABASE_URL deve estar correto');

    console.log('\n✅ Diagnóstico completo!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();



