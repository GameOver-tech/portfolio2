import { Router } from 'express'
import { supabase } from '../supabase/client.js'
import { verifyToken } from '../middleware/auth.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

// All admin routes require authentication
router.use(verifyToken)

// ──────────────────────────────────────
// File upload for certifications
// ──────────────────────────────────────
const uploadsDir = path.resolve(__dirname, '../../public/uploads/certifications')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `cert-${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.webp']
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
  },
})

router.post('/certifications/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const fileUrl = `/uploads/certifications/${req.file.filename}`
  res.json({ url: fileUrl, filename: req.file.originalname })
})

// ──────────────────────────────────────
// Dashboard stats
// ──────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const [projects, services, messages, subscribers] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter').select('*', { count: 'exact', head: true }),
    ])

    res.json({
      projects: projects.count || 0,
      services: services.count || 0,
      messages: messages.count || 0,
      subscribers: subscribers.count || 0,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
})

// ──────────────────────────────────────
// Hero
// ──────────────────────────────────────
router.get('/hero', async (req, res) => {
  try {
    const { data, error } = await supabase.from('hero').select('*').maybeSingle()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/hero', async (req, res) => {
  try {
    const { data, error } = await supabase.from('hero').upsert({ ...req.body, updated_at: new Date() }).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// About
// ──────────────────────────────────────
router.get('/about', async (req, res) => {
  try {
    const { data, error } = await supabase.from('about').select('*').maybeSingle()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/about', async (req, res) => {
  try {
    const { data, error } = await supabase.from('about').upsert({ ...req.body, updated_at: new Date() }).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Services
// ──────────────────────────────────────
router.get('/services', async (req, res) => {
  try {
    const { data, error } = await supabase.from('services').select('*').order('order')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/services', async (req, res) => {
  try {
    const { data, error } = await supabase.from('services').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/services/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('services').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/services/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('services').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Projects
// ──────────────────────────────────────
router.get('/projects', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*, project_images(*)').order('created_at', { ascending: false })
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/projects', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/projects/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/projects/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Stats
// ──────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const { data, error } = await supabase.from('stats').select('*').order('order')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/stats', async (req, res) => {
  try {
    const { data, error } = await supabase.from('stats').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/stats/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('stats').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/stats/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('stats').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Categories
// ──────────────────────────────────────
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/categories/:id', async (req, res) => {
  try {
    const { data: category } = await supabase.from('categories').select('name').eq('id', req.params.id).single()
    if (category) {
      await supabase.from('projects').update({ category: null, updated_at: new Date() }).eq('category', category.name)
    }
    const { error } = await supabase.from('categories').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Skills
// ──────────────────────────────────────
router.get('/skills', async (req, res) => {
  try {
    const { data, error } = await supabase.from('skills').select('*').order('name')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/skills', async (req, res) => {
  try {
    const { data, error } = await supabase.from('skills').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/skills/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('skills').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/skills/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('skills').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Team
// ──────────────────────────────────────
router.get('/team', async (req, res) => {
  try {
    const { data, error } = await supabase.from('team').select('*').order('name')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/team', async (req, res) => {
  try {
    const { data, error } = await supabase.from('team').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/team/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('team').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/team/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('team').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Messages
// ──────────────────────────────────────
router.get('/messages', async (req, res) => {
  try {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/messages/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('messages').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Newsletter
// ──────────────────────────────────────
router.get('/newsletter', async (req, res) => {
  try {
    const { data, error } = await supabase.from('newsletter').select('*').order('created_at', { ascending: false })
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/newsletter/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('newsletter').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Settings
// ──────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('*').maybeSingle()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').upsert({ ...req.body, updated_at: new Date() }).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Social Links
// ──────────────────────────────────────
router.get('/social-links', async (req, res) => {
  try {
    const { data, error } = await supabase.from('social_links').select('*').order('platform')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/social-links', async (req, res) => {
  try {
    const { data, error } = await supabase.from('social_links').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/social-links/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('social_links').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/social-links/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('social_links').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Chatbot Config
// ──────────────────────────────────────
router.get('/chatbot', async (req, res) => {
  try {
    const { data, error } = await supabase.from('chatbot_config').select('*').maybeSingle()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/chatbot', async (req, res) => {
  try {
    const { data, error } = await supabase.from('chatbot_config').upsert({ ...req.body, updated_at: new Date() }).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// SEO
// ──────────────────────────────────────
router.get('/seo', async (req, res) => {
  try {
    const { data, error } = await supabase.from('seo').select('*').maybeSingle()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/seo', async (req, res) => {
  try {
    const { data, error } = await supabase.from('seo').upsert({ ...req.body, updated_at: new Date() }).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// AI Providers
// ──────────────────────────────────────
router.get('/ai-providers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('ai_providers').select('*').order('priority')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/ai-providers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('ai_providers').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/ai-providers/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('ai_providers').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/ai-providers/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('ai_providers').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Experience
// ──────────────────────────────────────
router.get('/experience', async (req, res) => {
  try {
    const { data, error } = await supabase.from('experience').select('*').order('order')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/experience', async (req, res) => {
  try {
    const { data, error } = await supabase.from('experience').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/experience/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('experience').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/experience/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('experience').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Education
// ──────────────────────────────────────
router.get('/education', async (req, res) => {
  try {
    const { data, error } = await supabase.from('education').select('*').order('order')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/education', async (req, res) => {
  try {
    const { data, error } = await supabase.from('education').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/education/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('education').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/education/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('education').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// FAQs
// ──────────────────────────────────────
router.get('/faqs', async (req, res) => {
  try {
    const { data, error } = await supabase.from('faqs').select('*').order('order')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/faqs', async (req, res) => {
  try {
    const { data, error } = await supabase.from('faqs').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/faqs/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('faqs').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/faqs/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('faqs').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Certifications
// ──────────────────────────────────────
router.get('/certifications', async (req, res) => {
  try {
    const { data, error } = await supabase.from('certifications').select('*').order('order')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/certifications', async (req, res) => {
  try {
    const { data, error } = await supabase.from('certifications').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/certifications/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('certifications').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/certifications/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('certifications').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ──────────────────────────────────────
// Process Steps
// ──────────────────────────────────────
router.get('/process-steps', async (req, res) => {
  try {
    const { data, error } = await supabase.from('process_steps').select('*').order('order')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/process-steps', async (req, res) => {
  try {
    const { data, error } = await supabase.from('process_steps').insert(req.body).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/process-steps/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('process_steps').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/process-steps/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('process_steps').delete().eq('id', req.params.id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
