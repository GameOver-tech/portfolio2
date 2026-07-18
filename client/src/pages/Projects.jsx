import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiSearch, FiArrowRight, FiImage } from 'react-icons/fi'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'
import { supabase } from '../services/supabase'

function ProjectCard({ project }) {
  const linkTo = project.pdf_url ? `/portfolio/${project.slug}` : `/projects/${project.slug}`
  return (
    <Link to={linkTo}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative rounded-2xl overflow-hidden bg-card border border-white/5 min-h-[280px]"
      >
        <div className="aspect-[4/3] overflow-hidden bg-card relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray">
            <div className="flex flex-col items-center space-y-2">
              <FiImage size={36} />
              <span className="text-xs">No image</span>
            </div>
          </div>
          {project.thumbnail_url && (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-2">
            {project.category || 'Uncategorized'}
          </span>
          <h3 className="text-lg font-heading font-bold text-white break-words pr-2">{project.title}</h3>
          <div className="flex items-center space-x-1 text-primary text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span>Read More</span>
            <FiArrowRight />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function Projects() {
  const { projects } = useApp()
  const [dbCategories, setDbCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    supabase.from('categories').select('name').order('name').then(({ data }) => {
      if (data) setDbCategories(data.map(c => c.name))
    })
  }, [])

  // Use only DB categories — no hardcoded defaults so deleted categories don't persist
  const allCategories = ['All', ...dbCategories]

  const filteredProjects = (projects || []).filter((project) => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Helmet>
        <title>Portfolio | Abdul Waheed - Graphic Designer</title>
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">Portfolio</span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                My <span className="text-gradient">Work</span>
              </h1>
              <p className="text-gray leading-relaxed">
                A showcase of selected projects that demonstrate my expertise in brand identity,
                visual design, and creative direction.
              </p>
            </div>
          </SectionReveal>

          {/* Search & Filter */}
          <SectionReveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="relative w-full md:w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-12 pr-4 py-3 bg-card border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-gradient-primary text-background'
                        : 'bg-white/5 text-gray hover:text-white border border-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Project Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray text-lg">No projects found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
