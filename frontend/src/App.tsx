import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chat from './pages/chat'
import Files  from './pages/Files'
import FileChat from './pages/FileChat'
import Search from './pages/Search'
import Repositories from './pages/Repositories'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
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
          <Route path="files" element={<Files />} />
          <Route path="files/:fileId/chat" element={<FileChat />} />
          <Route path="search" element={<Search />} />
          <Route path="repositories" element={<Repositories />} />
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