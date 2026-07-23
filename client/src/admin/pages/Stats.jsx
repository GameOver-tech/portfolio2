import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import DataTable from '../components/DataTable'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

const defaultForm = { label: '', value: 0, suffix: '+', order: 0, active: true }

export default function AdminStats() {
  const [stats, setStats] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('stats').select('*').order('order')
    if (data) setStats(data)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    let error
    if (editing) {
      const res = await supabase.from('stats').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
      error = res.error
    } else {
      const res = await supabase.from('stats').insert({ ...form })
      error = res.error
    }
    setLoading(false)
    if (error) { showToast('Error saving stat', 'error'); console.error(error) }
    else { showToast(editing ? 'Stat updated!' : 'Stat created!'); refreshSite() }
    setShowModal(false)
    setForm(defaultForm)
    setEditing(null)
    fetchData()
  }

  const handleEdit = (item) => { setForm(item); setEditing(item); setShowModal(true) }
  const handleDelete = async (item) => {
    if (!confirm('Delete this stat?')) return
    const { error } = await supabase.from('stats').delete().eq('id', item.id)
    if (error) { showToast('Error deleting stat', 'error'); console.error(error) }
    else { showToast('Stat deleted!'); refreshSite() }
    fetchData()
  }

  const columns = [
    { key: 'label', label: 'Label' },
    { key: 'value', label: 'Value', render: (v) => v },
    { key: 'suffix', label: 'Suffix' },
    { key: 'order', label: 'Order' },
    { key: 'active', label: 'Active', render: (v) => v ? <span className="text-primary">✓</span> : '-' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading font-bold">Stats Counters</h2>
        <button onClick={() => { setForm(defaultForm); setEditing(null); setShowModal(true) }} className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl">Add Stat</button>
      </div>

      <DataTable columns={columns} data={stats} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search stats..." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-heading font-bold mb-6">{editing ? 'Edit Stat' : 'Add Stat'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label (e.g. Years Experience)" required className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white" />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })} placeholder="Value" className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white" />
                <input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} placeholder="Suffix (e.g. +)" className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white" />
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white" />
              </div>
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-white/20" />
                <span>Active</span>
              </label>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-white/10 rounded-xl text-gray">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
