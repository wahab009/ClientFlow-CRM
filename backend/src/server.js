import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import healthRoutes from './routes/health.js'
import userRoutes from './routes/users.js'
import clientRoutes from './routes/clients.js'
import taskRoutes from './routes/tasks.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/users', userRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/tasks', taskRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📝 API URL: http://localhost:${PORT}/api`)
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
})

export default app
