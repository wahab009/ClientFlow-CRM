import express from 'express'
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js'
import { authenticateToken, authorizeRole } from '../middleware/auth.js'
import { success } from '../utils/response.js'

const router = express.Router()

/**
 * Public routes
 */
router.post('/register', registerUser)
router.post('/login', loginUser)

/**
 * Protected routes
 */

// Get user profile
router.get('/me', authenticateToken, (req, res) => {
  return success(res, req.user)
})

// Update own profile
router.put('/:id', authenticateToken, updateUser)

// Admin only routes
router.get('/', authenticateToken, authorizeRole(['ADMIN']), getAllUsers)
router.get('/:id', authenticateToken, getUserById)
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), deleteUser)

export default router
