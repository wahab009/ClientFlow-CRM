import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js'

const prisma = new PrismaClient()

/**
 * Register new user
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name, email, and password are required'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already registered'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // Generate token
    const token = generateToken(user.id, user.role)

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true
      }
    })

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      })
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      })
    }

    // Generate token
    const token = generateToken(user.id, user.role)

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Error logging in user:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
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

    res.json({
      message: 'Users retrieved successfully',
      data: users,
      total: users.length
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
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
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      })
    }

    res.json({
      message: 'User retrieved successfully',
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Update user profile
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email } = req.body

    // Verify user owns this profile or is admin
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot update other users'
      })
    }

    // Check if new email already exists
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Email already in use'
        })
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    })

    res.json({
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // Prevent deleting self
    if (req.user.id === id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot delete your own account'
      })
    }

    await prisma.user.delete({
      where: { id }
    })

    res.json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      })
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    })
  }
}
