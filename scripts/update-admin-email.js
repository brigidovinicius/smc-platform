/**
 * Script para atualizar o email do usuário admin
 * 
 * Uso:
 *   node scripts/update-admin-email.js "novo@email.com"
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newEmail = process.argv[2];

  if (!newEmail || !newEmail.includes('@')) {
    console.error('❌ Por favor, forneça um email válido');
    console.error('Uso: node scripts/update-admin-email.js "novo@email.com"');
    process.exit(1);
  }

  try {
    // Buscar usuário admin atual
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

    // Verificar se o novo email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail.trim().toLowerCase() },
    });

    if (existingUser && existingUser.id !== adminUser.id) {
      console.error('❌ Este email já está em uso por outro usuário');
      process.exit(1);
    }

    // Atualizar email
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        email: newEmail.trim().toLowerCase(),
        emailVerified: new Date(),
      },
    });

    console.log('\n✅ Email do admin atualizado com sucesso!');
    console.log(`\n📧 Email anterior: ${adminUser.email}`);
    console.log(`📧 Email novo: ${newEmail.trim().toLowerCase()}`);
    console.log(`\n💡 Faça logout e login novamente para aplicar as mudanças.\n`);

  } catch (error) {
    console.error('\n❌ Erro ao atualizar email:', error.message);
    if (error.code === 'P2002') {
      console.error('   Este email já está em uso.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();



