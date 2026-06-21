import { useState, useEffect, useCallback } from 'react'
import { getAllListings, createListing, updateListing, deleteListing } from '../api/index.js'

export function useListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    getAllListings()
      .then(({ data }) => setListings(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load listings'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const create = async (data) => { await createListing(data); load() }
  const update = async (id, data) => { await updateListing(id, data); load() }
  const remove = async (id) => { await deleteListing(id); load() }

  return { listings, loading, error, create, update, remove, reload: load }
}
