import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Create new client
 */
export const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body
    const userId = req.user.id

    // Validation
    if (!name) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Client name is required'
      })
    }

    const client = await prisma.client.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        status: status || 'active',
        assignedTo: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Client created successfully',
      data: client
    })
  } catch (error) {
    console.error('Error creating client:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Get all clients for current user
 */
export const getAllClients = async (req, res) => {
  try {
    const { status } = req.query
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    const whereClause = {
      ...(status && { status }),
      ...(isAdmin ? {} : { assignedTo: userId })
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      message: 'Clients retrieved successfully',
      data: clients,
      total: clients.length
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
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

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      })
    }

    // Check authorization
    if (!isAdmin && client.assignedTo !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot access this client'
      })
    }

    res.json({
      message: 'Client retrieved successfully',
      data: client
    })
  } catch (error) {
    console.error('Error fetching client:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Update client
 */
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, company, status } = req.body
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    // Check if client exists
    const client = await prisma.client.findUnique({ where: { id } })

    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      })
    }

    // Check authorization
    if (!isAdmin && client.assignedTo !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot update this client'
      })
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(company && { company }),
        ...(status && { status })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.json({
      message: 'Client updated successfully',
      data: updatedClient
    })
  } catch (error) {
    console.error('Error updating client:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
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

    // Check if client exists
    const client = await prisma.client.findUnique({ where: { id } })

    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      })
    }

    // Check authorization
    if (!isAdmin && client.assignedTo !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot delete this client'
      })
    }

    // Delete associated tasks first
    await prisma.task.deleteMany({
      where: { clientId: id }
    })

    await prisma.client.delete({
      where: { id }
    })

    res.json({
      message: 'Client deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting client:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}
