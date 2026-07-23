import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { supabase, supabaseAnon } from '../supabase/client.js'
import { config } from '../config/env.js'

const router = Router()

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    // Use the anon-key client for user sign-in (service-role may fail)
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: data.user.id, email: data.user.email, role: 'admin' },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwtSecret)
    res.json({ valid: true, user: decoded })
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
