#!/bin/bash

# Setup script for Permit Office Finder database
# This script helps set up the database and seed it with real data

set -e

echo "🚀 Setting up Permit Office Finder database..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating from template..."
    echo "Please update the DATABASE_URL in backend/.env with your actual database credentials"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if npm run prisma:studio --dry-run 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Warning: Could not connect to database. Please check your DATABASE_URL in .env"
    echo "For PostgreSQL, make sure your database is running and accessible"
    echo "Example DATABASE_URL: postgresql://username:password@localhost:5432/permit_office_finder"
fi

# Run database migrations
echo "🗄️  Running database migrations..."
npm run prisma:dev

# Seed the database
echo "🌱 Seeding database with real permit office data..."
npm run seed

echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:3000 to use the application"
echo ""
echo "🔍 You can also view the database at http://localhost:5555 (Prisma Studio)"
echo "   Run: cd backend && npm run prisma:studio"