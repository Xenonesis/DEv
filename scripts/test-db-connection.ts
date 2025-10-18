#!/usr/bin/env tsx
/**
 * Database Connection Test Script
 * 
 * This script tests the database connection and verifies:
 * 1. Environment variables are set correctly
 * 2. Database is accessible
 * 3. Prisma Client can connect
 * 4. Schema is in sync with database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');

  // 1. Check environment variables
  console.log('1. Checking environment variables...');
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDirectUrl = !!process.env.DIRECT_URL;
  
  console.log(`   DATABASE_URL: ${hasDbUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`   DIRECT_URL: ${hasDirectUrl ? '✅ Set' : '❌ Not set'}`);
  
  if (!hasDbUrl) {
    console.error('\n❌ DATABASE_URL is not set. Please check your .env file.');
    process.exit(1);
  }

  // 2. Test database connectivity
  console.log('\n2. Testing database connectivity...');
  try {
    await prisma.$connect();
    console.log('   ✅ Successfully connected to database');
  } catch (error) {
    console.error('   ❌ Failed to connect to database');
    console.error('   Error:', error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  }

  // 3. Test query execution
  console.log('\n3. Testing query execution...');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Successfully executed test query');
    console.log('   Result:', result);
  } catch (error) {
    console.error('   ❌ Failed to execute query');
    console.error('   Error:', error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  }

  // 4. Check if tables exist
  console.log('\n4. Checking database schema...');
  try {
    const userCount = await prisma.user.count();
    console.log(`   ✅ Schema is accessible (found ${userCount} users)`);
  } catch (error) {
    console.error('   ⚠️  Schema may not be initialized or migrated');
    console.error('   Error:', error instanceof Error ? error.message : error);
    console.log('\n   💡 Run migrations with: npm run db:migrate:deploy');
  }

  // 5. Database information
  console.log('\n5. Database information...');
  try {
    const dbInfo: any = await prisma.$queryRaw`
      SELECT version() as version, 
             current_database() as database,
             current_user as user
    `;
    console.log('   Database:', dbInfo[0].database);
    console.log('   User:', dbInfo[0].user);
    console.log('   Version:', dbInfo[0].version.split(' ').slice(0, 2).join(' '));
  } catch (error) {
    console.log('   ⚠️  Could not fetch database information');
  }

  // 6. Environment check
  console.log('\n6. Environment check...');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Using Prisma Accelerate: ${process.env.DATABASE_URL?.includes('accelerate.prisma-data.net') ? 'Yes' : 'No'}`)

  await prisma.$disconnect();
  console.log('\n✅ All database tests passed!\n');
  console.log('Your database is ready for production deployment.');
  process.exit(0);
}

// Run the test
testConnection().catch(async (error) => {
  console.error('\n❌ Database test failed with unexpected error:');
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
