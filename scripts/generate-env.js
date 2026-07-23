// Snapshots build-time env vars into a JSON file the server can read at runtime.
// Vercel bundles the entire server/ directory into the serverless function.
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

const obj = {}
for (const k of vars) {
  const val = process.env[k]
  if (val) obj[k] = val
}

if (Object.keys(obj).length) {
  writeFileSync(resolve(root, 'server/build-vars.json'), JSON.stringify(obj, null, 2))
  console.log('[generate-env] Wrote server/build-vars.json (' + Object.keys(obj).length + ' vars)')
}
