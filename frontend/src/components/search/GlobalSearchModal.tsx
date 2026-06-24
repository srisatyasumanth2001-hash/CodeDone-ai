import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalSearch } from '../../hooks/useGlobalSearch'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function GlobalSearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const { results, isSearching, search } = useGlobalSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Auto-focus the input the moment the modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const handleChange = (value: string) => {
    setQuery(value)
    search(value)
  }

  const goToConversation = (id: number) => {
    navigate(`/dashboard/chat/${id}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center pt-24 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search conversations, files, repositories..."
          className="w-full bg-transparent text-white text-sm px-4 py-3 outline-none
                     border-b border-gray-700 placeholder-gray-500"
        />

        <div className="max-h-80 overflow-y-auto p-2">
          {isSearching && (
            <div className="text-gray-500 text-xs px-3 py-2">Searching...</div>
          )}

          {!isSearching && results && (
            <>
              {results.conversations.length === 0 &&
               results.files.length === 0 &&
               results.repositories.length === 0 && (
                <div className="text-gray-500 text-xs px-3 py-4 text-center">
                  No results found
                </div>
              )}

              {results.conversations.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 px-3 py-1 uppercase tracking-wide">
                    Conversations
                  </div>
                  {results.conversations.map(c => (
                    <button
                      key={c.id}
                      onClick={() => goToConversation(c.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200
                                 hover:bg-gray-800 transition-colors"
                    >
                      💬 {c.title}
                    </button>
                  ))}
                </div>
              )}

              {results.files.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-500 px-3 py-1 uppercase tracking-wide">
                    Files
                  </div>
                  {results.files.map(f => (
                    <div key={f.id} className="px-3 py-2 text-sm text-gray-200">
                      📄 {f.original_filename}
                    </div>
                  ))}
                </div>
              )}

              {results.repositories.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 px-3 py-1 uppercase tracking-wide">
                    Repositories
                  </div>
                  {results.repositories.map(r => (
                    <div key={r.id} className="px-3 py-2 text-sm text-gray-200">
                      🗂️ {r.owner}/{r.repo_name}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-gray-700 px-4 py-2 text-xs text-gray-500">
          esc to close
        </div>
      </div>
    </div>
  )
}