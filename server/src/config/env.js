/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../../.env') });

const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];

// Validate required environment variables
if (process.env.NODE_ENV === 'production') {
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
}

export const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/matchymatch',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  },
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
};

export default config;
