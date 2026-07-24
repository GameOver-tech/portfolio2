// Vercel serverless catch-all entry point for /api/*
import './env.js'
import app from '../server/api/index.js'

export const config = {
  runtime: 'nodejs',
}

export default app
