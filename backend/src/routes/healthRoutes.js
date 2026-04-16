import express from 'express'
import { success } from '../utils/response.js'

const router = express.Router()

router.get('/', (req, res) => {
  return success(res, {
    status: 'OK',
    message: 'Server is running'
  })
})

export default router
