import apiClient from './client'

export const getClients = (params = {}) => apiClient.get('/clients', { params })

export const createClient = (payload) => apiClient.post('/clients', payload)

export const updateClient = (id, payload) => apiClient.put(`/clients/${id}`, payload)

export const deleteClient = (id) => apiClient.delete(`/clients/${id}`)
