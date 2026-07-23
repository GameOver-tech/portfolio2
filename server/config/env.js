import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 1. Try the local .env file (development)
try { dotenv.config({ path: resolve(__dirname, '../../.env') }) } catch {}

// 2. Try the build-injected snapshot at api/server.env (Vercel deploy)
try { dotenv.config({ path: resolve(__dirname, '../../api/server.env') }) } catch {}

// 3. Check for the config keys in order of precedence:
//    - actual env (Vercel dashboard or host)
//    - VITE_ prefixed (from .env or build snapshot)
//    - empty fallback
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
