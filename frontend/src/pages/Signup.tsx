import { useState } from "react";
import {useNavigate, Link} from "react-router-dom"
import { signupUser } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { getMyProfile } from "../api/auth";

export default function Login(){
    const navigate = useNavigate()
    const setUser = useAuthStore((state)=> state.setUser)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [full_name, setFull_name] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async()=> {
        setLoading(true)
        setError('')
        try{
            const tokens = await signupUser({email, password,full_name})
            localStorage.getItem('access_token')
            localStorage.getItem('refresh_token')
            const user = await getMyProfile()
            setUser(user)
            navigate('/dashboard')
        }
        catch(err:any){
            setError(err.response?.data?.detail || 'Login failed')
        }
        finally{
            setLoading(false)
        }
    }
    return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-6">Sign in to CodeDone AI</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Password</label>
            <input
              type="full_name"
              value={full_name}
              onChange={(e) => setFull_name(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center mt-6">
          Do you have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </div>
    </div>
  )
}
