import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    console.log('Dashboard loaded')
  }, [])

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Welcome to ClientFlow CRM</p>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Active Projects</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-value">$0</p>
        </div>
      </div>
    </div>
  )
}
