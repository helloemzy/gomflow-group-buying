#!/bin/bash

# Deploy script for GOMFLOW MVP
echo "🚀 Deploying GOMFLOW MVP to Vercel..."

# Check if we're on main branch
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Error: Must be on main branch to deploy"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: There are uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Run tests and checks
echo "🔍 Running checks..."
npm run lint
npx tsc --noEmit

# Build the application
echo "🏗️ Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at: https://gomflow-mvp.vercel.app"
