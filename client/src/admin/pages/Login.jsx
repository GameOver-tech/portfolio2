import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminAPI } from '../../services/api'
import { supabase } from '../../services/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Get custom JWT from Express API (used by adminAPI axios calls)
      const { data } = await adminAPI.login(email, password)

      if (data?.token) {
        localStorage.setItem('admin_token', data.token)

        // Also sign in via Supabase SDK so direct Supabase calls work
        const supabaseResult = await supabase.auth.signInWithPassword({ email, password })
        if (supabaseResult.error) {
          console.warn('Supabase sign-in failed (admin panel may show no data):', supabaseResult.error.message)
        }

        navigate('/admin')
      } else {
        throw new Error('Login failed')
      }
    } catch (err) {
      // Never pass a non-string to setError — React can't render objects as children
      const raw = err.response?.data?.error || err.message || 'Invalid credentials'
      const message = typeof raw === 'string'
        ? raw
        : raw?.message || JSON.stringify(raw)

      if (err.response?.status === 500) {
        setError('Server error. Check that environment variables are set on Vercel.')
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach server. Is the API running?')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-gradient">AH</h1>
          <h2 className="text-2xl font-heading font-bold mt-4 text-white">Admin Login</h2>
          <p className="text-sm mt-2 text-text-secondary">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required
              className="w-full px-4 py-3 bg-bg-glass border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent/30 transition-colors placeholder:text-text-muted" />
          </div>
          <div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required
              className="w-full px-4 py-3 bg-bg-glass border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-accent/30 transition-colors placeholder:text-text-muted" />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-background font-semibold rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_40px_rgba(0,240,255,0.35)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
