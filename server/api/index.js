import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { config } from '../config/env.js'
import authRoutes from '../routes/auth.js'
import adminRoutes from '../routes/admin.js'
import contactRoutes from '../routes/contact.js'
import newsletterRoutes from '../routes/newsletter.js'
import chatRoutes from '../routes/chat.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(cors({
  origin: config.corsOrigins.includes('*')
    ? (origin, cb) => cb(null, origin || true)
    : config.corsOrigins,
  credentials: true,
}))

// Serve uploaded files
app.use('/uploads', express.static(resolve(__dirname, '../../public/uploads')))

// Rate limiting — more generous for admin panel (200 req / 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/chat', chatRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Start server for local development (not triggered on Vercel)
if (process.env.VERCEL !== '1') {
  const PORT = config.port || 3000
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
  })
}

export default app
