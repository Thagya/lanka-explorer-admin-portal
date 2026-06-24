import { Search } from 'lucide-react'

export default function UserSearch({ value, onChange }) {
  return (
    <div className="relative max-w-sm mb-5">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
      />
    </div>
  )
}


