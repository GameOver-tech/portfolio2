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
    }
    return Promise.reject(error)
  }
)

// Helper: extract data array from paginated or flat responses
function extractData(res) {
  if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
  if (Array.isArray(res.data)) return res.data
  return res.data || []
}

export const adminAPI = {
  // Auth
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  verify: () => api.get('/api/auth/verify'),

  // Dashboard
  getDashboard: () => api.get('/api/admin/dashboard'),

  // Hero
  getHero: () => api.get('/api/admin/hero'),
  updateHero: (data) => api.put('/api/admin/hero', data),

  // About
  getAbout: () => api.get('/api/admin/about'),
  updateAbout: (data) => api.put('/api/admin/about', data),

  // Services
  getServices: (params) => api.get('/api/admin/services', { params }).then(extractData),
  createService: (data) => api.post('/api/admin/services', data),
  updateService: (id, data) => api.put(`/api/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/api/admin/services/${id}`),

  // Projects
  getProjects: (params) => api.get('/api/admin/projects', { params }).then(extractData),
  createProject: (data) => api.post('/api/admin/projects', data),
  updateProject: (id, data) => api.put(`/api/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/admin/projects/${id}`),

  // Categories
  getCategories: () => api.get('/api/admin/categories').then(extractData),
  createCategory: (data) => api.post('/api/admin/categories', data),
  deleteCategory: (id) => api.delete(`/api/admin/categories/${id}`),

  // Stats
  getStats: () => api.get('/api/admin/stats').then(extractData),
  createStat: (data) => api.post('/api/admin/stats', data),
  updateStat: (id, data) => api.put(`/api/admin/stats/${id}`, data),
  deleteStat: (id) => api.delete(`/api/admin/stats/${id}`),

  // Skills
  getSkills: () => api.get('/api/admin/skills').then(extractData),
  createSkill: (data) => api.post('/api/admin/skills', data),
  updateSkill: (id, data) => api.put(`/api/admin/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/api/admin/skills/${id}`),

  // Team
  getTeam: () => api.get('/api/admin/team').then(extractData),
  createTeam: (data) => api.post('/api/admin/team', data),
  updateTeam: (id, data) => api.put(`/api/admin/team/${id}`, data),
  deleteTeam: (id) => api.delete(`/api/admin/team/${id}`),

  // Messages
  getMessages: (params) => api.get('/api/admin/messages', { params }).then(extractData),
  deleteMessage: (id) => api.delete(`/api/admin/messages/${id}`),

  // Newsletter
  getNewsletter: () => api.get('/api/admin/newsletter').then(extractData),
  deleteNewsletter: (id) => api.delete(`/api/admin/newsletter/${id}`),

  // Settings
  getSettings: () => api.get('/api/admin/settings'),
  updateSettings: (data) => api.put('/api/admin/settings', data),

  // Social Links
  getSocialLinks: () => api.get('/api/admin/social-links').then(extractData),
  createSocialLink: (data) => api.post('/api/admin/social-links', data),
  updateSocialLink: (id, data) => api.put(`/api/admin/social-links/${id}`, data),
  deleteSocialLink: (id) => api.delete(`/api/admin/social-links/${id}`),

  // Chatbot
  getChatbotConfig: () => api.get('/api/admin/chatbot'),
  updateChatbotConfig: (data) => api.put('/api/admin/chatbot', data),

  // SEO
  getSEO: () => api.get('/api/admin/seo'),
  updateSEO: (data) => api.put('/api/admin/seo', data),

  // AI Providers
  getAIProviders: () => api.get('/api/admin/ai-providers').then(extractData),
  createAIProvider: (data) => api.post('/api/admin/ai-providers', data),
  updateAIProvider: (id, data) => api.put(`/api/admin/ai-providers/${id}`, data),
  updateAIProviderApiKey: (id, api_key) => api.put(`/api/admin/ai-providers/${id}/api-key`, { api_key }),
  deleteAIProvider: (id) => api.delete(`/api/admin/ai-providers/${id}`),

  // Experience
  getExperience: () => api.get('/api/admin/experience').then(extractData),
  createExperience: (data) => api.post('/api/admin/experience', data),
  updateExperience: (id, data) => api.put(`/api/admin/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/api/admin/experience/${id}`),

  // Education
  getEducation: () => api.get('/api/admin/education').then(extractData),
  createEducation: (data) => api.post('/api/admin/education', data),
  updateEducation: (id, data) => api.put(`/api/admin/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/api/admin/education/${id}`),

  // FAQs
  getFAQs: () => api.get('/api/admin/faqs').then(extractData),
  createFAQ: (data) => api.post('/api/admin/faqs', data),
  updateFAQ: (id, data) => api.put(`/api/admin/faqs/${id}`, data),
  deleteFAQ: (id) => api.delete(`/api/admin/faqs/${id}`),

  // Certifications
  getCertifications: () => api.get('/api/admin/certifications').then(extractData),
  createCertification: (data) => api.post('/api/admin/certifications', data),
  updateCertification: (id, data) => api.put(`/api/admin/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/api/admin/certifications/${id}`),
  uploadCertificationFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/admin/certifications/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Contact Form
  submitContact: (data) => api.post('/api/contact', data),

  // Newsletter Subscribe
  subscribe: (email) => api.post('/api/newsletter', { email }),

  // Chatbot
  chat: (message) => api.post('/api/chat', { message }),
}

export default api
