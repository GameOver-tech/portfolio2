import { Link, useLocation } from 'react-router-dom'
import {
  FiGrid, FiUser, FiBriefcase, FiFolder, FiLayers, FiCode,
  FiUsers, FiMail, FiSend, FiSettings, FiLink, FiMessageSquare,
  FiSearch, FiLogOut, FiTrendingUp, FiCpu, FiHelpCircle,
  FiBookOpen, FiAward
} from 'react-icons/fi'

const menuItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/hero', icon: FiUser, label: 'Hero' },
  { path: '/admin/about', icon: FiBriefcase, label: 'About' },
  { path: '/admin/services', icon: FiLayers, label: 'Services' },
  { path: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { path: '/admin/categories', icon: FiLayers, label: 'Categories' },
  { path: '/admin/stats', icon: FiTrendingUp, label: 'Stats' },
  { path: '/admin/skills', icon: FiCode, label: 'Skills' },
  { path: '/admin/experience', icon: FiAward, label: 'Experience' },
  { path: '/admin/education', icon: FiBookOpen, label: 'Education' },
  { path: '/admin/certifications', icon: FiAward, label: 'Certifications' },
  { path: '/admin/team', icon: FiUsers, label: 'Team' },
  { path: '/admin/faqs', icon: FiHelpCircle, label: 'FAQs' },
  { path: '/admin/ai-providers', icon: FiCpu, label: 'AI Providers' },
  { path: '/admin/messages', icon: FiMail, label: 'Messages' },
  { path: '/admin/newsletter', icon: FiSend, label: 'Newsletter' },
  { path: '/admin/social-links', icon: FiLink, label: 'Social Links' },
  { path: '/admin/chatbot', icon: FiMessageSquare, label: 'Chatbot' },
  { path: '/admin/seo', icon: FiSearch, label: 'SEO' },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
]

export default function AdminSidebar() {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin/login'
  }

  const isActive = location.pathname

  return (
    <div className="fixed left-0 top-0 bottom-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-bg-glass backdrop-blur-xl">
      <div className="flex-shrink-0 p-6">
        <Link to="/" className="text-2xl font-heading font-bold text-gradient">AH</Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {menuItems.map((item) => {
          const active = isActive === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex w-full items-center space-x-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-accent/10 text-accent shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
              )}
              <item.icon size={18} className="flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex-shrink-0 border-t border-border-subtle p-3 space-y-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-text-secondary transition-all duration-150 hover:bg-accent/10 hover:text-red-400"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
