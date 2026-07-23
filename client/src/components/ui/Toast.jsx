import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'
const ToastContext = createContext()
export function useToast() { return useContext(ToastContext) }
export function showToast(message, type = 'success') { window.__toast?.({ message, type }) }

export default function Toast() {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback(({ message, type = 'success' }) => { const id = Date.now(); setToasts(p => [...p, { id, message, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000) }, [])
  useEffect(() => { window.__toast = addToast; return () => { window.__toast = null } }, [addToast])
  const remove = id => setToasts(p => p.filter(t => t.id !== id))
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence>{toasts.map(t => (
        <motion.div key={t.id} initial={{ opacity: 0, x: 100, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className={`pointer-events-auto flex items-center space-x-3 px-5 py-3 rounded-xl shadow-xl border ${t.type === 'success' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-bg-surface border-border-subtle text-text-muted'} backdrop-blur-xl`}>
          {t.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
          <span className="text-sm font-medium">{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity"><FiX size={16} /></button>
        </motion.div>
      ))}</AnimatePresence>
    </div>
  )
}
