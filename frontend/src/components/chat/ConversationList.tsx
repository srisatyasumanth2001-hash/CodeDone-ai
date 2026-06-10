import { useState } from 'react'
import type { Conversation } from '../../types'
import { deleteConversation } from '../../api/chat'

interface Props {
  conversations: Conversation[]
  activeConversationId: number | null
  onSelect: (id: number) => void
  onNew: () => void
  onDeleted: (id: number) => void
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  onNew,
  onDeleted
}: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (e: React.MouseEvent, conversationId: number) => {
    // stop the click from also selecting the conversation
    e.stopPropagation()

    if (!confirm('Delete this conversation?')) return

    setDeletingId(conversationId)
    try {
      await deleteConversation(conversationId)
      onDeleted(conversationId)
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full">

      {/* new chat button */}
      <div className="p-3 border-b border-gray-800">
        <button
          onClick={onNew}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          New Conversation
        </button>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-gray-600 text-xs text-center mt-4 px-3">
            No conversations yet.
          </p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(conv.id)}
              className={`
                group flex items-center justify-between gap-1
                px-3 py-2.5 rounded-lg text-sm mb-1 cursor-pointer transition-colors
                ${activeConversationId === conv.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }
              `}
            >
              {/* conversation title */}
              <span className="truncate flex-1 text-left">
                {conv.title}
              </span>

              {/* delete button — only shows on hover */}
              {hoveredId === conv.id && (
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  disabled={deletingId === conv.id}
                  className="flex-shrink-0 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50 p-0.5 rounded"
                  title="Delete conversation"
                >
                  {deletingId === conv.id ? '...' : '🗑'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}