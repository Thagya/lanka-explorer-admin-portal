import { createContext, useContext, useState, useEffect } from 'react'
import { adminLogin, getMe } from '../api/index.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const s = localStorage.getItem('le_admin')
    return s ? JSON.parse(s) : null
  })
  const [loading, setLoading] = useState(!!localStorage.getItem('le_admin_token'))

  useEffect(() => {
    const token = localStorage.getItem('le_admin_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then(({ data }) => {
        if (data.role !== 'admin') throw new Error('Not admin')
        setAdmin(data)
      })
      .catch(() => {
        localStorage.removeItem('le_admin_token')
        localStorage.removeItem('le_admin')
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { data } = await adminLogin({ email, password })
    if (data.user.role !== 'admin') throw new Error('Not an admin account')
    localStorage.setItem('le_admin_token', data.token)
    localStorage.setItem('le_admin', JSON.stringify(data.user))
    setAdmin(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('le_admin_token')
    localStorage.removeItem('le_admin')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
