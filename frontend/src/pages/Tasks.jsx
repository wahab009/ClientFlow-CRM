import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { getClients } from '../api/clients'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from '../api/tasks'
import { getApiErrorMessage } from '../utils/apiError'

const taskFilters = ['all', 'pending', 'completed']

const DEFAULT_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  clientId: ''
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [clients, setClients] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
    hasMore: false
  })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [completingTaskId, setCompletingTaskId] = useState('')
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const loadTaskRows = async (targetPage = page, filter = activeFilter) => {
    setLoading(true)
    setError('')

    try {
      const response = await getTasks({
        page: targetPage,
        limit: 10,
        ...(filter !== 'all' ? { status: filter } : {})
      })

      const payload = response?.data?.data || {}
      const taskRows = payload.tasks || []
      const paginationData = payload.pagination || {
        page: targetPage,
        pages: 1,
        total: taskRows.length,
        limit: 10,
        hasMore: false
      }

      setTasks(taskRows)
      setPagination(paginationData)
      setPage(paginationData.page || targetPage)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load tasks'))
    } finally {
      setLoading(false)
    }
  }

  const loadClientOptions = async () => {
    try {
      const response = await getClients({ page: 1, limit: 100 })
      const rows = response?.data?.data?.clients || []
      setClients(rows)
    } catch {
      setClients([])
    }
  }

  useEffect(() => {
    loadTaskRows(page, activeFilter)
  }, [page, activeFilter])

  useEffect(() => {
    loadClientOptions()
  }, [])

  const resetModal = () => {
    setModalOpen(false)
    setEditingTask(null)
    setFormData(DEFAULT_FORM)
  }

  const openCreateModal = () => {
    setEditingTask(null)
    setFormData(DEFAULT_FORM)
    setModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      clientId: task.clientId || task.client?.id || ''
    })
    setModalOpen(true)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setPage(1)
  }

  const handleFormChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }))
  }

  const buildPayload = () => {
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority
    }

    if (formData.clientId) {
      payload.clientId = formData.clientId
    }

    return payload
  }

  const handleSaveTask = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = buildPayload()
      if (!payload.title) {
        throw new Error('Task title is required')
      }

      if (editingTask) {
        await updateTask(editingTask.id, payload)
      } else {
        await createTask(payload)
      }

      const shouldJumpToFirstPage = !editingTask && page !== 1
      resetModal()

      if (shouldJumpToFirstPage) {
        setPage(1)
      } else {
        await loadTaskRows(editingTask ? page : 1, activeFilter)
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save task'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Delete this task?')
    if (!confirmed) return

    setError('')
    try {
      await deleteTask(taskId)
      await loadTaskRows(page, activeFilter)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete task'))
    }
  }

  const handleCompleteTask = async (task) => {
    const isCompleted = (task.status || '').toLowerCase() === 'completed'
    if (isCompleted) return

    setCompletingTaskId(task.id)
    setError('')
    try {
      await updateTask(task.id, { status: 'completed' })
      await loadTaskRows(page, activeFilter)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to complete task'))
    } finally {
      setCompletingTaskId('')
    }
  }

  return (
    <section>
      <div className="page-header-row">
        <div className="page-header">
          <h2>Tasks</h2>
          <p>Track and manage task execution</p>
        </div>
        <button className="button" onClick={openCreateModal}>
          Add Task
        </button>
      </div>

      {error ? <p className="alert alert-error">{error}</p> : null}

      <div className="tabs">
        {taskFilters.map((filter) => (
          <button
            key={filter}
            className={`tab${activeFilter === filter ? ' tab-active' : ''}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter[0].toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Client</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-empty">Loading tasks...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-empty">No tasks found</td>
              </tr>
            ) : (
               tasks.map((task) => {
                const isCompleted = (task.status || '').toLowerCase() === 'completed'
                const isCompleting = completingTaskId === task.id

                return (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.client?.name || '-'}</td>
                    <td>
                      <span className={`badge badge-${task.status}`}>{task.status}</span>
                    </td>
                    <td>{task.priority}</td>
                    <td>
                      <div className="row-actions">
                        {!isCompleted ? (
                          <button
                            className="button button-success"
                            onClick={() => handleCompleteTask(task)}
                            disabled={isCompleting}
                          >
                            {isCompleting ? 'Completing...' : 'Complete'}
                          </button>
                        ) : null}
                        <button className="button button-secondary" onClick={() => openEditModal(task)}>
                          Edit
                        </button>
                        <button className="button button-danger" onClick={() => handleDeleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="button button-secondary"
          disabled={loading || page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Previous
        </button>
        <p>
          Page {pagination.page} of {Math.max(1, pagination.pages)} · Total {pagination.total}
        </p>
        <button
          className="button button-secondary"
          disabled={loading || page >= pagination.pages}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>

      {modalOpen ? (
        <Modal title={editingTask ? 'Edit Task' : 'Add Task'} onClose={resetModal}>
          <form className="form-grid" onSubmit={handleSaveTask}>
            <label>
              Title
              <input
                className="input"
                value={formData.title}
                onChange={(event) => handleFormChange('title', event.target.value)}
                required
              />
            </label>

            <label>
              Description
              <textarea
                className="input textarea"
                value={formData.description}
                onChange={(event) => handleFormChange('description', event.target.value)}
              />
            </label>

            <label>
              Status
              <select
                className="input select"
                value={formData.status}
                onChange={(event) => handleFormChange('status', event.target.value)}
              >
                <option value="pending">pending</option>
                <option value="in-progress">in-progress</option>
                <option value="completed">completed</option>
              </select>
            </label>

            <label>
              Priority
              <select
                className="input select"
                value={formData.priority}
                onChange={(event) => handleFormChange('priority', event.target.value)}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </label>

            <label>
              Client (optional)
              <select
                className="input select"
                value={formData.clientId}
                onChange={(event) => handleFormChange('clientId', event.target.value)}
              >
                <option value="">No client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-actions">
              <button type="button" className="button button-secondary" onClick={resetModal}>
                Cancel
              </button>
              <button type="submit" className="button" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  )
}
