import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { updateProfile } from '../api/auth'
import ThemeToggle from '../components/ui/ThemeToggle'

export default function Settings() {
  const { user, setUser } = useAuthStore()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    try {
      const updated = await updateProfile(fullName)
      setUser(updated)
      setSaved(true)
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-md mx-auto">
        <h1 className="text-lg font-semibold text-white mb-6">Settings</h1>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <div className="text-sm text-gray-300 bg-gray-800 border border-gray-700
                            rounded-lg px-3 py-2">
              {user?.email}
            </div>
            <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                         text-white text-sm outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={isSaving || fullName === user?.full_name}
              className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40
                         text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <span className="text-sm text-gray-400">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}