#!/bin/bash

# Deployment Status Checker
# This script checks the status of your Vercel deployment

echo "🔍 Checking deployment status..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please run 'vercel login' first.${NC}"
    exit 1
fi

echo -e "${BLUE}📊 Checking deployment status...${NC}"

# Get latest deployment info
cd frontend
LATEST_DEPLOYMENT=$(vercel ls --json | jq -r '.[0] | select(.state == "READY" or .state == "BUILDING") | .url')

if [ -z "$LATEST_DEPLOYMENT" ]; then
    echo -e "${RED}❌ No recent deployments found${NC}"
    echo -e "${YELLOW}💡 Try running: vercel --prod${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Latest deployment: $LATEST_DEPLOYMENT${NC}"

# Check if deployment is accessible
echo -e "${BLUE}🌐 Testing deployment accessibility...${NC}"
if curl -s --head "$LATEST_DEPLOYMENT" | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Deployment is accessible and responding${NC}"
else
    echo -e "${RED}❌ Deployment is not accessible${NC}"
fi

# Show deployment details
echo -e "${BLUE}📋 Deployment Details:${NC}"
vercel ls --json | jq -r '.[0] | "URL: \(.url)\nState: \(.state)\nCreated: \(.created)\nGit: \(.git)"'

echo -e "${GREEN}🎉 Deployment check completed!${NC}"
