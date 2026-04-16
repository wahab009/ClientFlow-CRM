import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Topbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">ClientFlow Dashboard</h1>
      </div>
      <div className="topbar-actions">
        <div className="topbar-user">
          <p className="topbar-user-name">{user?.name || 'User'}</p>
          <p className="topbar-user-email">{user?.email || ''}</p>
        </div>
        <button className="button button-secondary theme-toggle" onClick={toggleTheme}>
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
        <button className="button button-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
