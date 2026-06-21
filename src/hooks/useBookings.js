import { useState, useEffect, useCallback } from 'react'
import { getAllBookings, getBooking, transitionBooking } from '../api/index.js'

export function useAllBookings(filter = 'all') {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = filter !== 'all' ? { status: filter } : {}
    getAllBookings(params)
      .then(({ data }) => setBookings(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [filter])

  return { bookings, loading, error }
}

export function useBooking(id) {
  const [booking, setBooking]             = useState(null)
  const [loading, setLoading]             = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError]                 = useState('')

  const load = useCallback(() => {
    if (!id) return
    getBooking(id)
      .then(({ data }) => setBooking(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load booking'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const doAction = useCallback(async (action, payload = {}) => {
    setActionLoading(true)
    setError('')
    try {
      const { data } = await transitionBooking(id, { action, ...payload })
      setBooking(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }, [id])

  return { booking, loading, actionLoading, error, doAction }
}
