import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js'
import { success, error } from '../utils/response.js'
import { config } from '../config/index.js'

const prisma = new PrismaClient()
const isProduction = config.NODE_ENV === 'production'

/**
 * Register new user
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return error(res, 'Name, email, and password are required', 400)
    }

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName) {
      return error(res, 'Name is required', 400)
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return error(res, 'Email already registered', 409)
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    const token = generateToken(user.id, user.role)

    return success(res, { user, token }, 201)
  } catch (err) {
    if (!isProduction) {
      console.error('Error registering user:', err)
    }
    return error(res, 'Internal server error', 500)
  }
}

/**
 * Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return error(res, 'Email and password are required', 400)
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true
      }
    })

    if (!user) {
      return error(res, 'Invalid email or password', 401)
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return error(res, 'Invalid email or password', 401)
    }

    const token = generateToken(user.id, user.role)

    return success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (err) {
    if (!isProduction) {
      console.error('Error logging in user:', err)
    }
    return error(res, 'Internal server error', 500)
  }
}

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            clients: true,
            tasks: true
          }
        }
      }
    })

    return success(res, {
      users,
      total: users.length
    })
  } catch (err) {
    if (!isProduction) {
      console.error('Error fetching users:', err)
    }
    return error(res, 'Internal server error', 500)
  }
}

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })

    if (!user) {
      return error(res, 'User not found', 404)
    }

    return success(res, user)
  } catch (err) {
    if (!isProduction) {
      console.error('Error fetching user:', err)
    }
    return error(res, 'Internal server error', 500)
  }
}

/**
 * Update user profile
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email } = req.body
    const normalizedName = name?.trim()
    const normalizedEmail = email?.trim().toLowerCase()

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return error(res, 'Cannot update other users', 403)
    }

    if (normalizedEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      })
      if (existingUser && existingUser.id !== id) {
        return error(res, 'Email already in use', 409)
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(normalizedName && { name: normalizedName }),
        ...(normalizedEmail && { email: normalizedEmail })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    })

    return success(res, user)
  } catch (err) {
    if (!isProduction) {
      console.error('Error updating user:', err)
    }
    if (err.code === 'P2025') {
      return error(res, 'User not found', 404)
    }
    return error(res, 'Internal server error', 500)
  }
}

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.id === id) {
      return error(res, 'Cannot delete your own account', 400)
    }

    await prisma.user.delete({
      where: { id }
    })

    return success(res, {})
  } catch (err) {
    if (!isProduction) {
      console.error('Error deleting user:', err)
    }
    if (err.code === 'P2025') {
      return error(res, 'User not found', 404)
    }
    return error(res, 'Internal server error', 500)
  }
}
