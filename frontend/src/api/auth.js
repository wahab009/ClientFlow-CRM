import apiClient from './client'

export const login = (credentials) => apiClient.post('/users/login', credentials)
export const register = (payload) => apiClient.post('/users/register', payload)
