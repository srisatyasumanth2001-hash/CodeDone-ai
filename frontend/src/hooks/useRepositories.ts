import { useState, useCallback, useRef, useEffect } from 'react'
import type { Repository } from '../types'
import { connectRepository, getRepository, listRepositories } from '../api/repositories'

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')

  // Tracks active polling intervals so we can clean them up properly
  const pollingRefs = useRef<Map<number, number>>(new Map())

  const loadRepositories = useCallback(async () => {
    const repos = await listRepositories()
    setRepositories(repos)
  }, [])

  const pollRepositoryStatus = useCallback((repoId: number) => {
    // Avoid starting a duplicate poll for the same repo
    if (pollingRefs.current.has(repoId)) return

    const intervalId = window.setInterval(async () => {
      const updated = await getRepository(repoId)

      setRepositories(prev =>
        prev.map(r => (r.id === repoId ? updated : r))
      )

      // Stop polling once ingestion reaches a final state
      if (updated.status === 'completed' || updated.status === 'failed') {
        clearInterval(intervalId)
        pollingRefs.current.delete(repoId)
      }
    }, 3000) // check every 3 seconds

    pollingRefs.current.set(repoId, intervalId)
  }, [])

  const connect = useCallback(async (repoUrl: string) => {
    setIsConnecting(true)
    setError('')
    try {
      const repo = await connectRepository(repoUrl)
      setRepositories(prev => [repo, ...prev])
      pollRepositoryStatus(repo.id)  // start watching this one
    } catch (err) {
      setError('Could not connect repository. Check the URL and try again.')
    } finally {
      setIsConnecting(false)
    }
  }, [pollRepositoryStatus])

  // On mount: load existing repos, and resume polling for any
  // that are still mid-ingestion (e.g. user refreshed the page)
  useEffect(() => {
    loadRepositories().then(() => {
      repositories.forEach(repo => {
        if (repo.status === 'pending' || repo.status === 'ingesting') {
          pollRepositoryStatus(repo.id)
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup all intervals when the component unmounts
  useEffect(() => {
    return () => {
      pollingRefs.current.forEach(intervalId => clearInterval(intervalId))
      pollingRefs.current.clear()
    }
  }, [])

  return { repositories, isConnecting, error, connect, loadRepositories }
}