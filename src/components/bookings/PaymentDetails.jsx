export default function PaymentDetails({ payment }) {
  if (!payment?.reference) return null
  const rows = [
    { label: 'Method',    value: payment.method?.replace('_', ' ').toUpperCase() },
    { label: 'Reference', value: payment.reference },
    { label: 'Payer',     value: payment.payerName },
    { label: 'Amount',    value: `LKR ${Number(payment.paidAmount).toLocaleString()}` },
    { label: 'Date',      value: payment.paidDate },
  ]
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
      <div className="grid grid-cols-2 gap-3">
        {rows.map(r => (
          <div key={r.label}>
            <p className="text-xs text-gray-400">{r.label}</p>
            <p className="text-sm font-medium text-gray-800">{r.value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
