import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function MessageContent({ content }: Props) {
  if (!content) {
    return <span className="text-gray-500 italic">Thinking...</span>
  }

  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isBlock = Boolean(match)
            if (!isBlock) {
              return (
                <code className="bg-gray-900 text-green-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <div className="my-2 rounded-lg overflow-hidden">
                <div className="bg-gray-900 text-gray-400 text-xs px-3 py-1 border-b border-gray-700">
                  {match![1]}
                </div>
                <pre className="bg-gray-900 p-3 overflow-x-auto">
                  <code className="text-green-400 text-xs font-mono">{children}</code>
                </pre>
              </div>
            )
          },
          p: ({ children }) => <p className="mb-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>,
          h1: ({ children }) => <h1 className="text-base font-semibold mt-3 mb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-semibold mt-3 mb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}