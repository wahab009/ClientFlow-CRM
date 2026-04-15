import express from 'express'
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/clientController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

/**
 * All routes require authentication
 */
router.use(authenticateToken)

/**
 * Client routes
 */
router.post('/', createClient)
router.get('/', getAllClients)
router.get('/:id', getClientById)
router.put('/:id', updateClient)
router.delete('/:id', deleteClient)

export default router
