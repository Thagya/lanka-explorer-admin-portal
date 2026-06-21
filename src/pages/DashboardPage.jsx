import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Building2, Users, TrendingUp } from 'lucide-react'
import { getAllBookings, getAllListings, getUsers } from '../api/index.js'
import StatCard from '../components/ui/StatCard.jsx'
import Badge from '../components/ui/Badge.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

export default function DashboardPage() {
  const [bookings, setBookings] = useState([])
  const [listings, setListings] = useState([])
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    Promise.all([getAllBookings(), getAllListings(), getUsers()])
      .then(([b, l, u]) => { setBookings(b.data); setListings(l.data); setUsers(u.data) })
      .catch(err => setError(err.response?.data?.message || 'Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>

  const pending = bookings.filter(b => b.status === 'under_review').length
  const revenue = bookings
    .filter(b => ['confirmed', 'completed'].includes(b.status))
    .reduce((s, b) => s + (b.pricing?.total || 0), 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings"   value={bookings.length} sub={`${pending} under review`} icon={ClipboardList} color="teal" />
        <StatCard label="Active Listings"  value={listings.filter(l => l.active).length} sub={`${listings.length} total`} icon={Building2} color="blue" />
        <StatCard label="Customers"        value={users.filter(u => u.role === 'user').length} icon={Users} color="gold" />
        <StatCard label="Revenue (LKR)"    value={revenue.toLocaleString()} sub="confirmed + completed" icon={TrendingUp} color="terracotta" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">Recent Bookings</h2>
          <Link to="/bookings" className="text-sm text-teal-500 hover:underline">View all →</Link>
        </div>
        <Table>
          <thead><tr>
            <Th>Listing</Th><Th>Customer</Th><Th>Amount</Th><Th>Date</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            {bookings.slice(0, 8).map(b => (
              <Tr key={b._id}>
                <Td>
                  <Link to={`/bookings/${b._id}`} className="text-teal-500 hover:underline font-medium">
                    {b.listingName}
                  </Link>
                  <p className="text-xs text-gray-400 capitalize">{b.type}</p>
                </Td>
                <Td>{b.customer?.name}</Td>
                <Td>{formatCurrency(b.pricing?.total)}</Td>
                <Td className="text-gray-500">{formatDate(b.createdAt)}</Td>
                <Td><Badge status={b.status} /></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        {bookings.length === 0 && !error && <p className="text-center text-gray-400 py-8 text-sm">No bookings yet.</p>}
      </div>
    </div>
  )
}
