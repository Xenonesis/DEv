# Production Deployment Checklist

Use this checklist to ensure your NeoFest application is production-ready, especially the database configuration.

## Pre-Deployment Checklist

### ✅ Database Configuration

- [ ] **Database URL configured**: `DATABASE_URL` environment variable is set
- [ ] **Direct URL configured**: `DIRECT_URL` environment variable is set (for migrations)
- [ ] **SSL enabled**: Connection string includes `sslmode=require`
- [ ] **Connection pooling**: Using Prisma Accelerate or connection pooling parameters
- [ ] **Database validated**: Run `npm run db:validate`
- [ ] **Schema pushed/migrated**: Run `npm run db:push` or `npm run db:migrate:deploy`
- [ ] **Connection tested**: Run `npm run db:test`

### ✅ Environment Variables

- [ ] **NEXTAUTH_SECRET**: Generated with `openssl rand -base64 32`
- [ ] **NEXTAUTH_URL**: Set to production domain (e.g., `https://yourdomain.com`)
- [ ] **NODE_ENV**: Set to `production`
- [ ] **No .env file committed**: Verify `.env` is in `.gitignore`

### ✅ Security

- [ ] **SSL/TLS enabled**: Database connections use SSL
- [ ] **Strong passwords**: Database and auth secrets are strong
- [ ] **Database user permissions**: Not using superuser account
- [ ] **Firewall configured**: Database only accessible from application servers
- [ ] **Rate limiting**: Consider implementing rate limiting on API routes

### ✅ Performance

- [ ] **Prisma Client generated**: Run `npm run db:generate`
- [ ] **Query logging disabled in production**: Check `src/lib/db.ts`
- [ ] **Connection pooling configured**: Verify pooling is active
- [ ] **Database indexes**: Ensure proper indexes exist for frequently queried fields

### ✅ Build & Deployment

- [ ] **Dependencies installed**: Run `npm ci` (not `npm install`)
- [ ] **TypeScript compiles**: Run `npm run lint`
- [ ] **Build succeeds**: Run `npm run build`
- [ ] **Migrations applied**: Automatically run during build or run manually

### ✅ Monitoring & Testing

- [ ] **Health check endpoint**: Test `/api/health` returns 200
- [ ] **Database connectivity**: Health check confirms database connection
- [ ] **Error logging**: Configure error tracking (Sentry, LogRocket, etc.)
- [ ] **Uptime monitoring**: Set up monitoring service
- [ ] **Backup configured**: Database backup strategy in place

## Quick Commands

```bash
# Test database connection
npm run db:test

# Validate schema
npm run db:validate

# Deploy migrations
npm run db:migrate:deploy

# Generate Prisma Client
npm run db:generate

# Build application
npm run build

# Test health endpoint (after starting server)
curl http://localhost:3000/api/health
```

## Environment Variables Template

```bash
# Production Environment Variables

# Database (Prisma Accelerate)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"
NEXTAUTH_URL="https://your-production-domain.com"

# Node Environment
NODE_ENV="production"
```

## Post-Deployment Verification

After deploying, verify everything works:

1. **Health Check**
   ```bash
   curl https://your-domain.com/api/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "message": "Good!",
     "database": "connected",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

2. **Database Connection**
   - Check application logs for any database errors
   - Verify queries are executing successfully
   - Monitor response times

3. **Authentication**
   - Test user sign-in/sign-up flows
   - Verify session persistence
   - Check NextAuth callbacks

4. **Data Operations**
   - Test creating records
   - Test reading records
   - Test updating records
   - Test deleting records

## Common Deployment Issues

### Issue: Database connection fails

**Symptoms:**
- Health check returns 503
- "Can't reach database server" error

**Solutions:**
1. Verify `DATABASE_URL` is correctly set
2. Check database server is running
3. Verify firewall/security group allows connections
4. Ensure SSL mode is correct (`sslmode=require`)
5. Check database credentials are correct

### Issue: Prisma Client not found

**Symptoms:**
- "Cannot find module '@prisma/client'" error
- Build fails with Prisma errors

**Solutions:**
1. Run `npm run db:generate`
2. Ensure `postinstall` script runs during deployment
3. Check Prisma version matches in `package.json`

### Issue: Migrations not applied

**Symptoms:**
- "Table does not exist" errors
- Schema mismatch errors

**Solutions:**
1. Run `npm run db:migrate:deploy`
2. Verify `DIRECT_URL` is set correctly
3. Check migration files exist in `prisma/migrations`
4. If no migrations, run `npm run db:push`

### Issue: Too many database connections

**Symptoms:**
- "Too many connections" error
- Slow query performance
- Connection timeouts

**Solutions:**
1. Use Prisma Accelerate for connection pooling
2. Add connection limits to `DATABASE_URL`
3. Implement proper connection cleanup
4. Monitor concurrent connections

## Platform-Specific Notes

### Vercel
- Automatic build and deployment
- Environment variables set in dashboard
- Prisma Accelerate highly recommended
- Serverless functions have connection limits

### Railway
- Automatic database provisioning available
- Can reference Railway database in env vars
- Build and start commands auto-detected

### Render
- Manual environment variable configuration
- Build command: `npm run build`
- Start command: `npm run start:unix`

### Docker
- Use multi-stage builds for smaller images
- Run migrations before starting application
- Use health checks in docker-compose

## Rollback Procedure

If deployment fails:

1. **Revert to previous version**
   ```bash
   git revert HEAD
   git push
   ```

2. **Rollback database** (if needed)
   - Restore from backup
   - Create and apply rollback migration

3. **Clear caches**
   - Clear CDN cache if applicable
   - Restart application servers

4. **Verify rollback**
   - Test health endpoint
   - Verify application functionality
   - Check error logs

## Maintenance Windows

Schedule regular maintenance for:

- Database backups verification
- Schema updates and migrations
- Dependency updates
- Security patches
- Performance optimization

## Support Contacts

- Database Provider: [Your DB provider support]
- Hosting Platform: [Your hosting support]
- Development Team: [Your team contact]

## Additional Resources

- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Database Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
