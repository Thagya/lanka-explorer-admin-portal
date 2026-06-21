import axios from 'axios'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const baseURL = rawUrl.replace(/^﻿/, '').trim()

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('le_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('le_admin_token')
      localStorage.removeItem('le_admin')
      // avoid redirect loop if already on /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
