#!/usr/bin/env node

/**
 * Safe postinstall script that runs prisma generate without requiring DATABASE_URL
 * Prisma Client can be generated without a valid database connection
 */

const { execSync } = require('child_process');

try {
  console.log('📦 Generating Prisma Client...');
  
  // Set a dummy DATABASE_URL if not present to avoid Prisma validation errors
  // Prisma Client generation doesn't actually need a real connection
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public';
    console.log('⚠️  Using dummy DATABASE_URL for Prisma Client generation');
  }
  
  execSync('prisma generate', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      // Override any config that might require validation
      SKIP_ENV_VALIDATION: 'true'
    }
  });
  
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Error generating Prisma Client:', error.message);
  console.log('⚠️  Continuing build without Prisma Client generation...');
  console.log('   Make sure DATABASE_URL is set in Vercel environment variables.');
  // Don't fail the build - exit with success
  process.exit(0);
}

