import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chat from './pages/chat'
import Files  from './pages/Files'
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
          <Route
            path="search"
            element={
              <div className="p-8 text-white">Search coming in Phase 4</div>
            }
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App