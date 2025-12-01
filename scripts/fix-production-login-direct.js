/**
 * Script para corrigir login usando conexão direta ao PostgreSQL
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// Extrair informações da URL
function parseDatabaseUrl(url) {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('URL do banco inválida');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5].split('?')[0],
    ssl: url.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  };
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const databaseUrl = process.argv[4] || process.env.DATABASE_URL;

  if (!email || !email.includes('@')) {
    console.error('❌ Por favor, forneça um email válido');
    console.error('Uso: node scripts/fix-production-login-direct.js "email@exemplo.com" "senha123" [DATABASE_URL]');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('❌ Por favor, forneça uma senha com no mínimo 8 caracteres');
    process.exit(1);
  }

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL não fornecida');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  
  console.log(`\n🔍 CONFIGURANDO LOGIN EM PRODUÇÃO\n`);
  console.log(`📧 Email: ${normalizedEmail}`);
  console.log(`🔑 Senha: ${normalizedPassword.length} caracteres\n`);

  const dbConfig = parseDatabaseUrl(databaseUrl);
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado!\n');

    // Buscar usuário
    console.log('🔍 Buscando usuário...');
    const userResult = await client.query(
      'SELECT id, email, name, password, "emailVerified" FROM "User" WHERE email = $1',
      [normalizedEmail]
    );

    let user = userResult.rows[0];

    if (!user) {
      console.log('❌ Usuário não encontrado. Criando novo usuário...\n');
      
      const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
      const userId = require('crypto').randomUUID();
      
      await client.query('BEGIN');
      
      // Criar usuário
      await client.query(
        'INSERT INTO "User" (id, email, name, password, "emailVerified") VALUES ($1, $2, $3, $4, $5)',
        [userId, normalizedEmail, 'Admin User', hashedPassword, new Date()]
      );
      
      // Criar perfil
      await client.query(
        'INSERT INTO "Profile" (id, "userId", role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
        [require('crypto').randomUUID(), userId, 'ADMIN', new Date(), new Date()]
      );
      
      await client.query('COMMIT');
      
      console.log('✅ Usuário criado com sucesso!');
      user = { id: userId, email: normalizedEmail, name: 'Admin User', password: hashedPassword, emailVerified: new Date() };
    } else {
      console.log('✅ Usuário encontrado!');
      
      // Verificar senha
      const isValid = user.password ? await bcrypt.compare(normalizedPassword, user.password) : false;
      
      if (!isValid || !user.password) {
        console.log('\n⚠️  Senha incorreta ou não definida. Atualizando senha...');
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
        
        await client.query(
          'UPDATE "User" SET password = $1, email = $2, "emailVerified" = COALESCE("emailVerified", $3) WHERE id = $4',
          [hashedPassword, normalizedEmail, new Date(), user.id]
        );
        
        user.password = hashedPassword;
        console.log('✅ Senha atualizada!');
      } else {
        console.log('✅ Senha está correta!');
      }
      
      // Verificar perfil
      const profileResult = await client.query(
        'SELECT role FROM "Profile" WHERE "userId" = $1',
        [user.id]
      );
      
      if (profileResult.rows.length === 0) {
        console.log('\n⚠️  Usuário sem perfil. Criando perfil...');
        await client.query(
          'INSERT INTO "Profile" (id, "userId", role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
          [require('crypto').randomUUID(), user.id, 'ADMIN', new Date(), new Date()]
        );
        console.log('✅ Perfil criado!');
      } else if (profileResult.rows[0].role !== 'ADMIN') {
        console.log('\n⚠️  Usuário não é admin. Atualizando para ADMIN...');
        await client.query(
          'UPDATE "Profile" SET role = $1 WHERE "userId" = $2',
          ['ADMIN', user.id]
        );
        console.log('✅ Usuário agora é ADMIN!');
      }
    }

    console.log('\n════════════════════════════════════════════════════');
    console.log('✅ CONFIGURAÇÃO CONCLUÍDA!\n');
    console.log(`📧 Email: ${normalizedEmail}`);
    console.log(`👤 Nome: ${user.name || 'N/A'}`);
    console.log(`🔑 Senha: ${normalizedPassword}`);
    console.log(`✅ Email verificado: ${user.emailVerified ? 'Sim' : 'Não'}`);
    console.log('\n💡 Agora você pode fazer login em:');
    console.log('   https://smc-platform.vercel.app/auth/login');
    console.log('════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Erro de conexão. Verifique se o banco está acessível.');
    }
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();



