import { createContext, useContext, useMemo, useState } from 'react'
import { login as loginRequest, register as registerRequest } from '../api/auth'
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  saveAuthSession
} from '../utils/authStorage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(getStoredUser())

  const persistAuthState = (response) => {
    const payload = response?.data?.data || {}
    const nextToken = payload.token
    const nextUser = payload.user

    if (!nextToken || !nextUser) {
      throw new Error('Invalid login response')
    }

    saveAuthSession(nextToken, nextUser)
    setToken(nextToken)
    setUser(nextUser)

    return nextUser
  }

  const login = async (credentials) => {
    const response = await loginRequest(credentials)
    return persistAuthState(response)
  }

  const register = async (registrationPayload) => {
    const response = await registerRequest(registrationPayload)
    return persistAuthState(response)
  }

  const logout = () => {
    clearAuthSession()
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [user, token, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
