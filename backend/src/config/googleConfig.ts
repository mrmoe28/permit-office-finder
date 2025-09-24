import dotenv from 'dotenv';

dotenv.config();

export const googleConfig = {
  // OAuth Configuration
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  projectId: process.env.GOOGLE_PROJECT_ID!,
  projectNumber: process.env.GOOGLE_PROJECT_NUMBER!,

  // API Keys
  mapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
  placesApiKey: process.env.GOOGLE_PLACES_API_KEY!,

  // Cloud Services
  cloudProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET!,
  region: process.env.GOOGLE_CLOUD_REGION || 'us-central1',

  // Email Configuration
  gmailUser: process.env.GMAIL_USER!,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD!,
  fromEmail: process.env.FROM_EMAIL!,

  // OAuth Redirect URLs
  redirectUrls: {
    development: 'http://localhost:3000/auth/google/callback',
    production: 'https://yourdomain.com/auth/google/callback'
  }
};

// Validation
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_PROJECT_ID',
  'GOOGLE_MAPS_API_KEY',
  'GOOGLE_PLACES_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default googleConfig;
