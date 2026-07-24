import { Router } from 'express'
import { supabaseAnon } from '../supabase/client.js'
import { validate, schemas } from '../middleware/validate.js'

const router = Router()

router.post('/', validate(schemas.contact), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const { error } = await supabaseAnon.from('messages').insert({
      name,
      email,
      subject,
      message,
    })

    if (error) throw error

    res.json({ success: true, message: 'Message sent successfully!' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router
