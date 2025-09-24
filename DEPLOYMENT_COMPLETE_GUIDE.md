# 🚀 Complete Deployment Guide - GitHub Actions + Vercel

This guide will walk you through setting up automatic deployments from GitHub to Vercel.

## 📋 Prerequisites Checklist

- [ ] GitHub repository: `mrmoe28/permit-office-finder`
- [ ] Vercel account (free tier available)
- [ ] Environment variables ready
- [ ] Domain name (optional)

## 🔧 Step 1: Vercel Project Setup

### 1.1 Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import from GitHub: `mrmoe28/permit-office-finder`
4. Configure project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 1.2 Environment Variables
Add these in Vercel Project Settings → Environment Variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy1tYWNhcXVlLTcyLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_KjJL421BMwk8Whfwgb7rXY0N6zknProULcrJRrzY2K

# Google Services
NEXT_PUBLIC_GOOGLE_CLIENT_ID=758522349328-uv1clg243i6l8l8tcpif9ni04do8as2s.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC1H255N22f9umdfigh4rHG1QJdnqm4UM4
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyC1H255N22f9umdfigh4rHG1QJdnqm4UM4
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=permit-office-finder
NEXT_PUBLIC_GOOGLE_CLOUD_STORAGE_BUCKET=permit-office-finder-storage

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

### 1.3 Git Integration
1. In Vercel project settings, go to **"Git"** tab
2. Ensure **"Automatic deployments"** is enabled
3. Set **Production Branch** to `main`
4. Enable **"Preview deployments"** for pull requests

## 🔄 Step 2: GitHub Actions Setup

### 2.1 Repository Secrets (Optional for Advanced Workflows)
If you want to use the advanced GitHub Actions workflow, add these secrets:

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### 2.2 Workflow Files
The repository already includes these workflow files:
- `.github/workflows/deploy.yml` - Full deployment with build
- `.github/workflows/vercel-deploy.yml` - Simple trigger
- `.github/workflows/webhook-deploy.yml` - Webhook-based deployment

## 🚀 Step 3: Test Deployment

### 3.1 Manual Test
1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```
3. Check Vercel dashboard for deployment status
4. Visit your deployed app

### 3.2 Check GitHub Actions
1. Go to GitHub repository → Actions tab
2. Verify workflows are running
3. Check for any errors in the logs

## 📊 Step 4: Monitor Deployments

### 4.1 Vercel Dashboard
- **Deployments**: View all deployment history
- **Analytics**: Monitor performance and usage
- **Functions**: Check serverless function logs
- **Domains**: Manage custom domains

### 4.2 GitHub Actions
- **Workflow Runs**: See all deployment attempts
- **Logs**: Detailed build and deployment logs
- **Status Checks**: Integration with branch protection

## 🔍 Step 5: Troubleshooting

### Common Issues

#### Deployment Fails
```bash
# Check Vercel logs
vercel logs

# Check build locally
cd frontend
npm run build
```

#### Environment Variables Not Working
- Verify variable names match exactly
- Check for typos in variable values
- Ensure variables are set for all environments (Production, Preview, Development)

#### GitHub Actions Fail
- Check Actions tab for error details
- Verify workflow file syntax
- Ensure repository secrets are set correctly

### Debug Commands
```bash
# Check deployment status
./scripts/check-deployment.sh

# Test build locally
cd frontend && npm run build

# Check Vercel CLI
vercel whoami
vercel ls
```

## 🎯 Step 6: Advanced Configuration

### 6.1 Custom Domain
1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate generation

### 6.2 Branch Protection
1. Go to GitHub repository → Settings → Branches
2. Add rule for `main` branch
3. Require status checks to pass
4. Require deployments to be successful

### 6.3 Preview Deployments
- Every PR automatically gets a preview URL
- Perfect for testing before merging
- Share preview URLs with team members

## 📱 Step 7: Production URLs

After successful deployment, your app will be available at:

- **Production**: `https://permit-office-finder.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (if configured)
- **Preview URLs**: Generated for each PR

## ✅ Final Checklist

- [ ] Vercel project created and connected to GitHub
- [ ] Environment variables configured in Vercel
- [ ] GitHub Actions workflows added to repository
- [ ] Test deployment triggered successfully
- [ ] Production URL accessible
- [ ] Preview deployments working for PRs
- [ ] Custom domain configured (optional)
- [ ] Branch protection rules set (optional)
- [ ] Team members have access to Vercel dashboard

## 🎉 Success!

Your automatic deployment pipeline is now fully configured! Every push to the `main` branch will automatically trigger a deployment to Vercel, and every pull request will get a preview deployment.

### Quick Commands
```bash
# Start development
./start-dev.sh

# Check deployment status
./scripts/check-deployment.sh

# Deploy manually (if needed)
cd frontend && vercel --prod
```

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

Your app is now live and automatically deploying! 🚀
