import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      // Don't do a full page reload — let AdminLayout's verify() handle the redirect
      // via React Router's <Navigate>, which avoids chunk loading race conditions.
    }
    return Promise.reject(error)
  }
)

export const adminAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Hero
  getHero: () => api.get('/admin/hero'),
  updateHero: (data) => api.put('/admin/hero', data),
  
  // About
  getAbout: () => api.get('/admin/about'),
  updateAbout: (data) => api.put('/admin/about', data),
  
  // Services
  getServices: (params) => api.get('/admin/services', { params }),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  
  // Projects
  getProjects: (params) => api.get('/admin/projects', { params }),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Skills
  getSkills: () => api.get('/admin/skills'),
  createSkill: (data) => api.post('/admin/skills', data),
  updateSkill: (id, data) => api.put(`/admin/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}`),
  
  // Team
  getTeam: () => api.get('/admin/team'),
  createTeam: (data) => api.post('/admin/team', data),
  updateTeam: (id, data) => api.put(`/admin/team/${id}`, data),
  deleteTeam: (id) => api.delete(`/admin/team/${id}`),
  
  // Messages
  getMessages: (params) => api.get('/admin/messages', { params }),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
  
  // Newsletter
  getNewsletter: () => api.get('/admin/newsletter'),
  deleteNewsletter: (id) => api.delete(`/admin/newsletter/${id}`),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  
  // Social Links
  getSocialLinks: () => api.get('/admin/social-links'),
  createSocialLink: (data) => api.post('/admin/social-links', data),
  updateSocialLink: (id, data) => api.put(`/admin/social-links/${id}`, data),
  deleteSocialLink: (id) => api.delete(`/admin/social-links/${id}`),
  
  // Chatbot
  getChatbotConfig: () => api.get('/admin/chatbot'),
  updateChatbotConfig: (data) => api.put('/admin/chatbot', data),
  
  // SEO
  getSEO: () => api.get('/admin/seo'),
  updateSEO: (data) => api.put('/admin/seo', data),

  // AI Providers
  getAIProviders: () => api.get('/admin/ai-providers'),
  createAIProvider: (data) => api.post('/admin/ai-providers', data),
  updateAIProvider: (id, data) => api.put(`/admin/ai-providers/${id}`, data),
  deleteAIProvider: (id) => api.delete(`/admin/ai-providers/${id}`),

  // Experience
  getExperience: () => api.get('/admin/experience'),
  createExperience: (data) => api.post('/admin/experience', data),
  updateExperience: (id, data) => api.put(`/admin/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/admin/experience/${id}`),

  // Education
  getEducation: () => api.get('/admin/education'),
  createEducation: (data) => api.post('/admin/education', data),
  updateEducation: (id, data) => api.put(`/admin/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/admin/education/${id}`),

  // FAQs
  getFAQs: () => api.get('/admin/faqs'),
  createFAQ: (data) => api.post('/admin/faqs', data),
  updateFAQ: (id, data) => api.put(`/admin/faqs/${id}`, data),
  deleteFAQ: (id) => api.delete(`/admin/faqs/${id}`),

  // Certifications
  getCertifications: () => api.get('/admin/certifications'),
  createCertification: (data) => api.post('/admin/certifications', data),
  updateCertification: (id, data) => api.put(`/admin/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/admin/certifications/${id}`),
  uploadCertificationFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/certifications/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Contact Form
  submitContact: (data) => api.post('/contact', data),

  // Newsletter Subscribe
  subscribe: (email) => api.post('/newsletter', { email }),

  // Chatbot
  chat: (message) => api.post('/chat', { message }),
}

export default api
