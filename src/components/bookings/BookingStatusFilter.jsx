const STATUSES = [
  { key: 'all',                  label: 'All' },
  { key: 'pending_payment',      label: 'Pending Payment' },
  { key: 'under_review',         label: 'Under Review' },
  { key: 'payment_rejected',     label: 'Payment Rejected' },
  { key: 'confirmed',            label: 'Confirmed' },
  { key: 'reschedule_requested', label: 'Reschedule' },
  { key: 'completed',            label: 'Completed' },
  { key: 'cancelled',            label: 'Cancelled' },
]

export default function BookingStatusFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {STATUSES.map(s => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
            ${value === s.key
              ? 'bg-teal-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-500 hover:text-teal-500'
            }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
