# 🔄 GitHub Actions CI/CD Setup for Vercel

This guide explains how to set up automated deployments to Vercel using GitHub Actions.

## 🎯 What This Does

- ✅ Automatically deploys to Vercel on every push to `main`/`master`
- ✅ Creates preview deployments for every Pull Request
- ✅ Comments on PRs with the preview URL
- ✅ Runs tests before deployment (optional)
- ✅ Zero manual deployment needed

## 🔐 Step 1: Get Vercel Tokens

### 1.1 Get Vercel Access Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it: `GitHub Actions Token`
4. Copy the token (you'll only see it once!)

### 1.2 Get Vercel Project IDs

Run these commands in your project directory:

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get the IDs
cat .vercel/project.json
```

You'll see something like:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

## 🔒 Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these three secrets:

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel access token | From Step 1.1 |
| `VERCEL_ORG_ID` | Your organization ID | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your project ID | From `.vercel/project.json` |

### Adding Each Secret

**VERCEL_TOKEN:**
- Name: `VERCEL_TOKEN`
- Secret: `[paste your token from step 1.1]`
- Click "Add secret"

**VERCEL_ORG_ID:**
- Name: `VERCEL_ORG_ID`
- Secret: `team_xxxxxxxxxxxxx` (from project.json)
- Click "Add secret"

**VERCEL_PROJECT_ID:**
- Name: `VERCEL_PROJECT_ID`
- Secret: `prj_xxxxxxxxxxxxx` (from project.json)
- Click "Add secret"

## 📝 Step 3: Verify GitHub Actions Workflow

The workflow file is already created at:
```
.github/workflows/vercel-deploy.yml
```

### Workflow Features

```yaml
# Triggers on:
- Push to main/master → Production deployment
- Pull requests → Preview deployment
- Manual trigger → On-demand deployment
```

## 🚀 Step 4: Test the Setup

### Method A: Push to Main

```bash
git add .
git commit -m "Test Vercel deployment"
git push origin main
```

Then:
1. Go to your repository → **Actions** tab
2. You should see a workflow running
3. Wait for it to complete
4. Check your Vercel dashboard for the deployment

### Method B: Create a Pull Request

```bash
# Create a new branch
git checkout -b test-deployment

# Make a small change
echo "# Test" >> TEST.md

# Commit and push
git add .
git commit -m "Test PR deployment"
git push origin test-deployment

# Create PR on GitHub
```

Then:
1. Create a Pull Request on GitHub
2. Watch the Actions tab
3. The bot will comment on your PR with the preview URL

## ✅ Step 5: Verify Everything Works

Check that:
- [ ] Workflow runs without errors
- [ ] Deployment appears in Vercel dashboard
- [ ] Application is accessible at the Vercel URL
- [ ] PR comments show preview URLs
- [ ] Environment variables are loaded correctly

## 🔧 Customization Options

### Add Environment Variables

Add this to the workflow before the build step:

```yaml
- name: Set Environment Variables
  run: |
    echo "NEXT_PUBLIC_API_URL=${{ secrets.API_URL }}" >> $GITHUB_ENV
```

### Add Testing Step

Add this before deployment:

```yaml
- name: Run Tests
  run: npm test

- name: Run Linter
  run: npm run lint
```

### Add Database Migration

Add this to run migrations:

```yaml
- name: Run Database Migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npx prisma migrate deploy
```

### Add Slack Notifications

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎨 Enhanced Workflow with Tests

Create `.github/workflows/vercel-deploy-advanced.yml`:

```yaml
name: Vercel Deployment (Advanced)

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      # ... deployment steps from vercel-deploy.yml
```

## 📊 Monitoring Deployments

### GitHub Actions Dashboard

- Go to repository → **Actions** tab
- View all workflows and their status
- Click on a workflow to see detailed logs

### Vercel Dashboard

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Select your project
- View all deployments
- Check logs and analytics

## 🐛 Troubleshooting

### Workflow Fails: "No such secret"

**Solution:** Double-check that all three secrets are added:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Workflow Fails: "Build failed"

**Solution:** 
1. Check the build logs in Actions tab
2. Ensure environment variables are set in Vercel
3. Try building locally: `npm run build`

### Workflow Fails: "Permission denied"

**Solution:** 
1. Regenerate the Vercel token
2. Make sure the token has correct permissions
3. Update the `VERCEL_TOKEN` secret

### Preview Deployment Not Commenting

**Solution:**
1. Go to Settings → Actions → General
2. Workflow permissions → Select "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"

### Environment Variables Not Loading

**Solution:**
1. Add environment variables in Vercel Dashboard
2. Make sure they're enabled for "Preview" deployments
3. Redeploy after adding variables

## 🔐 Security Best Practices

1. **Never commit secrets** to the repository
2. **Rotate tokens regularly** (every 90 days)
3. **Use separate tokens** for different environments
4. **Limit token permissions** to what's needed
5. **Monitor token usage** in Vercel dashboard

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Git Integration](https://vercel.com/docs/git)
- [GitHub Actions with Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)

## 🎉 Success!

You now have:
- ✅ Automated production deployments
- ✅ Preview deployments for PRs
- ✅ CI/CD pipeline set up
- ✅ Zero manual deployment needed

Every push to main will now automatically deploy to production! 🚀

---

**Questions?** Check the [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
