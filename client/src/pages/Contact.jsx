import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SectionReveal from '../components/ui/SectionReveal'
import { staggerContainerFast, staggerItemScale } from '../animations/variants'
import { useApp } from '../context/AppContext'
import { adminAPI } from '../services/api'

function MagneticField({ children, className = '' }) {
  return <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={className}>{children}</motion.div>
}

export default function Contact() {
  const { siteSettings } = useApp()
  const content = siteSettings?.section_titles || {}
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const contactEmail = siteSettings?.contact_email || 'alihassan.webstudio@gmail.com'
  const contactPhone = siteSettings?.phone || '+92 310 2850365'
  const contactAddress = siteSettings?.address || 'Gojra, Punjab, Pakistan'
  const whatsappNumber = siteSettings?.whatsapp || '923102850365'
  const handleSubmit = async e => { e.preventDefault(); setStatus('loading'); try { await adminAPI.submitContact(form); setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }); setTimeout(() => setStatus(''), 4000) } catch { setStatus('error'); setTimeout(() => setStatus(''), 4000) } }
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <>
      <Helmet><title>Contact | Ali Hassan</title></Helmet>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal type="blur"><div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} className="text-text-muted text-sm font-semibold tracking-[0.25em] uppercase">{content.contact_subtitle || 'Contact'}</motion.span>
            <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6 text-text-primary">{content.contact_heading || 'Get in'} <span className="text-gradient">{content.contact_heading_highlight || 'Touch'}</span></h1>
            <p className="leading-relaxed text-text-muted">{content.contact_description || "Have an AI project in mind? Let's discuss how I can help."}</p>
          </div></SectionReveal>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <SectionReveal type="scale">
                <motion.div className="rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm p-8 shadow-card">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['name', 'email'].map(field => (
                        <motion.div key={field} whileFocus={{ scale: 1.01 }} className="relative group">
                          <input type={field === 'email' ? 'email' : 'text'} name={field} value={form[field]} onChange={handleChange} placeholder={content[`contact_${field}_placeholder`] || (field === 'name' ? 'Your Name' : 'Your Email')} required
                            className="w-full px-4 min-h-[48px] bg-bg-glass border border-border-subtle rounded-xl text-text-primary focus:border-accent/30 focus:outline-none focus:ring-0 transition-all duration-300 placeholder:text-text-muted peer" />
                          <motion.span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" style={{ originX: '0' }} />
                        </motion.div>
                      ))}
                    </div>
                    {['subject', 'message'].map(field => (
                      <motion.div key={field} whileFocus={{ scale: 1.01 }} className="relative group">
                        {field === 'message' ? <textarea name={field} value={form[field]} onChange={handleChange} placeholder="Your Message" required rows={5}
                          className="w-full px-4 py-3 min-h-[120px] bg-bg-glass border border-border-subtle rounded-xl text-text-primary focus:border-accent/30 focus:outline-none focus:ring-0 transition-all duration-300 placeholder:text-text-muted resize-none peer" />
                          : <input type="text" name={field} value={form[field]} onChange={handleChange} placeholder="Subject" required
                            className="w-full px-4 min-h-[48px] bg-bg-glass border border-border-subtle rounded-xl text-text-primary focus:border-accent/30 focus:outline-none focus:ring-0 transition-all duration-300 placeholder:text-text-muted peer" />}
                        <motion.span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" style={{ originX: '0' }} />
                      </motion.div>
                    ))}
                    <MagneticField>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={status === 'loading'}
                        className="w-full px-6 min-h-[50px] bg-accent text-background font-semibold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all duration-300 disabled:opacity-50">
                        <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><FiSend /></motion.span>
                        <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                      </motion.button>
                    </MagneticField>
                    {status === 'success' && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-accent text-sm text-center">Message sent successfully! I'll get back to you soon.</motion.p>}
                    {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
                  </form>
                </motion.div>
              </SectionReveal>
            </div>
            <div className="lg:col-span-2">
              <SectionReveal type="right" delay={0.2}>
                <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
                  {[{ icon: FiMail, label: 'Email', value: contactEmail }, { icon: FiPhone, label: 'Phone', value: contactPhone }, { icon: FiMapPin, label: 'Location', value: contactAddress }].map((item, i) => (
                    <motion.div key={i} variants={staggerItemScale}>
                      <motion.div whileHover={{ y: -3, x: 4 }} className="p-6 rounded-2xl border border-border-subtle bg-bg-card/50 backdrop-blur-sm shadow-card">
                        <motion.div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(0,240,255,0.1)]" animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}><item.icon className="text-accent" size={18} /></motion.div>
                        <h3 className="text-sm font-heading font-semibold text-text-primary mb-1">{item.label}</h3>
                        <p className="text-sm text-text-muted break-all">{item.value}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                  <motion.div variants={staggerItemScale}>
                    <motion.a whileHover={{ scale: 1.02, x: 4 }} href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-3 p-6 rounded-2xl border border-accent/15 bg-accent/5 hover:bg-accent/10 transition-all duration-300 group">
                      <FaWhatsapp className="text-accent text-lg" /><span className="font-medium text-text-primary group-hover:text-accent transition-colors">Chat on WhatsApp</span>
                    </motion.a>
                  </motion.div>
                </motion.div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
