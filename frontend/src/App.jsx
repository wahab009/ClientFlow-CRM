import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState(null)

  const checkApiHealth = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setApiStatus(data.message)
    } catch (error) {
      console.error('API health check failed:', error)
      setApiStatus('API unavailable')
    }
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>ClientFlow CRM</h1>
          <button onClick={checkApiHealth}>Check API Status</button>
          {apiStatus && <p className="status">{apiStatus}</p>}
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
