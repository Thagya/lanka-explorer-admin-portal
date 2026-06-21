export const formatCurrency = (amount, currency = 'LKR') =>
  `${currency} ${Number(amount || 0).toLocaleString()}`

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export const PRICE_UNIT_LABELS = {
  per_night:  '/night',
  per_person: '/person',
  per_day:    '/day',
}

export const TYPE_ICONS = { hotel: '🏨', tour: '🗺️', vehicle: '🚙' }
