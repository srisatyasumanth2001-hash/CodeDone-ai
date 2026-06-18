import type { ChunkResult } from '../types'

const BASE_URL = 'http://localhost:8000/api/v1'

export interface SearchStreamCallbacks {
  onSources: (sources: ChunkResult[]) => void
  onToken: (token: string) => void
  onDone: () => void
  onError: (error: string) => void
}

export async function streamSearch(
  query: string,
  documentId: number | null,
  callbacks: SearchStreamCallbacks
): Promise<void> {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${BASE_URL}/search/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query,
      document_id: documentId,
      top_k: 5
    })
  })

  if (!response.ok) {
    callbacks.onError('Search request failed')
    return
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''

    for (const event of events) {
      if (!event.trim()) continue
      const dataStr = event.replace(/^data: /, '').trim()
      if (dataStr === '[DONE]') { callbacks.onDone(); break }

      try {
        const parsed = JSON.parse(dataStr)
        if (parsed.type === 'sources') callbacks.onSources(parsed.data)
        else if (parsed.type === 'token') callbacks.onToken(parsed.data)
      } catch { }
    }
  }
}