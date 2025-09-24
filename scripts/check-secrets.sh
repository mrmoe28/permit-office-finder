#!/bin/bash

# Secrets Check Script
# This script checks for potential secrets in staged files

echo "🔍 Checking for potential secrets..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Patterns to check for
SECRET_PATTERNS=(
    "pk_test_[a-zA-Z0-9_-]{50,}"
    "sk_test_[a-zA-Z0-9_-]{50,}"
    "AIzaSy[a-zA-Z0-9_-]{33}"
    "GOCSPX-[a-zA-Z0-9_-]{20,}"
    "postgresql://[^:]+:[^@]+@"
    "mongodb://[^:]+:[^@]+@"
    "mysql://[^:]+:[^@]+@"
    "redis://[^:]+:[^@]+@"
    "Bearer [a-zA-Z0-9_-]{50,}"
    "x-api-key: [a-zA-Z0-9_-]{20,}"
    "password.*=.*['\"][^'\"]{8,}['\"]"
    "secret.*=.*['\"][^'\"]{8,}['\"]"
    "token.*=.*['\"][^'\"]{20,}['\"]"
)

# Get staged files
STAGED_FILES=$(git diff --cached --name-only)

if [ -z "$STAGED_FILES" ]; then
    echo -e "${GREEN}✅ No staged files to check${NC}"
    exit 0
fi

echo -e "${BLUE}📁 Checking staged files:${NC}"
echo "$STAGED_FILES"

# Check each staged file
SECRETS_FOUND=0

for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        echo -e "${BLUE}🔍 Checking $file...${NC}"
        
        for pattern in "${SECRET_PATTERNS[@]}"; do
            if grep -qE "$pattern" "$file"; then
                echo -e "${RED}❌ Potential secret found in $file${NC}"
                echo -e "${YELLOW}   Pattern: $pattern${NC}"
                SECRETS_FOUND=1
            fi
        done
    fi
done

if [ $SECRETS_FOUND -eq 1 ]; then
    echo -e "${RED}🚨 SECRETS DETECTED!${NC}"
    echo -e "${YELLOW}💡 Please remove secrets from your files before committing${NC}"
    echo -e "${YELLOW}💡 Use .env files for local development${NC}"
    echo -e "${YELLOW}💡 Use placeholders in documentation${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No secrets detected${NC}"
    exit 0
fi
