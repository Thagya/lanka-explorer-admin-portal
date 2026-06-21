import Sidebar from './Sidebar.jsx'

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-60 flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}
