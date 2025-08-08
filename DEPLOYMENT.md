# 🚀 Deployment Guide

This guide will help you deploy GOMFLOW MVP to Vercel with automatic deployments from GitHub.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Vercel CLI** (optional): `npm i -g vercel`

## 🔧 Setup Vercel Deployment

### Option 1: Automatic Setup (Recommended)

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

2. **Configure Environment Variables** (if needed):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy**: Vercel will automatically deploy on every push to `main`

### Option 2: Manual Setup

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy manually**:
   ```bash
   npm run deploy
   ```

## 🔄 Automatic Deployments

### GitHub Actions Workflow

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

- Runs on every push to `main`
- Runs linting and type checking
- Builds the application
- Deploys to Vercel

### Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## 📦 Deployment Commands

```bash
# Deploy to production
npm run deploy

# Deploy directly with Vercel CLI
npm run deploy:vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🌐 Environment Variables

Set these in your Vercel project settings:

```bash
# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🔍 Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (`npm run lint && npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] All environment variables are set
- [ ] Code is committed to `main` branch

## 🚨 Troubleshooting

### Build Failures

1. **Check logs**: View build logs in Vercel dashboard
2. **Local testing**: Run `npm run build` locally
3. **Dependencies**: Ensure all dependencies are in `package.json`

### Environment Variables

1. **Check Vercel settings**: Ensure all env vars are set
2. **Restart deployment**: Sometimes needed after env var changes

### Performance Issues

1. **Check bundle size**: Use `npm run build` to see bundle analysis
2. **Optimize images**: Use Next.js Image component
3. **Enable caching**: Vercel automatically caches static assets

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error tracking**: Check Vercel function logs
- **Uptime**: Monitor in Vercel dashboard

## 🔄 Rollback

If deployment fails:

1. **Automatic rollback**: Vercel keeps previous successful deployment
2. **Manual rollback**: Use Vercel dashboard to revert
3. **Fix and redeploy**: Push fixes to trigger new deployment

## 📝 Best Practices

1. **Always test locally first**
2. **Use feature branches for major changes**
3. **Monitor deployment logs**
4. **Set up proper environment variables**
5. **Use semantic commit messages**

## 🆘 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Report deployment issues in the repository
- **Vercel Support**: Available in Vercel dashboard

---

**Happy Deploying! 🚀**
