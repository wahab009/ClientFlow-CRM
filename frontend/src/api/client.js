import axios from 'axios'
import { getStoredToken } from '../utils/authStorage'

const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim()

if (import.meta.env.PROD && !configuredApiUrl) {
  throw new Error('VITE_API_URL is required in production.')
}

const apiClient = axios.create({
  baseURL: configuredApiUrl || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default apiClient
