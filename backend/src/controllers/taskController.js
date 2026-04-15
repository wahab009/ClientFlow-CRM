import taskService from '../services/taskService.js'

/**
 * Create new task
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, clientId } = req.body
    const userId = req.user.id

    const task = await taskService.createTask(
      { title, description, status, priority, clientId },
      userId
    )

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    })
  } catch (error) {
    handleServiceError(error, res)
  }
}

/**
 * Get all tasks with search, filter, and pagination
 */
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    const result = await taskService.getAllTasks(userId, isAdmin, req.query)

    res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      ...result
    })
  } catch (error) {
    handleServiceError(error, res)
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

    const task = await taskService.getTaskById(id, userId, isAdmin)

    res.json({
      success: true,
      message: 'Task retrieved successfully',
      data: task
    })
  } catch (error) {
    handleServiceError(error, res)
  }
}

/**
 * Update task
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const isAdmin = req.user.role === 'ADMIN'

    const updatedTask = await taskService.updateTask(id, req.body, userId, isAdmin)

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    })
  } catch (error) {
    handleServiceError(error, res)
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

    await taskService.deleteTask(id, userId, isAdmin)

    res.json({
      success: true,
      message: 'Task deleted successfully'
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

  if (message === 'TASK_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    })
  }

  if (message === 'UNAUTHORIZED') {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access this resource'
    })
  }

  console.error('Task Controller Error:', error)
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}
