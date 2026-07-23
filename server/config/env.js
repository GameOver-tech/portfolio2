import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// .env is optional — on Vercel env vars come from the platform
try { dotenv.config({ path: resolve(__dirname, '../../.env') }) } catch {} 

// VITE_ prefix is only available during Vite build (client builds).
// At server runtime on Vercel, it reads regular env vars.
// Check both — SUPABASE_URL first (for Vercel), fall back to VITE_SUPABASE_URL (for local dev).
const env = (key) => process.env[key] || process.env[`VITE_${key}`] || ''

export const config = {
  port: process.env.PORT || 3000,
  supabaseUrl: env('SUPABASE_URL'),
  supabaseAnonKey: env('SUPABASE_ANON_KEY'),
  supabaseServiceRole: env('SUPABASE_SERVICE_ROLE'),
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@alihassan.dev',
}
