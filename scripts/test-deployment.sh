#!/bin/bash

# Deployment Test Script
# This script tests the deployment pipeline

echo "🧪 Testing deployment pipeline..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Check if we're in the right directory
echo -e "${BLUE}📁 Checking directory structure...${NC}"
if [ -d "frontend" ] && [ -d "backend" ] && [ -d ".github" ]; then
    echo -e "${GREEN}✅ Directory structure is correct${NC}"
else
    echo -e "${RED}❌ Directory structure is incorrect${NC}"
    exit 1
fi

# Test 2: Check if GitHub Actions workflows exist
echo -e "${BLUE}🔧 Checking GitHub Actions workflows...${NC}"
if [ -f ".github/workflows/deploy.yml" ] && [ -f ".github/workflows/vercel-deploy.yml" ]; then
    echo -e "${GREEN}✅ GitHub Actions workflows found${NC}"
else
    echo -e "${RED}❌ GitHub Actions workflows missing${NC}"
    exit 1
fi

# Test 3: Check if Vercel config exists
echo -e "${BLUE}⚙️  Checking Vercel configuration...${NC}"
if [ -f "frontend/vercel.json" ]; then
    echo -e "${GREEN}✅ Vercel configuration found${NC}"
else
    echo -e "${RED}❌ Vercel configuration missing${NC}"
    exit 1
fi

# Test 4: Test frontend build
echo -e "${BLUE}🏗️  Testing frontend build...${NC}"
cd frontend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    echo -e "${YELLOW}💡 Run 'cd frontend && npm run build' to see errors${NC}"
    exit 1
fi
cd ..

# Test 5: Check if git is configured
echo -e "${BLUE}📝 Checking git configuration...${NC}"
if git remote -v | grep -q "github.com"; then
    echo -e "${GREEN}✅ Git remote configured${NC}"
else
    echo -e "${RED}❌ Git remote not configured${NC}"
    exit 1
fi

# Test 6: Check if we can push to GitHub
echo -e "${BLUE}🚀 Testing git push capability...${NC}"
if git push --dry-run origin main > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git push capability confirmed${NC}"
else
    echo -e "${RED}❌ Git push capability failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All deployment tests passed!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "   1. Set up Vercel project: https://vercel.com/dashboard"
echo -e "   2. Configure environment variables in Vercel"
echo -e "   3. Push changes to trigger deployment:"
echo -e "      ${YELLOW}git add . && git commit -m 'test deployment' && git push origin main${NC}"
echo -e "   4. Check deployment status in Vercel dashboard"
echo -e "   5. Visit your deployed app!"

echo -e "${GREEN}🚀 Deployment pipeline is ready!${NC}"
