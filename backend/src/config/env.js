import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// White-list allowed origins for development & production
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:5000')
  .split(',')
  .map(url => url.trim());

export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || 'https://mock-supabase-url.supabase.co',
  supabaseKey: process.env.SUPABASE_KEY || (isProduction ? '' : 'mock-supabase-service-key-secret'),
  jwtSecret: process.env.JWT_SECRET || (isProduction ? '' : 'ner-smartroute-jwt-secret-key-2026'),
  corsOrigins: allowedOrigins,
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000'
};

if (isProduction) {
  if (!config.supabaseKey || config.supabaseKey.includes('mock')) {
    console.error('[CRITICAL SECURITY ERROR] SUPABASE_KEY missing in production environment!');
  }
  if (!config.jwtSecret || config.jwtSecret.includes('secret-key-2026')) {
    console.error('[CRITICAL SECURITY ERROR] Production JWT_SECRET must be configured in environment variables!');
  }
}
