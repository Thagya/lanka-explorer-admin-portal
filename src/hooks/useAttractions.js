import { useState, useEffect, useCallback } from 'react'
import { getAttractions, getAttraction, createAttraction, updateAttraction, deleteAttraction } from '../api/index.js'

export function useAttractions() {
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    getAttractions()
      .then(({ data }) => setAttractions(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load attractions'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const create = async (data) => { await createAttraction(data); load() }
  const update = async (id, data) => { await updateAttraction(id, data); load() }
  const remove = async (id) => { await deleteAttraction(id); load() }

  return { attractions, loading, error, create, update, remove }
}

export function useAttractionDetail(id) {
  const [detail, setDetail]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!id) { setDetail(null); setError(''); return }
    setLoading(true)
    setError('')
    getAttraction(id)
      .then(({ data }) => setDetail(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load attraction'))
      .finally(() => setLoading(false))
  }, [id])

  return { detail, loading, error }
}
