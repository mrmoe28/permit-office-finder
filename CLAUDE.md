# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Permit Office Finder** is a full-stack web application that helps contractors and property owners find building permit offices by location, track permit applications, and manage the permit process. Built with Next.js 15, Express.js, PostgreSQL (Neon), and Clerk Authentication.

## Architecture

This is a **monorepo** with two main applications:
- `frontend/` - Next.js 15 React application with App Router
- `backend/` - Express.js TypeScript API server

### Key Technology Decisions
- **Authentication**: Clerk for user management with custom middleware for database sync
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS 4, ShadCN components
- **Backend**: Express.js with TypeScript, Clerk integration, comprehensive API routes
- **Maps**: Mapbox GL integration for location services

## CRITICAL: Development Server Management

### **SINGLE SERVER RULE (MANDATORY)**
- **NEVER run multiple instances of the same development server**
- **ONLY ONE `npm run dev` command per project directory at a time**
- **ALWAYS check for existing processes before starting servers**

### Process Management Commands
```bash
# Check for existing processes FIRST
ps aux | grep -E "(npm run dev|nodemon|next dev)" | grep -v grep

# Kill existing processes if found
pkill -f "next dev"
pkill -f "nodemon"

# Check port usage
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill specific processes by PID if needed
kill -9 [PID]
```

## Common Development Commands

### Backend (`/backend`)
```bash
# BEFORE starting - check for existing processes
ps aux | grep nodemon | grep -v grep

# Development (ONLY start if no existing process)
npm run dev                  # Start dev server with nodemon and ts-node
npm run build               # Compile TypeScript to dist/
npm run start               # Run compiled production server

# Database
npm run prisma:generate     # Generate Prisma client after schema changes
npm run prisma:dev         # Run database migrations (development)
npm run seed               # Seed database with initial data

# Quality
npm run lint               # ESLint with auto-fix
```

### Frontend (`/frontend`)
```bash
# BEFORE starting - check for existing processes
ps aux | grep "next dev" | grep -v grep

# Development (ONLY start if no existing process)
npm run dev                # Start Next.js development server
npm run build              # Build for production
npm run start              # Start production server

# Quality
npm run lint               # ESLint for Next.js
```

### Database Workflow
Always run after Prisma schema changes:
1. `npm run prisma:generate` (in backend/)
2. `npm run prisma:dev` (creates migration)
3. **Kill and restart development servers (one at a time)**

## Authentication Architecture

The app uses **Clerk** for authentication with a custom middleware pattern:

### Middleware Chain
- `requireAuth` - Clerk's built-in auth requirement
- `syncUser` - Custom middleware that syncs Clerk user data to local database
- `authenticate` - Combined middleware for protected routes
- `optionalAuth` - For routes that work with or without authentication

### User Sync Process
1. Clerk validates JWT token
2. `syncUser` middleware checks if user exists in local database
3. If not exists, fetches user data from Clerk API and creates database record
4. Attaches `userId` and `user` to Express Request object

### Route Protection Patterns
```typescript
// Protected route
router.post('/applications', authenticate, handler);

// Optional auth (public with enhanced features when authenticated)
router.get('/permit-offices', optionalAuth, handler);

// Webhook (special verification)
router.post('/webhooks/clerk', verifyClerkWebhook, handler);
```

## Database Schema Patterns

### Core Models
- **User** - Clerk integration with `clerkId` field for mapping
- **PermitOffice** - Government offices that issue permits
- **Application** - User permit applications with status tracking
- **Review** - User reviews of permit offices with unique constraint
- **Document** - File attachments for applications

### Key Relationships
- Users can have multiple Applications and Reviews
- PermitOffices have multiple Applications and Reviews
- Applications have multiple Documents
- Reviews have unique constraint per user-office pair

### Status Patterns
- Applications use enum: `DRAFT | SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED | COMPLETED`
- All models include `createdAt` and `updatedAt` timestamps

## API Route Patterns

### Route Organization
- `/api/users/*` - User management and dashboard data
- `/api/permit-offices/*` - Office search and details
- `/api/applications/*` - Permit application CRUD
- `/api/reviews/*` - Office review system
- `/api/webhooks/*` - Clerk webhook handlers

### Authentication Patterns
- **Public routes**: Permit office search and details
- **Protected routes**: User dashboard, applications, reviews
- **Webhook routes**: Special Clerk signature verification

### Error Handling Pattern
All routes follow consistent error responses:
```typescript
try {
  // Route logic
  res.json(data);
} catch (error) {
  console.error('Route error:', error);
  res.status(500).json({ error: 'Descriptive message' });
}
```

## Frontend Architecture

### App Router Structure
- Uses Next.js App Router with TypeScript
- React 19 with modern patterns (Server Components default)
- Tailwind CSS 4 with ShadCN component library

### State Management
- **React Query/TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form state with Zod validation

### Key Dependencies
- **Mapbox GL** - Interactive maps and geocoding
- **Framer Motion** - Animations
- **Lucide React** - Icon system
- **Class Variance Authority** - Component variant styling

## Production Configuration

### Environment Variables Required

**Backend (.env)**
```
DATABASE_URL=postgresql://...           # Neon PostgreSQL connection
CLERK_SECRET_KEY=sk_live_...           # Clerk backend key
CLERK_WEBHOOK_SECRET=whsec_...         # Webhook verification
GOOGLE_PLACES_API_KEY=...              # Address validation
MAPBOX_ACCESS_TOKEN=...                # Maps integration
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # Clerk frontend key
NEXT_PUBLIC_API_URL=https://api.domain.com     # Backend API URL
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...            # Maps (client-side)
```

### Database Setup
1. Production database should have no demo/seed data
2. User records are created automatically via Clerk webhooks
3. PermitOffice data should be populated through admin interface

## Development Best Practices

### TypeScript Configuration
- Both frontend and backend use strict TypeScript
- Prisma generates types in `backend/src/generated/prisma/`
- Custom type extensions for Express Request object in auth middleware

### Error Recovery
- Backend compilation errors often require Prisma client regeneration
- Frontend hydration issues typically require clearing `.next` cache
- Database connection issues may need connection string verification

### Testing Approach
- Focus on API integration testing over unit tests
- Test authentication flows thoroughly
- Verify Clerk webhook handling in staging environment

## Common Issues & Solutions

### Prisma Client Errors
If seeing "Prisma client not initialized":
1. `cd backend && npm run prisma:generate`
2. Restart development server

### Authentication Issues
- Verify Clerk keys match environment (dev/staging/prod)
- Check webhook URL is accessible and properly configured
- Ensure database User model has `clerkId` field

### Build Failures
- TypeScript strict mode catches many issues early
- ESLint auto-fix resolves most linting problems
- Missing environment variables cause build failures

## Emergency Cleanup Procedures

### If Development Environment Becomes Unstable
```bash
# 1. Kill ALL project-related processes
pkill -f "Permit Office Finder"
pkill -f "next dev"
pkill -f "nodemon"

# 2. Clean caches and temporary files
cd frontend && rm -rf .next node_modules/.cache
cd backend && rm -rf dist node_modules/.cache

# 3. Regenerate Prisma client
cd backend && npm run prisma:generate

# 4. Restart Cursor completely (Quit and reopen)

# 5. Start only ONE server at a time
cd frontend && npm run dev  # OR
cd backend && npm run dev   # NOT BOTH at once initially
```

### Daily Development Checklist
1. **Before starting work**: Check for existing processes
2. **Choose frontend OR backend** to work on first
3. **Start only one server** at a time
4. **Fix any compilation errors** immediately
5. **Monitor server stability** - no constant restarts

## Key Files to Understand

- `backend/src/middleware/auth.ts` - Authentication and user sync logic
- `backend/prisma/schema.prisma` - Database schema and relationships
- `backend/src/routes/webhooks.ts` - Clerk user synchronization
- `frontend/src/app/layout.tsx` - Root layout with providers
- `backend/.env` / `frontend/.env.local` - Configuration (never commit)
- `.cursorrules` - Cursor IDE development rules (CRITICAL to follow)