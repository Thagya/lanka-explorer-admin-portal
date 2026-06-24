import { useState } from 'react'
import { useUsers, useUserDetail } from '../hooks/useUsers.js'
import UserSearch from '../components/users/UserSearch.jsx'
import UserDrawer from '../components/users/UserDrawer.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'
import { formatDate } from '../utils/formatters.js'
import { ShieldCheck, UserX } from 'lucide-react'

export default function UsersPage() {
  const { users, loading, error: loadError, toggle, remove } = useUsers()
  const [search, setSearch]         = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [actionError, setActionError] = useState('')
  const { detail, loading: detailLoading } = useUserDetail(selectedId)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async (id) => {
    setActionError('')
    try {
      await toggle(id)
      setSelectedId(null)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update user status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user and all their bookings?')) return
    setActionError('')
    try {
      await remove(id)
      setSelectedId(null)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
      <UserSearch value={search} onChange={setSearch} />

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          {loadError}
        </div>
      )}

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          {actionError}
        </div>
      )}

      <Table loading={loading} empty={!loadError && filtered.length === 0 ? 'No users found.' : null}>
        <thead><tr>
          <Th>Name</Th>
          <Th className="hidden sm:table-cell">Email</Th>
          <Th className="hidden md:table-cell">Role</Th>
          <Th>Status</Th>
          <Th className="hidden md:table-cell">Joined</Th>
          <Th>Actions</Th>
        </tr></thead>
        <tbody>
          {filtered.map(u => (
            <Tr key={u._id} onClick={() => setSelectedId(u._id)}>
              <Td>
                <p className="font-medium text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-400 sm:hidden mt-0.5 truncate">{u.email}</p>
              </Td>
              <Td className="hidden sm:table-cell text-gray-500">{u.email}</Td>
              <Td className="hidden md:table-cell">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                  {u.role}
                </span>
              </Td>
              <Td>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {u.active ? 'Active' : 'Disabled'}
                </span>
              </Td>
              <Td className="hidden md:table-cell text-gray-500">{formatDate(u.createdAt)}</Td>
              <Td onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleToggle(u._id)}
                  className={`p-1.5 rounded-lg transition-colors ${u.active ? 'text-orange-400 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                  title={u.active ? 'Disable' : 'Enable'}
                >
                  {u.active ? <UserX size={15} /> : <ShieldCheck size={15} />}
                </button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      <UserDrawer
        user={detail}
        onClose={() => setSelectedId(null)}
        onToggle={handleToggle}
        onDelete={handleDelete}
        loading={detailLoading}
      />
    </div>
  )
}
