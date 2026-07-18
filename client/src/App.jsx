import { Routes, Route } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import PortfolioViewer from './pages/PortfolioViewer'
import Team from './pages/Team'
import Contact from './pages/Contact'
import AdminDashboard from './admin/pages/Dashboard'
import AdminLogin from './admin/pages/Login'
import AdminHero from './admin/pages/Hero'
import AdminAbout from './admin/pages/About'
import AdminServices from './admin/pages/Services'
import AdminProjects from './admin/pages/Projects'
import AdminCategories from './admin/pages/Categories'
import AdminSkills from './admin/pages/Skills'
import AdminTeam from './admin/pages/Team'
import AdminMessages from './admin/pages/Messages'
import AdminNewsletter from './admin/pages/Newsletter'
import AdminSettings from './admin/pages/Settings'
import AdminSocialLinks from './admin/pages/SocialLinks'
import AdminChatbot from './admin/pages/Chatbot'
import AdminSEO from './admin/pages/SEO'
import AdminStats from './admin/pages/Stats'
import { AnimatePresence } from 'framer-motion'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function isAdminRoute(pathname) {
  return pathname.startsWith('/admin')
}

export default function App() {
  const location = useLocation()
  const lenisInstance = useRef(null)
  const rafId = useRef(null)

  useEffect(() => {
    const isAdmin = isAdminRoute(location.pathname)

    // Clean up previous Lenis + RAF
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
    if (lenisInstance.current) {
      lenisInstance.current.destroy()
      lenisInstance.current = null
    }

    // Only use smooth scroll on public (non-admin) routes
    // Lenis causes severe input lag on admin forms
    if (!isAdmin) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
      })
      lenisInstance.current = lenis

      function raf(time) {
        lenis.raf(time)
        rafId.current = requestAnimationFrame(raf)
      }
      rafId.current = requestAnimationFrame(raf)
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
        rafId.current = null
      }
      if (lenisInstance.current) {
        lenisInstance.current.destroy()
        lenisInstance.current = null
      }
    }
  }, [location.pathname])

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Main Frontend Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="social-links" element={<AdminSocialLinks />} />
            <Route path="chatbot" element={<AdminChatbot />} />
            <Route path="seo" element={<AdminSEO />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  )
}
