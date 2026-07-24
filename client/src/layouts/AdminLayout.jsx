import { Outlet, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FiMenu } from 'react-icons/fi'
import AdminSidebar from '../admin/components/Sidebar'
import AdminHeader from '../admin/components/Header'
import Toast from '../components/ui/Toast'
import { adminAPI } from '../services/api'

export default function AdminLayout() {
  const [authState, setAuthState] = useState('loading')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setAuthState('unauthenticated')
      return
    }
    adminAPI.verify().then(() => {
      setAuthState('authenticated')
    }).catch(() => {
      localStorage.removeItem('admin_token')
      setAuthState('unauthenticated')
    })
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-h-screen lg:ml-64">
        {/* Mobile menu button */}
        <button onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-bg-glass border border-border-subtle backdrop-blur-xl text-text-primary"
          aria-label="Open sidebar">
          <FiMenu size={20} />
        </button>
        <AdminHeader />
        <main className="p-4 sm:p-6 pt-20 lg:pt-24 overflow-y-auto min-h-screen">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  )
}
