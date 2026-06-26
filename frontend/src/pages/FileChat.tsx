import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFiles } from '../api/file'
import type { UploadedFile, Message } from '../types'
import MessageBubble from '../components/chat/MessageBubble'
import ChatInput from '../components/chat/ChatInput'

export default function FileChat() {
  const { fileId } = useParams<{ fileId: string }>()
  const navigate = useNavigate()
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadFile = async () => {
      try {
        const files = await getFiles()
        const found = files.find(f => f.id === Number(fileId))
        if (!found) navigate('/dashboard/files')
        else setFile(found)
      } catch {
        navigate('/dashboard/files')
      }
    }
    loadFile()
  }, [fileId, navigate])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isStreaming || !fileId) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: userMessage
    }
    const aiPlaceholder: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: ''
    }
    setMessages(prev => [...prev, userMsg, aiPlaceholder])
    setTimeout(scrollToBottom, 50)
    setIsStreaming(true)

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/files/${fileId}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: userMessage,
            conversation_id: conversationId
          })
        }
      )

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim()) continue
          const dataStr = line.replace(/^data: /, '').trim()
          if (dataStr === '[DONE]') {
            setIsStreaming(false)
            break
          }

          try {
            const event = JSON.parse(dataStr)

            if (event.type === 'metadata') {
              setConversationId(event.conversation_id)

              // patch the user message's fake id with the real one
              if (event.user_message_id) {
                setMessages(prev => {
                  const updated = [...prev]
                  const userIndex = updated.length - 2  // AI placeholder is last, user msg right before it
                  if (userIndex >= 0 && updated[userIndex].role === 'user') {
                    updated[userIndex] = { ...updated[userIndex], id: event.user_message_id }
                  }
                  return updated
                })
              }
            }

            else if (event.type === 'token') {
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.role === 'assistant') {
                  return [
                    ...updated.slice(0, -1),
                    { ...last, content: last.content + event.data }
                  ]
                }
                return updated
              })
              scrollToBottom()
            }

            else if (event.type === 'assistant_message_id') {
              // patch the AI message's fake id with the real one
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.role === 'assistant') {
                  return [...updated.slice(0, -1), { ...last, id: event.data }]
                }
                return updated
              })
            }

          } catch { }
        }
      }
    } catch (error) {
      console.error('File chat error:', error)
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-full">

      <div className="h-14 border-b border-gray-800 flex items-center px-6 gap-3 flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard/files')}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back
        </button>
        <div className="w-px h-4 bg-gray-700" />
        <span className="text-sm text-gray-300 truncate">
          {file?.original_filename || 'Loading...'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">📄</div>
            <h2 className="text-base font-medium text-gray-300 mb-2">
              {file?.original_filename}
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Ask me anything about this file. I can explain functions,
              find bugs, suggest improvements, or help you understand the code.
            </p>
          </div>
        )}

        {messages.map((message, index) => {
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

      <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
    </div>
  )
}