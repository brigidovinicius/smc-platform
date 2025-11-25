/**
 * Script para verificar e corrigir login em produção
 * Conecta ao banco de produção e verifica/cria usuário admin
 * 
 * Uso:
 *   DATABASE_URL="postgresql://..." node scripts/fix-production-login.js "email@exemplo.com" "senha123"
 */

// Carregar variáveis de ambiente
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  try {
    require('dotenv').config();
  } catch (e2) {
    // Ignorar se não conseguir carregar
  }
}

const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Usar DATABASE_URL do ambiente
let databaseUrl = process.env.DATABASE_URL;

// Se não estiver no ambiente, tentar ler do .env.production
if (!databaseUrl) {
  try {
    if (fs.existsSync('.env.production')) {
      const envContent = fs.readFileSync('.env.production', 'utf8');
      const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
      if (match) {
        databaseUrl = match[1].replace(/\\n/g, '').trim();
      }
    }
  } catch (e) {
    // Ignorar
  }
}

// Ou usar como argumento
if (!databaseUrl) {
  databaseUrl = process.argv[4];
}

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não encontrada!');
  console.error('\nOpções:');
  console.error('1. Configure DATABASE_URL como variável de ambiente:');
  console.error('   DATABASE_URL="postgresql://..." node scripts/fix-production-login.js "email@exemplo.com" "senha123"');
  console.error('2. Ou use o script helper:');
  console.error('   ./scripts/setup-production-admin.sh');
  console.error('\nPara obter a DATABASE_URL:');
  console.error('   vercel env pull .env.production --environment=production');
  process.exit(1);
}

// Limpar a URL (remover \n e espaços)
databaseUrl = databaseUrl.trim().replace(/\\n/g, '');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !email.includes('@')) {
    console.error('❌ Por favor, forneça um email válido');
    console.error('Uso: DATABASE_URL="..." node scripts/fix-production-login.js "email@exemplo.com" "senha123"');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('❌ Por favor, forneça uma senha com no mínimo 8 caracteres');
    console.error('Uso: DATABASE_URL="..." node scripts/fix-production-login.js "email@exemplo.com" "senha123"');
    process.exit(1);
  }

  try {
    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`\n🔍 VERIFICANDO/CORRIGINDO LOGIN EM PRODUÇÃO\n`);
    console.log(`📧 Email: ${normalizedEmail}`);
    console.log(`🔑 Senha: ${password.length} caracteres\n`);

    // Testar conexão
    console.log('🔌 Testando conexão com banco de dados...');
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados!\n');

    // Buscar usuário
    console.log('🔍 Buscando usuário...');
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      console.log('❌ Usuário não encontrado. Criando novo usuário...\n');
      
      // Criar usuário
      const normalizedPassword = password.trim();
      const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
      
      user = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: normalizedEmail,
          password: hashedPassword,
          emailVerified: new Date(),
          profile: {
            create: {
              role: 'ADMIN',
            },
          },
        },
        include: { profile: true },
      });
      
      console.log('✅ Usuário criado com sucesso!');
    } else {
      console.log('✅ Usuário encontrado!');
      
      // Verificar senha
      const normalizedPassword = password.trim();
      const isValid = user.password ? await bcrypt.compare(normalizedPassword, user.password) : false;
      
      if (!isValid || !user.password) {
        console.log('\n⚠️  Senha incorreta ou não definida. Atualizando senha...');
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
        
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            emailVerified: user.emailVerified || new Date(),
            email: normalizedEmail, // Garantir que email está normalizado
          },
        });
        
        console.log('✅ Senha atualizada!');
      } else {
        console.log('✅ Senha está correta!');
      }
      
      // Garantir que tem perfil
      if (!user.profile) {
        console.log('\n⚠️  Usuário sem perfil. Criando perfil...');
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: { role: 'ADMIN' },
          create: {
            userId: user.id,
            role: 'ADMIN',
          },
        });
        console.log('✅ Perfil criado!');
      } else if (user.profile.role !== 'ADMIN') {
        console.log('\n⚠️  Usuário não é admin. Atualizando para ADMIN...');
        await prisma.profile.update({
          where: { userId: user.id },
          data: { role: 'ADMIN' },
        });
        console.log('✅ Usuário agora é ADMIN!');
      }
    }

    // Buscar dados atualizados
    user = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    });

    console.log('\n════════════════════════════════════════════════════');
    console.log('✅ CONFIGURAÇÃO CONCLUÍDA!\n');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Nome: ${user.name || 'N/A'}`);
    console.log(`🔑 Senha: ${password}`);
    console.log(`👑 Role: ${user.profile?.role || 'USER'}`);
    console.log(`✅ Email verificado: ${user.emailVerified ? 'Sim' : 'Não'}`);
    console.log('\n💡 Agora você pode fazer login em:');
    console.log('   https://smc-platform.vercel.app/auth/login');
    console.log('════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.code === 'P1001') {
      console.error('   Erro de conexão com o banco de dados.');
      console.error('   Verifique se a DATABASE_URL está correta.');
    }
    if (error.code === 'P1000') {
      console.error('   Erro de autenticação no banco.');
      console.error('   Verifique usuário e senha na DATABASE_URL.');
    }
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

