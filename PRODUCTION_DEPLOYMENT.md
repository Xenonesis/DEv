# Production Deployment Guide

This guide ensures your NeoFest application database works correctly in production.

## Prerequisites

1. **PostgreSQL Database**: Ensure you have a PostgreSQL database set up (v12 or higher recommended)
2. **Prisma Accelerate** (Optional but recommended): For connection pooling and query acceleration
3. **Node.js**: v18 or higher

## Database Setup

### Option 1: Using Prisma Accelerate (Recommended for Production)

Prisma Accelerate provides connection pooling, query caching, and edge deployment support.

1. **Sign up for Prisma Accelerate**:
   - Go to [Prisma Data Platform](https://cloud.prisma.io/)
   - Create a new project
   - Get your Accelerate connection string

2. **Set Environment Variables**:
   ```bash
   DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
   DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```

3. **The `DATABASE_URL`** is used for queries (via Accelerate)
4. **The `DIRECT_URL`** is used for migrations and schema changes

### Option 2: Direct PostgreSQL Connection

If not using Prisma Accelerate:

```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require&connection_limit=10&pool_timeout=20"
DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### Connection String Parameters

For production, include these parameters in your `DATABASE_URL`:

- `sslmode=require`: Ensures SSL/TLS encryption
- `connection_limit=10`: Limits connections (adjust based on your plan)
- `pool_timeout=20`: Connection pool timeout in seconds
- `connect_timeout=10`: Connection timeout in seconds

## Environment Variables

Create a `.env` file (or configure in your deployment platform):

```bash
# Database
DATABASE_URL="your-database-url-here"
DIRECT_URL="your-direct-database-url-here"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"

# Node Environment
NODE_ENV="production"
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Run Migrations

For first-time deployment:
```bash
npx prisma migrate deploy
```

This will apply all pending migrations to your production database.

### 4. Build the Application

```bash
npm run build
```

This command will:
- Generate Prisma Client
- Deploy migrations
- Build Next.js application

### 5. Start the Application

**On Windows:**
```bash
npm run start
```

**On Linux/Mac:**
```bash
npm run start:unix
```

Or directly:
```bash
NODE_ENV=production tsx server.ts
```

## Health Check

After deployment, verify the database connection:

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

## Platform-Specific Deployment

### Vercel

1. Add environment variables in Vercel dashboard
2. Vercel will automatically run `npm run build`
3. Make sure to add:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

**Important for Vercel**: 
- Vercel uses serverless functions, so connection pooling is crucial
- Prisma Accelerate is highly recommended for Vercel deployments
- Add `postinstall` script (already included) to generate Prisma Client

### Railway

1. Add environment variables in Railway dashboard
2. Railway will automatically detect and run build scripts
3. Database URL can be referenced from Railway PostgreSQL service

**Railway-specific configuration**:
```bash
# If using Railway PostgreSQL service
DATABASE_URL=${{Postgres.DATABASE_URL}}
DIRECT_URL=${{Postgres.DATABASE_URL}}
```

### Render

1. Add environment variables in Render dashboard
2. Set build command: `npm run build`
3. Set start command: `npm run start:unix`

### Docker

Use the provided docker-compose setup or create a Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start:unix"]
```

## Database Migrations

### Creating a Migration

During development:
```bash
npm run db:migrate
```

### Deploying Migrations to Production

```bash
npm run db:migrate:deploy
```

Or directly:
```bash
npx prisma migrate deploy
```

### Rollback Strategy

If you need to rollback a migration:

1. Create a new migration that reverts the changes
2. Deploy the rollback migration
3. Never manually edit migration files

## Monitoring and Troubleshooting

### Check Database Connection

```bash
npx prisma db pull
```

### View Database in Browser

```bash
npm run db:studio
```

### Validate Schema

```bash
npm run db:validate
```

### Common Issues

#### Issue: "Can't reach database server"

**Solution**:
- Check if `DATABASE_URL` is correctly set
- Verify database server is running and accessible
- Check firewall/security group settings
- Ensure SSL mode is correct (`sslmode=require` for most cloud providers)

#### Issue: "Too many connections"

**Solution**:
- Use Prisma Accelerate for connection pooling
- Add connection limits to DATABASE_URL
- Reduce concurrent connections in your application

#### Issue: "Migration failed"

**Solution**:
- Check `DIRECT_URL` is correctly set
- Ensure you have write permissions on the database
- Run `npx prisma migrate resolve --rolled-back "MIGRATION_NAME"` if needed

#### Issue: "Prisma Client not generated"

**Solution**:
```bash
npx prisma generate
```

Add this to your deployment pipeline if not already included.

## Performance Optimization

### 1. Connection Pooling

Use Prisma Accelerate or add connection pooling parameters to your `DATABASE_URL`.

### 2. Query Optimization

- Use appropriate indexes in your schema
- Use `select` to fetch only needed fields
- Use `include` carefully to avoid N+1 queries

### 3. Logging

The production configuration logs only errors and warnings. Monitor these logs:

```bash
# View logs based on your deployment platform
vercel logs
# or
railway logs
# or
docker logs [container_id]
```

## Security Checklist

- [ ] Use SSL/TLS for database connections (`sslmode=require`)
- [ ] Set strong `NEXTAUTH_SECRET` (at least 32 characters)
- [ ] Don't commit `.env` file to version control
- [ ] Use environment variables for all secrets
- [ ] Limit database user permissions (don't use superuser)
- [ ] Enable database firewall rules
- [ ] Regular database backups
- [ ] Monitor database access logs

## Backup Strategy

### Automated Backups

Most cloud database providers offer automated backups. Enable them:

- **Render PostgreSQL**: Automatic daily backups
- **Railway PostgreSQL**: Automatic backups included
- **AWS RDS**: Configure automated backup retention
- **Heroku Postgres**: Enable continuous protection

### Manual Backup

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DIRECT_URL }}
          
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
```

## Support

For issues or questions:
- Check [Prisma Documentation](https://www.prisma.io/docs)
- Review application logs
- Test database connectivity with health check endpoint
- Verify environment variables are correctly set

## Quick Reference

```bash
# Development
npm run dev                  # Start development server
npm run db:migrate          # Create and apply migration
npm run db:studio           # Open Prisma Studio

# Production
npm run build               # Build application
npm run start               # Start production server (Windows)
npm run start:unix          # Start production server (Unix/Linux)
npm run db:migrate:deploy   # Deploy migrations
npm run db:generate         # Generate Prisma Client

# Maintenance
npm run db:validate         # Validate schema
npm run db:seed            # Seed database
```
