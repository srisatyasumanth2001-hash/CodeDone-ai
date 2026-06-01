import {Link, Outlet, useNavigate} from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Dashboard(){
    const {user, logout} = useAuthStore()
    const navigate = useNavigate()
    const handleLogout = ()=>{
        logout()
        navigate('/login')
    }
  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <span className="text-lg font-semibold text-blue-400">CodeDone AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/dashboard/chat"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            AI Chat
          </Link>
          <Link
            to="/dashboard/files"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Files
          </Link>
          <Link
            to="/dashboard/search"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Doc Search
          </Link>
        </nav>

        {/* User info at bottom */}
        <div className="p-3 border-t border-gray-800">
          <div className="text-sm text-gray-400 px-3 mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <Outlet />
        {/* Outlet renders whatever child route is currently active */}
      </main>

    </div>
  )
}
