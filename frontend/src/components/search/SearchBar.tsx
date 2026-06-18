import { useState } from 'react'
import type { KeyboardEvent } from 'react'

interface Props {
  onSearch: (query: string) => void
  isSearching: boolean
}

const SUGGESTED_QUERIES = [
  'How does authentication work?',
  'Explain the main functions in this file',
  'What are the key concepts covered?',
  'How would I implement this feature?',
]

export default function SearchBar({ onSearch, isSearching }: Props) {
  const [input, setInput] = useState('')

  const handleSearch = () => {
    if (!input.trim() || isSearching) return
    onSearch(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div>
      {/* Search input */}
      <div className="flex gap-3 items-center bg-gray-800 border border-gray-700
                      rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
        <span className="text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents..."
          disabled={isSearching}
          className="flex-1 bg-transparent text-white text-sm outline-none
                     placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          disabled={!input.trim() || isSearching}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40
                     disabled:cursor-not-allowed text-white text-sm font-medium
                     px-4 py-1.5 rounded-lg transition-colors flex-shrink-0"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Suggested queries - shown only when nothing is happening */}
      {!isSearching && (
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTED_QUERIES.map(sq => (
            <button
              key={sq}
              onClick={() => onSearch(sq)}
              className="text-xs text-gray-400 border border-gray-700 rounded-lg
                         px-3 py-1.5 hover:border-gray-500 hover:text-gray-200
                         transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}