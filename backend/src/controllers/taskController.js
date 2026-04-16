import taskService from '../services/taskService.js'
import { success, error } from '../utils/response.js'

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

    return success(res, task, 201)
  } catch (err) {
    return handleServiceError(err, res)
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

    return success(res, {
      tasks: result.data,
      pagination: result.pagination
    })
  } catch (err) {
    return handleServiceError(err, res)
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

    return success(res, task)
  } catch (err) {
    return handleServiceError(err, res)
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

    return success(res, updatedTask)
  } catch (err) {
    return handleServiceError(err, res)
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

  if (message === 'TASK_NOT_FOUND') {
    return error(res, 'Task not found', 404)
  }

  if (message.includes('UNAUTHORIZED')) {
    return error(res, 'You do not have permission to access this resource', 403)
  }

  return error(res, 'Internal server error', 500)
}
