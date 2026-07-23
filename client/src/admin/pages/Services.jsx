import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import DataTable from '../components/DataTable'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

const defaultForm = { title: '', description: '', icon: '', status: 'published', order: 0 }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('services').select('*').order('order')
    if (data) setServices(data)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    let error
    if (editing) {
      const res = await supabase.from('services').update({ ...form, updated_at: new Date() }).eq('id', editing.id)
      error = res.error
    } else {
      const res = await supabase.from('services').insert({ ...form })
      error = res.error
    }
    setLoading(false)
    if (error) {
      showToast('Error saving service', 'error')
    } else {
      showToast(editing ? 'Service updated!' : 'Service created!')
      refreshSite()
    }
    setShowModal(false)
    setForm(defaultForm)
    setEditing(null)
    fetchData()
  }

  const handleEdit = (item) => {
    setForm(item)
    setEditing(item)
    setShowModal(true)
  }

  const handleDelete = async (item) => {
    if (!confirm('Delete this service?')) return
    const { error } = await supabase.from('services').delete().eq('id', item.id)
    if (error) showToast('Error deleting service', 'error')
    else {
      showToast('Service deleted!')
      refreshSite()
    }
    fetchData()
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status', render: (v) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'published' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-text-muted'}`}>{v}</span> },
    { key: 'order', label: 'Order' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading font-bold">Services</h2>
        <button onClick={() => { setForm(defaultForm); setEditing(null); setShowModal(true) }} className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300">
          Add Service
        </button>
      </div>

      <DataTable columns={columns} data={services} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search services..." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-heading font-bold mb-6">{editing ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Service Title" required className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} required className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon name (optional)" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
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
