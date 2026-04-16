import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const DATABASE_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const CORS_ORIGIN = process.env.CORS_ORIGIN || (NODE_ENV === 'production' ? '' : 'http://localhost:3000')
const AUTH_RATE_LIMIT_MAX = Number(process.env.AUTH_RATE_LIMIT_MAX || (NODE_ENV === 'production' ? 20 : 100))
const AUTH_RATE_LIMIT_WINDOW_MS = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000)

export const config = {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CORS_ORIGIN,
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW_MS
}
