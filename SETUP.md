# 🚀 Quick Setup Guide - Permit Office Finder

## **Prerequisites**
Before starting, ensure you have these installed on your system:

```bash
# Check if you have these installed:
node --version    # Should be v18+ 
npm --version     # Should be v8+
git --version     # Any recent version
docker --version  # Optional but recommended
```

---

## **🏃‍♂️ Quick Start (5 minutes)**

### **1. Clone and Setup**
```bash
# Create project directory
mkdir permit-office-finder
cd permit-office-finder

# Initialize git repository
git init

# Create basic structure
mkdir frontend backend shared docs scripts
```

### **2. Frontend Setup (Next.js + React)**
```bash
cd frontend

# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional frontend dependencies
npm install @tanstack/react-query @hookform/react-hook-form framer-motion
npm install lucide-react zustand react-map-gl mapbox-gl
npm install @react-pdf/renderer html2canvas jspdf
npm install axios date-fns clsx tailwind-merge

# Install development dependencies
npm install -D @types/mapbox-gl @types/node
```

### **3. Backend Setup (Express + TypeScript)**
```bash
cd ../backend

# Initialize Node.js project
npm init -y

# Install production dependencies
npm install express cors helmet morgan compression
npm install @prisma/client prisma bcryptjs jsonwebtoken
npm install nodemailer twilio aws-sdk
npm install redis bull winston dotenv
npm install express-rate-limit express-validator

# Install development dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D @types/nodemailer nodemon ts-node
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Create TypeScript config
npx tsc --init
```

### **4. Database Setup (PostgreSQL + Prisma)**
```bash
# Still in backend directory

# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file with DATABASE_URL
```

---

## **📦 Complete Installation Script**

Create this script to automate the entire setup:

```bash
#!/bin/bash
# setup.sh - Complete project setup script

echo "🚀 Setting up Permit Office Finder..."

# Create project structure
mkdir -p permit-office-finder/{frontend,backend,shared,docs,scripts}
cd permit-office-finder

# Initialize git
git init
echo "node_modules/
.env*
.DS_Store
*.log
dist/
build/" > .gitignore

echo "📦 Setting up Frontend (Next.js)..."
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

# Frontend dependencies
npm install @tanstack/react-query @hookform/react-hook-form framer-motion lucide-react zustand
npm install react-map-gl mapbox-gl @react-pdf/renderer html2canvas jspdf
npm install axios date-fns clsx tailwind-merge
npm install -D @types/mapbox-gl

echo "🔧 Setting up Backend (Express)..."
cd ../backend
npm init -y

# Backend dependencies  
npm install express cors helmet morgan compression
npm install @prisma/client prisma bcryptjs jsonwebtoken
npm install nodemailer twilio aws-sdk redis bull winston dotenv
npm install express-rate-limit express-validator

# Backend dev dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer
npm install -D nodemon ts-node eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Initialize TypeScript and Prisma
npx tsc --init
npx prisma init

echo "✅ Setup complete! Next steps:"
echo "1. Configure your .env files"
echo "2. Set up your database"
echo "3. Run 'npm run dev' in both frontend and backend"

cd ..
echo "📁 Project created in: $(pwd)"
```

---

## **🔧 Environment Variables**

### **Frontend (.env.local)**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Map Services
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_key

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

### **Backend (.env)**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/permit_finder"

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@permitfinder.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=permit-finder-documents
AWS_REGION=us-east-1

# Map Services
MAPBOX_ACCESS_TOKEN=your_mapbox_token
GOOGLE_PLACES_API_KEY=your_google_places_key

# App Configuration
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

---

## **🐳 Docker Setup (Optional)**

Create `docker-compose.yml` in root directory:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: permit-finder-db
    environment:
      POSTGRES_DB: permit_finder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis for caching
  redis:
    image: redis:7-alpine
    container_name: permit-finder-redis
    ports:
      - "6379:6379"

  # Backend API
  backend:
    build: ./backend
    container_name: permit-finder-api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/permit_finder
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  # Frontend
  frontend:
    build: ./frontend
    container_name: permit-finder-web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
```

### **Run with Docker:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## **📋 Development Commands**

### **Frontend Commands:**
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### **Backend Commands:**
```bash
cd backend
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run prisma:dev   # Run database migrations
npm run prisma:generate  # Generate Prisma client
npm run seed         # Seed database with initial data
```

---

## **🚀 Next Steps After Setup**

1. **Configure APIs:**
   - Get Mapbox API key for maps
   - Set up Google Places API for geocoding
   - Configure SendGrid for emails
   - Set up Twilio for SMS (optional)

2. **Database Setup:**
   - Create PostgreSQL database
   - Run Prisma migrations
   - Seed with initial permit office data

3. **Development:**
   - Start both frontend and backend servers
   - Test the basic search functionality
   - Add your local permit office data

4. **Deployment:**
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to Railway/Render
   - Set up production database
   - Configure environment variables

---

## **💡 Pro Tips**

- Use the `setup.sh` script to automate the initial setup
- Start with local development using Docker Compose
- Use Prisma Studio to manage database data visually
- Set up GitHub Actions for automated testing and deployment
- Consider using a monorepo tool like Turborepo for larger scale

---

**Total Setup Time: ~15-30 minutes** ⏱️

This will give you a fully functional development environment ready for building the Permit Office Finder application!