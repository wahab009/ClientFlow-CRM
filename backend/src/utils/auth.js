import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`)
  }
}

/**
 * Compare plain text password with hashed password
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error.message}`)
  }
}

/**
 * Generate JWT token
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  )
}

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET)
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`)
  }
}
