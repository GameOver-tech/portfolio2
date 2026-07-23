import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import DataTable from '../components/DataTable'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

export default function AdminTeam() {
  const [team, setTeam] = useState([])
  const [form, setForm] = useState({ name: '', role: '', description: '', photo_url: '', social_links: {}, active: true })
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('team').select('*').order('name')
    if (data) setTeam(data)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    let error
    if (editing) {
      const res = await supabase.from('team').update({ ...form, updated_at: new Date() }).eq('id', editing.id)
      error = res.error
    } else {
      const res = await supabase.from('team').insert(form)
      error = res.error
    }
    setLoading(false)
    if (error) { showToast('Error saving team member', 'error') }
    else { showToast(editing ? 'Member updated!' : 'Member added!'); refreshSite() }
    setShowModal(false); setEditing(null); fetchData()
  }

  const handleEdit = (item) => { setForm(item); setEditing(item); setShowModal(true) }
  const handleDelete = async (item) => {
    if (!confirm('Delete this team member?')) return
    const { error } = await supabase.from('team').delete().eq('id', item.id)
    if (error) { showToast('Error deleting member', 'error') }
    else { showToast('Member deleted!'); refreshSite() }
    fetchData()
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'active', label: 'Active', render: (v) => v ? <span className="text-primary">✓</span> : '-' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading font-bold">Team</h2>
        <button onClick={() => { setForm({ name: '', role: '', description: '', photo_url: '', social_links: {}, active: true }); setEditing(null); setShowModal(true) }} className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl">Add Member</button>
      </div>
      <DataTable columns={columns} data={team} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search team..." />
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-heading font-bold mb-6">{editing ? 'Edit Member' : 'Add Member'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white" />
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white" />
              </div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white resize-none" />
              <input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="Photo URL" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white" />
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
