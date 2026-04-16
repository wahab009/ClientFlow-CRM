import { useEffect, useState } from 'react'
import { getClients } from '../api/clients'
import { getTasks } from '../api/tasks'
import { getApiErrorMessage } from '../utils/apiError'

const initialStats = {
  totalClients: 0,
  totalTasks: 0,
  completedTasks: 0
}

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStats = async () => {
    setLoading(true)
    setError('')

    try {
      const [clientsResponse, tasksResponse, completedTasksResponse] = await Promise.all([
        getClients({ page: 1, limit: 1 }),
        getTasks({ page: 1, limit: 1 }),
        getTasks({ status: 'completed', page: 1, limit: 1 })
      ])

      const totalClients = clientsResponse?.data?.data?.pagination?.total || 0
      const totalTasks = tasksResponse?.data?.data?.pagination?.total || 0
      const completedTasks = completedTasksResponse?.data?.data?.pagination?.total || 0

      setStats({
        totalClients,
        totalTasks,
        completedTasks
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load dashboard stats'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <section>
      <div className="page-header-row">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Overview of your CRM activity</p>
        </div>
        <button className="button button-secondary" onClick={loadStats} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error ? <p className="alert alert-error">{error}</p> : null}

      <div className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Total Clients</p>
          <p className="stat-value">{loading ? '...' : stats.totalClients}</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Total Tasks</p>
          <p className="stat-value">{loading ? '...' : stats.totalTasks}</p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Completed Tasks</p>
          <p className="stat-value">{loading ? '...' : stats.completedTasks}</p>
        </article>
      </div>
    </section>
  )
}
