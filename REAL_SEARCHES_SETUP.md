# Real Search Setup Guide

This guide will help you set up the Permit Office Finder application with real search functionality using a PostgreSQL database.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Quick Setup

### 1. Database Setup

First, create a PostgreSQL database:

```sql
CREATE DATABASE permit_office_finder;
```

### 2. Environment Configuration

Update the database connection in `backend/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/permit_office_finder?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Replace `username` and `password` with your actual PostgreSQL credentials.

### 3. Run Setup Script

From the project root directory:

```bash
./scripts/setup-database.sh
```

This script will:
- Install backend dependencies
- Generate Prisma client
- Run database migrations
- Seed the database with real permit office data

### 4. Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Manual Setup (Alternative)

If the setup script doesn't work, you can run the commands manually:

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:dev

# Seed database
npm run seed

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Real Search Features

Once set up, the application provides:

### 🔍 Advanced Search
- **Location-based search**: Search by city, state, or address
- **Permit type filtering**: Filter by building, electrical, solar, plumbing, HVAC, or roofing permits
- **Office type filtering**: Filter by county, city, state, or township offices
- **Radius search**: Find offices within a specified distance from your location

### 📍 Location Services
- **Automatic location detection**: Uses browser geolocation to find nearby offices
- **Distance calculation**: Shows distance to each office from your location
- **Google Maps integration**: Get directions to any permit office

### 🏢 Real Data
The database includes real permit offices from major US cities:
- **Georgia**: Walton County, Columbus, Atlanta
- **California**: Los Angeles, San Francisco
- **Texas**: Houston, Dallas
- **New York**: New York City
- **Florida**: Miami
- **Illinois**: Chicago

### ⭐ Reviews & Ratings
- Real user reviews and ratings for each office
- Average rating calculations
- Review count display

## API Endpoints

The backend provides these endpoints:

- `GET /api/permit-offices` - Search permit offices with filters
- `GET /api/permit-offices/:id` - Get specific office details
- `GET /health` - Health check endpoint

### Search Parameters

```
GET /api/permit-offices?search=atlanta&permitType=solar&radius=25&userLat=33.7490&userLng=-84.3880
```

Parameters:
- `search`: Text search across name, description, address, city, state
- `permitType`: Filter by permit type (building, electrical, solar, etc.)
- `officeType`: Filter by office type (county, city, state, township)
- `radius`: Search radius in miles (requires userLat/userLng)
- `userLat`/`userLng`: User location for distance calculations
- `city`/`state`/`zipCode`: Specific location filters

## Database Schema

The application uses the following main entities:

- **PermitOffice**: Office information, location, services, hours
- **User**: User accounts and profiles
- **Application**: Permit applications
- **Review**: User reviews and ratings
- **Document**: Application documents

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running**:
   ```bash
   # macOS with Homebrew
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo systemctl start postgresql
   ```

2. **Verify database exists**:
   ```sql
   \l
   ```

3. **Check connection string format**:
   ```
   postgresql://username:password@host:port/database?schema=public
   ```

### Common Issues

- **"Database not found"**: Create the database first
- **"Connection refused"**: Check if PostgreSQL is running
- **"Authentication failed"**: Verify username/password in .env
- **"Schema not found"**: Run migrations with `npm run prisma:dev`

### Reset Database

To start fresh:

```bash
cd backend
npx prisma migrate reset
npm run seed
```

## Development Tools

### Prisma Studio
View and edit database data:
```bash
cd backend
npm run prisma:studio
```
Opens at [http://localhost:5555](http://localhost:5555)

### Database Migrations
Create new migrations:
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

## Production Deployment

For production deployment:

1. Set up a production PostgreSQL database
2. Update environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Seed production data if needed
5. Build and deploy both frontend and backend

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check that all dependencies are installed

The application is now ready for real searches with actual permit office data!