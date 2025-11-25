const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });

    console.log('\n📊 Usuários no banco de dados:\n');
    console.log(`Total: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado.');
      console.log('\n💡 Execute: node scripts/create-admin-user.js');
    } else {
      users.forEach((u, i) => {
        console.log(`${i + 1}. Email: ${u.email}`);
        console.log(`   Nome: ${u.name || 'N/A'}`);
        console.log(`   Tem senha: ${u.password ? '✅ Sim' : '❌ Não'}`);
        console.log(`   Email verificado: ${u.emailVerified ? '✅ Sim' : '❌ Não'}`);
        console.log(`   Perfil: ${u.profile ? `✅ ${u.profile.role}` : '❌ SEM PERFIL'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.code === 'P1001') {
      console.error('   Verifique se o PostgreSQL está rodando: docker compose up -d db');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();

