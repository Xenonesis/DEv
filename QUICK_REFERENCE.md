# 🚀 Quick Reference - Production Database

## Essential Commands

```bash
# Test database connection
npm run db:test

# Initialize production database
npm run db:init

# Validate schema
npm run db:validate

# Build application
npm run build

# Start production server
npm run start        # Windows
npm run start:unix   # Linux/Mac

# Deploy migrations
npm run db:migrate:deploy

# Generate Prisma Client
npm run db:generate
```

## Environment Variables

```bash
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"
DIRECT_URL="postgresql://user:pass@host:port/db?sslmode=require"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

## Health Check

```bash
curl https://your-domain.com/api/health
```

Expected: `{"status":"healthy","database":"connected"}`

## Deployment Steps

1. **Set environment variables**
2. **Run**: `npm run db:init`
3. **Run**: `npm run build`
4. **Run**: `npm run start:unix`
5. **Verify**: Check `/api/health`

## Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect to database | Check `DATABASE_URL`, verify SSL mode |
| Table doesn't exist | Run `npm run db:init` or `npm run db:push` |
| Too many connections | Use Prisma Accelerate or add connection limits |
| Prisma Client not found | Run `npm run db:generate` |

## Files Created

- ✅ `.env.example` - Environment template
- ✅ `PRODUCTION_DEPLOYMENT.md` - Complete guide
- ✅ `PRODUCTION_CHECKLIST.md` - Pre-deployment checklist
- ✅ `DATABASE_PRODUCTION_SETUP_SUMMARY.md` - Setup summary
- ✅ `DEPLOYMENT_VERIFICATION.md` - Verification guide
- ✅ `scripts/test-db-connection.ts` - Connection tester
- ✅ `scripts/init-production-db.ts` - DB initialization

## Files Modified

- ✅ `src/lib/db.ts` - Production-optimized Prisma Client
- ✅ `src/app/api/health/route.ts` - Database health check
- ✅ `package.json` - Production scripts

## Platform Quick Start

### Vercel
```bash
# Dashboard: Add environment variables
# Deploy: Automatic on git push
# Recommended: Use Prisma Accelerate
```

### Railway
```bash
# Dashboard: Add environment variables
# Deploy: Automatic on git push
# Option: Use Railway PostgreSQL plugin
```

### Render
```bash
# Build: npm run build
# Start: npm run start:unix
# Dashboard: Add environment variables
```

## Support Resources

- 📖 **Full Guide**: `PRODUCTION_DEPLOYMENT.md`
- ✅ **Checklist**: `PRODUCTION_CHECKLIST.md`
- 📋 **Summary**: `DATABASE_PRODUCTION_SETUP_SUMMARY.md`
- 🔍 **Verification**: `DEPLOYMENT_VERIFICATION.md`
