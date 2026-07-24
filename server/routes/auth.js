import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { supabase, supabaseAnon } from '../supabase/client.js'
import { config } from '../config/env.js'
import { validate, schemas } from '../middleware/validate.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// Admin login
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message?.includes('Email not confirmed')) {
        return res.status(401).json({ error: 'Please confirm your email before logging in' })
      }
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const role = data.user?.user_metadata?.role || 'admin'

    const token = jwt.sign(
      { userId: data.user.id, email: data.user.email, role },
      config.jwtSecret,
      { algorithm: 'HS256', expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    const message = error.message === 'fetch failed'
      ? 'Cannot connect to Supabase. Check your environment variables.'
      : 'Login failed'
    res.status(500).json({ error: message })
  }
})

// Verify token
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

export default router
