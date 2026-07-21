import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { FiDownload, FiExternalLink } from 'react-icons/fi'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useApp } from '../../context/AppContext'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
]

/* ── Sidebar backdrop ── */
function SidebarBackdrop({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
      onClick={onClick}
      aria-hidden="true"
    />
  )
}

/* ── Sidebar panel ── */
function SidebarPanel({ children }) {
  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.8 }}
      className="fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-[320px] bg-[#FFF8F2] border-l border-[#EFE5DA] shadow-2xl lg:hidden flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {children}
    </motion.aside>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('/')
  const location = useLocation()
  const { isScrolled } = useScrollPosition()
  const { siteSettings, socialLinks, heroData } = useApp()

  const logoText = siteSettings?.logo_text || 'AW'
  const logoImage = siteSettings?.logo_image_url || null

  /* ── Track active route ── */
  useEffect(() => {
    setActiveSection(location.pathname)
  }, [location])

  /* ── Close sidebar on route change ── */
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => document.body.classList.remove('no-scroll')
  }, [isOpen])

  /* ── ESC key close ── */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setIsOpen(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  return (
    <>
      {/* ── Navigation bar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
          isScrolled
            ? 'bg-[rgba(255,248,242,0.86)] backdrop-blur-xl border-b border-[#EFE5DA] shadow-[0_8px_30px_-24px_rgba(31,31,31,0.45)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="relative group flex-shrink-0" onClick={close}>
              {logoImage ? (
                <img src={logoImage} alt={logoText} className="h-8 md:h-10 w-auto" />
              ) : (
                <span className="text-xl md:text-2xl font-heading font-bold text-gradient">
                  {logoText}
                </span>
              )}
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-1.5 text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${
                    activeSection === link.path ? 'text-primary' : 'text-[#374151] hover:text-[#EA6A00]'
                  }`}
                >
                  {link.name}
                  {activeSection === link.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-primary"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ml-3 px-5 py-2 bg-gradient-primary text-[#FFF8F2] font-semibold rounded-full text-sm shadow-[0_10px_30px_-16px_rgba(244,122,32,0.55)] transition-all duration-300 whitespace-nowrap"
              >
                Hire Me
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={toggle}
              className="lg:hidden relative w-11 h-11 flex items-center justify-center text-[#1F1F1F] flex-shrink-0 rounded-full border border-[#EFE5DA] bg-white/70 backdrop-blur active:scale-95 transition-transform duration-200"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile sidebar ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <SidebarBackdrop onClick={close} />

            {/* Sidebar panel */}
            <SidebarPanel>
              {/* Close button */}
              <div className="flex items-center justify-between px-5 pt-5 pb-2 border-b border-[#EFE5DA]">
                <span className="text-lg font-heading font-bold text-gradient">{logoText}</span>
                <button
                  onClick={close}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FFF2E8] transition-colors"
                  aria-label="Close menu"
                >
                  <HiX size={20} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      onClick={close}
                      className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                        activeSection === link.path
                          ? 'bg-gradient-primary/10 text-primary'
                          : 'text-[#374151] hover:bg-[#FFF2E8] hover:text-[#EA6A00]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Resume + Socials footer */}
              <div className="border-t border-[#EFE5DA] px-5 py-5 space-y-4">
                {heroData?.resume_url && (
                  <motion.a
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    href={heroData.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-primary text-[#FFF8F2] font-semibold rounded-full text-sm shadow-[0_12px_30px_-16px_rgba(244,122,32,0.6)]"
                  >
                    <FiDownload size={16} />
                    <span>Download Resume</span>
                  </motion.a>
                )}

                {socialLinks?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="flex items-center justify-center gap-3 flex-wrap"
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF] mr-1">Follow</span>
                    {socialLinks
                      .filter((s) => s.active !== false)
                      .slice(0, 5)
                      .map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EFE5DA] text-[#6B7280] hover:border-primary/30 hover:bg-primary hover:text-[#FFF8F2] transition-all duration-200"
                          aria-label={link.platform}
                        >
                          <FiExternalLink size={14} />
                        </a>
                      ))}
                  </motion.div>
                )}
              </div>
            </SidebarPanel>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
