import clientService from '../services/clientService.js'

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

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    })
  } catch (error) {
    handleServiceError(error, res)
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

    res.json({
      success: true,
      message: 'Clients retrieved successfully',
      ...result
    })
  } catch (error) {
    handleServiceError(error, res)
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

    res.json({
      success: true,
      message: 'Client retrieved successfully',
      data: client
    })
  } catch (error) {
    handleServiceError(error, res)
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

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    })
  } catch (error) {
    handleServiceError(error, res)
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

    res.json({
      success: true,
      message: 'Client deleted successfully'
    })
  } catch (error) {
    handleServiceError(error, res)
  }
}

/**
 * Helper function to handle service layer errors
 * @param {Error} error - Error thrown by service
 * @param {Response} res - Express response object
 */
function handleServiceError(error, res) {
  const message = error.message || 'Unknown error'

  if (message.includes('VALIDATION_ERROR')) {
    return res.status(400).json({
      success: false,
      message: message.replace('VALIDATION_ERROR: ', '')
    })
  }

  if (message === 'CLIENT_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    })
  }

  if (message === 'UNAUTHORIZED') {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access this resource'
    })
  }

  console.error('Client Controller Error:', error)
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}
