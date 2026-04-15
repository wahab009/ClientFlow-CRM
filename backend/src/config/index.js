const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const DATABASE_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

export const config = {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRE,
  CORS_ORIGIN
}
