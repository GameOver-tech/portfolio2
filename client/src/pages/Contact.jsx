import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SectionReveal from '../components/ui/SectionReveal'
import { useApp } from '../context/AppContext'
import { adminAPI } from '../services/api'

export default function Contact() {
  const { siteSettings } = useApp()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

  const contactEmail = siteSettings?.contact_email || 'abdulwaheedgraphics097@gmail.com'
  const contactPhone = siteSettings?.phone || '+92 329 1966097'
  const contactAddress = siteSettings?.address || 'Lahore, Pakistan'
  const whatsappNumber = siteSettings?.whatsapp || '923291966097'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await adminAPI.submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus(''), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(''), 4000)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Helmet>
        <title>Contact | Abdul Waheed - Graphic Designer</title>
      </Helmet>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">Contact</span>
              <h1 className="text-[clamp(2rem,7vw,2.8rem)] sm:text-4xl md:text-6xl font-heading font-bold mt-4 mb-6">
                Let's Work <span className="text-gradient">Together</span>
              </h1>
              <p className="leading-relaxed text-[#4B5563]">
                Have a project in mind? I'd love to hear about it. Send me a message and let's
                create something amazing together.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <SectionReveal>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="w-full px-4 min-h-[48px] bg-card border border-white/10 rounded-xl text-[#1F2937] focus:outline-none focus:border-primary transition-colors placeholder:text-[#9CA3AF]" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" required className="w-full px-4 min-h-[48px] bg-card border border-white/10 rounded-xl text-[#1F2937] focus:outline-none focus:border-primary transition-colors placeholder:text-[#9CA3AF]" />
                </div>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required className="w-full px-4 min-h-[48px] bg-card border border-white/10 rounded-xl text-[#1F2937] focus:outline-none focus:border-primary transition-colors placeholder:text-[#9CA3AF]" />
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" required rows={5} className="w-full px-4 py-3 min-h-[120px] bg-card border border-white/10 rounded-xl text-[#1F2937] focus:outline-none focus:border-primary transition-colors placeholder:text-[#9CA3AF] resize-none" />
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }} type="submit" disabled={status === 'loading'} className="w-full px-6 min-h-[48px] bg-gradient-primary text-background font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50">
                  <FiSend />
                  <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                </motion.button>
                {status === 'success' && <p className="text-primary text-sm text-center">Message sent successfully! I'll get back to you soon.</p>}
                {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
              </form>
            </SectionReveal>

            {/* Contact Info — values from settings */}
            <SectionReveal delay={0.2}>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FiMail className="text-primary" size={22} />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-1">Email</h3>
                  <p className="text-[#4B5563]">{contactEmail}</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FiPhone className="text-primary" size={22} />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-1">Phone</h3>
                  <p className="text-[#4B5563]">{contactPhone}</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FiMapPin className="text-primary" size={22} />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-1">Location</h3>
                  <p className="text-[#4B5563]">{contactAddress}</p>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 p-6 rounded-2xl bg-[#FFF2E8] border border-[#F47A20]/20 hover:bg-[#FFE7D0] transition-all duration-300"
                >
                  <FaWhatsapp className="text-[#F47A20] text-2xl" />
                  <span className="font-semibold">Chat on WhatsApp</span>
                </a>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  )
}
