import { X, MapPin, Star, Check, Pencil, Trash2 } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import { formatCurrency, PRICE_UNIT_LABELS } from '../../utils/formatters.js'

const TYPE_COLORS = {
  hotel:   'bg-blue-100 text-blue-700',
  tour:    'bg-green-100 text-green-700',
  vehicle: 'bg-amber-100 text-amber-700',
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

export default function ListingDetailDrawer({ listing, loading, error, onClose, onEdit, onDelete }) {
  if (!loading && !listing && !error) return null

  const amenities = listing?.options?.amenities || listing?.options?.includes || []
  const roomTypes = listing?.options?.roomTypes || []

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-gray-900">Listing Details</h2>
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

        {listing && (
          <div className="flex-1 flex flex-col">
            {/* Hero image */}
            {listing.images?.[0] && (
              <div className="w-full h-48 bg-gray-100 overflow-hidden shrink-0">
                <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-5 space-y-5 flex-1">
              {/* Title + type + status */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{listing.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${TYPE_COLORS[listing.listingType] || 'bg-gray-100 text-gray-600'}`}>
                    {listing.listingType}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${listing.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {listing.active ? 'Active' : 'Inactive'}
                  </span>
                  {listing.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Stars value={listing.rating} />
                      <span className="text-sm font-semibold text-gray-700">{listing.rating}</span>
                      <span className="text-xs text-gray-400">({listing.reviewCount || 0} review{listing.reviewCount !== 1 ? 's' : ''})</span>
                    </div>
                  )}
                  {(!listing.rating || listing.rating === 0) && (
                    <span className="text-xs text-gray-400">No reviews yet</span>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-teal-500 mt-0.5 shrink-0" />
                <div className="text-sm text-gray-600">
                  {listing.address && <p className="font-medium text-gray-800">{listing.address}</p>}
                  <p className={listing.address ? 'text-gray-400 text-xs mt-0.5' : 'font-medium text-gray-800'}>{listing.region}</p>
                </div>
              </div>

              {/* Price */}
              <div className="bg-teal-50 rounded-xl px-4 py-3">
                <p className="text-xs text-teal-600 font-medium mb-0.5">Price</p>
                <p className="text-teal-600 font-bold text-xl">
                  {formatCurrency(listing.price?.amount)}
                  <span className="text-gray-500 font-normal text-sm ml-1">{PRICE_UNIT_LABELS[listing.price?.unit]}</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              {/* Room Types */}
              {roomTypes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Room Types</p>
                  <div className="space-y-1">
                    {roomTypes.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={13} className="text-teal-500 shrink-0" /> {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities / Includes */}
              {amenities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {listing.listingType === 'tour' ? "What's Included" : 'Amenities'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a, i) => (
                      <span key={i} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                        <Check size={10} className="text-teal-500" /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra images */}
              {listing.images?.length > 1 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Images</p>
                  <div className="grid grid-cols-3 gap-2">
                    {listing.images.slice(1).map((img, i) => (
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
                <Pencil size={15} /> Edit Listing
              </Button>
              <Button variant="danger" className="w-full" size="sm" onClick={onDelete}>
                <Trash2 size={15} /> Delete Listing
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
