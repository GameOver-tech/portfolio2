import { useLocation } from 'react-router-dom'
import { useScrollPosition } from '../../hooks/useScrollPosition'

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/hero': 'Hero Section',
  '/admin/about': 'About Section',
  '/admin/services': 'Services',
  '/admin/projects': 'Projects',
  '/admin/categories': 'Categories',
  '/admin/stats': 'Stats',
  '/admin/skills': 'Skills',
  '/admin/experience': 'Experience',
  '/admin/education': 'Education',
  '/admin/certifications': 'Certifications',
  '/admin/team': 'Team',
  '/admin/messages': 'Messages',
  '/admin/newsletter': 'Newsletter',
  '/admin/social-links': 'Social Links',
  '/admin/chatbot': 'Chatbot',
  '/admin/seo': 'SEO',
  '/admin/settings': 'Settings',
}

export default function AdminHeader() {
  const location = useLocation()
  const { isScrolled } = useScrollPosition()
  const pageTitle = pageTitles[location.pathname] || 'Admin Panel'

  return (
    <header
      className={`fixed top-0 right-0 left-0 lg:left-64 z-30 flex h-16 items-center justify-between px-4 sm:px-6 pl-14 lg:pl-6 transition-all duration-300 ${
        isScrolled ? 'border-b border-border-subtle bg-bg-glass backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div>
        <nav className="mb-0.5 flex items-center space-x-2 text-sm text-text-secondary">
          <span>Admin</span>
          <span>/</span>
          <span className="font-semibold text-white">{pageTitle}</span>
        </nav>
      </div>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/20 whitespace-nowrap"
      >
        View Site
      </a>
    </header>
  )
}
