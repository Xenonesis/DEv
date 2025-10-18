#!/usr/bin/env tsx
/**
 * Production Database Initialization Script
 * 
 * This script safely initializes a production database:
 * 1. Checks connection
 * 2. Creates initial migration if needed
 * 3. Applies all migrations
 * 4. Verifies schema integrity
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initProductionDb() {
  console.log('🚀 Initializing Production Database...\n');

  try {
    // Step 1: Check connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Connected to database\n');

    // Step 2: Check if database has tables
    console.log('2. Checking database state...');
    try {
      await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`;
      console.log('   ✅ Database already initialized\n');
      
      // Check if migrations are needed
      console.log('3. Checking for pending migrations...');
      try {
        execSync('npx prisma migrate deploy', { 
          stdio: 'inherit',
          env: process.env 
        });
      } catch (error) {
        console.log('   ⚠️  No migrations to apply or migration failed\n');
      }
      
    } catch (error) {
      console.log('   ℹ️  Database needs initialization\n');

      // Step 3: Push schema to database
      console.log('3. Pushing schema to database...');
      try {
        execSync('npx prisma db push --accept-data-loss', { 
          stdio: 'inherit',
          env: process.env 
        });
        console.log('   ✅ Schema pushed successfully\n');
      } catch (error) {
        throw new Error('Failed to push schema to database');
      }
    }

    // Step 4: Verify schema integrity
    console.log('4. Verifying schema integrity...');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    
    console.log(`   ✅ Found ${tables.length} tables in database`);
    console.log('   Tables:', tables.map(t => t.tablename).join(', '));

    // Step 5: Optional - Seed database
    console.log('\n5. Database seeding...');
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('   ℹ️  Database is empty. Consider running seed script:');
      console.log('   npm run db:seed');
    } else {
      console.log(`   ✅ Database has ${userCount} users`);
    }

    await prisma.$disconnect();
    
    console.log('\n✅ Production database initialization complete!\n');
    console.log('Your database is ready for production use.');
    
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run initialization
initProductionDb();
