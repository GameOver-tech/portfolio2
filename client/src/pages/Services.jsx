import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight } from 'react-icons/fi'
import SectionReveal from '../components/ui/SectionReveal'
import { staggerContainerFast, staggerItemScale } from '../animations/variants'
import { useApp } from '../context/AppContext'

export default function Services() {
  const { services, siteSettings, processSteps } = useApp()
  const content = siteSettings?.section_titles || {}
  const serviceList = services || []

  return (
    <>
      <Helmet><title>Services | Ali Hassan</title></Helmet>
      <section className="relative pt-24 sm:pt-32 pb-[72px] sm:pb-20 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal type="blur"><div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <motion.span initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} className="text-text-muted text-sm font-semibold tracking-[0.25em] uppercase">{content.services_subtitle || 'Services'}</motion.span>
            <h1 className="text-[clamp(1.8rem,6vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-4 sm:mb-6 text-text-primary">{content.services_heading || 'What I'} <span className="text-gradient">{content.services_heading_highlight || 'Deliver'}</span></h1>
            <p className="leading-relaxed text-sm sm:text-base text-text-muted">{content.services_description || 'Production-ready AI systems and software built for reliability, scale, and business impact.'}</p>
          </div></SectionReveal>

          <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceList.map((service, i) => (
              <motion.div key={service.id || i} variants={staggerItemScale}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative p-5 sm:p-7 rounded-2xl border border-border-subtle bg-[#111827] shadow-card hover:border-accent/20 hover:shadow-glow transition-all duration-500 h-full overflow-hidden">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <div className="relative">
                    <motion.div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-3 sm:mb-4 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}>
                      <span className="text-sm font-bold text-accent">{service.icon || '✦'}</span>
                    </motion.div>
                    <h3 className="text-base sm:text-lg font-heading font-semibold mb-2 sm:mb-3 text-text-primary group-hover:text-accent transition-colors duration-500 break-words">{service.title}</h3>
                    <p className="mb-3 sm:mb-4 break-words leading-relaxed text-xs sm:text-sm text-text-muted">{service.description}</p>
                    <div className="flex items-center space-x-2 text-accent text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500"><span>{content.services_learn_more || 'Learn More'}</span><FiArrowRight className="group-hover:translate-x-1 transition-transform" /></div>
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-accent rounded-2xl opacity-0 group-hover:opacity-8 blur-xl transition-opacity duration-500 -z-10" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal type="scale"><div className="text-center mb-10 sm:mb-16">
            <span className="text-text-muted text-sm font-semibold tracking-[0.25em] uppercase">{content.process_subtitle || 'Process'}</span>
            <h2 className="text-[clamp(1.8rem,6vw,2.5rem)] sm:text-4xl md:text-5xl font-heading font-bold mt-4 text-text-primary">{content.process_heading || 'My Development'} <span className="text-gradient">{content.process_heading_highlight || 'Process'}</span></h2>
          </div></SectionReveal>
          <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {(processSteps || []).map((item, i) => (
              <motion.div key={item.id || i} variants={staggerItemScale}>
                <motion.div whileHover={{ y: -4 }} className="text-center p-4 sm:p-6 rounded-2xl border border-border-subtle bg-[#111827]/60">
                  <motion.div className="w-12 sm:w-14 h-12 sm:h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-3 sm:mb-4 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                    animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}>
                    <span className="text-base sm:text-lg font-heading font-bold text-gradient">{item.step}</span>
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-heading font-semibold text-text-primary mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-text-muted">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
