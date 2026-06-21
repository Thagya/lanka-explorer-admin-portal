import { X, Mail, Calendar, ShieldCheck, UserX, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'

export default function UserDrawer({ user, onClose, onToggle, onDelete, loading }) {
  if (!user) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <div className="p-5 space-y-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === 'admin' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-3 text-sm">
              <InfoRow icon={Mail} label={user.email} />
              <InfoRow icon={Calendar} label={`Joined ${new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`} />
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {user.active ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Booking history */}
            {user.bookings?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Booking History ({user.bookings.length})
                </p>
                <div className="space-y-2">
                  {user.bookings.slice(0, 6).map(b => (
                    <div key={b._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                      <div>
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[160px]">{b.listingName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge status={b.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user.bookings?.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No bookings yet</p>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => onToggle(user._id)}
              >
                {user.active
                  ? <><UserX size={15} /> Disable Account</>
                  : <><ShieldCheck size={15} /> Enable Account</>
                }
              </Button>
              {user.role !== 'admin' && (
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => onDelete(user._id)}
                >
                  <Trash2 size={15} /> Delete User
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <Icon size={15} className="text-teal-500 flex-shrink-0" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
