import { useState } from 'react'
import type { KeyboardEvent } from 'react'

interface Props {
  onConnect: (url: string) => void
  isConnecting: boolean
}

export default function ConnectRepoForm({ onConnect, isConnecting }: Props) {
  const [url, setUrl] = useState('')

  const handleConnect = () => {
    if (!url.trim() || isConnecting) return
    onConnect(url.trim())
    setUrl('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleConnect()
  }

  return (
    <div className="flex gap-3 items-center bg-gray-800 border border-gray-700
                    rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
      <span className="text-slate-600 dark:text-slate-400">🔗</span>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://github.com/owner/repository"
        disabled={isConnecting}
        className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
      />
      <button
        onClick={handleConnect}
        disabled={!url.trim() || isConnecting}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40
                   disabled:cursor-not-allowed text-white text-sm font-medium
                   px-4 py-1.5 rounded-lg transition-colors flex-shrink-0"
      >
        {isConnecting ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  )
}