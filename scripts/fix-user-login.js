/**
 * Script para corrigir login de um usuário
 * Re-hash a senha com normalização correta e garante que o email está normalizado
 * 
 * Uso:
 *   node scripts/fix-user-login.js "email@exemplo.com" "novasenha123"
 */

// Carregar variáveis de ambiente
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv não disponível, tentar .env
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
  const newPassword = process.argv[3];

  if (!email || !email.includes('@')) {
    console.error('❌ Por favor, forneça um email válido');
    console.error('Uso: node scripts/fix-user-login.js "email@exemplo.com" "novasenha123"');
    process.exit(1);
  }

  if (!newPassword || newPassword.length < 8) {
    console.error('❌ Por favor, forneça uma senha com no mínimo 8 caracteres');
    console.error('Uso: node scripts/fix-user-login.js "email@exemplo.com" "novasenha123"');
    process.exit(1);
  }

  try {
    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`\n🔍 Buscando usuário: ${normalizedEmail}\n`);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      console.error(`❌ Usuário com email ${normalizedEmail} não encontrado`);
      console.error('\n💡 Você pode criar um novo usuário com:');
      console.error('   node scripts/create-admin-user.js "Seu Nome" "email@exemplo.com" "senha123"');
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user.name || 'N/A'}`);
    console.log(`   Email atual: ${user.email}`);
    console.log(`   Tem senha: ${user.password ? '✅ Sim' : '❌ Não'}`);
    console.log(`   Email verificado: ${user.emailVerified ? '✅ Sim' : '❌ Não'}`);
    console.log(`   Perfil: ${user.profile ? `✅ ${user.profile.role}` : '❌ SEM PERFIL'}\n`);

    // Normalizar senha e fazer hash
    const normalizedPassword = newPassword.trim();
    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    // Atualizar usuário: email normalizado, senha normalizada, email verificado
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: normalizedEmail, // Garantir que email está normalizado
        password: hashedPassword, // Nova senha normalizada
        emailVerified: user.emailVerified || new Date(), // Garantir que email está verificado
      },
    });

    // Garantir que tem perfil
    if (!user.profile) {
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          role: 'USER',
        },
      });
      console.log('✅ Perfil criado para o usuário');
    }

    console.log('\n✅ Usuário atualizado com sucesso!');
    console.log(`\n📧 Email: ${updatedUser.email}`);
    console.log(`👤 Nome: ${updatedUser.name || 'N/A'}`);
    console.log(`🔑 Nova senha: ${newPassword}`);
    console.log(`\n💡 Você pode fazer login agora em: http://localhost:3000/auth/login`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Erro ao atualizar usuário:', error.message);
    if (error.code === 'P1001') {
      console.error('   Erro de conexão com o banco de dados. Verifique se o PostgreSQL está rodando.');
      console.error('   Execute: docker compose up -d db');
    }
    if (error.code === 'P2002') {
      console.error('   O email já está em uso por outro usuário.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

