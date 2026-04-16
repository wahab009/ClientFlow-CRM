import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { error as errorResponse } from '../utils/response.js'

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return errorResponse(res, 'No token provided', 401)
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 403)
  }
}

/**
 * Authorization middleware to check user role
 */
export const authorizeRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'User not authenticated', 401)
    }

    if (!requiredRoles.includes(req.user.role)) {
      return errorResponse(res, 'User does not have required role', 403)
    }

    next()
  }
}
