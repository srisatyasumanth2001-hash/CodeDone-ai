import { useEffect, useState } from 'react'
import { useChat } from '../hooks/useChat'
import { useParams } from 'react-router-dom'
import MessageBubble from '../components/chat/MessageBubble'
import ChatInput from '../components/chat/ChatInput'
import ConversationList from '../components/chat/ConversationList'
import { useAuthStore } from '../store/authStore'

export default function Chat() {
  const {
    conversations,
    messages,
    activeConversationId,
    isStreaming,
    isLoading,
    messagesEndRef,
    loadConversations,
    openConversation,
    startNewConversation,
    deleteConversationById,
    sendMessage
  } = useChat()
  const { user} = useAuthStore()
  const {conversationId} = useParams()
  const [conversationOpen, setConversationOpen] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [loadConversations])
  useEffect(() => {
  if (conversationId) {
    openConversation(Number(conversationId))
  }
}, [conversationId])

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >

      {/* LEFT PANEL */}
      <div
        style={{
          width: conversationOpen ? '200px' : '0px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          transition: 'width 0.25s ease'
        }}
        className="
          bg-white
          dark:bg-slate-950

          border-r
          border-slate-200/60
          dark:border-slate-800/60
        "
      >
        {/* Header */}
        <div
          style={{ flexShrink: 0 }}
          className="
            px-4
            py-3

            flex
            items-center
            justify-between

            border-b
            border-slate-200/60
            dark:border-slate-800/60
          "
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Conversations
          </h2>

          <button
    onClick={() => setConversationOpen(prev => !prev)}
    className="
      text-slate-500
      dark:text-slate-400

      hover:text-slate-900
      dark:hover:text-white

      hover:bg-slate-100
      dark:hover:bg-slate-900

      transition-all
      duration-200

      p-2
      rounded-lg
    "
    title={
      conversationOpen
        ? 'Close conversations'
        : 'Open conversations'
    }
  >
    <div className="flex flex-col gap-1.5 w-5">
      <span
        style={{
          display: 'block',
          height: '2px',
          background: 'currentColor',
          borderRadius: '2px',
          transition: 'all 0.2s',
          transform: conversationOpen
            ? 'rotate(45deg) translate(3px, 3px)'
            : 'none',
        }}
      />
      <span
        style={{
          display: 'block',
          height: '2px',
          background: 'currentColor',
          borderRadius: '2px',
          transition: 'all 0.2s',
          opacity: conversationOpen ? 0 : 1,
        }}
      />
      <span
        style={{
          display: 'block',
          height: '2px',
          background: 'currentColor',
          borderRadius: '2px',
          transition: 'all 0.2s',
          transform: conversationOpen
            ? 'rotate(-45deg) translate(3px, -3px)'
            : 'none',
        }}
      />
    </div>
  </button>
    {!conversationOpen && (
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
              Conversations
            </span>)}
       
  



        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNew={startNewConversation}
            onDeleted={deleteConversationById}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
<div
  style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    minWidth: 0
  }}
  className=' bg-white
          dark:bg-slate-950

          border-r
          border-slate-200/60
          dark:border-slate-800/60'
>

  {!conversationOpen && (
    <div className="px-3 py-2">
      <button
        onClick={() => setConversationOpen(true)}
        className="
          text-slate-500
          dark:text-slate-400

          hover:text-slate-900
          dark:hover:text-white

          hover:bg-slate-100
          dark:hover:bg-slate-900

          transition-all
          duration-200

          p-2
          rounded-lg
        "
      >
        {/* Hamburger */}
        <div className="flex flex-col gap-1.5 w-5">
          <span className="block h-[2px] bg-current rounded" />
          <span className="block h-[2px] bg-current rounded" />
          <span className="block h-[2px] bg-current rounded" />
        </div>
      </button>
    </div>
  )}

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
          className="px-6 py-4"
        >

          {isLoading && (
            <div className="flex justify-center mt-8">
              <span className="text-slate-500 text-sm">
                Loading...
              </span>
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
              className="text-center "
            >
              <div className="text-5xl mb-5 animate-pulse">⚡</div>

              <h2 className="text-2xl font-semibold text-blue-900 dark:text-white mb-2">
                CodeDone AI 
              </h2>
              <h2 className="text-2xl font-semibold text-blue-900 dark:text-white mb-2">
                Welcome {user?.full_name}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mb-6">
                Ask me anything about code. I can help you learn,
                debug, generate code, and understand software systems.
              </p>

              <div className="w-full max-w-lg space-y-2">
                {[
                  'Explain how JWT authentication works',
                  'What is the difference between async and sync?',
                  'Help me debug a React useEffect issue',
                  'How does a RAG pipeline work?'
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="
                      w-full
                      text-left
                      text-sm

                      bg-white
                      dark:bg-slate-900

                      text-slate-600
                      dark:text-slate-400

                      border
                      border-slate-300
                      dark:border-slate-700

                      rounded-xl

                      px-4
                      py-2.5

                      hover:bg-slate-50
                      dark:hover:bg-slate-800

                      hover:border-slate-400
                      dark:hover:border-slate-600

                      hover:text-slate-900
                      dark:hover:text-slate-200

                      transition-colors
                    "
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLoading &&
            messages.map((message, index) => {
              const isLastMessage =
                index === messages.length - 1

              const showCursor =
                isLastMessage &&
                isStreaming &&
                message.role === 'assistant'

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={showCursor}
                />
              )
            })}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={{ flexShrink: 0 }}>
          <ChatInput
            onSend={sendMessage}
            isStreaming={isStreaming}
          />
        </div>

      </div>
    </div>
  )
}