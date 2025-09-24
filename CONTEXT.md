# Permit Office Finder - Project Context

## 🎯 Project Overview
A comprehensive web application for finding and managing permit office information across different locations. Users can search for permit offices, get directions, view office details, and manage their permit applications.

## 📁 Current Project Structure
```
permit-office-finder/
├── frontend/          # Next.js 15 with React 19
├── backend/           # Express + TypeScript + Prisma
├── shared/            # Shared utilities and types
├── docs/              # Documentation
├── scripts/           # Build and deployment scripts
├── DATABASE_SCHEMA.md # Database structure documentation
├── README.md          # Project overview
├── SETUP.md          # Setup instructions
└── CONTEXT.md        # This file - project state tracker
```

## 🏗️ Current State

### ✅ Completed Setup
- [x] Frontend: Next.js 15 with TypeScript, Tailwind CSS, ESLint
- [x] Backend: Express server with TypeScript
- [x] Database: Prisma ORM initialized (PostgreSQL)
- [x] Environment: Configuration files created
- [x] Dependencies: All packages installed
- [x] Git: Repository initialized

### 📦 Installed Technologies

#### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + ShadCN UI
- **State Management**: Zustand
- **Forms**: react-hook-form
- **Maps**: Mapbox GL + React Map GL
- **HTTP Client**: Axios
- **Data Fetching**: @tanstack/react-query
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx, tailwind-merge

#### Backend Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **Database ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator
- **Email**: Nodemailer (SendGrid ready)
- **Logging**: Morgan
- **Environment**: dotenv

## 🎯 Immediate Next Steps

### Phase 1: Database Schema (Priority)
1. Design Prisma schema for:
   - Permit offices
   - Users
   - Applications
   - Documents
   - Reviews/Ratings
2. Run migrations
3. Seed initial data

### Phase 2: Core API Development
1. Authentication endpoints (register, login, logout)
2. Permit office CRUD operations
3. Search and filtering endpoints
4. Geocoding integration

### Phase 3: Frontend Development
1. Layout and navigation components
2. Search interface with map
3. Office details pages
4. User authentication flow
5. Application tracking system

## 🔧 Development Commands

### Frontend
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
```

### Backend
```bash
cd backend
npm run dev        # Start with nodemon
npm run build      # Compile TypeScript
npm run start      # Production server
```

## 🔐 Environment Variables Status
- ⚠️ Frontend: `.env.local` created - needs API keys
- ⚠️ Backend: `.env` created - needs database URL and service keys

## 📊 Database Status
- ✅ Prisma initialized
- ⏳ Schema needs to be defined
- ⏳ Migrations pending
- ⏳ Database connection not configured

## 🐛 Known Issues
- None currently

## 💡 Architecture Decisions
1. **Monorepo Structure**: Separate frontend/backend for clear separation
2. **TypeScript**: Full type safety across the stack
3. **Prisma**: Type-safe database access with migrations
4. **App Router**: Using Next.js 15's latest routing system
5. **ShadCN UI**: Component library for consistent UI

## 📝 Notes for Development
- All API endpoints should be versioned (e.g., `/api/v1/`)
- Use JWT for authentication with refresh tokens
- Implement proper error handling and logging
- Follow RESTful conventions for API design
- Use TypeScript strict mode

## 🚀 Deployment Targets
- **Frontend**: Vercel (recommended)
- **Backend**: Railway/Render/Fly.io
- **Database**: Neon/Supabase/Railway PostgreSQL
- **File Storage**: AWS S3 or Cloudinary

## 📅 Last Updated
- Date: September 24, 2025
- Status: Initial setup completed, ready for development
- Next Action: Define database schema and start API development