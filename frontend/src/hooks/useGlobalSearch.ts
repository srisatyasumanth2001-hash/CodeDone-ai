import { useState, useRef, useCallback } from 'react'
import api from '../api/axios'

interface GlobalSearchResults {
  conversations: { id: number; title: string }[]
  files: { id: number; original_filename: string }[]
  repositories: { id: number; owner: string; repo_name: string }[]
}

export function useGlobalSearch() {
  const [results, setResults] = useState<GlobalSearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const debounceRef = useRef<number | null>(null)

  const search = useCallback((query: string) => {
    // Clear any pending search — this is the "reset the timer" part of debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!query.trim()) {
      setResults(null)
      return
    }

    setIsSearching(true)

    // Schedule the actual request 300ms from now.
    // If search() is called again before this fires, the clearTimeout
    // above cancels it — only the LAST call in a burst actually runs.
    debounceRef.current = window.setTimeout(async () => {
      try {
        const response = await api.get('/global-search/', { params: { q: query } })
        setResults(response.data)
      } catch (err) {
        console.error('Global search failed:', err)
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [])

  return { results, isSearching, search }
}