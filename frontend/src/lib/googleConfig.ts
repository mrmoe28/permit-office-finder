// Google Services Configuration for Frontend

export const googleConfig = {
  // OAuth Configuration
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  projectId: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID!,

  // API Keys
  mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  placesApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!,

  // Cloud Services
  cloudProjectId: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_STORAGE_BUCKET!,

  // Mapbox (alternative maps provider)
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,

  // OAuth Scopes
  oauthScopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],

  // API Endpoints
  endpoints: {
    geocoding: 'https://maps.googleapis.com/maps/api/geocode/json',
    places: 'https://maps.googleapis.com/maps/api/place',
    directions: 'https://maps.googleapis.com/maps/api/directions/json'
  }
};

// Validation
const requiredEnvVars = [
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Missing required environment variable: ${envVar}`);
  }
}

export default googleConfig;
