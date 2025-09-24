# 🚀 GitHub Actions + Vercel Setup Guide

This guide will help you set up automatic deployments to Vercel whenever you push changes to GitHub.

## 📋 Prerequisites

- [ ] GitHub repository connected to Vercel
- [ ] Vercel project created and configured
- [ ] Environment variables set in Vercel dashboard

## 🔧 Step 1: Connect Vercel to GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `mrmoe28/permit-office-finder`
4. Set **Root Directory** to `frontend`
5. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

## 🔑 Step 2: Set Up Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy1tYWNhcXVlLTcyLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_KjJL421BMwk8Whfwgb7rXY0N6zknProULcrJRrzY2K

# Google Services
NEXT_PUBLIC_GOOGLE_CLIENT_ID=758522349328-uv1clg243i6l8l8tcpif9ni04do8as2s.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC1H255N22f9umdfigh4rHG1QJdnqm4UM4
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyC1H255N22f9umdfigh4rHG1QJdnqm4UM4
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=permit-office-finder
NEXT_PUBLIC_GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

## 🔄 Step 3: Enable Automatic Deployments

Vercel automatically deploys when you push to GitHub, but let's ensure it's properly configured:

1. In Vercel dashboard, go to your project settings
2. Go to "Git" tab
3. Ensure "Automatic deployments" is enabled
4. Set production branch to `main`

## 📝 Step 4: GitHub Actions Workflow

The repository now includes two GitHub Actions workflows:

### 1. `deploy.yml` - Full Deployment Workflow
- Installs dependencies
- Builds the application
- Deploys to Vercel
- Comments on PRs with deployment URLs

### 2. `vercel-deploy.yml` - Simple Trigger Workflow
- Lightweight workflow that triggers Vercel's built-in deployment
- Provides deployment status notifications

## 🚀 Step 5: Test the Setup

1. Make a small change to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```
3. Check Vercel dashboard for deployment status
4. Check GitHub Actions tab for workflow runs

## 🔍 Troubleshooting

### Deployment Fails
- Check Vercel dashboard for error logs
- Verify all environment variables are set
- Ensure build command is correct

### GitHub Actions Fail
- Check Actions tab in GitHub repository
- Verify workflow files are in `.github/workflows/`
- Check for syntax errors in YAML files

### Environment Variables Not Working
- Verify variables are set in Vercel dashboard
- Check variable names match exactly
- Ensure no extra spaces or quotes

## 📊 Monitoring Deployments

### Vercel Dashboard
- View deployment history
- Check build logs
- Monitor performance

### GitHub Actions
- View workflow runs
- Check build status
- See deployment notifications

## 🔧 Advanced Configuration

### Custom Domain
1. Go to Vercel project settings
2. Add your custom domain
3. Update DNS records as instructed

### Preview Deployments
- Every PR automatically gets a preview deployment
- Preview URLs are available in PR comments
- Perfect for testing before merging

### Branch Protection
- Set up branch protection rules in GitHub
- Require status checks to pass before merging
- Ensure deployments are successful

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review GitHub Actions workflow runs
3. Verify environment variables
4. Check the [Vercel documentation](https://vercel.com/docs)
5. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)

## ✅ Checklist

- [ ] Vercel project created and connected to GitHub
- [ ] Environment variables set in Vercel
- [ ] GitHub Actions workflows added
- [ ] Test deployment triggered
- [ ] Deployment successful
- [ ] Custom domain configured (optional)
- [ ] Branch protection rules set (optional)

Your automatic deployment pipeline is now ready! 🎉
