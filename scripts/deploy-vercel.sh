#!/bin/bash
# Vercel Deployment Script for NeoFest
# This script helps you deploy your application to Vercel

set -e

echo "🚀 NeoFest Vercel Deployment Helper"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Please create it from .env.production.example${NC}"
    echo ""
    read -p "Would you like to copy .env.production.example to .env.production? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.production.example .env.production
        echo -e "${GREEN}✅ Created .env.production from template${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env.production and add your actual values${NC}"
        exit 0
    fi
fi

echo "📋 Pre-deployment Checklist"
echo ""
echo "Please ensure you have:"
echo "  ✅ A Vercel account"
echo "  ✅ PostgreSQL database set up (Neon, Supabase, or Railway)"
echo "  ✅ Environment variables ready"
echo "  ✅ Code pushed to Git repository"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔐 Login to Vercel"
vercel login

echo ""
echo "🏗️  Building and deploying to Vercel..."
echo ""

# Ask deployment type
echo "Select deployment type:"
echo "1) Production deployment"
echo "2) Preview deployment"
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🚀 Deploying to PRODUCTION..."
    vercel --prod
    
    echo ""
    echo -e "${GREEN}✅ Production deployment complete!${NC}"
    echo ""
    echo "📝 Post-deployment tasks:"
    echo "  1. Verify environment variables in Vercel Dashboard"
    echo "  2. Run database migrations (if not automated)"
    echo "  3. Test your application"
    echo "  4. Configure custom domain (optional)"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "🔍 Deploying to PREVIEW..."
    vercel
    
    echo ""
    echo -e "${GREEN}✅ Preview deployment complete!${NC}"
    echo ""
    echo "You can now test your changes on the preview URL"
else
    echo -e "${RED}Invalid choice. Deployment cancelled.${NC}"
    exit 1
fi

echo ""
echo "🌐 Next steps:"
echo "  • View your deployment: vercel ls"
echo "  • View logs: vercel logs"
echo "  • Add environment variables: vercel env add <NAME>"
echo "  • Pull environment variables: vercel env pull"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"
