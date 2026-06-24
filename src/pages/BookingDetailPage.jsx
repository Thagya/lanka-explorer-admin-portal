import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBooking } from '../hooks/useBookings.js'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import BookingTimeline from '../components/bookings/BookingTimeline.jsx'
import BookingActions from '../components/bookings/BookingActions.jsx'
import PaymentDetails from '../components/bookings/PaymentDetails.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { booking, loading, actionLoading, error, doAction } = useBooking(id)

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>
  if (!booking) return <div className="text-center py-24 text-gray-400">Booking not found.</div>

  const { status, listingName, type, customer, details, pricing, payment, history } = booking

  return (
    <div className="max-w-3xl w-full">
      <button onClick={() => navigate('/bookings')} className="flex items-center gap-2 text-teal-500 text-sm mb-5 hover:underline">
        <ArrowLeft size={16} /> All Bookings
      </button>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="md:col-span-2 space-y-4">
          {/* Main info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{listingName}</h1>
                <p className="text-sm text-gray-500 capitalize mt-0.5">{type}</p>
              </div>
              <Badge status={status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Customer"  value={customer?.name} />
              <InfoRow label="Email"     value={customer?.email} />
              <InfoRow label="Phone"     value={customer?.phone || '—'} />
              <InfoRow label="Booked On" value={formatDate(booking.createdAt)} />
              {Object.entries(details || {}).map(([k, v]) => (
                <InfoRow key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} value={String(v)} />
              ))}
            </div>
          </div>

          <PaymentDetails payment={payment} />

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Activity Timeline</h3>
            <BookingTimeline history={history} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Pricing</h3>
            <div className="space-y-2 text-sm">
              <PriceRow label={`Unit × ${pricing?.quantity}`} value={formatCurrency(pricing?.unitPrice * pricing?.quantity)} />
              {pricing?.extras > 0 && <PriceRow label="Extras" value={formatCurrency(pricing.extras)} />}
              <div className="border-t pt-2 mt-2">
                <PriceRow label="Total" value={formatCurrency(pricing?.total)} bold />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          <BookingActions status={status} onAction={doAction} loading={actionLoading} />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 capitalize">{label}</p>
      <p className="font-medium text-gray-800 mt-0.5">{value}</p>
    </div>
  )
}

function PriceRow({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-bold text-teal-500' : 'text-gray-800'}>{value}</span>
    </div>
  )
}
