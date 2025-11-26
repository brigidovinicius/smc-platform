#!/usr/bin/env node

/**
 * Safe postinstall script that runs prisma generate without requiring DATABASE_URL
 * Prisma Client can be generated without a valid database connection
 */

const { execSync } = require('child_process');

try {
  console.log('📦 Generating Prisma Client...');
  
  // Check if DATABASE_URL is valid (not pointing to localhost/docker hostnames)
  // Supabase pode usar POSTGRES_URL_NON_POOLING ou POSTGRES_URL
  const dbUrl = process.env.DATABASE_URL || 
                process.env.POSTGRES_URL_NON_POOLING || 
                process.env.POSTGRES_URL;
  
  // If DATABASE_URL is invalid (contains 'postgres:' hostname or is missing), use dummy
  if (!dbUrl || dbUrl.includes('postgres:5432') || dbUrl.includes('@postgres:')) {
    console.log('⚠️  DATABASE_URL is invalid or missing, using dummy URL for Prisma Client generation');
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public';
  } else {
    // Use the actual database URL for Prisma Client generation
    // Prisma schema expects DATABASE_URL, so we set it from Supabase variables if needed
    if (!process.env.DATABASE_URL && (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL)) {
      process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
      console.log('✅ Using Supabase database URL (POSTGRES_URL_NON_POOLING/POSTGRES_URL) for Prisma Client generation');
    } else {
      console.log('✅ Using provided DATABASE_URL for Prisma Client generation');
    }
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
  console.log('   Make sure DATABASE_URL is set correctly in Vercel environment variables.');
  console.log('   DATABASE_URL should be a valid PostgreSQL connection string (e.g., from Supabase or Vercel Postgres).');
  // Don't fail the build - exit with success
  process.exit(0);
}

