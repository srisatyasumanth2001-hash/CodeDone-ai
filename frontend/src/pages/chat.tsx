import { useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import MessageBubble from '../components/chat/MessageBubble'
import ChatInput from '../components/chat/ChatInput'
import ConversationList from '../components/chat/ConversationList'

export default function Chat() {
  const {
    conversations,
    messages,
    activeConversationId,
    activeConversationTitle,
    isStreaming,
    isLoading,
    messagesEndRef,
    loadConversations,
    openConversation,
    startNewConversation,
    deleteConversationById,
    sendMessage
  } = useChat()

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>

      {/* LEFT PANEL */}
      <div style={{
        width: '256px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderRight: '1px solid rgb(31 41 55)'
      }}>

        <div style={{ flexShrink: 0 }} className="p-4 border-b border-gray-800">
          <h2 className="text-sm font-medium text-gray-300">Conversations</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={openConversation}
            onNew={startNewConversation}
            onDeleted={deleteConversationById}
          />
        </div>
         
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        minWidth: 0
      }}>

       {/* HEADER — shows active conversation title */}
        <div style={{ flexShrink: 0, height: '48px' }}
            className="border-b border-gray-800 flex items-center px-6">
        <h1 className="text-sm font-medium text-gray-400 truncate">
            {activeConversationTitle || 'New Conversation'}
        </h1>
        </div>

        {/* MESSAGES — only this scrolls */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
             className="px-6 py-4">

          {isLoading && (
            <div className="flex justify-center mt-8">
              <span className="text-gray-500 text-sm">Loading...</span>
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                 className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-lg font-medium text-gray-300 mb-2">CodeDone AI</h2>
              <p className="text-gray-500 text-sm max-w-sm mb-6">
                Ask me anything about code. I can help you learn,
                debug, generate code, and understand software systems.
              </p>
              <div className="w-full max-w-sm space-y-2">
                {[
                  "Explain how JWT authentication works",
                  "What is the difference between async and sync?",
                  "Help me debug a React useEffect issue",
                  "How does a RAG pipeline work?"
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="w-full text-left text-sm text-gray-400 border border-gray-700 rounded-lg px-4 py-2.5 hover:border-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLoading && messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1
            const showCursor = isLastMessage && isStreaming && message.role === 'assistant'
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

        {/* INPUT — fixed at bottom */}
        <div style={{ flexShrink: 0 }}>
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
        </div>

      </div>
    </div>
  )
}