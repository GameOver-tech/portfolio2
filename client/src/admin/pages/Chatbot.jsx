import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

export default function AdminChatbot() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  const defaults = {
    greeting: '👋 Hi! I\'m Ali\'s AI assistant. Ask me about his work or how to get started!',
    system_prompt: '',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 500,
    enabled: true
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase.from('chatbot_config').select('*').maybeSingle()
      if (error) {
        console.error('Error loading chatbot config:', error)
        setFetchError(true)
        setForm(defaults)
      } else if (data) {
        setForm({
          greeting: data.greeting || defaults.greeting,
          system_prompt: data.system_prompt || '',
          model: data.model || defaults.model,
          temperature: data.temperature ?? defaults.temperature,
          max_tokens: data.max_tokens || defaults.max_tokens,
          enabled: data.enabled ?? true,
          id: data.id
        })
      } else {
        setForm(defaults)
      }
    } catch (err) {
      console.error('Error:', err)
      setFetchError(true)
      setForm(defaults)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form) return
    setLoading(true)

    try {
      const payload = { ...form, updated_at: new Date() }
      if (form.id) payload.id = form.id

      const { error } = await supabase.from('chatbot_config').upsert(payload)
      if (error) throw error

      showToast('Chatbot config saved!')
      refreshSite()
    } catch (err) {
      showToast('Error saving config: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">Chatbot Configuration</h2>
      <form onSubmit={handleSave} className="max-w-2xl space-y-4">
        <input value={form.greeting} onChange={(e) => setForm({ ...form, greeting: e.target.value })} placeholder="Greeting message" className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white" />
        <textarea value={form.system_prompt} onChange={(e) => setForm({ ...form, system_prompt: e.target.value })} placeholder="System prompt (instructions for the AI)" rows={6} className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white resize-none" />
        <div className="grid grid-cols-3 gap-4">
          <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="px-4 py-3 bg-card border border-white/10 rounded-xl text-white">
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
            <option value="gemma2-9b-it">Gemma 2 9B</option>
          </select>
          <div>
            <label className="block text-xs text-gray mb-1">Temperature: {form.temperature}</label>
            <input type="range" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })} min={0} max={1} step={0.1} className="w-full" />
          </div>
          <input type="number" value={form.max_tokens} onChange={(e) => setForm({ ...form, max_tokens: parseInt(e.target.value) || 500 })} placeholder="Max tokens" className="px-4 py-3 bg-card border border-white/10 rounded-xl text-white" />
        </div>
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="rounded border-white/20" />
          <span>Enable Chatbot</span>
        </label>
        <button type="submit" disabled={loading} className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] disabled:opacity-50">{loading ? 'Saving...' : 'Save Config'}</button>
      </form>
    </div>
  )
}
