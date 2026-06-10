import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-gray-800 text-white'
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`

  return (
    <div
      style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}
      className="bg-gray-950 text-white"
    >

      {/* SIDEBAR */}
      <aside
        style={{
          width: sidebarOpen ? '240px' : '0px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.25s ease',
        }}
        className="bg-gray-900 border-r border-gray-800"
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }} className="p-4 border-b border-gray-800">
          <span className="text-lg font-semibold text-blue-400 whitespace-nowrap">
            CodeDone AI
          </span>
        </div> 

        {/* Nav */}
        <nav style={{ flexShrink: 0 }} className="p-3 space-y-1">
          <NavLink to="/dashboard/chat" className={navLinkClass}>
            <span>💬</span>
            <span className="whitespace-nowrap">AI Chat</span>
          </NavLink>
          <NavLink to="/dashboard/files" className={navLinkClass}>
            <span>📄</span>
            <span className="whitespace-nowrap">Files</span>
          </NavLink>
          <NavLink to="/dashboard/search" className={navLinkClass}>
            <span>🔍</span>
            <span className="whitespace-nowrap">Doc Search</span>
          </NavLink>
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User section */}
        <div style={{ flexShrink: 0 }} className="p-3 border-t border-gray-800">
          <div className="text-xs text-gray-500 px-3 mb-2 truncate whitespace-nowrap">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors whitespace-nowrap"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* TOP BAR — contains toggle button */}
        <div
          style={{ flexShrink: 0, height: '48px' }}
          className="flex items-center gap-3 px-4 border-b border-gray-800 bg-gray-950"
        >
          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {/* Hamburger / close icon */}
            <div className="flex flex-col gap-1.5 w-5">
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  background: 'currentColor',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                  transform: sidebarOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  background: 'currentColor',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                  opacity: sidebarOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  background: 'currentColor',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                  transform: sidebarOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
                }}
              />
            </div>
          </button>

          {/* Show logo when sidebar is closed so user knows where they are */}
          {!sidebarOpen && (
            <span className="text-sm font-semibold text-blue-400">
              CodeDone AI
            </span>
          )}
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Outlet />
        </div>
      </main>

    </div>
  )
}
