#!/usr/bin/env node

/**
 * Script automático para redefinir senha
 * Gera hash bcrypt e mostra SQL para executar no Supabase
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const email = 'brigido254@gmail.com';
const defaultPassword = 'Teste1234';

console.log('\n🔐 Redefinindo senha para:', email);
console.log('🔑 Nova senha padrão:', defaultPassword);
console.log('\n⏳ Gerando hash bcrypt...\n');

// Gerar hash da senha
bcrypt.hash(defaultPassword, 10)
  .then(hash => {
    console.log('✅ Hash gerado com sucesso!\n');
    console.log('📋 Execute este SQL no Supabase SQL Editor:\n');
    console.log('─'.repeat(70));
    console.log(`UPDATE "User"`);
    console.log(`SET password = '${hash}'`);
    console.log(`WHERE email = '${email}';`);
    console.log('─'.repeat(70));
    console.log('\n💡 Depois disso, você pode fazer login com:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${defaultPassword}\n`);
    
    // Perguntar se quer tentar executar automaticamente
    rl.question('❓ Quer que eu tente executar automaticamente? (s/n): ', async (answer) => {
      if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
        console.log('\n🔄 Tentando executar automaticamente...\n');
        
        // Tentar usar Prisma
        try {
          require('dotenv').config({ path: '.env.local' });
          const { PrismaClient } = require('@prisma/client');
          
          const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || 
                            process.env.POSTGRES_URL || 
                            process.env.DATABASE_URL;

          if (databaseUrl && !databaseUrl.includes('dummy') && !databaseUrl.includes('postgres:5432')) {
            if (process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL !== process.env.POSTGRES_URL_NON_POOLING) {
              process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
            }
            
            const prisma = new PrismaClient();
            
            try {
              const user = await prisma.user.findUnique({
                where: { email }
              });

              if (!user) {
                console.error(`❌ Usuário com email "${email}" não encontrado!`);
                rl.close();
                process.exit(1);
              }

              await prisma.user.update({
                where: { id: user.id },
                data: { password: hash }
              });

              console.log('✅ Senha redefinida com sucesso automaticamente!');
              console.log(`\n💡 Agora você pode fazer login com:`);
              console.log(`   Email: ${email}`);
              console.log(`   Senha: ${defaultPassword}\n`);
              
              await prisma.$disconnect();
              rl.close();
              process.exit(0);
            } catch (error) {
              console.error('❌ Erro ao atualizar senha:', error.message);
              console.log('\n💡 Use o SQL mostrado acima no Supabase SQL Editor.\n');
              await prisma.$disconnect();
              rl.close();
              process.exit(1);
            }
          } else {
            console.log('⚠️  Connection string não configurada localmente.');
            console.log('💡 Use o SQL mostrado acima no Supabase SQL Editor.\n');
            rl.close();
            process.exit(0);
          }
        } catch (error) {
          console.error('❌ Erro ao conectar:', error.message);
          console.log('\n💡 Use o SQL mostrado acima no Supabase SQL Editor.\n');
          rl.close();
          process.exit(1);
        }
      } else {
        console.log('\n✅ SQL gerado! Execute no Supabase SQL Editor.\n');
        rl.close();
        process.exit(0);
      }
    });
  })
  .catch(error => {
    console.error('❌ Erro ao gerar hash:', error.message);
    rl.close();
    process.exit(1);
  });


