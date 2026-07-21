import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FaLinkedin, FaTwitter, FaBehance } from 'react-icons/fa'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'

const defaultTeam = [
  { name: 'Abdul Waheed', role: 'Founder & Creative Director', photo_url: null, description: 'Visionary designer with 8+ years of experience in brand identity.' },
]

const socialIconMap = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  behance: FaBehance,
}

export default function Team() {
  const { team } = useApp()
  const teamMembers = team?.length > 0 ? team : defaultTeam

  return (
    <>
      <Helmet>
        <title>Team | Abdul Waheed</title>
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">Team</span>
              <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                The Creative <span className="text-gradient">Minds</span>
              </h1>
              <p className="leading-relaxed text-[#4B5563]">
                Meet the talented people behind the designs. We're a team of passionate creatives
                dedicated to bringing your vision to life.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <SectionReveal key={member.id || i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/20 transition-all duration-500 text-center"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-500">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-3xl font-bold text-background">{member.name?.[0] || 'A'}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-semibold mb-4">{member.role}</p>
                    {member.description && (
                      <p className="mb-6 text-sm leading-relaxed text-[#4B5563]">{member.description}</p>
                    )}
                    {member.social_links && (
                      <div className="flex justify-center space-x-3">
                        {Object.entries(member.social_links).map(([platform, url]) => {
                          const Icon = socialIconMap[platform]
                          if (!Icon) return null
                          return (
                            <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray hover:bg-primary hover:text-background transition-all duration-300">
                              <Icon size={15} />
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
