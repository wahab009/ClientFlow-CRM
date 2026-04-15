import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Service layer for Task operations
 * Handles all business logic, validation, and database operations
 */

class TaskService {
  /**
   * Get all tasks with search, filter, and pagination
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @param {object} filters - { search, status, priority, clientId, page, limit }
   * @returns {object} - { data, pagination }
   */
  async getAllTasks(userId, isAdmin, filters = {}) {
    const { search, status, priority, clientId, page = 1, limit = 10 } = filters

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10))
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const whereClause = {
      // User scope: admin sees all, regular users see only their own
      ...(isAdmin ? {} : { userId }),

      // Status filter
      ...(status && { status: status.toLowerCase() }),

      // Priority filter
      ...(priority && { priority: priority.toLowerCase() }),

      // Client filter
      ...(clientId && { clientId }),

      // Search by title or description
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    // Execute parallel queries
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.task.count({ where: whereClause })
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum)

    return {
      data: tasks,
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
   * Get single task by ID with authorization check
   * @param {string} id - Task ID
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {object} - Task object
   * @throws {Error} - If not found or unauthorized
   */
  async getTaskById(id, userId, isAdmin) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    // Authorization check
    if (!isAdmin && task.userId !== userId) {
      throw new Error('UNAUTHORIZED')
    }

    return task
  }

  /**
   * Create new task with validation
   * @param {object} data - { title, description, status, priority, clientId }
   * @param {string} userId - User creating the task
   * @returns {object} - Created task
   * @throws {Error} - If validation fails
   */
  async createTask(data, userId) {
    const { title, description, status = 'pending', priority = 'medium', clientId } = data

    // Validation
    if (!title || title.trim() === '') {
      throw new Error('VALIDATION_ERROR: Title is required')
    }

    if (title.length < 2 || title.length > 200) {
      throw new Error('VALIDATION_ERROR: Title must be between 2-200 characters')
    }

    if (status && !['pending', 'in-progress', 'completed'].includes(status.toLowerCase())) {
      throw new Error('VALIDATION_ERROR: Status must be pending, in-progress, or completed')
    }

    if (priority && !['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      throw new Error('VALIDATION_ERROR: Priority must be low, medium, or high')
    }

    // Validate client if provided
    if (clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      })

      if (!client) {
        throw new Error('VALIDATION_ERROR: Client not found')
      }

      // Check if user has access to this client
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (currentUser.role !== 'ADMIN' && client.assignedTo !== userId) {
        throw new Error('UNAUTHORIZED: Cannot create task for this client')
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        status: status.toLowerCase(),
        priority: priority.toLowerCase(),
        userId,
        clientId: clientId || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return task
  }

  /**
   * Update task with authorization and validation
   * @param {string} id - Task ID
   * @param {object} data - Fields to update
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {object} - Updated task
   * @throws {Error} - If validation fails or unauthorized
   */
  async updateTask(id, data, userId, isAdmin) {
    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    // Authorization check
    if (!isAdmin && task.userId !== userId) {
      throw new Error('UNAUTHORIZED')
    }

    // Validate updateable fields
    const { title, description, status, priority } = data
    const updateData = {}

    if (title !== undefined) {
      if (!title || title.trim() === '') {
        throw new Error('VALIDATION_ERROR: Title cannot be empty')
      }
      if (title.length < 2 || title.length > 200) {
        throw new Error('VALIDATION_ERROR: Title must be between 2-200 characters')
      }
      updateData.title = title.trim()
    }

    if (description !== undefined) {
      updateData.description = description || null
    }

    if (status !== undefined) {
      if (!['pending', 'in-progress', 'completed'].includes(status.toLowerCase())) {
        throw new Error('VALIDATION_ERROR: Status must be pending, in-progress, or completed')
      }
      updateData.status = status.toLowerCase()
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority.toLowerCase())) {
        throw new Error('VALIDATION_ERROR: Priority must be low, medium, or high')
      }
      updateData.priority = priority.toLowerCase()
    }

    // No fields to update
    if (Object.keys(updateData).length === 0) {
      return task
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return updatedTask
  }

  /**
   * Delete task with authorization check
   * @param {string} id - Task ID
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @throws {Error} - If unauthorized or not found
   */
  async deleteTask(id, userId, isAdmin) {
    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    // Authorization check
    if (!isAdmin && task.userId !== userId) {
      throw new Error('UNAUTHORIZED')
    }

    await prisma.task.delete({
      where: { id }
    })
  }

  /**
   * Get task statistics
   * @param {string} userId - Current user ID
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {object} - Task statistics
   */
  async getTaskStats(userId, isAdmin) {
    const whereClause = isAdmin ? {} : { userId }

    const [totalTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
      prisma.task.count({ where: whereClause }),
      prisma.task.count({ where: { ...whereClause, status: 'pending' } }),
      prisma.task.count({ where: { ...whereClause, status: 'in-progress' } }),
      prisma.task.count({ where: { ...whereClause, status: 'completed' } })
    ])

    return {
      total: totalTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      completed: completedTasks
    }
  }
}

export default new TaskService()
