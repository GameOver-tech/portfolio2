import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiDownload, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp, FaLinkedin, FaBehance, FaDribbble } from 'react-icons/fa'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useApp } from '../../context/AppContext'

const HeroPortrait = memo(function HeroPortrait({ photoUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, y: -4 }}
    >
      <div className="relative flex h-[180px] w-[180px] items-center justify-center sm:h-[260px] sm:w-[260px] md:h-[320px] md:w-[320px] lg:h-[420px] lg:w-[420px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-10px] rounded-full border border-primary/25 sm:inset-[-18px] hidden sm:block"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-4px] rounded-full border border-[#F4A259]/35 sm:inset-[-12px] hidden sm:block"
        />
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-3xl sm:inset-6"
        />
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary/70 shadow-lg shadow-primary/30 sm:right-3 sm:top-5 sm:h-3.5 sm:w-3.5"
        />
        <motion.div
          animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-4 left-2 h-2 w-2 rounded-full border border-primary/30 sm:bottom-8 sm:left-5 sm:h-2.5 sm:w-2.5"
        />
        <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-white/95 bg-white p-1 shadow-[0_40px_90px_-30px_rgba(31,31,31,0.35)] sm:border-[10px] sm:p-2">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Abdul Waheed"
              loading="eager"
              decoding="async"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#FFF2E8] via-white to-[#FFF8F2] text-4xl font-heading font-bold text-gradient sm:text-8xl">
              AW
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { normalized } = useMousePosition()
  const { heroData, socialLinks } = useApp()

  const roles = heroData?.typing_titles || ['Product Engineer', 'Full-Stack Developer', 'Design Systems Partner', 'Digital Product Creator']
  const badgeText = heroData?.badge_text || 'Available for ambitious products'
  const heroName = heroData?.name || 'Abdul Waheed'
  const introParagraph = heroData?.intro_paragraph || 'Building polished digital experiences with the clarity of a product team and the precision of a senior engineer.'

  useEffect(() => {
    const currentRole = roles[roleIndex]
    let timeout

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentRole.slice(0, displayText.length - 1)
            : currentRole.slice(0, displayText.length + 1)
        )
      }, isDeleting ? 50 : 100)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, roleIndex, roles])

  const socialIconMap = {
    whatsapp: FaWhatsapp,
    linkedin: FaLinkedin,
    behance: FaBehance,
    dribbble: FaDribbble,
  }

  return (
    <section className="relative min-h-[100dvh] pt-24 md:pt-28 flex items-center overflow-x-hidden">
      <div className="absolute inset-0 animated-grid opacity-70" />
      <div className="absolute inset-0 bg-gradient-soft" />

      <div
        className="blob blob-1"
        style={{
          transform: `translate(${(normalized.x - 0.5) * 28}px, ${(normalized.y - 0.5) * 28}px)`,
        }}
      />
      <div
        className="blob blob-2"
        style={{
          transform: `translate(${(normalized.x - 0.5) * -28}px, ${(normalized.y - 0.5) * -28}px)`,
        }}
      />

      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:block absolute top-24 left-8 md:left-16 w-20 h-20 border border-primary/20 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:block absolute bottom-28 right-6 md:right-16 w-32 h-32 border border-primary/10 rounded-full"
      />

      <div className="relative w-full max-w-7xl mx-auto px-[clamp(16px,5vw,32px)] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 lg:gap-16 items-start lg:items-center">
          {/* Portrait — first in DOM for mobile-first stacking */}
          <div className="lg:order-2 flex justify-center pt-4 sm:pt-6 lg:pt-0">
            <HeroPortrait photoUrl={heroData?.photo_url} />
          </div>

          {/* Text content */}
          <div className="lg:order-1 space-y-5 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary shadow-[0_16px_45px_-24px_rgba(244,122,32,0.55)]">
                {badgeText}
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-[clamp(2rem,7vw,2.8rem)] sm:text-5xl lg:text-7xl xl:text-[5.2rem] font-heading font-bold leading-[1.05] sm:leading-[1] lg:leading-[0.95] tracking-[-0.03em] text-[#1F1F1F]">
              {heroName.split(' ')[0]}
              <br />
              <span className="text-gradient">{heroName.split(' ').slice(1).join(' ') || heroName}</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <span className="text-[clamp(1.125rem,4vw,1.5rem)] sm:text-2xl lg:text-3xl font-animation text-[#4B5563]">I build</span>
              <span className="text-[clamp(1.125rem,4vw,1.5rem)] sm:text-2xl lg:text-3xl font-animation text-gradient font-bold">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="max-w-xl mx-auto lg:mx-0 text-[clamp(0.95rem,3.5vw,1.05rem)] sm:text-lg leading-[1.6] sm:leading-8 text-[#4B5563]">
              {introParagraph}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <Link to="/contact" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 sm:px-7 min-h-[48px] font-semibold text-sm sm:text-base text-[#FFF8F2] shadow-[0_16px_44px_-20px_rgba(244,122,32,0.7)] transition-all duration-300 active:scale-95 hover:-translate-y-0.5 whitespace-nowrap">
                <span>Start a Project</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1 flex-shrink-0" />
              </Link>
              <Link to="/projects" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EFE5DA] bg-white/80 px-6 sm:px-7 min-h-[48px] font-semibold text-sm sm:text-base text-[#1F1F1F] transition-all duration-300 active:scale-95 hover:border-primary/30 hover:bg-white whitespace-nowrap">
                <span>View Portfolio</span>
              </Link>
              {heroData?.resume_url && (
                <a href={heroData.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EFE5DA] bg-transparent px-6 sm:px-7 min-h-[48px] font-semibold text-sm sm:text-base text-[#4B5563] transition-all duration-300 active:scale-95 hover:border-primary/30 hover:text-[#1F1F1F] whitespace-nowrap">
                  <FiDownload />
                  <span>Resume</span>
                </a>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">
              <span className="text-sm font-medium uppercase tracking-[0.35em] text-[#9CA3AF]">Follow</span>
              <div className="flex gap-2 sm:gap-3">
                {(socialLinks?.length > 0 ? socialLinks : []).map((link) => {
                  const Icon = socialIconMap[link.platform] || FiArrowRight
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EFE5DA] bg-white/80 text-[#4B5563] transition-all duration-300 hover:border-primary/30 hover:bg-primary hover:text-[#FFF8F2] active:scale-90">
                      <Icon size={16} />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
        <span className="text-xs uppercase tracking-[0.35em] text-[#9CA3AF]">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="h-8 w-0.5 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  )
}
