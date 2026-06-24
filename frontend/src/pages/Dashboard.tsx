import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import ThemeToggle from '../components/ui/ThemeToggle'
import GlobalSearchModal from '../components/search/GlobalSearchModal'
import {
  MessageSquare,
  FileText,
  Search,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Bookmark
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
   useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault() // stops the browser's own Ctrl+K behavior
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
    isActive
      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
  }`

  return (
    <div
      style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}
      className="flex h-screen bg-slate-100 dark:bg-slate-950 text-gray-900 dark:text-white"
    >
      

      {/* SIDEBAR */}
      <aside
        style={{
          width: sidebarOpen ? '220px' : '70px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.25s ease',
        }}
       className="w-60 bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60"
      >
        {/* Logo */}
        <div
          style={{ flexShrink: 0 }}
          className="px-4 py-4 flex items-center justify-between"
        >
          {sidebarOpen ? (
            <>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
                CodeDone AI
              </span>
              <ThemeToggle />
            </>
          ) : (
            <div className="w-full flex justify-center">
              <ThemeToggle />
            </div>
          )}
        </div>

        {/* Nav */}
        
        <nav style={{ flexShrink: 0 }} className="p-3 space-y-1">

          <NavLink to="/dashboard/chat" className={navLinkClass} title='AI Chat'>
            <span className="text-lg"><MessageSquare size={20} /></span>
            {sidebarOpen && <span className="ml-3">AI Chat</span>}
          </NavLink>

          <NavLink to="/dashboard/files" className={navLinkClass} title='Files'>
            <span className="text-lg"><FileText size={20} /></span>
            {sidebarOpen && <span className="ml-3">Files</span>}
          </NavLink>

          <NavLink to="/dashboard/search" className={navLinkClass} title='Doc Search'>
            <span className="text-lg"><Search size={20} /></span>
            {sidebarOpen && <span className="ml-3">Doc Search</span>}
          </NavLink>

          <NavLink to="/dashboard/repositories" className={navLinkClass} title='Repositories'>
            <span className="text-lg"><FolderGit2 size={20} /></span>
            {sidebarOpen && <span className="ml-3">Repositories</span>}
          </NavLink>

          <NavLink to="/dashboard/overview" className={navLinkClass} title='Overview'>
            <span className="text-lg"><LayoutDashboard size={20} /></span>
            {sidebarOpen && <span className="ml-3">Overview</span>}
          </NavLink>
          <NavLink to="/dashboard/SavedResponses" className={navLinkClass} title='SavedResponse'>
            <span className="text-lg"><Bookmark size={20} /></span>
            {sidebarOpen && <span className="ml-3">SavedResponse</span>}
          </NavLink>
          {/* <NavLink to="/dashboard/Settings" className={navLinkClass} title='Settings'>
            <span className="text-lg"><LayoutDashboard size={20} /></span>
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </NavLink> */}

        </nav>
        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />  
        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User section */}
       <div style={{ flexShrink: 0 }} className="p-3">
          {sidebarOpen && (
          <div
            className="
              text-xs
              text -slate-500
              dark:text-slate-400
              px-3
              mb-2
              truncate
            "
          >
            {user?.email}
          </div>
        )}
          {/* <button
            onClick={handleLogout}
            className="p-3 space-y-1" title='LogOut'>
              <span className="text-lg"><LogOut size={20} /></span>
            {sidebarOpen && <span className="ml-3">Sign Out</span>}
          </button> */}
          <button
            onClick ={ handleLogout }
            className =" p-3 flex items-center space-x-3 "
            title =' Log Out '>
            < span className =" text -lg ">
            < LogOut size ={ 20 } />
            </ span >
            { sidebarOpen && < span > Sign Out </ span >}
            </ button >
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
        className="
          flex
          items-center
          gap-3

          px-5

          bg-white/80
          dark:bg-slate-950/80

          backdrop-blur-md

          border-b
          border-slate-200/60
          dark:border-slate-800/60
        "
        >
          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="
             text -slate-500
              dark:text-slate-400

              hover:text-slate-900
              dark:hover:text-white

              hover:bg-slate-100
              dark:hover:bg-slate-900

              transition-all
              duration-200

              p-2
              rounded-lg
            "            
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
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
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
