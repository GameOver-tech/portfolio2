import { Router } from 'express'
import { supabaseAnon } from '../supabase/client.js'
import { validate, schemas } from '../middleware/validate.js'

const router = Router()

router.post('/', validate(schemas.newsletter), async (req, res) => {
  try {
    const { email } = req.body

    const { data: existing } = await supabaseAnon
      .from('newsletter')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return res.json({ success: true, message: 'Already subscribed!' })
    }

    const { error } = await supabaseAnon.from('newsletter').insert({ email })

    if (error) throw error

    res.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error) {
    console.error('Newsletter error:', error)
    res.status(500).json({ error: 'Failed to subscribe' })
  }
})

export default router
