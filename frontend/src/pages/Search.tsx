import { useSearch } from '../hooks/useSearch'
import SearchBar from '../components/search/SearchBar'
import SourceChunk from '../components/search/SourceChunk'
import AnswerPanel from '../components/search/AnswerPanel'

export default function Search() {
  const {
    query,
    answer,
    sources,
    isSearching,
    hasSearched,
    error,
    search,
    reset
  } = useSearch()

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">

  {/* Header */}
  <div
    style={{ flexShrink: 0 }}
    className="p-6 border-b border-slate-200 dark:border-slate-800"
  >
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Document Search
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            Ask questions about your uploaded documents
          </p>
        </div>

        {hasSearched && (
          <button
            onClick={reset}
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
              hover:text-slate-900
              dark:hover:text-white
              transition-colors
            "
          >
            New search
          </button>
        )}
      </div>

      <SearchBar
        onSearch={search}
        isSearching={isSearching}
      />
    </div>
  </div>

  {/* Results area */}
  <div style={{ flex: 1, overflow: 'hidden' }}>

    {/* Empty state */}
    {!hasSearched && (
      <div
        className="
          flex flex-col items-center justify-center
          h-full text-center px-6
        "
      >
        <div className="text-5xl mb-4">🔍</div>

        <h2
          className="
            text-lg font-medium
            text-slate-800
            dark:text-white
            mb-2
          "
        >
          Search your documents
        </h2>

        <p
          className="
            text-slate-600
            dark:text-slate-400
            text-sm max-w-md
          "
        >
          Upload documents in the Files section, then ask questions
          here. The AI will find relevant passages and generate
          a grounded answer.
        </p>
      </div>
    )}

    {/* Error state */}
    {error && (
      <div className="p-6 max-w-4xl mx-auto">
        <div
          className="
            bg-red-500/10
            border border-red-500/20
            text-red-500 dark:text-red-400
            text-sm rounded-xl p-4
          "
        >
          {error}
        </div>
      </div>
    )}

    {/* Results */}
    {hasSearched && !error && (
      <div
        style={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
        }}
      >

        {/* LEFT — Sources */}
        <div
          style={{
            width: '340px',
            flexShrink: 0,
            overflowY: 'auto',
          }}
          className="
            p-4
            border-r
            border-slate-200
            dark:border-slate-800
          "
        >
          <div
            className="
              text-xs font-medium
              text-slate-500
              dark:text-slate-400
              mb-3 uppercase tracking-wider
            "
          >
            Retrieved Sources

            {sources.length > 0 && (
              <span className="ml-2 text-green-500 dark:text-blue-400">
                ({sources.length})
              </span>
            )}
          </div>

          {/* Loading */}
          {isSearching && sources.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="
                    border
                    border-slate-200
                    dark:border-slate-700
                    rounded-xl
                    p-4
                    animate-pulse
                  "
                >
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />

                  <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded mb-3" />

                  <div className="space-y-1.5">
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sources */}
          {sources.length > 0 && (
            <div className="space-y-3">
              {sources.map((chunk, i) => (
                <SourceChunk
                  key={i}
                  chunk={chunk}
                  index={i + 1}
                />
              ))}
            </div>
          )}

          {/* No Sources */}
          {!isSearching && sources.length === 0 && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">📭</div>

              <p
                className="
                  text-slate-600
                  dark:text-slate-400
                  text-sm
                "
              >
                No relevant chunks found
              </p>

              <p
                className="
                  text-slate-500
                  dark:text-slate-500
                  text-xs mt-1
                "
              >
                Try uploading documents first
              </p>
            </div>
          )}
        </div>

        {/* RIGHT — Answer */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
          className="p-6"
        >
          {(answer || isSearching) && (
            <AnswerPanel
              answer={answer}
              isStreaming={isSearching}
              query={query}
            />
          )}
        </div>

      </div>
    )}
  </div>
</div>
  )
}