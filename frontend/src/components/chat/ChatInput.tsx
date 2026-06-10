import { useState} from 'react'
import type { KeyboardEvent } from 'react'

interface Props {
  onSend: (message: string) => void
  isStreaming: boolean
}

export default function ChatInput({ onSend, isStreaming }: Props) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
  }

  // send on Enter, new line on Shift+Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-800 p-4">
      <div className="flex gap-3 items-end bg-gray-800 border border-gray-700 rounded-xl p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a coding question..."
          rows={1}
          className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-gray-500 max-h-32"
          style={{ minHeight: '24px' }}
          disabled={isStreaming}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          {isStreaming ? 'Generating...' : 'Send'}
        </button>
      </div>
      <p className="text-gray-600 text-xs text-center mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}