import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

export default function AdminSEO() {
  const [form, setForm] = useState({ meta_title: '', meta_description: '', og_title: '', og_description: '', og_image: '', keywords: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('seo').select('*').single().then(({ data }) => {
      if (data) setForm({ ...form, ...data })
    })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('seo').upsert({ id: form.id || undefined, ...form, updated_at: new Date() })
    setLoading(false)
    if (error) showToast('Error saving SEO settings', 'error')
    else { showToast('SEO settings saved!'); refreshSite() }
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">SEO Settings</h2>
      <form onSubmit={handleSave} className="max-w-2xl space-y-4">
        <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="Meta Title" className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white" />
        <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} placeholder="Meta Description" rows={3} className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white resize-none" />
        <div className="grid grid-cols-2 gap-4">
          <input value={form.og_title} onChange={(e) => setForm({ ...form, og_title: e.target.value })} placeholder="OG Title" className="px-4 py-3 bg-card border border-white/10 rounded-xl text-white" />
          <input value={form.og_image} onChange={(e) => setForm({ ...form, og_image: e.target.value })} placeholder="OG Image URL" className="px-4 py-3 bg-card border border-white/10 rounded-xl text-white" />
        </div>
        <textarea value={form.og_description} onChange={(e) => setForm({ ...form, og_description: e.target.value })} placeholder="OG Description" rows={2} className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white resize-none" />
        <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="Keywords (comma separated)" className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white" />
        <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] disabled:opacity-50">{loading ? 'Saving...' : 'Save SEO'}</button>
      </form>
    </div>
  )
}
