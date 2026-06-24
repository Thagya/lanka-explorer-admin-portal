import { X, MapPin, Star, Clock, Ticket, Tag, Pencil, Trash2 } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'

const CATEGORY_COLORS = {
  Historical: 'bg-amber-100 text-amber-700',
  Scenic:     'bg-green-100 text-green-700',
  Beach:      'bg-blue-100 text-blue-700',
  Cultural:   'bg-purple-100 text-purple-700',
  Wildlife:   'bg-emerald-100 text-emerald-700',
}

function Stars({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={14} className={s <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
      ))}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2">
      <Icon size={15} className="text-teal-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function AttractionDetailDrawer({ attraction, loading, error, onClose, onEdit, onDelete }) {
  if (!loading && !attraction && !error) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-gray-900">Attraction Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-16"><Spinner /></div>
        )}

        {error && (
          <div className="p-5">
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          </div>
        )}

        {attraction && (
          <div className="flex-1 flex flex-col">
            {/* Hero image */}
            {attraction.images?.[0] && (
              <div className="w-full h-48 bg-gray-100 overflow-hidden shrink-0">
                <img src={attraction.images[0]} alt={attraction.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-5 space-y-5 flex-1">
              {/* Title + category */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{attraction.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${CATEGORY_COLORS[attraction.category] || 'bg-gray-100 text-gray-600'}`}>
                    {attraction.category}
                  </span>
                </div>

                {/* Rating */}
                {attraction.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Stars value={attraction.rating} />
                    <span className="text-sm font-semibold text-gray-700">{attraction.rating}</span>
                  </div>
                )}
                {(!attraction.rating || attraction.rating === 0) && (
                  <span className="text-xs text-gray-400">No rating yet</span>
                )}
              </div>

              {/* Key info rows */}
              <div className="space-y-3">
                <InfoRow icon={MapPin} label="Location" value={attraction.address || attraction.region} />
                <InfoRow icon={Clock} label="Opening Hours" value={attraction.openingHours} />
                <InfoRow icon={Ticket} label="Entry Fee" value={attraction.entryFee} />
              </div>

              {/* Short description */}
              {attraction.shortDescription && (
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-sm text-gray-600 italic">{attraction.shortDescription}</p>
                </div>
              )}

              {/* Full description */}
              {attraction.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{attraction.description}</p>
                </div>
              )}

              {/* Tags */}
              {attraction.tags?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Tag size={11} /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attraction.tags.map((t, i) => (
                      <span key={i} className="bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra images */}
              {attraction.images?.length > 1 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Images</p>
                  <div className="grid grid-cols-3 gap-2">
                    {attraction.images.slice(1).map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t px-5 py-4 space-y-2">
              <Button className="w-full" size="sm" onClick={onEdit}>
                <Pencil size={15} /> Edit Attraction
              </Button>
              <Button variant="danger" className="w-full" size="sm" onClick={onDelete}>
                <Trash2 size={15} /> Delete Attraction
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
