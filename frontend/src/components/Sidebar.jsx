import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Clients', to: '/clients' },
  { label: 'Tasks', to: '/tasks' }
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">ClientFlow CRM</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
