import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiDownload, FiTarget, FiEye, FiCalendar } from 'react-icons/fi'
import SectionReveal from '../components/ui/SectionReveal'
import { staggerContainerFast, staggerItemScale, staggerItem } from '../animations/variants'
import { useApp } from '../context/AppContext'

const timeline = [
  { year: '2024', event: 'Full-Stack Developer (Freelance)', desc: 'Building custom web applications, AI systems, and APIs for clients worldwide.' },
  { year: '2023', event: 'AI Engineer Intern', desc: 'Developed AI-powered chatbots, RAG systems, and LLM integrations for enterprise clients.' },
  { year: '2022', event: 'Junior Web Developer', desc: 'Built responsive web applications using React, Node.js, and PostgreSQL.' },
]

const tabVariants = {
  enter: { opacity: 0, y: 20, scale: 0.95 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function About() {
  const { aboutData, skills, certifications } = useApp()
  const [activeTab, setActiveTab] = useState('experience')
  return (
    <>
      <Helmet><title>About | Ali Hassan</title></Helmet>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SectionReveal type="left">
              <div>
                <span className="text-text-muted text-sm font-semibold tracking-[0.25em] uppercase">About</span>
                <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6 text-text-primary">The Work Behind the <span className="text-gradient">Systems</span></h1>
                <p className="leading-relaxed mb-6 text-text-muted">{aboutData?.bio?.split('\n')[0] || "I'm an AI Engineer and Full-Stack Developer focused on building production-grade intelligent systems."}</p>
                <p className="leading-relaxed mb-8 text-text-muted">{aboutData?.bio?.split('\n')[1] || "Specializing in AI/ML systems, LLM applications, and scalable full-stack platforms."}</p>
                {aboutData?.cv_url && (
                  <motion.a href={aboutData.cv_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] bg-accent text-background font-semibold rounded-full shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300">
                    <FiDownload /><span>Download CV</span>
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
            {[{ icon: FiTarget, title: 'My Mission', desc: aboutData?.mission || 'To build intelligent systems that empower businesses.' }, { icon: FiEye, title: 'My Vision', desc: aboutData?.vision || 'To be at the forefront of AI innovation.' }].map((item, i) => (
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
                    {timeline.map((item, i) => (
                      <SectionReveal key={i} delay={i * 0.1} type={i % 2 === 0 ? 'left' : 'right'}>
                        <div className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          <div className="hidden md:block flex-1" />
                          <motion.div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_rgba(0,240,255,0.5)]" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                          <motion.div whileHover={{ x: i % 2 === 0 ? 5 : -5 }} className="flex-1 p-6 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/10 transition-all duration-500">
                            <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2"><FiCalendar size={14} /><span>{item.year}</span></div>
                            <h3 className="text-lg font-heading font-semibold text-text-primary">{item.event}</h3>
                            <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
                          </motion.div>
                        </div>
                      </SectionReveal>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <motion.div variants={staggerContainerFast} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(skills?.length > 0 ? skills : [
                    { name: 'React.js', level: 85 }, { name: 'Node.js', level: 80 }, { name: 'TypeScript', level: 75 },
                    { name: 'Python', level: 70 }, { name: 'Graphics Design', level: 90 }, { name: 'Adobe Creative Suite', level: 88 },
                    { name: 'Supabase / SQL', level: 75 }, { name: 'Framer Motion', level: 82 },
                  ]).map((skill, i) => (
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
                  {[{ degree: 'BS Information Technology', school: 'Akhuwat University', year: '2024 \u2013 Present' }, { degree: 'ICS (Intermediate)', school: 'Punjab College', year: '2022 \u2013 2024' }, { degree: 'Matriculation', school: 'Govt High School', year: '2020 \u2013 2022' }].map((edu, i) => (
                    <motion.div key={i} variants={staggerItem}>
                      <motion.div whileHover={{ y: -2, x: 4 }} className="p-6 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/10 transition-all duration-500">
                        <div className="flex items-center gap-2 text-accent text-sm font-medium mb-2"><FiCalendar size={14} /><span>{edu.year}</span></div>
                        <h3 className="text-lg font-heading font-semibold text-text-primary">{edu.degree}</h3>
                        <p className="mt-1 text-sm text-text-muted">{edu.school}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'certifications' && (
                <motion.div variants={staggerContainerFast} initial="hidden" animate="visible" className="space-y-4">
                  {(certifications?.length > 0 ? certifications : []).map((cert, i) => (
                    <motion.div key={cert.id || i} variants={staggerItem}>
                      <motion.div whileHover={{ y: -2, x: 4 }} className="p-6 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/10 transition-all duration-500">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-heading font-semibold text-text-primary">{cert.title}</h3>
                            <p className="mt-1 text-sm text-accent">{cert.issuer}</p>
                            {cert.description && <p className="mt-2 text-sm text-text-muted">{cert.description}</p>}
                          </div>
                          {cert.credential_url && (
                            <motion.a href={cert.credential_url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }}
                              className="flex-shrink-0 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-accent/20 transition-all">
                              Verify →
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
