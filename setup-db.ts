import { db } from './src/lib/db'

async function setupDatabase() {
    try {
        console.log('🚀 Setting up database schema...')

        // Try to create tables using raw SQL
        // This is a workaround for Accelerate when we don't have direct URL

        console.log('📝 Creating database schema...')

        // Create enums first
        await db.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "HackathonStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

        await db.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "EventType" AS ENUM ('WORKSHOP', 'SEMINAR', 'NETWORKING', 'COMPETITION', 'SOCIAL');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

        await db.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "SessionType" AS ENUM ('VIDEO', 'WORKSHOP', 'TUTORIAL', 'READING', 'QUIZ');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

        await db.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

        await db.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'MEMBER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

        await db.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "IdeaStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

        console.log('✅ Enums created successfully!')

        // Test connection
        await db.$connect()
        console.log('✅ Database connected successfully!')

        // Try a simple query to see what tables exist
        const result = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

        console.log('📊 Existing tables:', result)

        console.log('🎉 Database setup complete!')
        console.log('💡 Note: You may need to run migrations or use db push with a direct database URL')

    } catch (error) {
        console.error('❌ Database setup failed:', error)
        console.log('\n💡 Troubleshooting tips:')
        console.log('1. Make sure your Prisma Accelerate connection is working')
        console.log('2. You may need a direct database URL for schema migrations')
        console.log('3. Check your Prisma dashboard for the direct database URL')
    } finally {
        await db.$disconnect()
    }
}

setupDatabase()