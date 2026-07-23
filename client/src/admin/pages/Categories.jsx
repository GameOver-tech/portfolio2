import { useState, useEffect } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const { error } = await supabase.from('categories').insert({ name })
      if (error) throw error
      showToast('Category added!')
      refreshSite()
      setName('')
    } catch (err) {
      console.error('Error adding category:', err)
      showToast('Error adding category', 'error')
    }
    setLoading(false)
    fetchData()
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? Projects using this category will become uncategorized.`)) return
    try {
      // Reassign projects first, then delete the category
      await supabase.from('projects').update({ category: null }).eq('category', name)
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      showToast('Category deleted!')
      refreshSite()
    } catch (err) {
      console.error('Error deleting category:', err)
      showToast('Error deleting category', 'error')
    }
    fetchData()
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-8">Categories</h2>
      <form onSubmit={handleAdd} className="flex space-x-4 mb-8">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required className="flex-1 px-4 py-3 bg-card border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
        <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300 disabled:opacity-50">Add</button>
      </form>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-card border border-white/5">
            <span>{cat.name}</span>
            <button onClick={() => handleDelete(cat.id, cat.name)} className="text-gray hover:text-red-400 transition-colors text-sm">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
