import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import {
  createClient,
  deleteClient,
  getClients,
  updateClient
} from '../api/clients'
import { getApiErrorMessage } from '../utils/apiError'

const DEFAULT_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'active'
}

export default function Clients() {
  const [clients, setClients] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
    hasMore: false
  })
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const loadClients = async (targetPage = page) => {
    setLoading(true)
    setError('')

    try {
      const response = await getClients({
        page: targetPage,
        limit: 10,
        ...(search ? { search } : {}),
        ...(statusFilter !== 'all' ? { status: statusFilter } : {})
      })

      const payload = response?.data?.data || {}
      const clientRows = payload.clients || []
      const paginationData = payload.pagination || {
        page: targetPage,
        pages: 1,
        total: clientRows.length,
        limit: 10,
        hasMore: false
      }

      setClients(clientRows)
      setPagination(paginationData)
      setPage(paginationData.page || targetPage)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load clients'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients(page)
  }, [page, search, statusFilter])

  const resetModal = () => {
    setModalOpen(false)
    setEditingClient(null)
    setFormData(DEFAULT_FORM)
  }

  const openCreateModal = () => {
    setEditingClient(null)
    setFormData(DEFAULT_FORM)
    setModalOpen(true)
  }

  const openEditModal = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      status: client.status || 'active'
    })
    setModalOpen(true)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value)
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
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      status: formData.status
    }

    if (formData.email.trim()) {
      payload.email = formData.email.trim()
    }

    return payload
  }

  const handleSaveClient = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = buildPayload()
      if (!payload.name) {
        throw new Error('Client name is required')
      }

      if (editingClient) {
        await updateClient(editingClient.id, payload)
      } else {
        await createClient(payload)
      }

      const shouldJumpToFirstPage = !editingClient && page !== 1
      resetModal()

      if (shouldJumpToFirstPage) {
        setPage(1)
      } else {
        await loadClients(editingClient ? page : 1)
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to save client'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClient = async (clientId) => {
    const confirmed = window.confirm('Delete this client?')
    if (!confirmed) return

    setError('')
    try {
      await deleteClient(clientId)
      await loadClients(page)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete client'))
    }
  }

  return (
    <section>
      <div className="page-header-row">
        <div className="page-header">
          <h2>Clients</h2>
          <p>Manage your client accounts</p>
        </div>
        <button className="button" onClick={openCreateModal}>
          Add Client
        </button>
      </div>

      {error ? <p className="alert alert-error">{error}</p> : null}

      <div className="toolbar-grid">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Search clients..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button className="button button-secondary" type="submit">
            Search
          </button>
        </form>

        <select className="input select" value={statusFilter} onChange={handleStatusChange}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-empty">Loading clients...</td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-empty">
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.company || '-'}</td>
                  <td>{client.email || '-'}</td>
                  <td>
                    <span className={`badge badge-${client.status}`}>{client.status}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="button button-secondary" onClick={() => openEditModal(client)}>
                        Edit
                      </button>
                      <button className="button button-danger" onClick={() => handleDeleteClient(client.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
        <Modal title={editingClient ? 'Edit Client' : 'Add Client'} onClose={resetModal}>
          <form className="form-grid" onSubmit={handleSaveClient}>
            <label>
              Name
              <input
                className="input"
                value={formData.name}
                onChange={(event) => handleFormChange('name', event.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                className="input"
                type="email"
                value={formData.email}
                onChange={(event) => handleFormChange('email', event.target.value)}
              />
            </label>
            <label>
              Phone
              <input
                className="input"
                value={formData.phone}
                onChange={(event) => handleFormChange('phone', event.target.value)}
              />
            </label>
            <label>
              Company
              <input
                className="input"
                value={formData.company}
                onChange={(event) => handleFormChange('company', event.target.value)}
              />
            </label>
            <label>
              Status
              <select
                className="input select"
                value={formData.status}
                onChange={(event) => handleFormChange('status', event.target.value)}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
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
