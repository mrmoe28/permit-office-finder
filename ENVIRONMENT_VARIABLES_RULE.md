# 🔧 Environment Variables Rule

## **RULE: Always Set Environment Variables Correctly**

**NEVER** create scripts that overlook missing environment variables. **ALWAYS** set the correct environment variables with the proper values.

### ✅ **Correct Approach:**
1. Identify missing environment variables
2. Set them with the correct values
3. Ensure all services work properly
4. Test the complete functionality

### ❌ **Incorrect Approach:**
1. Create fallback scripts that ignore missing variables
2. Use placeholder values in production
3. Skip environment variable configuration
4. Work around missing configuration

## **Implementation:**
When environment variables are missing:
1. **STOP** what you're doing
2. **IDENTIFY** which variables are missing
3. **SET** the correct values
4. **VERIFY** everything works
5. **CONTINUE** with the task

## **Environment Variables Required:**

### Frontend (.env.local)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
NEXT_PUBLIC_GOOGLE_CLOUD_STORAGE_BUCKET=your_google_cloud_storage_bucket
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```bash
DATABASE_URL=your_database_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_PROJECT_ID=your_google_project_id
GOOGLE_PROJECT_NUMBER=your_google_project_number
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## **This rule ensures:**
- ✅ All services work correctly
- ✅ No runtime errors due to missing config
- ✅ Proper authentication and API access
- ✅ Complete functionality testing
- ✅ Production-ready deployments
