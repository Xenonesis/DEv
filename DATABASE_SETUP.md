# Database Setup Guide

## Current Status
✅ Prisma schema configured for PostgreSQL  
✅ Prisma Accelerate URL configured  
✅ Prisma Client generated with Accelerate support  
❌ Database schema not yet created (tables don't exist)

## Next Steps

### 1. Get Your Direct Database URL

You need to get the direct PostgreSQL connection URL from your Prisma dashboard:

1. Go to your Prisma dashboard
2. Navigate to your project
3. Find the "Connection Details" or "Database" section
4. Copy the **direct database URL** (not the Accelerate URL)
5. It should look like: `postgresql://username:password@host:port/database?sslmode=require`

### 2. Update Your .env File

Replace the placeholder `DIRECT_URL` in your `.env` file with the actual direct database URL:

```env
DIRECT_URL="postgresql://your-actual-connection-string"
```

### 3. Create Database Schema

Once you have the direct URL, run:

```bash
npm run db:push
```

Or if you prefer migrations:

```bash
npm run db:migrate
```

### 4. Verify Setup

Run the test script to verify everything works:

```bash
npx tsx test-db.ts
```

## Current Configuration

- **Prisma Client**: Generated with Accelerate support
- **Database Provider**: PostgreSQL
- **Accelerate URL**: Configured ✅
- **Direct URL**: Needs to be updated ⚠️

## Troubleshooting

If you get permission errors:
- Make sure your direct database URL has admin/owner permissions
- The Accelerate URL is read-only for queries
- Migrations require the direct URL with full permissions

## Files Modified

- `prisma/schema.prisma` - Updated to use PostgreSQL with Accelerate
- `.env` - Added DATABASE_URL and DIRECT_URL
- `package.json` - Updated db:generate script for Accelerate
- `src/lib/db.ts` - Already configured for Prisma Client

## What's Working

- ✅ Database connection (Accelerate)
- ✅ Prisma Client generation
- ✅ Basic queries (once schema is created)

## What's Needed

- ⚠️ Direct database URL for migrations
- ⚠️ Schema creation (db push/migrate)