import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import type { ChangeEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'

interface Props {
  onSend: (message: string) => void
  isStreaming: boolean
}

const MAX_HEIGHT = 500 // px — roughly 8 lines before it scrolls internally instead of growing further

export default function ChatInput({ onSend, isStreaming }: Props) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'   // reset so scrollHeight reflects the CURRENT content, not the old fixed height
    ta.style.height = Math.min(ta.scrollHeight, MAX_HEIGHT) + 'px'
  }
  const focusInput = () => {
  textareaRef.current?.focus()
  }
  useEffect(() => {
  focusInput()
  }, [])
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    adjustHeight()
  }
  useEffect(() => {
  if (!isStreaming) {
    textareaRef.current?.focus()
  }
}, [isStreaming])

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
    requestAnimationFrame(() => {
      if (textareaRef.current){ 
        textareaRef.current.style.height = 'auto'  // collapse back to one line after sending
        textareaRef.current.focus() }
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-r border-gray-700 p-4">
      <div className="flex gap-3 items-end border
                      border-slate-300
                      dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl p-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a coding question..."
          rows={1}
          className="flex-1 bg-transparent text-black dark:text-white text-sm resize-none outline-none placeholder-gray-500 overflow-y-auto"
          disabled={isStreaming}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          {isStreaming ? <Loader2 size={18}></Loader2> : <ArrowUp size={18}></ArrowUp>}
        </button>
      </div>
      <p className="text-gray-600 text-xs text-center mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}