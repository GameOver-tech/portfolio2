// Snapshot VITE_ env vars into api/server.env during Vite build.
// Vercel deploys api/ alongside the serverless function so the server
// can read it at runtime (VITE_ vars aren't available to server runtime).
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const vars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_SERVICE_ROLE',
  'JWT_SECRET',
]

const lines = []
for (const k of vars) {
  const v = process.env[k]
  if (v) lines.push(`${k}=${v}`)
}

if (lines.length) {
  writeFileSync(resolve(root, 'api/server.env'), lines.join('\n') + '\n')
  console.log('[generate-env] Wrote api/server.env with', lines.length, 'vars')
}
