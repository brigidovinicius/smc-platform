/**
 * Lista usuários no banco de produção
 */

const fs = require('fs');
const path = require('path');

// Ler DATABASE_URL do .env.production
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync('.env.production')) {
  const envContent = fs.readFileSync('.env.production', 'utf8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  if (match) {
    databaseUrl = match[1].replace(/\\n/g, '').trim();
  }
}

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não encontrada!');
  console.error('   Configure no .env.production ou como variável de ambiente');
  process.exit(1);
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function main() {
  try {
    console.log('\n🔍 Listando usuários no banco de produção...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        password: true,
        profile: {
          select: {
            role: true
          }
        }
      },
      orderBy: {
        email: 'asc'
      }
    });

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco!\n');
      console.log('💡 Crie um usuário com:');
      console.log('   node scripts/fix-production-login.js "email@exemplo.com" "senha123"');
    } else {
      console.log(`✅ Encontrados ${users.length} usuário(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Nome: ${user.name || 'N/A'}`);
        console.log(`   Tem senha: ${user.password ? '✅ Sim' : '❌ Não'}`);
        console.log(`   Email verificado: ${user.emailVerified ? '✅ Sim' : '❌ Não'}`);
        console.log(`   Role: ${user.profile?.role || 'N/A'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.code === 'P1001') {
      console.error('   Erro de conexão. Verifique a DATABASE_URL.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();

