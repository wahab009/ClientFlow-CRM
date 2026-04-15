import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided'
    })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token'
    })
  }
}

/**
 * Authorization middleware to check user role
 */
export const authorizeRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      })
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User does not have required role'
      })
    }

    next()
  }
}
