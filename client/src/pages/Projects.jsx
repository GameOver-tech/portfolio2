import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiSearch, FiArrowRight, FiImage } from 'react-icons/fi'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'
import { supabase } from '../services/supabase'

function ProjectCard({ project }) {
  const detailLink = project.pdf_url ? `/portfolio/${project.slug}` : `/projects/${project.slug}`
  const externalUrl = project.project_url || '#'
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-[#EFE5DA] bg-white p-3 shadow-[0_24px_70px_-40px_rgba(31,31,31,0.3)]"
    >
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.title} live site`}
        className="block"
        onClick={(e) => {
          if (externalUrl === '#') e.preventDefault()
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#FFF2E8]">
          <div className="absolute inset-0 flex items-center justify-center text-[#9CA3AF]">
            <div className="flex flex-col items-center space-y-2">
              <FiImage size={36} />
              <span className="text-xs">No image</span>
            </div>
          </div>
          {project.thumbnail_url && (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
        </div>
      </a>

      <Link to={detailLink} className="relative block p-4 pt-5">
        <span className="mb-2 inline-flex rounded-full bg-[#FFF2E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
          {project.category || 'Uncategorized'}
        </span>
        <h3 className="break-words pr-2 font-heading text-lg font-bold text-[#1F1F1F]">{project.title}</h3>
        <div className="mt-3 flex items-center space-x-2 text-sm font-semibold text-primary">
          <span>Read More</span>
          <FiArrowRight />
        </div>
      </Link>
    </motion.div>
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

      <section className="relative overflow-hidden pb-20 pt-32">
        <div className="blob blob-1" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Portfolio</span>
              <h1 className="mt-4 mb-6 font-heading text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-bold text-[#1F1F1F]">
                My <span className="text-gradient">Work</span>
              </h1>
              <p className="text-lg leading-8 text-[#4B5563]">
                A showcase of selected projects that demonstrate my expertise in brand identity,
                digital product design, and modern user experience.
              </p>
            </div>
          </SectionReveal>

          {/* Search & Filter */}
          <SectionReveal>
            <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:gap-6 rounded-[1.75rem] border border-[#EFE5DA] bg-white/80 p-4 sm:p-5 shadow-[0_24px_70px_-40px_rgba(31,31,31,0.25)] md:flex-row md:p-6">
              <div className="relative w-full md:w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full rounded-full border border-[#EFE5DA] bg-[#FFF8F2] py-3 pl-12 pr-4 text-sm text-[#1F1F1F] transition-colors focus:border-primary focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none pb-1">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 sm:px-5 min-h-[40px] text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                      activeCategory === category
                        ? 'bg-gradient-primary text-[#FFF8F2] shadow-[0_12px_32px_-18px_rgba(244,122,32,0.7)]'
                        : 'border border-[#EFE5DA] bg-white text-[#4B5563] hover:border-primary/30 hover:text-[#1F1F1F]'
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
            <div className="rounded-[1.75rem] border border-[#EFE5DA] bg-white/80 py-20 text-center shadow-[0_24px_70px_-40px_rgba(31,31,31,0.25)]">
              <p className="text-lg text-[#4B5563]">No projects found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
