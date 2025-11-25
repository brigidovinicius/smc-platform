/**
 * Script para criar um usuário administrador
 * 
 * Uso interativo:
 *   node scripts/create-admin-user.js
 * 
 * Uso com argumentos (não-interativo):
 *   node scripts/create-admin-user.js "Nome Completo" "email@exemplo.com" "senha123"
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

// Modo não-interativo: verificar argumentos da linha de comando
const args = process.argv.slice(2);
const isInteractive = args.length === 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdminUser(name, email, password) {
  const emailLower = email.trim().toLowerCase();

  // Verificar se o email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: emailLower },
    include: { profile: true },
  });

  if (existingUser) {
    if (existingUser.profile?.role === 'ADMIN') {
      return {
        success: true,
        message: 'Usuário já é administrador',
        user: existingUser,
        alreadyAdmin: true,
      };
    }

    // Atualizar para admin
    await prisma.profile.upsert({
      where: { userId: existingUser.id },
      update: { role: 'ADMIN' },
      create: {
        userId: existingUser.id,
        role: 'ADMIN',
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: existingUser.id },
      include: { profile: true },
    });

    return {
      success: true,
      message: 'Usuário agora é administrador',
      user: updatedUser,
      updated: true,
    };
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar usuário e perfil
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: emailLower,
      password: hashedPassword,
      emailVerified: new Date(),
      profile: {
        create: {
          role: 'ADMIN',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return {
    success: true,
    message: 'Usuário administrador criado com sucesso',
    user,
    created: true,
  };
}

async function main() {
  let name, email, password;

  try {
    if (isInteractive) {
      console.log('\n🔐 Criando usuário administrador...\n');

      // Solicitar informações
      name = await question('Nome completo: ');
      if (!name || name.trim().length === 0) {
        console.error('❌ Nome é obrigatório');
        process.exit(1);
      }

      email = await question('E-mail: ');
      if (!email || !email.includes('@')) {
        console.error('❌ E-mail inválido');
        process.exit(1);
      }

      // Verificar se o email já existe primeiro
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include: { profile: true },
      });

      if (existingUser) {
        console.log(`\n⚠️  Usuário com email ${email} já existe.`);
        
        if (existingUser.profile?.role === 'ADMIN') {
          console.log('✅ Este usuário já é administrador.');
          rl.close();
          await prisma.$disconnect();
          return;
        }

        const update = await question('Deseja tornar este usuário administrador? (s/n): ');
        if (update.toLowerCase() !== 's') {
          console.log('❌ Operação cancelada');
          rl.close();
          await prisma.$disconnect();
          return;
        }

        // Apenas atualizar role
        await prisma.profile.upsert({
          where: { userId: existingUser.id },
          update: { role: 'ADMIN' },
          create: {
            userId: existingUser.id,
            role: 'ADMIN',
          },
        });

        console.log('\n✅ Usuário agora é administrador!');
        console.log(`📧 Email: ${existingUser.email}`);
        console.log(`👤 Nome: ${existingUser.name}`);
        console.log(`\n💡 Você pode fazer login em: http://localhost:3001/auth/login`);
        rl.close();
        await prisma.$disconnect();
        return;
      }

      // Solicitar senha
      password = await question('Senha (mínimo 8 caracteres): ');
      if (!password || password.length < 8) {
        console.error('❌ Senha deve ter no mínimo 8 caracteres');
        process.exit(1);
      }

      // Confirmar senha
      const confirmPassword = await question('Confirmar senha: ');
      if (password !== confirmPassword) {
        console.error('❌ Senhas não coincidem');
        process.exit(1);
      }
    } else {
      // Modo não-interativo
      if (args.length !== 3) {
        console.error('❌ Uso: node scripts/create-admin-user.js "Nome Completo" "email@exemplo.com" "senha123"');
        process.exit(1);
      }

      [name, email, password] = args;

      if (!name || name.trim().length === 0) {
        console.error('❌ Nome é obrigatório');
        process.exit(1);
      }

      if (!email || !email.includes('@')) {
        console.error('❌ E-mail inválido');
        process.exit(1);
      }

      if (!password || password.length < 8) {
        console.error('❌ Senha deve ter no mínimo 8 caracteres');
        process.exit(1);
      }
    }

    // Criar ou atualizar usuário
    const result = await createAdminUser(name, email, password);

    if (result.success) {
      console.log(`\n✅ ${result.message}!`);
      console.log(`\n📧 Email: ${result.user.email}`);
      console.log(`👤 Nome: ${result.user.name}`);
      console.log(`🔑 Role: ${result.user.profile?.role}`);
      console.log(`\n💡 Você pode fazer login em: http://localhost:3001/auth/login`);
      console.log('\n');
    }

  } catch (error) {
    console.error('\n❌ Erro ao criar usuário:', error.message);
    if (error.code === 'P2002') {
      console.error('   O email já está em uso.');
    }
    if (error.code === 'P1001') {
      console.error('   Erro de conexão com o banco de dados. Verifique se o PostgreSQL está rodando.');
      console.error('   Execute: docker compose up -d db');
    }
    process.exit(1);
  } finally {
    if (isInteractive) {
      rl.close();
    }
    await prisma.$disconnect();
  }
}

main();
