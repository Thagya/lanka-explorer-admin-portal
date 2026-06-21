export default function StatCard({ label, value, sub, icon: Icon, color = 'teal' }) {
  const colors = {
    teal:       { bg: 'bg-teal-50',   icon: 'bg-teal-500',   text: 'text-teal-600' },
    blue:       { bg: 'bg-blue-50',   icon: 'bg-blue-500',   text: 'text-blue-600' },
    gold:       { bg: 'bg-yellow-50', icon: 'bg-yellow-500', text: 'text-yellow-600' },
    terracotta: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-600' },
    green:      { bg: 'bg-green-50',  icon: 'bg-green-500',  text: 'text-green-600' },
  }
  const c = colors[color] || colors.teal

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
      {Icon && (
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className="text-white" />
        </div>
      )}
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${c.text}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
