import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowUp } from 'react-icons/hi'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaLinkedin, FaBehance, FaDribbble, FaTwitter, FaInstagram, FaFacebook, FaGithub, FaYoutube } from 'react-icons/fa'
import { useApp } from '../../context/AppContext'
import { adminAPI } from '../../services/api'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
]

const socialIconMap = {
  whatsapp: FaWhatsapp,
  linkedin: FaLinkedin,
  behance: FaBehance,
  dribbble: FaDribbble,
  twitter: FaTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
  github: FaGithub,
  youtube: FaYoutube,
}

export default function Footer() {
  const { siteSettings, socialLinks } = useApp()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await adminAPI.subscribe(email)
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus(''), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden border-t border-[#EFE5DA] bg-[linear-gradient(180deg,#FFF8F2_0%,#FFF2E8_100%)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand — bio text from settings */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-heading font-bold text-gradient">
              AW
            </Link>
            <p className="text-sm leading-7 text-[#4B5563]">
              {siteSettings?.site_description || 'Creating premium visual experiences that elevate brands and leave lasting impressions.'}
            </p>
            <div className="flex space-x-3">
              {(socialLinks || []).filter(s => s.active !== false).map((link) => {
                const Icon = socialIconMap[link.platform] || FiMail
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EFE5DA] bg-white/80 text-[#4B5563] transition-all duration-300 hover:border-primary/30 hover:bg-primary hover:text-[#FFF8F2]"
                    title={link.platform}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-heading font-semibold text-[#1F1F1F]">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#4B5563] transition-colors duration-300 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — values from siteSettings */}
          <div>
            <h3 className="mb-6 text-lg font-heading font-semibold text-[#1F1F1F]">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-[#4B5563]">
                <FiMail className="mt-0.5 flex-shrink-0 text-primary" size={16} />
                <span>{siteSettings?.contact_email || 'abdulwaheedgraphics097@gmail.com'}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-[#4B5563]">
                <FiPhone className="mt-0.5 flex-shrink-0 text-primary" size={16} />
                <span>{siteSettings?.phone || '+92 329 1966097'}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-[#4B5563]">
                <FiMapPin className="mt-0.5 flex-shrink-0 text-primary" size={16} />
                <span>{siteSettings?.address || 'Lahore, Pakistan'}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-lg font-heading font-semibold text-[#1F1F1F]">Newsletter</h3>
            <p className="mb-4 text-sm text-[#4B5563]">
              Subscribe for design insights and updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-[#EFE5DA] bg-white/80 px-4 min-h-[48px] text-sm text-[#1F1F1F] placeholder:text-[#9CA3AF] focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-xl bg-gradient-primary px-4 min-h-[48px] text-sm font-semibold text-[#FFF8F2] shadow-[0_16px_44px_-20px_rgba(244,122,32,0.75)] transition-all duration-300 disabled:opacity-50 active:scale-95"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {status === 'success' && (
                <p className="text-primary text-xs">Subscribed successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-xs">Something went wrong.</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#EFE5DA] pt-8 sm:flex-row">
          <p className="text-sm text-[#4B5563]">
            {siteSettings?.copyright_text || `© ${new Date().getFullYear()} ${siteSettings?.site_name || 'Abdul Waheed'}. All rights reserved.`}
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 text-[#4B5563] transition-colors duration-300 hover:text-primary"
          >
            <span className="text-sm">Back to top</span>
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HiArrowUp />
            </motion.span>
          </button>
        </div>

        {/* Developer Credit */}
        <div className="mt-4 flex items-center justify-center border-t border-[#EFE5DA]/80 pt-4">
          <p className="text-center text-xs text-[#9CA3AF] transition-colors duration-300 hover:text-[#4B5563]">
            Crafted with precision by <a href="https://anssol.com" target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-primary">anssol.com</a> — Developer{' '}
            <a href="https://wa.me/923102850365" target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-primary">Ali Hassan</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
