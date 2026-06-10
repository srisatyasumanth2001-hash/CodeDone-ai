import type { Message } from '../../types'

interface Props {
  message: Message
  isStreaming?: boolean
}

export default function MessageBubble({ message, isStreaming = false }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* AI avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">
          AI
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
        }`}
      >
        {/* render content with basic formatting */}
        <MessageContent content={message.content} />

        {/* blinking cursor while streaming */}
        {isStreaming && !isUser && (
          <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle" />
        )}
      </div>

      {/* user avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold ml-3 flex-shrink-0 mt-1">
          You
        </div>
      )}
    </div>
  )
}


// renders message content with code block support
function MessageContent({ content }: { content: string }) {
  if (!content) {
    return <span className="text-gray-500 italic">Thinking...</span>
  }

  // split by code blocks (```...```)
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // extract language and code
          const lines = part.split('\n')
          const language = lines[0].replace('```', '').trim()
          const code = lines.slice(1, -1).join('\n')

          return (
            <div key={index} className="my-2 rounded-lg overflow-hidden">
              {language && (
                <div className="bg-gray-900 text-gray-400 text-xs px-3 py-1 border-b border-gray-700">
                  {language}
                </div>
              )}
              <pre className="bg-gray-900 p-3 overflow-x-auto">
                <code className="text-green-400 text-xs font-mono">{code}</code>
              </pre>
            </div>
          )
        }

        // regular text — preserve line breaks
        return (
          <span key={index}>
            {part.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < part.split('\n').length - 1 && <br />}
              </span>
            ))}
          </span>
        )
      })}
    </>
  )
}