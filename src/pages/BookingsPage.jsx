import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllBookings } from '../hooks/useBookings.js'
import BookingStatusFilter from '../components/bookings/BookingStatusFilter.jsx'
import Badge from '../components/ui/Badge.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

export default function BookingsPage() {
  const [filter, setFilter] = useState('all')
  const { bookings, loading } = useAllBookings(filter)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>
      <BookingStatusFilter value={filter} onChange={setFilter} />
      <Table loading={loading} empty={bookings.length === 0 ? 'No bookings found.' : null}>
        <thead><tr>
          <Th>Listing</Th><Th>Customer</Th><Th>Type</Th>
          <Th>Amount</Th><Th>Date</Th><Th>Status</Th>
        </tr></thead>
        <tbody>
          {bookings.map(b => (
            <Tr key={b._id}>
              <Td>
                <Link to={`/bookings/${b._id}`} className="text-teal-500 hover:underline font-medium">
                  {b.listingName}
                </Link>
              </Td>
              <Td>{b.customer?.name}</Td>
              <Td className="capitalize text-gray-500">{b.type}</Td>
              <Td>{formatCurrency(b.pricing?.total)}</Td>
              <Td className="text-gray-500">{formatDate(b.createdAt)}</Td>
              <Td><Badge status={b.status} /></Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
