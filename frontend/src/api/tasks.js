import apiClient from './client'

export const getTasks = (params = {}) => apiClient.get('/tasks', { params })

export const createTask = (payload) => apiClient.post('/tasks', payload)

export const updateTask = (id, payload) => apiClient.put(`/tasks/${id}`, payload)

export const deleteTask = (id) => apiClient.delete(`/tasks/${id}`)
