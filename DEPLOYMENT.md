# 🚀 Deployment Guide - Permit Office Finder

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] GitHub repository set up
- [ ] Vercel account
- [ ] Clerk account with API keys
- [ ] Google Cloud Console with API keys
- [ ] Neon database (or other PostgreSQL database)

## 🔧 Environment Variables

### Required for Vercel Deployment:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Services
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_key
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=your_project_id
NEXT_PUBLIC_GOOGLE_CLOUD_STORAGE_BUCKET=your_bucket_name

# Database (if using external database)
DATABASE_URL=postgresql://...

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

## 🌐 Vercel Deployment

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as the root directory

### Step 2: Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Step 3: Add Environment Variables
Add all the environment variables listed above in the Vercel dashboard.

### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

## 🔧 Local Development

### Start Both Servers:
```bash
# From project root
./start-dev.sh

# Or using npm
npm run dev
```

### Start Individual Servers:
```bash
# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run dev
```

## 📁 Project Structure

```
permit-office-finder/
├── frontend/                 # Next.js app (deployed to Vercel)
│   ├── src/app/             # App Router pages
│   ├── src/components/      # React components
│   ├── src/lib/            # Utilities and configs
│   └── package.json        # Frontend dependencies
├── backend/                 # Express API (separate deployment)
│   ├── src/                # Backend source code
│   ├── prisma/             # Database schema
│   └── package.json        # Backend dependencies
├── vercel.json             # Vercel configuration
├── start-dev.sh            # Development startup script
└── package.json            # Root package.json
```

## 🚨 Important Notes

1. **Frontend Only**: Vercel deployment is for the frontend only
2. **Backend Separate**: Backend needs separate deployment (Railway, Render, etc.)
3. **Environment Variables**: All sensitive keys must be set in Vercel dashboard
4. **Database**: Use external database (Neon, Supabase, etc.) for production

## 🔍 Troubleshooting

### Build Errors:
- Check that all environment variables are set
- Ensure all dependencies are in package.json
- Verify TypeScript compilation

### Runtime Errors:
- Check browser console for client-side errors
- Verify API endpoints are accessible
- Ensure Clerk authentication is properly configured

## 📞 Support

If you encounter issues:
1. Check the Vercel build logs
2. Verify environment variables
3. Test locally first with `./start-dev.sh`
4. Check the browser console for errors
