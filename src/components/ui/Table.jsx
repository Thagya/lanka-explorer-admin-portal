import Spinner from './Spinner.jsx'

export function Table({ children, loading, empty }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {loading ? (
        <div className="flex justify-center py-16"><Spinner className="w-10 h-10" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">{children}</table>
        </div>
      )}
      {!loading && empty && (
        <div className="text-center py-14 text-gray-400">{empty}</div>
      )}
    </div>
  )
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 ${className}`}>
      {children}
    </th>
  )
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>
}

export function Tr({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b last:border-0 transition-colors ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${className}`}
    >
      {children}
    </tr>
  )
}
