import { useState, useEffect, useCallback } from 'react'
import { getUsers, getUser, toggleUser, deleteUser } from '../api/index.js'

export function useUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    getUsers()
      .then(({ data }) => setUsers(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const toggle = async (id) => {
    await toggleUser(id)
    load()
  }

  const remove = async (id) => {
    await deleteUser(id)
    load()
  }

  return { users, loading, error, toggle, remove, reload: load }
}

export function useUserDetail(id) {
  const [detail, setDetail]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!id) { setDetail(null); setError(''); return }
    setLoading(true)
    setError('')
    getUser(id)
      .then(({ data }) => setDetail(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load user'))
      .finally(() => setLoading(false))
  }, [id])

  return { detail, loading, error }
}
