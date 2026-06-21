import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, List, MapPin, Users, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

const NAV = [
  { to: '/',           label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { to: '/bookings',   label: 'Bookings',  Icon: ClipboardList },
  { to: '/listings',   label: 'Listings',  Icon: List },
  { to: '/attractions',label: 'Attractions',Icon: MapPin },
  { to: '/users',      label: 'Users',     Icon: Users },
]

export default function Sidebar() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-60 bg-teal-500 text-white flex flex-col min-h-screen fixed left-0 top-0 z-40">
      <div className="px-6 py-5 border-b border-white/20">
        <h1 className="font-bold text-lg">Lanka Explorer</h1>
        <p className="text-xs text-white/60 mt-0.5">Admin Portal</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV.map(({ to, label, Icon, exact }) => (
          <NavLink key={to} to={to} end={exact}
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
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            {admin?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-xs">
            <p className="font-medium">{admin?.name}</p>
            <p className="text-white/60">{admin?.email}</p>
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
