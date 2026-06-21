import { useState, useEffect, useCallback } from 'react'
import { getAllBookings, getBooking, transitionBooking } from '../api/index.js'

export function useAllBookings(filter = 'all') {
  const [bookings, setBookings]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = filter !== 'all' ? { status: filter } : {}
    getAllBookings(params)
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter])

  return { bookings, loading }
}

export function useBooking(id) {
  const [booking, setBooking]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError]             = useState('')

  const load = useCallback(() => {
    if (!id) return
    getBooking(id)
      .then(({ data }) => setBooking(data))
      .catch(() => setError('Booking not found'))
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
