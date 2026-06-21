import { useState } from 'react'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'

// Only actions the admin role is permitted to perform (matches backend TRANSITIONS actor:'admin')
const ADMIN_ACTIONS = {
  under_review:         [
    { action: 'confirm',        label: 'Confirm Booking', variant: 'primary' },
    { action: 'reject_payment', label: 'Reject Payment',  variant: 'danger' },
  ],
  confirmed:            [
    { action: 'complete',       label: 'Mark Completed',  variant: 'primary' },
  ],
  reschedule_requested: [
    { action: 'approve_reschedule', label: 'Approve Reschedule', variant: 'primary' },
  ],
  amendment_requested:  [
    { action: 'approve_amendment',  label: 'Approve Amendment',  variant: 'primary' },
  ],
}

export default function BookingActions({ status, onAction, loading }) {
  const [note, setNote] = useState('')
  const actions = ADMIN_ACTIONS[status] || []

  if (!actions.length) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 mb-3">Admin Actions</h3>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Optional note for the customer..."
        rows={2}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
      />
      <div className="space-y-2">
        {actions.map(({ action, label, variant }) => (
          <Button
            key={action}
            variant={variant}
            size="sm"
            className="w-full"
            disabled={loading}
            onClick={() => onAction(action, { note })}
          >
            {loading ? <Spinner className="w-4 h-4" /> : label}
          </Button>
        ))}
      </div>
    </div>
  )
}
