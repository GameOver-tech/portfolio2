import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiDownload, FiTarget, FiEye } from 'react-icons/fi'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'

const timeline = [
  { year: '2024', event: 'Senior Brand Designer at Creative Agency', desc: 'Leading design team for major brand projects.' },
  { year: '2022', event: 'Launched Independent Studio', desc: 'Started freelance practice serving global clients.' },
  { year: '2020', event: 'UI/UX Design Lead', desc: 'Transitioned into digital product design.' },
  { year: '2018', event: 'Started Design Career', desc: 'Began professional journey in graphic design.' },
]

export default function About() {
  const { aboutData, skills } = useApp()
  const [activeTab, setActiveTab] = useState('experience')

  return (
    <>
      <Helmet>
        <title>About | Abdul Waheed - Graphic Designer</title>
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SectionReveal>
              <div>
                <span className="text-primary text-sm font-semibold tracking-widest uppercase">About Me</span>
                <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                  The Story Behind the <span className="text-gradient">Design</span>
                </h1>
                <p className="leading-relaxed mb-6 text-[#4B5563]">
                  {aboutData?.bio?.split('\n')[0] || "I'm a passionate graphic designer with over 8 years of experience creating visual identities that resonate. My approach combines strategic thinking with creative execution to deliver designs that not only look beautiful but achieve real results."}
                </p>
                <p className="leading-relaxed mb-8 text-[#4B5563]">
                  {aboutData?.bio?.split('\n')[1] || "Specializing in brand identity, logo design, and visual communication, I've had the privilege of working with 200+ clients worldwide, from startups to established enterprises."}
                </p>
                {aboutData?.cv_url && (
                  <a
                    href={aboutData.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] bg-gradient-primary text-background font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95"
                  >
                    <FiDownload />
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-3xl" />
                <div className="relative aspect-square rounded-3xl bg-card border border-white/10 overflow-hidden">
                  {aboutData?.photo_url ? (
                    <img src={aboutData.photo_url} alt="About" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl font-heading font-bold text-gradient">AW</span>
                    </div>
                  )}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionReveal>
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-card border border-white/5 group hover:border-primary/20 transition-all duration-500"
              >
                <FiTarget className="text-primary text-3xl mb-4" />
                <h3 className="text-2xl font-heading font-bold mb-3">My Mission</h3>
                <p className="leading-relaxed text-[#4B5563]">
                  {aboutData?.mission || 'To empower brands with compelling visual identities that communicate their unique story and connect with their audience on a deeper level.'}
                </p>
              </motion.div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-card border border-white/5 group hover:border-primary/20 transition-all duration-500"
              >
                <FiEye className="text-primary text-3xl mb-4" />
                <h3 className="text-2xl font-heading font-bold mb-3">My Vision</h3>
                <p className="leading-relaxed text-[#4B5563]">
                  {aboutData?.vision || 'To be the most sought-after design studio known for creating iconic brands that shape industries and inspire the next generation of designers.'}
                </p>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Experience & Skills Tabs */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
              {['experience', 'skills', 'education'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 sm:px-6 min-h-[44px] rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 ${
                    activeTab === tab
                      ? 'bg-gradient-primary text-background'
                      : 'bg-white/5 text-[#4B5563] hover:text-[#1F2937] border border-[#EFE5DA]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </SectionReveal>

          {activeTab === 'experience' && (
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />
              <div className="space-y-6 sm:space-y-12">
                {timeline.map((item, i) => (
                  <SectionReveal key={i} delay={i * 0.1}>
                    <div className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="hidden md:block flex-1" />
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
                      <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-card border border-white/5">
                        <span className="text-primary font-bold text-sm">{item.year}</span>
                        <h3 className="text-lg font-heading font-bold mt-1">{item.event}</h3>
                        <p className="mt-2 text-sm text-[#4B5563]">{item.desc}</p>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(skills?.length > 0
                ? skills
                : [
                    { name: 'Adobe Photoshop', level: 95 },
                    { name: 'Adobe Illustrator', level: 92 },
                    { name: 'Figma', level: 88 },
                    { name: 'Brand Strategy', level: 90 },
                  ]
              ).map((skill, i) => (
                <SectionReveal key={skill.id || i} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="p-6 rounded-2xl bg-card border border-white/5 group hover:border-primary/20 transition-all duration-500"
                  >
                    <h4 className="font-semibold mb-3">{skill.name}</h4>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level || 80}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                        className="h-full bg-gradient-primary rounded-full"
                      />
                    </div>
                    <span className="mt-1 block text-xs text-[#6B7280]">{skill.level || 80}%</span>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              {[
                { degree: 'Matriculation', school: 'Government High school', year: '2021 – 2022' },
                { degree: 'Intermediate', school: 'Quaid-e-Azam Collage Gojra', year: '2023 – 2024' },
                { degree: 'BSCS(3rd semester)', school: '(LIMS) Gojra', year: '2025 – Present' },
              ].map((edu, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl bg-card border border-white/5">
                    <span className="text-primary text-sm font-semibold">{edu.year}</span>
                    <h3 className="text-xl font-heading font-bold mt-1">{edu.degree}</h3>
                    <p className="mt-1 text-sm text-[#4B5563]">{edu.school}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
