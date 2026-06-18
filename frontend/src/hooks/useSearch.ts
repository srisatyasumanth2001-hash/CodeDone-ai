import { useState, useCallback } from 'react'
import type { ChunkResult } from '../types'
import { streamSearch } from '../api/search'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState<ChunkResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')

  const search = useCallback(async (searchQuery: string, documentId: number | null = null) => {
    if (!searchQuery.trim() || isSearching) return

    // Reset previous results
    setAnswer('')
    setSources([])
    setError('')
    setIsSearching(true)
    setHasSearched(true)
    setQuery(searchQuery)

    try {
      await streamSearch(searchQuery, documentId, {
        onSources: (retrievedSources) => {
          // Sources arrive first — show them immediately
          // before the answer even starts streaming
          setSources(retrievedSources)
        },
        onToken: (token) => {
          // Append each token to the answer as it arrives
          setAnswer(prev => prev + token)
        },
        onDone: () => {
          setIsSearching(false)
        },
        onError: (err) => {
          setError(err)
          setIsSearching(false)
        }
      })
    } catch (err) {
      setError('Search failed. Please try again.')
      setIsSearching(false)
    }
  }, [isSearching])

  const reset = useCallback(() => {
    setQuery('')
    setAnswer('')
    setSources([])
    setError('')
    setHasSearched(false)
  }, [])

  return {
    query,
    answer,
    sources,
    isSearching,
    hasSearched,
    error,
    search,
    reset
  }
}