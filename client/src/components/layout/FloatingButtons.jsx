import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'
import { useApp } from '../../context/AppContext'

export default function FloatingButtons() {
  const { siteSettings } = useApp()
  const [showScroll, setShowScroll] = useState(false)
  const [chatbotOpen, setChatbotOpen] = useState(false)

  useEffect(() => {
    const h = () => setShowScroll(window.scrollY > 400)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setChatbotOpen(!!window.__chatbotOpen)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const openWA = () => { const wa = siteSettings?.whatsapp || '923291966097'; window.open(`https://wa.me/${wa}`, '_blank') }

  if (chatbotOpen) return null

  return (
    <>
      {/* WhatsApp — bottom-right, under chatbot */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openWA}
        className="fixed z-[999] w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,211,102,0.25)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(37,211,102,0.5)]"
        style={{ bottom: 'max(24px, calc(24px + env(safe-area-inset-bottom, 0px)))', right: '24px' }}
        aria-label="Contact via WhatsApp"
      >
        <FaWhatsapp size={20} />
      </motion.button>

      {/* Scroll to top — above chatbot */}
      <div className={`fixed z-[60] transition-all duration-300 ${showScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ bottom: 'max(156px, calc(156px + env(safe-area-inset-bottom, 0px)))', right: '24px' }}>
        <AnimatePresence>
          {showScroll && (
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              onClick={scrollToTop}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border-subtle bg-bg-glass backdrop-blur-sm flex items-center justify-center text-text-muted hover:border-accent/30 hover:text-accent hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all duration-300 ease-in-out hover:-translate-y-1 shadow-lg flex-shrink-0"
              aria-label="Scroll to top"
            >
              <HiArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
