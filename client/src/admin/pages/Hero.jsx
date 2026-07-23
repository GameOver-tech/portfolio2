import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

export default function AdminHero() {
  const [form, setForm] = useState({
    name: '', title: '', subtitle: '', badge_text: '',
    typing_titles: '', intro_paragraph: '', photo_url: '', resume_url: '',
  })
  const [heroId, setHeroId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadHero()
  }, [])

  const loadHero = async () => {
    const { data, error } = await supabase.from('hero').select('*').limit(1).maybeSingle()
    if (data) {
      setHeroId(data.id)
      setForm({
        name: data.name || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        badge_text: data.badge_text || '',
        typing_titles: Array.isArray(data.typing_titles) ? data.typing_titles.join('\n') : '',
        intro_paragraph: data.intro_paragraph || '',
        photo_url: data.photo_url || '',
        resume_url: data.resume_url || '',
      })
    } else if (error) {
      console.error('Error loading hero:', error)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        id: heroId || undefined,
        name: form.name,
        title: form.title,
        subtitle: form.subtitle,
        badge_text: form.badge_text,
        typing_titles: form.typing_titles.split('\n').filter(t => t.trim()),
        intro_paragraph: form.intro_paragraph,
        photo_url: form.photo_url,
        resume_url: form.resume_url,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from('hero').upsert(payload).select()
      if (error) throw error
      if (data?.[0]?.id) setHeroId(data[0].id)

      showToast('Hero section saved!')
      refreshSite()
    } catch (err) {
      showToast('Error saving hero section', 'error')
      console.error('Hero save error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">Hero Section</h2>
      <p className="text-gray text-sm mb-6">All text on the homepage hero is editable here.</p>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Main Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray mb-1">Your Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Title (appears below name)</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Subtitle</label>
              <textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} rows={2} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Intro Paragraph</label>
              <textarea value={form.intro_paragraph} onChange={(e) => setForm({ ...form, intro_paragraph: e.target.value })} rows={3} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Badge Text (top badge: "Available for Freelance Projects")</label>
              <input value={form.badge_text} onChange={(e) => setForm({ ...form, badge_text: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Typing Titles (one per line — cycles through these)</label>
              <textarea value={form.typing_titles} onChange={(e) => setForm({ ...form, typing_titles: e.target.value })} rows={4} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Graphic Designer&#10;Brand Identity Designer&#10;UI Designer&#10;Motion Designer" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Media</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray mb-1">Photo URL (Google Drive)</label>
              <input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" placeholder="https://drive.google.com/..." />
              {form.photo_url && <img src={form.photo_url} alt="preview" className="mt-2 w-32 h-32 rounded-xl object-cover" />}
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Resume URL</label>
              <input value={form.resume_url} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
