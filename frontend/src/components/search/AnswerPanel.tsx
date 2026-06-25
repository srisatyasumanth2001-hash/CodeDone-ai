interface Props {
  answer: string
  isStreaming: boolean
  query: string
}
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
function CodeBlock({ code, language }: { code: string, language: string }) {
  return (
    <div className="my-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
  {language && (
    <div
      className="
        bg-slate-100
        dark:bg-slate-900
        text-slate-600
        dark:text-slate-400
        text-xs
        px-3
        py-1.5
        border-b
        border-slate-200
        dark:border-slate-700
      "
    >
      {language}
    </div>
  )}

  <pre
    className="
      bg-slate-50
      dark:bg-slate-900
      p-4
      overflow-x-auto
    "
  >
    <code
      className="
        text-emerald-600
        dark:text-green-400
        text-xs
        font-mono
      "
    >
      {code}
    </code>
  </pre>
</div>
  )
}

function AnswerContent({ text }: { text: string }) {
  if (!text) return null

  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '')

            if (match) {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(/\n$/, '')}
                />
              )
            }

            return (
              <code
                className="
                  px-1.5
                  py-0.5
                  rounded-md

                  bg-slate-200
                  dark:bg-slate-800

                  text-pink-600
                  dark:text-green-400

                  text-xs
                  font-mono
                "
              >
                {children}
              </code>
            )
          },

          p: ({ children }) => (
            <p className="mb-3 leading-7">
              {children}
            </p>
          ),

          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3 text-slate-900 dark:text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-900 dark:text-white">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="text-base font-semibold mt-3 mb-2 text-slate-900 dark:text-white">
              {children}
            </h4>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 dark:text-white">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),

          blockquote: ({ children }) => (
            <blockquote
              className="
                my-4
                border-l-4
                border-blue-500

                pl-4

                italic

                text-slate-600
                dark:text-slate-400
              "
            >
              {children}
            </blockquote>
          ),

          hr: () => (
            <hr className="my-6 border-slate-300 dark:border-slate-700" />
          ),

          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-slate-300 dark:border-slate-700 rounded-lg">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800">
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {children}
            </tr>
          ),

          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-4 py-2">
              {children}
            </td>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-blue-600
                dark:text-blue-400
                hover:underline
              "
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

export default function AnswerPanel({ answer, isStreaming, query }: Props) {
  return (
    <div className="flex flex-col h-full">

  {/* Query echo */}
  <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
      Your question
    </div>

    <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
      {query}
    </div>
  </div>

  {/* Answer */}
  <div className="flex-1 overflow-y-auto">

    {!answer && isStreaming && (
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
        <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
        Searching documents and generating answer...
      </div>
    )}

    {answer && (
      <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
        <AnswerContent text={answer} />

        {isStreaming && (
          <span
            className="
              inline-block
              w-2
              h-4
              bg-blue-500
              dark:bg-blue-400
              ml-1
              animate-pulse
              align-middle
            "
          />
        )}
      </div>
    )}

  </div>

    </div>
  )
}