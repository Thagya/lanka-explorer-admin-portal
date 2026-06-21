import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import BookingDetailPage from './pages/BookingDetailPage.jsx'
import ListingsPage from './pages/ListingsPage.jsx'
import AttractionsPage from './pages/AttractionsPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import Spinner from './components/ui/Spinner.jsx'

function Protected({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="w-10 h-10" /></div>
  if (!admin) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { admin, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="w-10 h-10" /></div>

  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<Protected><AdminLayout><DashboardPage /></AdminLayout></Protected>} />
      <Route path="/bookings" element={<Protected><AdminLayout><BookingsPage /></AdminLayout></Protected>} />
      <Route path="/bookings/:id" element={<Protected><AdminLayout><BookingDetailPage /></AdminLayout></Protected>} />
      <Route path="/listings" element={<Protected><AdminLayout><ListingsPage /></AdminLayout></Protected>} />
      <Route path="/attractions" element={<Protected><AdminLayout><AttractionsPage /></AdminLayout></Protected>} />
      <Route path="/users" element={<Protected><AdminLayout><UsersPage /></AdminLayout></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
