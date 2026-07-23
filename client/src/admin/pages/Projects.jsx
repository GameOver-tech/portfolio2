import { useState, useEffect, useCallback } from 'react'
import { adminSupabase as supabase } from '../../services/supabase'
import DataTable from '../components/DataTable'
import { showToast } from '../../components/ui/Toast'
import { refreshSite } from '../../utils/refresh'

const defaultForm = {
  title: '', slug: '', description: '', category: '', client: '', duration: '',
  software: '', thumbnail_url: '', project_url: '', case_study_url: '', github_url: '',
  pdf_url: '', problem: '', solution: '', status: 'published', featured: false
}

function generateSlug(title) {
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  if (!slug) slug = 'project'
  return slug
}

function cleanFormData(form) {
  // Return only the fields that should be sent to the database
  // Exclude id, created_at, updated_at — those are managed by Supabase
  const { id, created_at, updated_at, project_images, ...clean } = form
  return {
    ...clean,
    slug: clean.slug || generateSlug(clean.title),
    updated_at: new Date().toISOString(),
  }
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchData(), loadCategories()])
      .finally(() => setTableLoading(false))
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('name')
      if (error) throw error
      if (data) setCategories(data.map(c => c.name))
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
      if (error) throw error
      if (data) setProjects(data)
    } catch (err) {
      console.error('Error fetching projects:', err)
      showToast('Failed to load projects', 'error')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()

    // Validate required fields before save
    if (!form.title.trim()) {
      showToast('Project title is required', 'error')
      return
    }
    if (!form.category) {
      showToast('Please select a category for this project', 'error')
      return
    }

    setLoading(true)

    try {
      const payload = cleanFormData(form)

      let error
      if (editing) {
        const res = await supabase.from('projects').update(payload).eq('id', editing.id)
        error = res.error
        if (!error) {
          showToast('Project updated!')
        }
      } else {
        // Check for slug uniqueness before inserting
        const { data: existing } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', payload.slug)
          .maybeSingle()

        if (existing) {
          payload.slug = `${payload.slug}-${Date.now()}`
        }

        const res = await supabase.from('projects').insert(payload)
        error = res.error
        if (!error) {
          showToast('Project created!')
        }
      }

      if (error) throw error

      refreshSite()
      setShowModal(false)
      setForm(defaultForm)
      setEditing(null)
      await fetchData()
    } catch (err) {
      console.error('Error saving project:', err)
      showToast(`Error saving project: ${err.message || 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = useCallback((item) => {
    // Only spread form-relevant fields, exclude db-managed fields
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      description: item.description || '',
      category: item.category || '',
      client: item.client || '',
      duration: item.duration || '',
      software: item.software || '',
      thumbnail_url: item.thumbnail_url || '',
      project_url: item.project_url || '',
      case_study_url: item.case_study_url || '',
      github_url: item.github_url || '',
      pdf_url: item.pdf_url || '',
      problem: item.problem || '',
      solution: item.solution || '',
      status: item.status || 'published',
      featured: item.featured || false,
    })
    setEditing(item)
    setShowModal(true)
  }, [])

  const handleDelete = async (item) => {
    if (!confirm('Delete this project?')) return
    try {
      const { error } = await supabase.from('projects').delete().eq('id', item.id)
      if (error) throw error
      showToast('Project deleted!')
      refreshSite()
      await fetchData()
    } catch (err) {
      console.error('Error deleting project:', err)
      showToast('Error deleting project', 'error')
    }
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (v) => v ? <span>{v}</span> : <span className="text-gray text-xs italic">None</span> },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2 py-1 rounded-full text-xs ${v === 'published' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-text-muted'}`}>
          {v}
        </span>
      ),
    },
    { key: 'featured', label: 'Featured', render: (v) => v ? <span className="text-primary">★</span> : '-' },
  ]

  if (tableLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading font-bold">Projects</h2>
        <button
          onClick={() => { setForm(defaultForm); setEditing(null); setShowModal(true) }}
          className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300"
        >
          Add Project
        </button>
      </div>

      <DataTable columns={columns} data={projects} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search projects..." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-card border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-heading font-bold mb-6">{editing ? 'Edit Project' : 'Add Project'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray mb-1">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Title" required className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray mb-1">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated if empty" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project description" rows={3} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray mb-1">Client</label>
                  <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Client name" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray mb-1">Duration</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2 weeks" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray mb-1">Software Used</label>
                  <input value={form.software} onChange={(e) => setForm({ ...form, software: e.target.value })} placeholder="e.g. Photoshop, Illustrator" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray mb-1">Thumbnail URL (Google Drive)</label>
                <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://drive.google.com/..." className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                {form.thumbnail_url && <img src={form.thumbnail_url} alt="preview" className="mt-2 w-32 h-20 rounded-lg object-cover" />}
              </div>

              <div>
                <label className="block text-xs text-gray mb-1">Project Live Link (optional)</label>
                <input value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} placeholder="https://your-project.vercel.app" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray mb-1">Case Study URL (Behance / Dribbble)</label>
                  <input value={form.case_study_url} onChange={(e) => setForm({ ...form, case_study_url: e.target.value })} placeholder="https://behance.net/..." className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray mb-1">GitHub / Repository URL</label>
                  <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray mb-1">PDF URL (Portfolio Viewer)</label>
                <input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} placeholder="https://drive.google.com/your-portfolio.pdf" className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors" />
                {form.pdf_url && (
                  <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 mt-2 text-xs text-primary hover:underline">
                    <span>Preview PDF Link</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray mb-1">The Problem</label>
                  <textarea value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} placeholder="What problem did this project solve?" rows={2} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray mb-1">The Solution</label>
                  <textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} placeholder="How did you solve it?" rows={2} className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <div>
                  <label className="block text-xs text-gray mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-3 bg-background border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <label className="flex items-center space-x-2 text-sm pt-4">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-white/20" />
                  <span>Featured</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button type="button" onClick={() => { setShowModal(false); setForm(defaultForm); setEditing(null) }} className="px-6 py-2.5 border border-white/10 rounded-xl text-gray hover:text-white transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300 disabled:opacity-50 flex items-center space-x-2">
                  {loading && <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />}
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
