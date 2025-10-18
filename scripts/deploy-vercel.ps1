# Vercel Deployment Script for NeoFest (PowerShell)
# This script helps you deploy your application to Vercel

$ErrorActionPreference = "Stop"

Write-Host "🚀 NeoFest Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if .env.production exists
if (-not (Test-Path .env.production)) {
    Write-Host "⚠️  .env.production not found. Please create it from .env.production.example" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Would you like to copy .env.production.example to .env.production? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Copy-Item .env.production.example .env.production
        Write-Host "✅ Created .env.production from template" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env.production and add your actual values" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "📋 Pre-deployment Checklist" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please ensure you have:"
Write-Host "  ✅ A Vercel account"
Write-Host "  ✅ PostgreSQL database set up (Neon, Supabase, or Railway)"
Write-Host "  ✅ Environment variables ready"
Write-Host "  ✅ Code pushed to Git repository"
Write-Host ""

$continue = Read-Host "Continue with deployment? (y/n)"
if ($continue -ne 'y' -and $continue -ne 'Y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔐 Login to Vercel" -ForegroundColor Cyan
vercel login

Write-Host ""
Write-Host "🏗️  Building and deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Ask deployment type
Write-Host "Select deployment type:"
Write-Host "1) Production deployment"
Write-Host "2) Preview deployment"
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "🚀 Deploying to PRODUCTION..." -ForegroundColor Cyan
    vercel --prod
    
    Write-Host ""
    Write-Host "✅ Production deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Post-deployment tasks:" -ForegroundColor Cyan
    Write-Host "  1. Verify environment variables in Vercel Dashboard"
    Write-Host "  2. Run database migrations (if not automated)"
    Write-Host "  3. Test your application"
    Write-Host "  4. Configure custom domain (optional)"
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "🔍 Deploying to PREVIEW..." -ForegroundColor Cyan
    vercel
    
    Write-Host ""
    Write-Host "✅ Preview deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now test your changes on the preview URL"
} else {
    Write-Host "Invalid choice. Deployment cancelled." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🌐 Next steps:" -ForegroundColor Cyan
Write-Host "  • View your deployment: vercel ls"
Write-Host "  • View logs: vercel logs"
Write-Host "  • Add environment variables: vercel env add <NAME>"
Write-Host "  • Pull environment variables: vercel env pull"
Write-Host ""
Write-Host "Happy deploying! 🎉" -ForegroundColor Green
