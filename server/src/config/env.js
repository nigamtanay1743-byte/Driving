import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const required = ['MONGODB_URI', 'SESSION_SECRET'];

function loadEnv() {
  const clientOrigin =
    process.env.CLIENT_ORIGIN ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

  const missing = required.filter((key) => !process.env[key]);
  if (!clientOrigin) {
    missing.push('CLIENT_ORIGIN');
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const isProd =
    process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

  return {
    nodeEnv: process.env.NODE_ENV || (process.env.VERCEL ? 'production' : 'development'),
    isProd,
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGODB_URI,
    clientOrigin,
    sessionSecret: process.env.SESSION_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    whatsappNumber: process.env.BUSINESS_WHATSAPP_NUMBER || '',
    timezone: process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata',
    cookieSecure: isProd,
  };
}

export const env = new Proxy(
  {},
  {
    get(_target, prop) {
      return loadEnv()[prop];
    },
  }
);
