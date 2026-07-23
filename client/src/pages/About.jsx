import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import { FiDownload, FiTarget, FiEye, FiCalendar, FiArrowLeft, FiArrowRight, FiExternalLink, FiAward, FiFile } from 'react-icons/fi'
import SectionReveal from '../components/ui/SectionReveal'
import { staggerContainerFast, staggerItemScale, staggerItem } from '../animations/variants'
import { useApp } from '../context/AppContext'

const tabVariants = {
  enter: { opacity: 0, y: 20, scale: 0.95 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const certIcons = [
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
]

function CertificationsView({ certifications }) {
  const [selectedCert, setSelectedCert] = useState(null)

  if (selectedCert) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
        <motion.button
          onClick={() => setSelectedCert(null)}
          whileHover={{ x: -3 }}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Certifications
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                  <FiAward className="text-accent" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-text-primary">{selectedCert.title}</h3>
                  <p className="text-sm text-accent">{selectedCert.issuer}</p>
                </div>
              </div>
              {selectedCert.issue_date && (
                <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                  <FiCalendar size={12} />
                  <span>Issued: {new Date(selectedCert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              <p className="text-sm text-text-muted leading-relaxed">{selectedCert.description || 'No description available.'}</p>
              {selectedCert.credential_url && (
                <motion.a
                  href={selectedCert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-accent/20 transition-all"
                >
                  <FiExternalLink size={12} /> Verify Credential
                </motion.a>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            {(selectedCert.pdf_url || selectedCert.image_url) ? (
              <Link to={`/certificate/${selectedCert.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl overflow-hidden border border-border-subtle bg-bg-card shadow-card cursor-pointer group"
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-bg-glass">
                    <span className="text-xs font-medium text-text-muted tracking-wide">CERTIFICATE</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-accent group-hover:gap-2 transition-all">
                      <FiFile size={11} /> View full certificate
                    </span>
                  </div>
                  <div className="p-8 flex items-center justify-center min-h-[200px] bg-[#0a0c12]">
                    <div className="text-center">
                      <FiAward size={40} className="mx-auto text-accent/40 mb-3" />
                      <p className="text-sm text-text-muted">Click to view in full detail</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[200px] rounded-2xl border border-dashed border-border-subtle bg-bg-card/30 flex items-center justify-center"
              >
                <p className="text-sm text-text-muted">No certificate file attached.</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const certs = certifications?.length > 0 ? certifications : []

  return (
    <motion.div variants={staggerContainerFast} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {certs.map((cert, i) => (
        <motion.div key={cert.id || i} variants={staggerItem}>
          <motion.div
            onClick={() => setSelectedCert(cert)}
            whileHover={{ y: -4 }}
            className="group relative cursor-pointer p-6 rounded-2xl bg-bg-card/40 backdrop-blur-sm border border-border-subtle hover:border-accent/25 transition-all duration-500 h-full flex flex-col"
          >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent-neural/10 flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(0,240,255,0.06)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.12)] transition-shadow duration-500">
                <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={certIcons[i % certIcons.length]} />
                </svg>
              </div>

              <h3 className="text-base font-heading font-semibold text-text-primary mb-1 leading-snug">{cert.title}</h3>
              <p className="text-xs text-text-muted mb-auto">{cert.issuer}</p>

              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent/70 group-hover:text-accent transition-colors duration-300">
                <span>View details</span>
                <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" size={12} />
              </div>
            </div>

            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function About() {
  const { aboutData, skills, certifications, siteSettings, education, experience } = useApp()
  const location = useLocation()
  const content = siteSettings?.section_titles || {}
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'experience')
  return (
    <>
      <Helmet><title>About | Ali Hassan</title></Helmet>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SectionReveal type="left">
              <div>
                <span className="text-text-muted text-sm font-semibold tracking-[0.25em] uppercase">{content.about_subtitle || 'About'}</span>
                <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6 text-text-primary">{content.about_heading || 'The Work Behind the'} <span className="text-gradient">{content.about_heading_highlight || 'Systems'}</span></h1>
                <p className="leading-relaxed mb-6 text-text-muted">{aboutData?.bio?.split('\n')[0] || content.about_bio_fallback || "I'm an AI Engineer and Full-Stack Developer focused on building production-grade intelligent systems."}</p>
                <p className="leading-relaxed mb-8 text-text-muted">{aboutData?.bio?.split('\n')[1] || content.about_bio_fallback_2 || "Specializing in AI/ML systems, LLM applications, and scalable full-stack platforms."}</p>
                {aboutData?.cv_url && (
                  <motion.a href={aboutData.cv_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] bg-accent text-background font-semibold rounded-full shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300">
                    <FiDownload /><span>{content.about_cv_button || 'Download CV'}</span>
                  </motion.a>
                )}
              </div>
            </SectionReveal>
            <SectionReveal type="right" delay={0.1}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-accent rounded-3xl blur-3xl opacity-30" />
                <motion.div className="relative aspect-square rounded-2xl border border-border-subtle overflow-hidden bg-bg-surface shadow-elevated" whileHover={{ scale: 1.01 }}>
                  {aboutData?.photo_url ? <img src={aboutData.photo_url} alt="About" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-8xl font-heading font-bold text-gradient">AH</span></div>}
                </motion.div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ icon: FiTarget, title: content.about_mission_title || 'My Mission', desc: aboutData?.mission || content.about_mission_fallback || 'To build intelligent systems that empower businesses.' }, { icon: FiEye, title: content.about_vision_title || 'My Vision', desc: aboutData?.vision || content.about_vision_fallback || 'To be at the forefront of AI innovation.' }].map((item, i) => (
              <motion.div key={i} variants={staggerItemScale}>
                <motion.div whileHover={{ y: -4 }} className="p-8 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/15 transition-all duration-500">
                  <motion.div className="text-accent text-xl mb-4" animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}><item.icon /></motion.div>
                  <h3 className="text-lg font-heading font-semibold mb-3 text-text-primary">{item.title}</h3>
                  <p className="leading-relaxed text-text-muted">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal><div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
            {['experience', 'skills', 'education', 'certifications'].map(tab => (
              <motion.button key={tab} onClick={() => setActiveTab(tab)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                className={`px-5 sm:px-6 min-h-[44px] rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab ? 'bg-accent text-background shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-visible'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div></SectionReveal>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} variants={tabVariants} initial="enter" animate="center" exit="exit">
              {activeTab === 'experience' && (
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent-neural/30 to-transparent hidden md:block" />
                  <div className="space-y-6 sm:space-y-10">
                    {(experience || []).map((item, i) => (
                      <SectionReveal key={item.id || i} delay={i * 0.1} type={i % 2 === 0 ? 'left' : 'right'}>
                        <div className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          <div className="hidden md:block flex-1" />
                          <motion.div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(0,240,255,0.5)]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                          <motion.div whileHover={{ x: i % 2 === 0 ? 5 : -5 }} className="flex-1 p-6 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/10 transition-all duration-500">
                            <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2"><FiCalendar size={14} /><span>{item.start_date ? new Date(item.start_date).getFullYear() : ''}{item.end_date ? ` - ${item.end_date === 'Present' ? 'Present' : new Date(item.end_date).getFullYear()}` : ''}</span></div>
                            <h3 className="text-lg font-heading font-semibold text-text-primary">{item.title}</h3>
                            <p className="mt-2 text-sm text-text-muted">{item.description}</p>
                          </motion.div>
                        </div>
                      </SectionReveal>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <motion.div variants={staggerContainerFast} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(skills || []).map((skill, i) => (
                    <motion.div key={skill.id || i} variants={staggerItemScale}>
                      <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-5 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/15 transition-all duration-500">
                        <h4 className="font-medium text-sm text-text-primary mb-3">{skill.name}</h4>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level || 80}%` }} transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                            className="h-full bg-gradient-accent rounded-full shadow-[0_0_8px_rgba(0,240,255,0.3)]" />
                        </div>
                        <span className="mt-1 block text-xs text-text-muted">{skill.level || 80}%</span>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'education' && (
                <motion.div variants={staggerContainerFast} initial="hidden" animate="visible" className="space-y-4">
                  {(education?.length > 0 ? education : []).map((edu, i) => (
                    <motion.div key={edu.id || i} variants={staggerItem}>
                      <motion.div whileHover={{ y: -2, x: 4 }} className="p-6 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/10 transition-all duration-500">
                        <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2"><FiCalendar size={14} /><span>{edu.year || edu.duration || ''}</span></div>
                        <h3 className="text-lg font-heading font-semibold text-text-primary">{edu.degree}</h3>
                        <p className="mt-1 text-sm text-text-muted">{edu.institution}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'certifications' && <CertificationsView certifications={certifications} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
