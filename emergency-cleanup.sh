#!/bin/bash

echo "🚨 EMERGENCY CLEANUP - Permit Office Finder"
echo "=============================================="

echo "1. Killing all project-related processes..."
pkill -f "Permit Office Finder" 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "nodemon" 2>/dev/null

echo "2. Cleaning caches and temporary files..."
cd "$(dirname "$0")"
rm -rf frontend/.next 2>/dev/null
rm -rf backend/dist 2>/dev/null
rm -rf frontend/node_modules/.cache 2>/dev/null
rm -rf backend/node_modules/.cache 2>/dev/null

echo "3. Regenerating Prisma client..."
cd backend && npm run prisma:generate

echo "4. Checking for remaining processes..."
REMAINING=$(ps aux | grep -E "(npm run dev|nodemon|next dev)" | grep -v grep | wc -l)
if [ $REMAINING -gt 0 ]; then
    echo "⚠️  Warning: $REMAINING development processes still running"
    ps aux | grep -E "(npm run dev|nodemon|next dev)" | grep -v grep
else
    echo "✅ All development processes cleaned up"
fi

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Restart Cursor completely (Quit and reopen)"
echo "2. Start ONLY ONE server:"
echo "   cd frontend && npm run dev   (for frontend work)"
echo "   OR"
echo "   cd backend && npm run dev    (for backend work)"
echo ""
echo "⚠️  DO NOT start multiple servers at once!"
echo "⚠️  Check processes first: ps aux | grep dev"