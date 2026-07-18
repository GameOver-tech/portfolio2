import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { pdfjs, Document, Page } from 'react-pdf'
import {
  FiArrowLeft, FiDownload, FiShare2, FiZoomIn, FiZoomOut,
  FiMaximize2, FiMinimize2, FiChevronLeft, FiChevronRight,
  FiPrinter, FiMail, FiMessageCircle,
  FiUser, FiClock, FiLayers, FiTag, FiImage, FiLayout
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'
import { staggerContainer, staggerItem } from '../animations/variants'

// Configure PDF.js worker for cross-origin loading
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2]
const TOOLBAR_HEIGHT = 64
const PDF_STANDARD_WIDTH = 612 // US Letter points

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-6 py-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full max-w-4xl aspect-[8.5/11] rounded-xl bg-card animate-pulse overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer" />
        </div>
      ))}
    </div>
  )
}

function PDFError({ pdfUrl }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <FiImage className="text-red-400" size={32} />
      </div>
      <h3 className="text-xl font-heading font-bold mb-2">Unable to load PDF</h3>
      <p className="text-gray text-center max-w-md mb-6">
        The PDF could not be loaded. It may be unavailable or the URL may be invalid.
      </p>
      <div className="flex items-center space-x-4">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gradient-primary text-background font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          Open PDF directly
        </a>
      </div>
    </div>
  )
}

function PDFToolbar({
  numPages, pageNumber, setPageNumber, scale, zoomIn, zoomOut,
  fitWidth, fitPage, isFullscreen, toggleFullscreen, pdfUrl, fileName,
  onPrint, onShare
}) {
  const zoomIndex = ZOOM_LEVELS.indexOf(scale)
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1
  const canZoomOut = zoomIndex > 0

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 w-full bg-card/90 backdrop-blur-xl border-b border-white/5 print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between overflow-x-auto scrollbar-none">
        {/* Left group */}
        <div className="flex items-center space-x-1">
          <Link
            to="/projects"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-gray hover:text-white transition-all text-sm whitespace-nowrap"
          >
            <FiArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <a
            href={pdfUrl}
            download={fileName}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-gray hover:text-white transition-all text-sm whitespace-nowrap"
          >
            <FiDownload size={16} />
            <span className="hidden sm:inline">Download</span>
          </a>
          <button
            onClick={onShare}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-gray hover:text-white transition-all text-sm whitespace-nowrap"
          >
            <FiShare2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Center - Zoom */}
        <div className="flex items-center space-x-1 bg-white/5 rounded-lg px-2 py-1">
          <button
            onClick={zoomOut}
            disabled={!canZoomOut}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray hover:text-white transition-all disabled:opacity-30"
            aria-label="Zoom out"
          >
            <FiZoomOut size={16} />
          </button>
          <span className="text-sm font-mono min-w-[48px] text-center text-white select-none">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={!canZoomIn}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray hover:text-white transition-all disabled:opacity-30"
            aria-label="Zoom in"
          >
            <FiZoomIn size={16} />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button
            onClick={fitWidth}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray hover:text-white transition-all"
            title="Fit Width"
            aria-label="Fit width"
          >
            <FiLayout size={14} />
          </button>
        </div>

        {/* Right group */}
        <div className="flex items-center space-x-1">
          {/* Page Navigation */}
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg px-2 py-1">
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className="p-1.5 rounded-md hover:bg-white/10 text-gray hover:text-white transition-all disabled:opacity-30"
              aria-label="Previous page"
            >
              <FiChevronLeft size={16} />
            </button>
            <input
              type="number"
              value={pageNumber}
              onChange={(e) => {
                const val = Math.min(numPages, Math.max(1, parseInt(e.target.value) || 1))
                setPageNumber(val)
              }}
              className="w-10 bg-transparent text-center text-sm text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={1}
              max={numPages}
              aria-label="Current page number"
            />
            <span className="text-xs text-gray select-none">/ {numPages}</span>
            <button
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
              className="p-1.5 rounded-md hover:bg-white/10 text-gray hover:text-white transition-all disabled:opacity-30"
              aria-label="Next page"
            >
              <FiChevronRight size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={onPrint}
            className="p-2 rounded-lg hover:bg-white/5 text-gray hover:text-white transition-all"
            aria-label="Print"
          >
            <FiPrinter size={16} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/5 text-gray hover:text-white transition-all"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectHero({ project }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const tags = project.software?.split(',').map((s) => s.trim()) || []

  return (
    <section className="relative pt-28 pb-12 overflow-hidden">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 text-sm text-gray mb-8"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-white">{project.title}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left - Project Info */}
          <div className="lg:col-span-3">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-primary text-sm font-semibold uppercase tracking-wider mb-3"
            >
              {project.category}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight"
            >
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray text-lg leading-relaxed max-w-2xl"
            >
              {project.description}
            </motion.p>

            {/* Tags */}
            {tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mt-6"
              >
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right - Project Details Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-6 space-y-4"
            >
              {/* Thumbnail */}
              {project.thumbnail_url && (
                <div className="rounded-xl overflow-hidden mb-4">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <FiUser className="text-primary shrink-0" size={16} />
                  <span className="text-gray">Designer:</span>
                  <span>Abdul Waheed</span>
                </div>
                {project.created_at && (
                  <div className="flex items-center space-x-3 text-sm">
                    <FiClock className="text-primary shrink-0" size={16} />
                    <span className="text-gray">Date:</span>
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                )}
                {project.software && (
                  <div className="flex items-start space-x-3 text-sm">
                    <FiLayers className="text-primary shrink-0 mt-0.5" size={16} />
                    <div>
                      <span className="text-gray">Software:</span>
                      <span className="ml-1">{project.software}</span>
                    </div>
                  </div>
                )}
                {project.client && (
                  <div className="flex items-center space-x-3 text-sm">
                    <FiTag className="text-primary shrink-0" size={16} />
                    <span className="text-gray">Client:</span>
                    <span>{project.client}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedProjects({ current, projects }) {
  if (!projects || projects.length < 2) return null

  const related = projects
    .filter((p) => p.id !== current.id && p.category === current.category && p.status === 'published')
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="blob blob-2 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Related <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-gray max-w-xl mx-auto">Explore more work in this category</p>
          </div>
        </SectionReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {related.map((project) => (
            <motion.div key={project.id} variants={staggerItem}>
              <Link
                to={project.pdf_url ? `/portfolio/${project.slug}` : `/projects/${project.slug}`}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-white/5 min-h-[240px]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-card">
                    <div className="absolute inset-0 flex items-center justify-center text-gray">
                      <FiImage size={36} />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-2">
                      {project.category || 'Uncategorized'}
                    </span>
                    <h3 className="text-base font-heading font-bold text-white">{project.title}</h3>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CTASection() {
  const { siteSettings } = useApp()
  const whatsapp = siteSettings?.whatsapp || '923291966097'

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 animated-grid opacity-30" />
      <div
        className="blob blob-1"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionReveal>
          <motion.div className="glass rounded-3xl p-8 md:p-12 border border-white/5">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Like the project?
            </h2>
            <p className="text-gray text-lg mb-8 max-w-lg mx-auto">
              Let&apos;s work together and create something amazing for your brand.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-gradient-primary text-background font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <FiMail size={18} />
                <span>Contact Me</span>
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 border border-primary/40 text-primary font-semibold rounded-xl hover:bg-primary/10 transition-all duration-300 flex items-center space-x-2"
              >
                <FiMessageCircle size={18} />
                <span>Hire Me</span>
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-green-600/20 border border-green-500/30 text-green-400 font-semibold rounded-xl hover:bg-green-600/30 transition-all duration-300 flex items-center space-x-2"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  )
}

export default function PortfolioViewer() {
  const { slug } = useParams()
  const { projects } = useApp()
  const project = projects?.find((p) => p.slug === slug)

  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const containerRef = useRef(null)
  const viewerRef = useRef(null)

  const onDocumentLoadSuccess = useCallback(({ numPages: pages }) => {
    setNumPages(pages)
    setPdfLoaded(true)
    setPdfError(false)
    setPageNumber(1)
  }, [])

  const onDocumentLoadError = useCallback(() => {
    setPdfError(true)
    setPdfLoaded(false)
  }, [])

  // Auto-fit to width on initial load for smaller viewports
  useEffect(() => {
    if (containerRef.current && pdfLoaded) {
      const containerWidth = containerRef.current.clientWidth - 32
      if (containerWidth < PDF_STANDARD_WIDTH) {
        setScale(Math.round((containerWidth / PDF_STANDARD_WIDTH) * 100) / 100)
      }
    }
  }, [pdfLoaded])

  const zoomIn = useCallback(() => {
    setScale((prev) => {
      const idx = ZOOM_LEVELS.indexOf(prev)
      return idx < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[idx + 1] : prev
    })
  }, [])

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const idx = ZOOM_LEVELS.indexOf(prev)
      return idx > 0 ? ZOOM_LEVELS[idx - 1] : prev
    })
  }, [])

  const fitWidth = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32
      const fitScale = containerWidth / PDF_STANDARD_WIDTH
      setScale(Math.round(fitScale * 100) / 100)
    }
  }, [])

  const fitPage = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32
      const containerHeight = window.innerHeight - TOOLBAR_HEIGHT - 100
      const scaleW = containerWidth / PDF_STANDARD_WIDTH
      const scaleH = containerHeight / 792 // US Letter height
      setScale(Math.round(Math.min(scaleW, scaleH) * 100) / 100)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await viewerRef.current?.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Fullscreen API not supported or denied
    }
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: project?.title || 'Portfolio', url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {})
    }
  }, [project])

  // Track fullscreen changes from browser controls
  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFSChange)
    return () => document.removeEventListener('fullscreenchange', handleFSChange)
  }, [])

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary hover:underline">Back to Projects</Link>
        </div>
      </div>
    )
  }

  const pdfUrl = project.pdf_url

  return (
    <>
      <Helmet>
        <title>{project.title} | Portfolio | Abdul Waheed</title>
        <meta name="description" content={project.description?.slice(0, 160)} />
        <meta property="og:title" content={`${project.title} | Abdul Waheed`} />
        <meta property="og:description" content={project.description?.slice(0, 200)} />
        {project.thumbnail_url && <meta property="og:image" content={project.thumbnail_url} />}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://abdulwaheed.design/portfolio/${project.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            author: { '@type': 'Person', name: 'Abdul Waheed' },
            ...(project.thumbnail_url && { image: project.thumbnail_url }),
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <ProjectHero project={project} />

      {/* PDF Viewer */}
      {pdfUrl ? (
        <section className="relative pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl overflow-hidden border border-white/5"
              >
                <PDFToolbar
                  numPages={numPages || 1}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  scale={scale}
                  zoomIn={zoomIn}
                  zoomOut={zoomOut}
                  fitWidth={fitWidth}
                  fitPage={fitPage}
                  isFullscreen={isFullscreen}
                  toggleFullscreen={toggleFullscreen}
                  pdfUrl={pdfUrl}
                  fileName={`${project.slug || 'portfolio'}.pdf`}
                  onPrint={handlePrint}
                  onShare={handleShare}
                />

                <div ref={containerRef} className="bg-[#0a0a0a] relative min-h-[500px]">
                  {!pdfLoaded && !pdfError && <LoadingSkeleton />}

                  {pdfError && <PDFError pdfUrl={pdfUrl} />}

                  <div
                    ref={viewerRef}
                    className="flex flex-col items-center py-8 space-y-6 print:space-y-0"
                  >
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={<LoadingSkeleton />}
                      error={<PDFError pdfUrl={pdfUrl} />}
                    >
                      {numPages > 0 &&
                        Array.from({ length: numPages }, (_, index) => (
                          <motion.div
                            key={`page_${index + 1}`}
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            viewport={{ once: true, margin: '-100px' }}
                            className="rounded-lg overflow-hidden shadow-2xl shadow-black/50 print:shadow-none print:rounded-none"
                          >
                            <Page
                              pageNumber={index + 1}
                              scale={scale}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="pdf-page"
                              loading={
                                <div className="w-[612px] max-w-full aspect-[8.5/11] bg-card animate-pulse rounded-lg" />
                              }
                            />
                          </motion.div>
                        ))}
                    </Document>
                  </div>
                </div>
              </motion.div>
            </SectionReveal>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="glass rounded-2xl p-12 border border-white/5">
              <FiImage className="mx-auto text-gray mb-4" size={48} />
              <h3 className="text-2xl font-heading font-bold mb-2">No PDF Available</h3>
              <p className="text-gray mb-6">This project doesn't have a portfolio PDF to display.</p>
              <Link to="/projects" className="text-primary hover:underline">Back to Projects</Link>
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      <RelatedProjects current={project} projects={projects} />

      {/* CTA Section */}
      <CTASection />
    </>
  )
}
