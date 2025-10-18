# ⚡ Quick Deploy to Vercel - 5 Minutes

This is the fastest way to get your NeoFest application live on Vercel.

## 🎯 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fneofest)

## 🚀 Manual Quick Deploy (5 Steps)

### Step 1: Prepare Database (2 minutes)

**Option A: Neon (Recommended)**
1. Go to https://console.neon.tech
2. Click "Create Project"
3. Copy the connection string

**Option B: Supabase**
1. Go to https://app.supabase.com
2. New Project → Settings → Database
3. Copy connection pooling string

### Step 2: Import to Vercel (1 minute)

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select the repository

### Step 3: Add Environment Variables (1 minute)

In Vercel's configuration screen, add these variables:

```env
DATABASE_URL=postgresql://[your-db-connection-string]
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Quick NEXTAUTH_SECRET Generator:**
- Run: `openssl rand -base64 32`
- Or visit: https://generate-secret.vercel.app/32

### Step 4: Deploy (1 minute)

Click "Deploy" and wait 2-3 minutes.

### Step 5: Update NEXTAUTH_URL

After deployment:
1. Go to Settings → Environment Variables
2. Update `NEXTAUTH_URL` with your actual Vercel URL
3. Redeploy

## ✅ Done!

Your app is now live! 🎉

Visit your Vercel URL to see your application.

## 🔧 Next Steps

- [ ] Test authentication (sign up/sign in)
- [ ] Add custom domain (optional)
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring

## 📚 Need More Details?

See the full guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## ⚠️ Important Notes

1. **Socket.IO Limitation**: Vercel doesn't fully support WebSocket. Consider deploying Socket.IO separately to Railway/Render if you need real-time features.

2. **Database Migrations**: Run automatically during build via `prisma migrate deploy` in the build script.

3. **Environment Variables**: After changing any environment variable, you must redeploy for changes to take effect.

## 🆘 Troubleshooting

**Build fails?**
- Check that DATABASE_URL is correct
- Ensure NEXTAUTH_SECRET is set
- Review build logs in Vercel Dashboard

**Can't sign in?**
- Verify NEXTAUTH_URL matches your deployment URL
- Check that NEXTAUTH_SECRET is set

**Database errors?**
- Ensure database allows external connections
- Check SSL mode is enabled
- Verify connection string format

---

**Questions?** Check the detailed [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) guide.
