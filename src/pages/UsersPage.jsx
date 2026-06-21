import { useState } from 'react'
import { useUsers, useUserDetail } from '../hooks/useUsers.js'
import UserSearch from '../components/users/UserSearch.jsx'
import UserDrawer from '../components/users/UserDrawer.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'
import { formatDate } from '../utils/formatters.js'
import { ShieldCheck, UserX } from 'lucide-react'

export default function UsersPage() {
  const { users, loading, toggle, remove } = useUsers()
  const [search, setSearch]     = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const { detail, loading: detailLoading } = useUserDetail(selectedId)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = async (id) => {
    await toggle(id)
    setSelectedId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user and all their bookings?')) return
    await remove(id)
    setSelectedId(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
      <UserSearch value={search} onChange={setSearch} />

      <Table loading={loading} empty={filtered.length === 0 ? 'No users found.' : null}>
        <thead><tr>
          <Th>Name</Th><Th>Email</Th><Th>Role</Th>
          <Th>Status</Th><Th>Joined</Th><Th>Actions</Th>
        </tr></thead>
        <tbody>
          {filtered.map(u => (
            <Tr key={u._id} onClick={() => setSelectedId(u._id)}>
              <Td className="font-medium text-gray-900">{u.name}</Td>
              <Td className="text-gray-500">{u.email}</Td>
              <Td>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                  {u.role}
                </span>
              </Td>
              <Td>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {u.active ? 'Active' : 'Disabled'}
                </span>
              </Td>
              <Td className="text-gray-500">{formatDate(u.createdAt)}</Td>
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
