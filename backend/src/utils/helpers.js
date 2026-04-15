// Utility function for error handling
export const createError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

// Validation helpers
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateRequired = (field, value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw createError(400, `${field} is required`)
  }
}
