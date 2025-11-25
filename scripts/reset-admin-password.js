/**
 * Script para resetar a senha do usuário admin
 * 
 * Uso:
 *   node scripts/reset-admin-password.js "novasenha123"
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const newPassword = process.argv[2];

  if (!newPassword || newPassword.length < 8) {
    console.error('❌ Por favor, forneça uma senha com no mínimo 8 caracteres');
    console.error('Uso: node scripts/reset-admin-password.js "novasenha123"');
    process.exit(1);
  }

  try {
    // Buscar usuário admin
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
      console.error('❌ Nenhum usuário admin encontrado');
      process.exit(1);
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        password: hashedPassword,
      },
    });

    console.log('\n✅ Senha do admin resetada com sucesso!');
    console.log(`\n📧 Email: ${adminUser.email}`);
    console.log(`👤 Nome: ${adminUser.name}`);
    console.log(`🔑 Nova senha: ${newPassword}`);
    console.log(`\n💡 Você pode fazer login agora em: https://sua-aplicacao.com/auth/login`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Erro ao resetar senha:', error.message);
    if (error.code === 'P1001') {
      console.error('   Erro de conexão com o banco de dados. Verifique se o PostgreSQL está rodando.');
      console.error('   Execute: docker compose up -d db');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

