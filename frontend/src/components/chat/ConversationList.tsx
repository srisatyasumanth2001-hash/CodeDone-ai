import { useState } from 'react'
import type { Conversation } from '../../types'
import { deleteConversation } from '../../api/chat'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
interface Props {
  conversations: Conversation[]
  activeConversationId: number | null
  onNew: () => void
  onDeleted: (id: number) => void
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onNew,
  onDeleted
}: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedConversationId, setSelectedConversationId] =
  useState<number | null>(null)
  // const handleDelete = async (
  //   e: React.MouseEvent,
  //   conversationId: number
  // ) => {
  //   e.stopPropagation()
  //   setDeletingId(conversationId)

  //   try {
  //     await deleteConversation(conversationId)
  //     onDeleted(conversationId)
  //   } catch (error) {
  //     console.error('Failed to delete conversation:', error)
  //   } finally {
  //     setDeletingId(null)
  //   }
  // }
  const handleConfirmDelete = async () => {
  if (!selectedConversationId) return
  setDeletingId(selectedConversationId)
  try{
  await deleteConversation(selectedConversationId)

  onDeleted(selectedConversationId)
  navigate('dashboard/chat')}
  finally{
  setDeletingId(null)
  setShowDeleteModal(false)
  setSelectedConversationId(null)}
}
  return (
    <div className="flex flex-col h-full">

      {/* New Conversation */}
      <div className="p-3 border-b border-slate-200/60 dark:border-slate-800/60" onClick={() =>  {navigate(`/dashboard/chat`)
}}>
        <button
          onClick={onNew}
          className="
            w-full
            flex
            items-center
            gap-2

            px-3
            py-2.5

            rounded-xl

            text-sm

            bg-white
            dark:bg-slate-900

            border
            border-slate-200
            dark:border-slate-700

            text-slate-700
            dark:text-slate-300

            hover:bg-slate-50
            dark:hover:bg-slate-800

            hover:border-slate-300
            dark:hover:border-slate-600

            transition-all
            duration-200
          "
        >
          <span className="text-lg leading-none">+</span>
          <span>New Conversation</span>
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2">

        {conversations.length === 0 ? (
          <p className="text-slate-500 text-xs text-center mt-4 px-3">
            No conversations yet.
          </p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() =>  {navigate(`/dashboard/chat/${conv.id}`)
}}
              className={`
                group

                flex
                items-center
                justify-between

                gap-2

                px-3
                py-2.5

                rounded-xl

                text-sm

                mb-1

                cursor-pointer

                transition-all
                duration-200

                ${
                  activeConversationId === conv.id
                    ? `
                      bg-slate-200
                      dark:bg-slate-800

                      text-slate-900
                      dark:text-white

                      shadow-sm
                    `
                    : `
                      text-slate-700
                      dark:text-slate-300

                      hover:bg-slate-100
                      dark:hover:bg-slate-900

                      hover:text-slate-900
                      dark:hover:text-white
                    `
                }
              `}
            >
              {/* Title */}
              <span className="truncate flex-1">
                {conv.title}
              </span>

              {/* Delete Button */}
              {hoveredId === conv.id && (
                <button
                  onClick={(e) => {
                  e.stopPropagation()
                  setSelectedConversationId(conv.id)
                  setShowDeleteModal(true)
                }}
                  disabled={deletingId === conv.id}
                  className="
                    flex-shrink-0

                    text-slate-400
                    hover:text-red-500

                    dark:text-slate-500
                    dark:hover:text-red-400

                    transition-colors

                    disabled:opacity-50

                    p-1

                    rounded-md
                  "
                  title="Delete conversation"
                >
                  {deletingId === conv.id ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              )}
            </div>
          ))
        )}
        <ConfirmDialog
          open={showDeleteModal}
          title="Delete Conversation"
          message="This conversation and all its messages will be permanently deleted."
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false)
            setSelectedConversationId(null)
          }}
        />
      </div>
    </div>
  )
}