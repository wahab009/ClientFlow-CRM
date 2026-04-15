import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Create new task
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, clientId } = req.body
    const userId = req.user.id

    // Validation
    if (!title) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Task title is required'
      })
    }

    // If task is assigned to a client, verify the client exists and is accessible
    if (clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      })

      if (!client) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Client not found'
        })
      }

      // Check if user has access to this client
      if (req.user.role !== 'ADMIN' && client.assignedTo !== userId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Cannot create task for this client'
        })
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'pending',
        priority: priority || 'medium',
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

    res.status(201).json({
      message: 'Task created successfully',
      data: task
    })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Get all tasks for current user
 */
export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, clientId } = req.query
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    const whereClause = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(clientId && { clientId }),
      ...(isAdmin ? {} : { userId })
    }

    const tasks = await prisma.task.findMany({
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
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      message: 'Tasks retrieved successfully',
      data: tasks,
      total: tasks.length
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Get task by ID
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

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
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found'
      })
    }

    // Check authorization
    if (!isAdmin && task.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot access this task'
      })
    }

    res.json({
      message: 'Task retrieved successfully',
      data: task
    })
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Update task
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority } = req.body
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found'
      })
    }

    // Check authorization
    if (!isAdmin && task.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot update this task'
      })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority })
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

    res.json({
      message: 'Task updated successfully',
      data: updatedTask
    })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Delete task
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    // Check if task exists
    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found'
      })
    }

    // Check authorization
    if (!isAdmin && task.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot delete this task'
      })
    }

    await prisma.task.delete({
      where: { id }
    })

    res.json({
      message: 'Task deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}
