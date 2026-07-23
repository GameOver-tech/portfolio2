import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight } from 'react-icons/fi'
import SectionReveal from '../components/ui/SectionReveal'
import { staggerContainerFast, staggerItemScale } from '../animations/variants'
import { useApp } from '../context/AppContext'

const defaultServices = [
  { title: 'AI Engineering', description: 'Custom AI models, LLM integration, RAG systems, and intelligent automation for production environments.', icon: 'AI' },
  { title: 'LLM Applications', description: 'Chatbots, document analysis, search systems, and conversational AI built on large language models.', icon: 'LL' },
  { title: 'Full-Stack Development', description: 'Modern web applications with React, Node.js, and cloud-native architectures.', icon: 'FS' },
  { title: 'Chatbot Development', description: 'Intelligent conversational agents with NLU, multi-channel deployment, and analytics.', icon: 'CB' },
  { title: 'Cloud & DevOps', description: 'Cloud infrastructure, CI/CD pipelines, containerization, and scalable deployments.', icon: 'CD' },
  { title: 'AI Automation', description: 'Process automation, intelligent workflows, and AI-powered business optimization.', icon: 'AU' },
]

export default function Services() {
  const { services } = useApp()
  const serviceList = services?.length > 0 ? services : defaultServices

  return (
    <>
      <Helmet><title>Services | Ali Hassan</title></Helmet>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal type="blur"><div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} className="text-text-muted text-sm font-semibold tracking-[0.25em] uppercase">Services</motion.span>
            <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6 text-text-primary">What I <span className="text-gradient">Deliver</span></h1>
            <p className="leading-relaxed text-text-muted">Production-ready AI systems and software built for reliability, scale, and business impact.</p>
          </div></SectionReveal>

          <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceList.map((service, i) => (
              <motion.div key={service.id || i} variants={staggerItemScale}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative p-7 rounded-2xl border border-border-subtle bg-bg-card backdrop-blur-sm shadow-card hover:border-accent/20 hover:shadow-glow transition-all duration-500 h-full overflow-hidden">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <div className="relative">
                    <motion.div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}>
                      <span className="text-sm font-bold text-accent">{service.icon || '✦'}</span>
                    </motion.div>
                    <h3 className="text-lg font-heading font-semibold mb-3 text-text-primary group-hover:text-accent transition-colors duration-500 break-words">{service.title}</h3>
                    <p className="mb-4 break-words leading-relaxed text-sm text-text-muted">{service.description}</p>
                    <div className="flex items-center space-x-2 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500"><span>Learn More</span><FiArrowRight className="group-hover:translate-x-1 transition-transform" /></div>
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-accent rounded-2xl opacity-0 group-hover:opacity-8 blur-xl transition-opacity duration-500 -z-10" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal type="scale"><div className="text-center mb-16">
            <span className="text-text-muted text-sm font-semibold tracking-[0.25em] uppercase">Process</span>
            <h2 className="text-[clamp(2rem,7vw,2.5rem)] sm:text-4xl md:text-5xl font-heading font-bold mt-4 text-text-primary">My Development <span className="text-gradient">Process</span></h2>
          </div></SectionReveal>
          <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[{ step: '01', title: 'Discovery', desc: 'Understanding your goals, requirements, and technical landscape.' },
              { step: '02', title: 'Architecture', desc: 'Designing the system architecture, data flow, and tech stack.' },
              { step: '03', title: 'Build', desc: 'Iterative development with continuous testing and refinement.' },
              { step: '04', title: 'Deploy', desc: 'Production deployment, monitoring, and ongoing optimization.' },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItemScale}>
                <motion.div whileHover={{ y: -4 }} className="text-center p-6 rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm">
                  <motion.div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                    animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}>
                    <span className="text-lg font-heading font-bold text-gradient">{item.step}</span>
                  </motion.div>
                  <h3 className="text-base font-heading font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
