import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, List, MapPin, Users, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

const NAV = [
  { to: '/',            label: 'Dashboard',  Icon: LayoutDashboard, exact: true },
  { to: '/bookings',    label: 'Bookings',   Icon: ClipboardList },
  { to: '/listings',    label: 'Listings',   Icon: List },
  { to: '/attractions', label: 'Attractions', Icon: MapPin },
  { to: '/users',       label: 'Users',      Icon: Users },
]

export default function Sidebar({ open, onClose }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const handleNav = () => { if (onClose) onClose() }

  return (
    <aside className={`w-60 bg-teal-500 text-white flex flex-col min-h-screen fixed left-0 top-0 z-40 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-6 py-5 border-b border-white/20">
        <h1 className="font-bold text-lg">Lanka Explorer</h1>
        <p className="text-xs text-white/60 mt-0.5">Admin Portal</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV.map(({ to, label, Icon, exact }) => (
          <NavLink key={to} to={to} end={exact} onClick={handleNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/20">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
            {admin?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-xs min-w-0">
            <p className="font-medium truncate">{admin?.name}</p>
            <p className="text-white/60 truncate">{admin?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
