interface Props {
  answer: string
  isStreaming: boolean
  query: string
}

function CodeBlock({ code, language }: { code: string, language: string }) {
  return (
    <div className="my-3 rounded-lg overflow-hidden">
      {language && (
        <div className="bg-gray-900 text-gray-400 text-xs px-3 py-1.5 border-b border-gray-700">
          {language}
        </div>
      )}
      <pre className="bg-gray-900 p-4 overflow-x-auto">
        <code className="text-green-400 text-xs font-mono">{code}</code>
      </pre>
    </div>
  )
}

function AnswerContent({ text }: { text: string }) {
  if (!text) return null

  // Split by code blocks and render each part
  const parts = text.split(/(```[\s\S]*?```)/g)

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n')
          const language = lines[0].replace('```', '').trim()
          const code = lines.slice(1, -1).join('\n')
          return <CodeBlock key={i} code={code} language={language} />
        }
        return (
          <span key={i}>
            {part.split('\n').map((line, j) => (
              <span key={j}>
                {line}
                {j < part.split('\n').length - 1 && <br />}
              </span>
            ))}
          </span>
        )
      })}
    </>
  )
}

export default function AnswerPanel({ answer, isStreaming, query }: Props) {
  return (
    <div className="flex flex-col h-full">

      {/* Query echo */}
      <div className="mb-4 pb-4 border-b border-gray-800">
        <div className="text-xs text-gray-500 mb-1">Your question</div>
        <div className="text-sm text-gray-200 font-medium">{query}</div>
      </div>

      {/* Answer */}
      <div className="flex-1 overflow-y-auto">
        {!answer && isStreaming && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Searching documents and generating answer...
          </div>
        )}

        {answer && (
          <div className="text-sm text-gray-200 leading-relaxed">
            <AnswerContent text={answer} />
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-blue-400 ml-1
                             animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}