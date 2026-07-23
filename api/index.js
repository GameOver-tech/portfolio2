// Vercel serverless entry point
// Statically import build-injected env vars so Vercel's tracer bundles them
import './env.js'
// Re-exports the Express app from the server directory
export { default } from '../server/api/index.js'
