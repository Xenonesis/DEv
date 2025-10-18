# 🚀 Vercel Deployment Guide for NeoFest

This guide will walk you through deploying the NeoFest application to Vercel.

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

1. ✅ A [Vercel account](https://vercel.com/signup)
2. ✅ [Vercel CLI](https://vercel.com/cli) installed (optional but recommended)
3. ✅ A PostgreSQL database (recommended: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
4. ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## 🗄️ Step 1: Set Up PostgreSQL Database

### Option A: Using Neon (Recommended for Vercel)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string (starts with `postgresql://`)
4. For Prisma Accelerate (optional), sign up at [Prisma Data Platform](https://console.prisma.io)

### Option B: Using Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (enable "Display connection pooling")

### Option C: Using Railway

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add PostgreSQL database
4. Copy the connection string from Variables tab

## 🔐 Step 2: Prepare Environment Variables

Create a list of environment variables you'll need to set in Vercel:

### Required Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# For Prisma Accelerate (optional but recommended for better performance)
# DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
# DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="https://your-app.vercel.app"

# Node Environment
NODE_ENV="production"
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## 🚀 Step 3: Deploy to Vercel

### Method A: Deploy via Vercel Dashboard (Easiest)

1. **Go to [Vercel Dashboard](https://vercel.com/new)**

2. **Import your Git repository:**
   - Click "Import Project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure your project:**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add each variable from Step 2
   - Make sure to select "Production", "Preview", and "Development" as needed

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (3-5 minutes)

### Method B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from your project directory:**
```bash
# Navigate to your project
cd your-project-directory

# Deploy to production
vercel --prod
```

4. **Add environment variables via CLI:**
```bash
# Add each environment variable
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add NODE_ENV production

# Pull environment variables locally (optional)
vercel env pull .env.local
```

## 🔄 Step 4: Run Database Migrations

After your first deployment, you need to run Prisma migrations:

### Option A: Via Vercel CLI

```bash
# Set your DATABASE_URL locally
export DATABASE_URL="your-database-url"

# Run migrations
npx prisma migrate deploy

# Optional: Seed the database
npm run db:seed
```

### Option B: Via Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Click on "Settings" → "Functions"
3. Create a one-time serverless function or use the deployment hook

### Option C: Automated (Add to package.json)

The build script already includes migrations:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

This will automatically run migrations during deployment.

## ⚙️ Step 5: Configure Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Follow Vercel's DNS configuration instructions

## 🔍 Step 6: Verify Deployment

1. **Check deployment status:**
   - Go to your Vercel Dashboard
   - Click on your project
   - Check the "Deployments" tab

2. **Test your application:**
   - Visit your deployed URL
   - Test authentication (sign up/sign in)
   - Create a test event or hackathon
   - Check database connectivity

3. **Monitor logs:**
   - Go to "Deployments" → Select a deployment → "Functions"
   - Click on any function to see logs

## 🐛 Troubleshooting

### Build Fails with "Prisma Client not generated"

**Solution:** The build script includes `prisma generate`, but if it still fails:
```bash
# In your project, ensure postinstall script is in package.json
"postinstall": "prisma generate"
```

### Database Connection Issues

**Solution:** 
1. Verify your DATABASE_URL is correct
2. Ensure SSL mode is enabled for production databases
3. Check if your database allows connections from Vercel's IP ranges
4. For Neon/Supabase, use connection pooling URLs

### NextAuth Redirect Issues

**Solution:**
1. Verify `NEXTAUTH_URL` matches your deployment URL exactly
2. Update the URL after adding a custom domain
3. Check CORS settings if using a custom domain

### Socket.IO Not Working

**Note:** Vercel Serverless Functions don't support WebSocket connections persistently. 

**Solutions:**
1. **Use Vercel's Edge Functions** (limited WebSocket support)
2. **Use a separate WebSocket service:**
   - Deploy Socket.IO server to [Railway](https://railway.app)
   - Deploy Socket.IO server to [Render](https://render.com)
   - Use [Ably](https://ably.com) or [Pusher](https://pusher.com) as alternatives

3. **Update your Socket.IO configuration** in `src/lib/socket.ts`:
```typescript
// Point to external WebSocket server
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
  path: '/api/socketio'
});
```

### Environment Variables Not Loading

**Solution:**
1. Go to Settings → Environment Variables
2. Verify all variables are added
3. Make sure they're enabled for Production/Preview/Development
4. Redeploy after adding new variables

## 📊 Step 7: Set Up Monitoring (Optional)

### Add Vercel Analytics

1. Go to your project in Vercel Dashboard
2. Click "Analytics" in the sidebar
3. Enable Web Analytics

### Add Vercel Speed Insights

1. Install the package:
```bash
npm install @vercel/speed-insights
```

2. Add to your layout:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production:** Every push to your `main` or `master` branch
- **Preview:** Every push to other branches or pull requests

### Configure Deployment Settings

1. Go to Settings → Git
2. Configure:
   - Production Branch
   - Ignored Build Step (if needed)
   - Auto-deploy branches

## 🌍 Environment-Specific Deployments

### Preview Deployments

Every branch and PR gets a unique preview URL:
```
https://your-app-git-feature-branch-username.vercel.app
```

### Multiple Environments

Create separate projects for different environments:
- `neofest-dev` (development)
- `neofest-staging` (staging)
- `neofest` (production)

## 📱 Alternative: Deploy Socket.IO Separately

Since Vercel doesn't fully support WebSocket, consider this hybrid approach:

### 1. Deploy Next.js to Vercel (without Socket.IO)

Remove Socket.IO from the main app for Vercel deployment.

### 2. Deploy Socket.IO Server Separately

**Create a separate Socket.IO server** (e.g., `socketio-server/index.js`):
```javascript
const { Server } = require('socket.io');
const io = new Server(3001, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  // Your Socket.IO logic here
});

const port = process.env.PORT || 3001;
console.log(`Socket.IO server running on port ${port}`);
```

**Deploy to Railway/Render:**
- Push to a separate repository
- Deploy as a Node.js service
- Set `NEXT_PUBLIC_SOCKET_URL` in Vercel to point to this server

## 🎉 Success Checklist

- [ ] ✅ Application deployed to Vercel
- [ ] ✅ Database connected and migrations run
- [ ] ✅ Environment variables configured
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ Authentication working (sign up/sign in)
- [ ] ✅ Database operations working (CRUD)
- [ ] ✅ Images/assets loading correctly
- [ ] ✅ API routes responding
- [ ] ✅ No console errors in production
- [ ] ✅ SSL certificate active
- [ ] ✅ Analytics/monitoring set up (optional)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables on Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## 🆘 Need Help?

If you encounter issues:
1. Check [Vercel Status Page](https://www.vercel-status.com/)
2. Review deployment logs in Vercel Dashboard
3. Check [Vercel Community](https://github.com/vercel/vercel/discussions)
4. Contact Vercel Support (Pro/Enterprise plans)

---

**Ready to deploy? Let's go! 🚀**
