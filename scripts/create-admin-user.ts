/**
 * Script para criar um usuário administrador
 * 
 * Uso:
 *   npx tsx scripts/create-admin-user.ts
 *   ou
 *   ts-node scripts/create-admin-user.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('\n🔐 Criando usuário administrador...\n');

  try {
    // Solicitar informações
    const name = await question('Nome completo: ');
    if (!name || name.trim().length === 0) {
      console.error('❌ Nome é obrigatório');
      process.exit(1);
    }

    const email = await question('E-mail: ');
    if (!email || !email.includes('@')) {
      console.error('❌ E-mail inválido');
      process.exit(1);
    }

    // Verificar se o email já existe
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
      if (update.toLowerCase() === 's') {
        await prisma.profile.upsert({
          where: { userId: existingUser.id },
          update: { role: 'ADMIN' },
          create: {
            userId: existingUser.id,
            role: 'ADMIN',
          },
        });
        console.log('\n✅ Usuário agora é administrador!');
        rl.close();
        await prisma.$disconnect();
        return;
      } else {
        console.log('❌ Operação cancelada');
        rl.close();
        await prisma.$disconnect();
        return;
      }
    }

    // Solicitar senha
    const password = await question('Senha (mínimo 8 caracteres): ');
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

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário e perfil
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        emailVerified: new Date(), // Marcar como verificado
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

    console.log('\n✅ Usuário administrador criado com sucesso!');
    console.log(`\n📧 Email: ${user.email}`);
    console.log(`👤 Nome: ${user.name}`);
    console.log(`🔑 Role: ${user.profile?.role}`);
    console.log(`\n💡 Você pode fazer login em: http://localhost:3001/auth/login`);
    console.log('\n');

  } catch (error: any) {
    console.error('\n❌ Erro ao criar usuário:', error.message);
    if (error.code === 'P2002') {
      console.error('   O email já está em uso.');
    }
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();


