import { useState, useEffect, useCallback } from 'react'
import { getUsers, getUser, toggleUser, deleteUser } from '../api/index.js'

export function useUsers() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    getUsers()
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const toggle = async (id) => { await toggleUser(id); load() }
  const remove = async (id) => { await deleteUser(id); load() }

  return { users, loading, toggle, remove, reload: load }
}

export function useUserDetail(id) {
  const [detail, setDetail]   = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) { setDetail(null); return }
    setLoading(true)
    getUser(id)
      .then(({ data }) => setDetail(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  return { detail, loading }
}
