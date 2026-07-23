import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import DataTable from '../components/DataTable'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

export default function AdminProcess() {
  const [steps, setSteps] = useState([])
  const [form, setForm] = useState({ step: '', title: '', description: '', order: 0, active: true })
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('process_steps').select('*').order('order')
    if (data) setSteps(data)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    let error
    const payload = { ...form, order: parseInt(form.order) || 0 }
    if (editing) {
      const res = await supabase.from('process_steps').update({ ...payload, updated_at: new Date() }).eq('id', editing.id)
      error = res.error
    } else {
      const res = await supabase.from('process_steps').insert(payload)
      error = res.error
    }
    setLoading(false)
    if (error) { showToast('Error saving step', 'error') }
    else { showToast(editing ? 'Step updated!' : 'Step created!'); refreshSite() }
    setShowModal(false)
    setForm({ step: '', title: '', description: '', order: 0, active: true })
    setEditing(null)
    fetchData()
  }

  const handleEdit = (item) => { setForm(item); setEditing(item); setShowModal(true) }
  const handleDelete = async (item) => {
    if (!confirm('Delete this process step?')) return
    const { error } = await supabase.from('process_steps').delete().eq('id', item.id)
    if (error) { showToast('Error deleting step', 'error') }
    else { showToast('Step deleted!'); refreshSite() }
    fetchData()
  }

  const columns = [
    { key: 'step', label: 'Step #' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', render: (v) => v?.length > 60 ? v.slice(0, 60) + '...' : v },
    { key: 'order', label: 'Order' },
    { key: 'active', label: 'Active', render: (v) => v ? <span className="text-primary">✓</span> : '-' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading font-bold">Process Steps</h2>
        <button onClick={() => { setForm({ step: '', title: '', description: '', order: steps.length + 1, active: true }); setEditing(null); setShowModal(true) }}
          className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300">
          Add Step
        </button>
      </div>
      <p className="text-sm text-text-muted mb-6">These 4 cards appear in the "My Development Process" section on the Services page.</p>
      <DataTable columns={columns} data={steps} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search steps..." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-heading font-bold mb-6">{editing ? 'Edit Step' : 'Add Step'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Step Number (e.g. "01")</label>
                  <input value={form.step} onChange={(e) => setForm({ ...form, step: e.target.value })} placeholder="01" required
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} required
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Discovery" required
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Understanding your goals, requirements, and technical landscape." required rows={3}
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-white/20" />
                <span>Active</span>
              </label>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-white/10 rounded-xl text-gray hover:text-white transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
