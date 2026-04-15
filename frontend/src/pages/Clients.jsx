import { useEffect, useState } from 'react'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Clients page loaded')
  }, [])

  return (
    <div className="clients">
      <h2>Clients</h2>
      <p>Client management interface</p>
      {loading && <p>Loading clients...</p>}
      {!loading && (!clients || clients.length === 0) && (
        <p>No clients found. Create your first client to get started.</p>
      )}
    </div>
  )
}
