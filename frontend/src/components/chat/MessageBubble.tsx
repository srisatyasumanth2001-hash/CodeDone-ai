import type { Message } from '../../types'
import { useState } from 'react'
import { saveResponse } from '../../api/savedResponse'
import MessageContent from './MessageContent'
import { CircleUser, SparkleIcon } from 'lucide-react'

interface Props {
  message: Message
  isStreaming?: boolean
}

// Top-level now — never redefined on every MessageBubble render
function BookmarkButton({ messageId, content }: { messageId: number, content: string }) {
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (saved) return
    try {
      await saveResponse(messageId, content)
      setSaved(true)
    } catch {
      // silently fail — bookmarking is a nice-to-have, not critical
    }
  }

  return (
    <button
      onClick={handleSave}
      className="block mt-2 text-xs text-gray-500 hover:text-blue-400 transition-colors"
      title={saved ? 'Saved' : 'Save this response'}
    >
      {saved ? '🔖 Saved' : '🔖 Save'}
    </button>
  )
}

export default function MessageBubble({ message, isStreaming = false }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1 animate-pulse">
          <SparkleIcon size={18}></SparkleIcon>
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-white-600 text-black-100 rounded-tr-sm border border-blue-700'
            : 'bg-white-600 text-black-100 rounded-tl-sm border border-green-700'
        }`}
      >
        <MessageContent content={message.content} />

        {isStreaming && !isUser && (
          <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle" />
        )}

        {!isUser && message.content && !isStreaming && (
          <BookmarkButton messageId={message.id} content={message.content} />
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold ml-3 flex-shrink-0 mt-1">
          <CircleUser size={18}></CircleUser>
        </div>
      )}
    </div>
  )
}

