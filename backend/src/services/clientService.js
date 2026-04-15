import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Service layer for Client operations
 * Handles all business logic, validation, and database operations
 */

class ClientService {
  /**
   * Get all clients with search, filter, and pagination
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @param {object} filters - { search, status, page, limit }
   * @returns {object} - { data, pagination }
   */
  async getAllClients(userId, isAdmin, filters = {}) {
    const { search, status, page = 1, limit = 10 } = filters

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10))
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const whereClause = {
      // User scope: admin sees all, regular users see only their own
      ...(isAdmin ? {} : { assignedTo: userId }),

      // Status filter
      ...(status && { status: status.toLowerCase() }),

      // Search across multiple fields (case-insensitive)
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    // Execute parallel queries
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.client.count({ where: whereClause })
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum)

    return {
      data: clients,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: totalPages,
        hasMore: pageNum < totalPages
      }
    }
  }

  /**
   * Get single client by ID with authorization check
   * @param {string} id - Client ID
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {object} - Client object
   * @throws {Error} - If not found or unauthorized
   */
  async getClientById(id, userId, isAdmin) {
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
      throw new Error('CLIENT_NOT_FOUND')
    }

    // Authorization check
    if (!isAdmin && client.assignedTo !== userId) {
      throw new Error('UNAUTHORIZED')
    }

    return client
  }

  /**
   * Create new client with validation
   * @param {object} data - { name, email, phone, company, status }
   * @param {string} userId - User creating the client
   * @returns {object} - Created client
   * @throws {Error} - If validation fails
   */
  async createClient(data, userId) {
    const { name, email, phone, company, status = 'active' } = data

    // Validation
    if (!name || name.trim() === '') {
      throw new Error('VALIDATION_ERROR: Name is required')
    }

    if (name.length < 2 || name.length > 100) {
      throw new Error('VALIDATION_ERROR: Name must be between 2-100 characters')
    }

    if (email && !this.isValidEmail(email)) {
      throw new Error('VALIDATION_ERROR: Invalid email format')
    }

    if (status && !['active', 'inactive'].includes(status.toLowerCase())) {
      throw new Error('VALIDATION_ERROR: Status must be "active" or "inactive"')
    }

    // Check email uniqueness (if provided)
    if (email) {
      const existingClient = await prisma.client.findFirst({
        where: { email }
      })
      if (existingClient) {
        throw new Error('VALIDATION_ERROR: Email already in use')
      }
    }

    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        email: email ? email.toLowerCase() : null,
        phone: phone || null,
        company: company ? company.trim() : null,
        status: status.toLowerCase(),
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

    return client
  }

  /**
   * Update client with authorization and validation
   * @param {string} id - Client ID
   * @param {object} data - Fields to update
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {object} - Updated client
   * @throws {Error} - If validation fails or unauthorized
   */
  async updateClient(id, data, userId, isAdmin) {
    // Check if client exists
    const client = await prisma.client.findUnique({ where: { id } })
    if (!client) {
      throw new Error('CLIENT_NOT_FOUND')
    }

    // Authorization check
    if (!isAdmin && client.assignedTo !== userId) {
      throw new Error('UNAUTHORIZED')
    }

    // Validate updateable fields
    const { name, email, phone, company, status } = data
    const updateData = {}

    if (name !== undefined) {
      if (!name || name.trim() === '') {
        throw new Error('VALIDATION_ERROR: Name cannot be empty')
      }
      if (name.length < 2 || name.length > 100) {
        throw new Error('VALIDATION_ERROR: Name must be between 2-100 characters')
      }
      updateData.name = name.trim()
    }

    if (email !== undefined) {
      if (email !== client.email) {
        // Check if new email is valid and unique
        if (!this.isValidEmail(email)) {
          throw new Error('VALIDATION_ERROR: Invalid email format')
        }
        const existingClient = await prisma.client.findFirst({
          where: { email: email.toLowerCase() }
        })
        if (existingClient) {
          throw new Error('VALIDATION_ERROR: Email already in use')
        }
      }
      updateData.email = email.toLowerCase()
    }

    if (phone !== undefined) {
      updateData.phone = phone || null
    }

    if (company !== undefined) {
      updateData.company = company ? company.trim() : null
    }

    if (status !== undefined) {
      if (!['active', 'inactive'].includes(status.toLowerCase())) {
        throw new Error('VALIDATION_ERROR: Status must be "active" or "inactive"')
      }
      updateData.status = status.toLowerCase()
    }

    // No fields to update
    if (Object.keys(updateData).length === 0) {
      return client
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: updateData,
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

    return updatedClient
  }

  /**
   * Delete client with authorization check and cascade
   * @param {string} id - Client ID
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @throws {Error} - If unauthorized or not found
   */
  async deleteClient(id, userId, isAdmin) {
    // Check if client exists
    const client = await prisma.client.findUnique({ where: { id } })
    if (!client) {
      throw new Error('CLIENT_NOT_FOUND')
    }

    // Authorization check
    if (!isAdmin && client.assignedTo !== userId) {
      throw new Error('UNAUTHORIZED')
    }

    // Delete associated tasks first (cascade)
    await prisma.task.deleteMany({
      where: { clientId: id }
    })

    // Then delete client
    await prisma.client.delete({
      where: { id }
    })
  }

  /**
   * Get clients by user (admin only can see all users' clients)
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {object} - Statistics about user's clients
   */
  async getClientStats(userId, isAdmin) {
    const whereClause = isAdmin ? {} : { assignedTo: userId }

    const [totalClients, activeClients, inactiveClients] = await Promise.all([
      prisma.client.count({ where: whereClause }),
      prisma.client.count({ where: { ...whereClause, status: 'active' } }),
      prisma.client.count({ where: { ...whereClause, status: 'inactive' } })
    ])

    return {
      total: totalClients,
      active: activeClients,
      inactive: inactiveClients
    }
  }

  /**
   * Helper: Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

export default new ClientService()
