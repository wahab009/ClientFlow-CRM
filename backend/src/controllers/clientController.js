import clientService from '../services/clientService.js'
import { success, error } from '../utils/response.js'

/**
 * Create new client
 */
export const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body
    const userId = req.user.id

    const client = await clientService.createClient(
      { name, email, phone, company, status },
      userId
    )

    return success(res, client, 201)
  } catch (err) {
    return handleServiceError(err, res)
  }
}

/**
 * Get all clients with search, filter, and pagination
 */
export const getAllClients = async (req, res) => {
  try {
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    const result = await clientService.getAllClients(userId, isAdmin, req.query)

    return success(res, {
      clients: result.data,
      pagination: result.pagination
    })
  } catch (err) {
    return handleServiceError(err, res)
  }
}

/**
 * Get client by ID
 */
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    const client = await clientService.getClientById(id, userId, isAdmin)

    return success(res, client)
  } catch (err) {
    return handleServiceError(err, res)
  }
}

/**
 * Update client
 */
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    const updatedClient = await clientService.updateClient(id, req.body, userId, isAdmin)

    return success(res, updatedClient)
  } catch (err) {
    return handleServiceError(err, res)
  }
}

/**
 * Delete client
 */
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    await clientService.deleteClient(id, userId, isAdmin)

    return success(res, {})
  } catch (err) {
    return handleServiceError(err, res)
  }
}

/**
 * Helper function to handle service layer errors
 * @param {Error} err - Error thrown by service
 * @param {Response} res - Express response object
 */
function handleServiceError(err, res) {
  const message = err.message || 'Unknown error'

  if (message.includes('VALIDATION_ERROR')) {
    return error(res, message.replace('VALIDATION_ERROR: ', ''), 400)
  }

  if (message === 'CLIENT_NOT_FOUND') {
    return error(res, 'Client not found', 404)
  }

  if (message.includes('UNAUTHORIZED')) {
    return error(res, 'You do not have permission to access this resource', 403)
  }

  return error(res, 'Internal server error', 500)
}
