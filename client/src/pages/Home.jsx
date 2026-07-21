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
  return Icon ? <Icon size={size} className={className || 'text-current'} /> : <span className="text-2xl text-[#1F2937]">✦</span>
}

function HomeProjectCard({ project }) {
  const detailLink = project.pdf_url ? `/portfolio/${project.slug}` : `/projects/${project.slug}`
  const externalUrl = project.project_url || '#'
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.01 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-[#EFE5DA] bg-white p-3 shadow-[0_24px_70px_-40px_rgba(31,31,31,0.35)]"
    >
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.title} live site`}
        className="block"
        onClick={(e) => {
          if (externalUrl === '#') e.preventDefault()
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#FFF2E8]">
          <div className="absolute inset-0 flex items-center justify-center text-[#9CA3AF]">
            <div className="flex flex-col items-center space-y-2">
              <FiImage size={28} />
              <span className="text-xs">No image</span>
            </div>
          </div>
          {project.thumbnail_url && (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
        </div>
      </a>
      <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-[#FFF8F2] via-[#FFF8F2]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Link to={detailLink} className="relative block p-4 pt-5">
        <span className="inline-flex rounded-full bg-[#FFF2E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
          {project.category}
        </span>
        <h3 className="mt-3 text-xl font-heading font-bold text-[#1F1F1F]">{project.title}</h3>
        <div className="mt-4 flex items-center space-x-2 text-sm font-semibold text-primary">
          <span>Explore case study</span>
          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function Home() {
  const { projects, services, testimonials, siteSettings, heroData } = useApp()
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
            <div className="mb-14 text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Portfolio</span>
              <h2 className="mt-4 text-[clamp(2rem,7vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#1F1F1F]">
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
                <HomeProjectCard project={project} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="mt-10 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 sm:px-8 min-h-[48px] font-semibold text-sm sm:text-base text-[#FFF8F2] shadow-[0_20px_50px_-20px_rgba(244,122,32,0.7)] transition-all duration-300 active:scale-95"
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
            <div className="mb-14 text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">What I Do</span>
              <h2 className="mt-4 text-[clamp(2rem,7vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#1F1F1F]">
                {servicesTitle} <span className="text-gradient">Expertise</span>
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.slice(0, 6).map((service, i) => (
              <SectionReveal key={service.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-[#EFE5DA] bg-white/90 p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_24px_70px_-40px_rgba(244,122,32,0.45)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF2E8] text-primary">
                      <IconComponent icon={service.icon} />
                    </div>
                    <h3 className="mb-3 break-words font-heading text-xl font-bold text-[#1F1F1F]">{service.title}</h3>
                    <p className="line-clamp-4 break-words text-sm leading-7 text-[#4B5563]">{service.description}</p>
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
              <div className="mb-14 text-center">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Testimonials</span>
                <h2 className="mt-4 text-[clamp(2rem,7vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#1F1F1F]">
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
                  <div className="rounded-[1.5rem] border border-[#EFE5DA] bg-white/90 p-8 shadow-[0_24px_70px_-40px_rgba(31,31,31,0.3)]">
                    <div className="mb-4 flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm text-primary">★</span>
                      ))}
                    </div>
                    <p className="mb-6 text-sm leading-7 text-[#4B5563]">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-[#FFF8F2]">
                        {testimonial.name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F1F1F]">{testimonial.name}</p>
                        <p className="text-xs text-[#6B7280]">{testimonial.role} • {testimonial.company}</p>
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
            <h2 className="text-[clamp(2rem,7vw,2.5rem)] sm:text-4xl md:text-6xl font-heading font-bold mb-6">
              {ctaTitle}
            </h2>
            <p className="mb-8 max-w-2xl mx-auto text-base sm:text-lg text-[#4B5563]">
              {ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 min-h-[48px] bg-gradient-primary text-background font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95"
              >
                <span>Start a Project</span>
                <FiArrowRight />
              </Link>
              <a
                href={heroData?.resume_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 min-h-[48px] border border-[#EFE5DA] rounded-full text-[#1F2937] font-semibold hover:bg-[#FFF2E8] transition-all duration-300 active:scale-95"
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
