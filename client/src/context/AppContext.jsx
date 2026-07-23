import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [siteSettings, setSiteSettings] = useState(null)
  const [chatbotConfig, setChatbotConfig] = useState(null)
  const [socialLinks, setSocialLinks] = useState([])
  const [heroData, setHeroData] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [stats, setStats] = useState([])
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [team, setTeam] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [faqs, setFAQs] = useState([])
  const [certifications, setCertifications] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const fetchSiteData = useCallback(async () => {
    // Fire all queries in parallel but catch each individually
    // This way one empty table or error doesn't break the entire site
    const safeSingle = async (table) => {
      const { data } = await supabase.from(table).select('*').limit(1).maybeSingle()
      return data || null
    }

    const safeList = async (table, field, value) => {
      const { data } = await supabase.from(table).select('*').eq(field, value)
      return data || []
    }

    const settingsRes = await safeSingle('settings')
    const heroRes = await safeSingle('hero')
    const aboutRes = await safeSingle('about')

    const { data: socialRes } = await supabase.from('social_links').select('*').eq('active', true)
    const { data: servicesRes } = await supabase.from('services').select('*').eq('status', 'published')
    const { data: projectsRes } = await supabase.from('projects').select('*, project_images(*)').eq('status', 'published')
    const { data: skillsRes } = await supabase.from('skills').select('*').eq('active', true)
    const { data: teamRes } = await supabase.from('team').select('*').eq('active', true)
    const { data: testimonialsRes } = await supabase.from('testimonials').select('*').eq('status', 'published')
    const { data: statsRes } = await supabase.from('stats').select('*').eq('active', true).order('order')
    const chatbotConfigRes = await safeSingle('chatbot_config')
    const { data: experienceRes } = await supabase.from('experience').select('*').order('start_date', { ascending: false })
    const { data: educationRes } = await supabase.from('education').select('*').order('order')
    const { data: faqsRes } = await supabase.from('faqs').select('*').eq('active', true).order('order')
    const { data: certsRes } = await supabase.from('certifications').select('*').eq('active', true).order('order')

    if (settingsRes) setSiteSettings(settingsRes)
    if (socialRes) setSocialLinks(socialRes)
    if (heroRes) setHeroData(heroRes)
    if (aboutRes) setAboutData(aboutRes)
    if (chatbotConfigRes) setChatbotConfig(chatbotConfigRes)
    if (statsRes) setStats(statsRes)
    if (servicesRes) setServices(servicesRes)
    if (projectsRes) setProjects(projectsRes)
    if (skillsRes) setSkills(skillsRes)
    if (teamRes) setTeam(teamRes)
    if (testimonialsRes) setTestimonials(testimonialsRes)
    if (experienceRes) setExperience(experienceRes)
    if (educationRes) setEducation(educationRes)
    if (faqsRes) setFAQs(faqsRes)
    if (certsRes) setCertifications(certsRes)
  }, [])

  const refetch = useCallback(async () => {
    setRefreshing(true)
    await fetchSiteData()
    setRefreshing(false)
  }, [fetchSiteData])

  useEffect(() => {
    fetchSiteData().finally(() => setLoading(false))
  }, [fetchSiteData])

  // Expose refetch globally for admin pages to trigger frontend refresh
  useEffect(() => {
    window.__refetchSiteData = refetch
    return () => { window.__refetchSiteData = null }
  }, [refetch])

  return (
    <AppContext.Provider value={{
      loading,
      refreshing,
      siteSettings,
      chatbotConfig,
      socialLinks,
      heroData,
      aboutData,
      stats,
      services,
      projects,
      skills,
      team,
      testimonials,
      experience,
      education,
      faqs,
      certifications,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      refetch,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
