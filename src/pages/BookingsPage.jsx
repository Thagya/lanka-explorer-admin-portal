import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllBookings } from '../hooks/useBookings.js'
import BookingStatusFilter from '../components/bookings/BookingStatusFilter.jsx'
import Badge from '../components/ui/Badge.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

export default function BookingsPage() {
  const [filter, setFilter] = useState('all')
  const { bookings, loading, error } = useAllBookings(filter)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>
      <BookingStatusFilter value={filter} onChange={setFilter} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <Table loading={loading} empty={!error && bookings.length === 0 ? 'No bookings found.' : null}>
        <thead><tr>
          <Th>Listing</Th>
          <Th className="hidden sm:table-cell">Customer</Th>
          <Th className="hidden md:table-cell">Type</Th>
          <Th>Amount</Th>
          <Th className="hidden md:table-cell">Date</Th>
          <Th>Status</Th>
        </tr></thead>
        <tbody>
          {bookings.map(b => (
            <Tr key={b._id}>
              <Td>
                <Link to={`/bookings/${b._id}`} className="text-teal-500 hover:underline font-medium">
                  {b.listingName}
                </Link>
                <p className="text-xs text-gray-400 sm:hidden mt-0.5">{b.customer?.name}</p>
              </Td>
              <Td className="hidden sm:table-cell">{b.customer?.name}</Td>
              <Td className="hidden md:table-cell capitalize text-gray-500">{b.type}</Td>
              <Td>{formatCurrency(b.pricing?.total)}</Td>
              <Td className="hidden md:table-cell text-gray-500">{formatDate(b.createdAt)}</Td>
              <Td><Badge status={b.status} /></Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
