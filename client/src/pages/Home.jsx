import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiDownload, FiArrowRight, FiImage, FiPenTool, FiLayers, FiTrendingUp, FiSmartphone, FiMonitor, FiPrinter, FiGrid } from 'react-icons/fi'
import HeroSection from '../components/home/HeroSection'
import StatsSection from '../components/home/StatsSection'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

function IconComponent({ icon, size = 24, className = '' }) {
  const iconMap = {
    FiPenTool, FiLayers, FiTrendingUp, FiSmartphone, FiMonitor, FiPrinter, FiGrid, FiImage,
  }
  const Icon = iconMap[icon]
  return Icon ? <Icon size={size} className={className || 'text-white'} /> : <span className="text-2xl text-white">✦</span>
}

function HomeProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-white/5"
    >
      <div className="aspect-[4/3] overflow-hidden bg-card relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray">
          <div className="flex flex-col items-center space-y-2">
            <FiImage size={28} />
            <span className="text-xs">No image</span>
          </div>
        </div>
        {project.thumbnail_url && (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          {project.category}
        </span>
        <h3 className="text-xl font-heading font-bold mt-1 break-words">{project.title}</h3>
        <div className="flex items-center space-x-1 text-primary text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Read More</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { projects, services, testimonials, siteSettings } = useApp()
  const t = siteSettings?.section_titles || {}
  const featuredTitle = (t.featured_projects || 'Featured').replace(/\s*Projects$/, '')
  const servicesTitle = (t.services || 'Services &').replace(/\s*Expertise$/, '')
  const testimonialsTitle = t.testimonials || 'What Clients Say'
  const ctaTitle = t.cta_title || 'Let\'s Create Something Amazing'
  const ctaSubtitle = t.cta_subtitle || 'Ready to elevate your brand?'

  return (
    <>
      <Helmet>
        <title>Abdul Waheed | Graphic Designer - Brand Identity Designer</title>
        <meta name="description" content="Professional Graphic Designer specializing in brand identity, logo design, and visual communication." />
      </Helmet>

      <HeroSection />
      <StatsSection />

      {/* Featured Projects */}
      <section className="section-padding relative">
        <div className="absolute inset-0 animated-grid" />
        <div className="relative max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-heading font-bold mt-4">
                {featuredTitle} <span className="text-gradient">Projects</span>
              </h2>
            </div>
          </SectionReveal>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-14"
          >
            {projects?.slice(0, 6).map((project) => (
              <SwiperSlide key={project.id}>
                <Link to={project.pdf_url ? `/portfolio/${project.slug}` : `/projects/${project.slug}`}>
                  <HomeProjectCard project={project} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-10">
            <Link
              to="/projects"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-primary text-background font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <span>View All Projects</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">What I Do</span>
              <h2 className="text-4xl md:text-6xl font-heading font-bold mt-4">
                {servicesTitle} <span className="text-gradient">Expertise</span>
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.slice(0, 6).map((service, i) => (
              <SectionReveal key={service.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary/20 flex items-center justify-center mb-6 flex-shrink-0">
                      <IconComponent icon={service.icon} />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-3 break-words">{service.title}</h3>
                    <p className="text-gray text-sm leading-relaxed break-words line-clamp-4">{service.description}</p>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials?.length > 0 && (
        <section className="section-padding relative">
          <div className="blob blob-1" />
          <div className="relative max-w-7xl mx-auto">
            <SectionReveal>
              <div className="text-center mb-16">
                <span className="text-primary text-sm font-semibold tracking-widest uppercase">Testimonials</span>
                <h2 className="text-4xl md:text-6xl font-heading font-bold mt-4">
                  What <span className="text-gradient">Clients Say</span>
                </h2>
              </div>
            </SectionReveal>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 5000 }}
              pagination={{ clickable: true }}
              className="pb-14"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="p-8 rounded-2xl bg-card border border-white/5">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-primary text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-gray text-sm leading-relaxed mb-6">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-background font-bold text-sm">
                        {testimonial.name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-gray text-xs">{testimonial.role} • {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding relative">
        <div className="max-w-4xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              {ctaTitle}
            </h2>
            <p className="text-gray text-lg mb-8 max-w-2xl mx-auto">
              {ctaSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-gradient-primary text-background font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start a Project</span>
                <FiArrowRight />
              </Link>
              <a
                href="/resume.pdf"
                download
                className="px-8 py-4 border border-white/10 rounded-full text-white font-semibold hover:bg-white/5 transition-all duration-300 flex items-center space-x-2"
              >
                <FiDownload />
                <span>Download Resume</span>
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
