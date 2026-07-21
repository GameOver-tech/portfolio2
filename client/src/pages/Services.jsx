import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight, FiLayers, FiPenTool, FiTrendingUp, FiBox, FiMonitor, FiImage, FiLayout, FiPrinter, FiSmartphone, FiGrid } from 'react-icons/fi'

const iconMap = {
  FiPenTool, FiLayers, FiTrendingUp, FiSmartphone, FiMonitor, FiPrinter, FiGrid, FiImage, FiBox, FiLayout,
}
function resolveIcon(name) {
  return iconMap[name] || FiPenTool
}
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'

const defaultServices = [
  { title: 'Graphic Design', description: 'Eye-catching visual designs that communicate your brand message effectively.', icon: FiPenTool },
  { title: 'Brand Identity', description: 'Complete brand identity systems including logos, colors, typography, and guidelines.', icon: FiLayers },
  { title: 'Logo Design', description: 'Unique, memorable logos that capture the essence of your brand.', icon: FiTrendingUp },
  { title: 'Social Media Design', description: 'Engaging social media graphics that stop the scroll and drive engagement.', icon: FiSmartphone },
  { title: 'UI Design', description: 'Beautiful, intuitive user interfaces for web and mobile applications.', icon: FiMonitor },
  { title: 'Print Design', description: 'Professional print materials from business cards to billboards.', icon: FiPrinter },
]

export default function Services() {
  const { services } = useApp()
  const serviceList = services?.length > 0 ? services : defaultServices

  return (
    <>
      <Helmet>
        <title>Services | Abdul Waheed - Graphic Designer</title>
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">Services</span>
              <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                What I <span className="text-gradient">Create</span>
              </h1>
              <p className="leading-relaxed text-[#4B5563]">
                From brand identity to digital design, I offer a comprehensive range of design services
                to help your business stand out and succeed.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceList.map((service, i) => {
              const Icon = resolveIcon(service.icon)
              return (
                <SectionReveal key={service.id || i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 h-full overflow-hidden"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                        <Icon className="text-2xl text-primary" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-4 group-hover:text-gradient transition-all duration-500 break-words">
                        {service.title}
                      </h3>
                      <p className="mb-6 break-words leading-relaxed text-[#4B5563]">{service.description}</p>
                      <div className="flex items-center space-x-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span>Learn More</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    {/* Glow Effect on Hover */}
                    <div className="absolute -inset-0.5 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
                  </motion.div>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-[clamp(2rem,7vw,2.5rem)] sm:text-4xl md:text-5xl font-heading font-bold">
                My Design <span className="text-gradient">Process</span>
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'Understanding your brand, goals, and vision.' },
              { step: '02', title: 'Research', desc: 'Market analysis and competitor research.' },
              { step: '03', title: 'Design', desc: 'Creating and refining design concepts.' },
              { step: '04', title: 'Deliver', desc: 'Polished final assets and brand guidelines.' },
            ].map((item, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-heading font-bold text-gradient">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[#4B5563]">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
