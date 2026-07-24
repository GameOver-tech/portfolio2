// Vercel serverless catch-all entry point for /api/*
import './env.js'
export { default } from '../server/api/index.js'
