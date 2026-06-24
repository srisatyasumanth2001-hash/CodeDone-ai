import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { getMyProfile } from './api/auth'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chat from './pages/chat'
import Files  from './pages/Files'
import FileChat from './pages/FileChat'
import Search from './pages/Search'
import Repositories from './pages/Repositories'
import Overview from './pages/OverView'
import SavedResponses from './pages/SavedResponse'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isLoading, setLoading, setUser, logout } = useAuthStore()
   useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return  // nothing to rehydrate — isLoading is already false

    getMyProfile()
      .then(setUser)
      .catch(() => {
        // token was invalid and the axios refresh interceptor also
        // couldn't save it — log out cleanly rather than leaving the
        // app in a half-authenticated state
        logout()
      })
      .finally(() => setLoading(false))
  }, [])
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected dashboard — everything inside here shares the sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* These render inside Dashboard's <Outlet /> */}
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:conversationId" element={<Chat />} />
          <Route path="files" element={<Files />} />
          <Route path="files/:fileId/chat" element={<FileChat />} />
          <Route path="search" element={<Search />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="Overview" element={<Overview />} />
          <Route path="SavedResponses" element={<SavedResponses />} />
          <Route path="Settings" element={<Settings />} />

        </Route>

        {/* Catch all */}
        <Route
          path="/"
          element={
            localStorage.getItem("access_token")
              ? <Navigate to="/dashboard/chat" replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App