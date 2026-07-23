import { Router } from 'express'
import { supabase } from '../supabase/client.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

// All admin routes require authentication
router.use(verifyToken)

// Dashboard stats
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

// Hero
router.get('/hero', async (req, res) => {
  const { data } = await supabase.from('hero').select('*').single()
  res.json(data)
})

router.put('/hero', async (req, res) => {
  const { data } = await supabase.from('hero').upsert({ ...req.body, updated_at: new Date() }).select()
  res.json(data)
})

// About
router.get('/about', async (req, res) => {
  const { data } = await supabase.from('about').select('*').single()
  res.json(data)
})

router.put('/about', async (req, res) => {
  const { data } = await supabase.from('about').upsert({ ...req.body, updated_at: new Date() }).select()
  res.json(data)
})

// Services
router.get('/services', async (req, res) => {
  const { data } = await supabase.from('services').select('*').order('order')
  res.json(data)
})

router.post('/services', async (req, res) => {
  const { data } = await supabase.from('services').insert(req.body).select()
  res.json(data)
})

router.put('/services/:id', async (req, res) => {
  const { data } = await supabase.from('services').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/services/:id', async (req, res) => {
  await supabase.from('services').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Projects
router.get('/projects', async (req, res) => {
  const { data } = await supabase.from('projects').select('*, project_images(*)').order('created_at', { ascending: false })
  res.json(data)
})

router.post('/projects', async (req, res) => {
  const { data } = await supabase.from('projects').insert(req.body).select()
  res.json(data)
})

router.put('/projects/:id', async (req, res) => {
  const { data } = await supabase.from('projects').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/projects/:id', async (req, res) => {
  await supabase.from('projects').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Stats
router.get('/stats', async (req, res) => {
  const { data } = await supabase.from('stats').select('*').order('order')
  res.json(data)
})

router.post('/stats', async (req, res) => {
  const { data } = await supabase.from('stats').insert(req.body).select()
  res.json(data)
})

router.put('/stats/:id', async (req, res) => {
  const { data } = await supabase.from('stats').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/stats/:id', async (req, res) => {
  await supabase.from('stats').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Categories
router.get('/categories', async (req, res) => {
  const { data } = await supabase.from('categories').select('*').order('name')
  res.json(data)
})

router.post('/categories', async (req, res) => {
  const { data } = await supabase.from('categories').insert(req.body).select()
  res.json(data)
})

router.delete('/categories/:id', async (req, res) => {
  // First, get the category name to find projects using it
  const { data: category } = await supabase.from('categories').select('name').eq('id', req.params.id).single()

  if (category) {
    // Reassign projects using this category to null (uncategorized)
    await supabase.from('projects').update({ category: null, updated_at: new Date() }).eq('category', category.name)
  }

  // Then delete the category itself
  await supabase.from('categories').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Skills
router.get('/skills', async (req, res) => {
  const { data } = await supabase.from('skills').select('*').order('name')
  res.json(data)
})

router.post('/skills', async (req, res) => {
  const { data } = await supabase.from('skills').insert(req.body).select()
  res.json(data)
})

router.put('/skills/:id', async (req, res) => {
  const { data } = await supabase.from('skills').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/skills/:id', async (req, res) => {
  await supabase.from('skills').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Team
router.get('/team', async (req, res) => {
  const { data } = await supabase.from('team').select('*').order('name')
  res.json(data)
})

router.post('/team', async (req, res) => {
  const { data } = await supabase.from('team').insert(req.body).select()
  res.json(data)
})

router.put('/team/:id', async (req, res) => {
  const { data } = await supabase.from('team').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/team/:id', async (req, res) => {
  await supabase.from('team').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Messages
router.get('/messages', async (req, res) => {
  const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  res.json(data)
})

router.delete('/messages/:id', async (req, res) => {
  await supabase.from('messages').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Newsletter
router.get('/newsletter', async (req, res) => {
  const { data } = await supabase.from('newsletter').select('*').order('created_at', { ascending: false })
  res.json(data)
})

router.delete('/newsletter/:id', async (req, res) => {
  await supabase.from('newsletter').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Settings
router.get('/settings', async (req, res) => {
  const { data } = await supabase.from('settings').select('*').single()
  res.json(data)
})

router.put('/settings', async (req, res) => {
  const { data } = await supabase.from('settings').upsert({ ...req.body, updated_at: new Date() }).select()
  res.json(data)
})

// Social Links
router.get('/social-links', async (req, res) => {
  const { data } = await supabase.from('social_links').select('*').order('platform')
  res.json(data)
})

router.post('/social-links', async (req, res) => {
  const { data } = await supabase.from('social_links').insert(req.body).select()
  res.json(data)
})

router.put('/social-links/:id', async (req, res) => {
  const { data } = await supabase.from('social_links').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/social-links/:id', async (req, res) => {
  await supabase.from('social_links').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Chatbot Config
router.get('/chatbot', async (req, res) => {
  const { data } = await supabase.from('chatbot_config').select('*').single()
  res.json(data)
})

router.put('/chatbot', async (req, res) => {
  const { data } = await supabase.from('chatbot_config').upsert({ ...req.body, updated_at: new Date() }).select()
  res.json(data)
})

// SEO
router.get('/seo', async (req, res) => {
  const { data } = await supabase.from('seo').select('*').single()
  res.json(data)
})

router.put('/seo', async (req, res) => {
  const { data } = await supabase.from('seo').upsert({ ...req.body, updated_at: new Date() }).select()
  res.json(data)
})

// AI Providers
router.get('/ai-providers', async (req, res) => {
  const { data } = await supabase.from('ai_providers').select('*').order('priority')
  res.json(data)
})

router.post('/ai-providers', async (req, res) => {
  const { data, error } = await supabase.from('ai_providers').insert(req.body).select()
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

router.put('/ai-providers/:id', async (req, res) => {
  const { data, error } = await supabase.from('ai_providers').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

router.delete('/ai-providers/:id', async (req, res) => {
  await supabase.from('ai_providers').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Experience
router.get('/experience', async (req, res) => {
  const { data } = await supabase.from('experience').select('*').order('order')
  res.json(data)
})

router.post('/experience', async (req, res) => {
  const { data } = await supabase.from('experience').insert(req.body).select()
  res.json(data)
})

router.put('/experience/:id', async (req, res) => {
  const { data } = await supabase.from('experience').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/experience/:id', async (req, res) => {
  await supabase.from('experience').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Education
router.get('/education', async (req, res) => {
  const { data } = await supabase.from('education').select('*').order('order')
  res.json(data)
})

router.post('/education', async (req, res) => {
  const { data } = await supabase.from('education').insert(req.body).select()
  res.json(data)
})

router.put('/education/:id', async (req, res) => {
  const { data } = await supabase.from('education').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/education/:id', async (req, res) => {
  await supabase.from('education').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// FAQs
router.get('/faqs', async (req, res) => {
  const { data } = await supabase.from('faqs').select('*').order('order')
  res.json(data)
})

router.post('/faqs', async (req, res) => {
  const { data } = await supabase.from('faqs').insert(req.body).select()
  res.json(data)
})

router.put('/faqs/:id', async (req, res) => {
  const { data } = await supabase.from('faqs').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/faqs/:id', async (req, res) => {
  await supabase.from('faqs').delete().eq('id', req.params.id)
  res.json({ success: true })
})

// Certifications
router.get('/certifications', async (req, res) => {
  const { data } = await supabase.from('certifications').select('*').order('order')
  res.json(data)
})

router.post('/certifications', async (req, res) => {
  const { data } = await supabase.from('certifications').insert(req.body).select()
  res.json(data)
})

router.put('/certifications/:id', async (req, res) => {
  const { data } = await supabase.from('certifications').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).select()
  res.json(data)
})

router.delete('/certifications/:id', async (req, res) => {
  await supabase.from('certifications').delete().eq('id', req.params.id)
  res.json({ success: true })
})

export default router
