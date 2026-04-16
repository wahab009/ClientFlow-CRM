import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import healthRoutes from './routes/healthRoutes.js'
import userRoutes from './routes/userRoutes.js'
import clientRoutes from './routes/clientsRoutes.js'
import taskRoutes from './routes/tasksRoutes.js'
import { success, error as errorResponse } from './utils/response.js'
import { config } from './config/index.js'

const app = express()
const isProduction = config.NODE_ENV === 'production'
const allowedOrigins = config.CORS_ORIGIN
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

if (isProduction && allowedOrigins.length === 0) {
  throw new Error('CORS_ORIGIN must be configured in production')
}

const authRateLimiter = rateLimit({
  windowMs: config.AUTH_RATE_LIMIT_WINDOW_MS,
  max: config.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
})

// Middleware
app.disable('x-powered-by')
if (isProduction) {
  app.set('trust proxy', 1)
}

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    const corsError = new Error('CORS origin not allowed')
    corsError.status = 403
    return callback(corsError)
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/users/login', authRateLimiter)
app.use('/api/users/register', authRateLimiter)

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/users', userRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/tasks', taskRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  return success(res, {
    status: 'ok',
    message: 'Server is running'
  })
})

// 404 handler
app.use((req, res) => {
  return errorResponse(res, `Route ${req.method} ${req.path} not found`, 404)
})

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500
  if (!isProduction) {
    console.error('Error:', err)
  }

  const message = isProduction && status >= 500
    ? 'Internal server error'
    : (err.message || 'Internal server error')

  return errorResponse(res, message, status)
})

// Start server
app.listen(config.PORT, () => {
  if (!isProduction) {
    console.log(`Server running on http://localhost:${config.PORT}`)
    console.log(`API URL: http://localhost:${config.PORT}/api`)
    console.log(`CORS enabled for: ${allowedOrigins.join(', ') || 'none'}`)
    return
  }

  console.log(`Server running on port ${config.PORT}`)
})

export default app
