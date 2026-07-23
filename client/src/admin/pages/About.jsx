import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

export default function AdminAbout() {
  const [form, setForm] = useState({ bio: '', mission: '', vision: '', photo_url: '', cv_url: '' })
  const [aboutId, setAboutId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAbout()
  }, [])

  const loadAbout = async () => {
    const { data, error } = await supabase.from('about').select('*').limit(1).maybeSingle()
    if (data) {
      setAboutId(data.id)
      setForm({
        bio: data.bio || '',
        mission: data.mission || '',
        vision: data.vision || '',
        photo_url: data.photo_url || '',
        cv_url: data.cv_url || '',
      })
    } else if (error) {
      console.error('Error loading about:', error)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        id: aboutId || undefined,
        bio: form.bio,
        mission: form.mission,
        vision: form.vision,
        photo_url: form.photo_url,
        cv_url: form.cv_url,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from('about').upsert(payload).select()
      if (error) throw error

      if (data?.[0]?.id) setAboutId(data[0].id)

      showToast('About section saved!')
      refreshSite()
    } catch (err) {
      showToast('Error saving about section', 'error')
      console.error('About save error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">About Section</h2>
      <p className="text-gray text-sm mb-6">These values appear on the About page — bio, mission/vision cards, and the download CV button.</p>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Bio & Story</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray mb-1">Bio (appears at top of About page)</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={5} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Mission</label>
              <textarea value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} rows={3} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">Vision</label>
              <textarea value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} rows={3} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/5">
          <h3 className="text-lg font-heading font-semibold mb-4 text-primary">Media</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray mb-1">Photo URL</label>
              <input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" placeholder="https://drive.google.com/..." />
              {form.photo_url && <img src={form.photo_url} alt="preview" className="mt-2 w-32 h-32 rounded-xl object-cover" />}
            </div>
            <div>
              <label className="block text-xs text-gray mb-1">CV / Resume URL</label>
              <input value={form.cv_url} onChange={(e) => setForm({ ...form, cv_url: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" placeholder="https://drive.google.com/your-cv.pdf" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
