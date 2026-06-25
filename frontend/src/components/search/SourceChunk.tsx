import type { ChunkResult } from '../../types'

interface Props {
  chunk: ChunkResult
  index: number
}

function SimilarityBar({ score }: { score: number }) {
  // Thresholds match this embedding model's real score distribution —
  // genuinely relevant matches typically land around 0.30–0.50, not 0.70+.
  const percentage = Math.round(score * 100)
  const color = score >= 0.40
    ? 'bg-green-500'
    : score >= 0.30
    ? 'bg-blue-500'
    : 'bg-yellow-500'

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-slate-600 dark:text-slate-400 flex-shrink-0">{percentage}%</span>
    </div>
  )
}

export default function SourceChunk({ chunk, index }: Props) {
  const sourceIcon = chunk.source_type === 'repository' ? '🗂️' : '📄'

  return (
    <div className="border border-gray-700 rounded-xl p-4 bg-white-800/40
                    hover:border-gray-600 transition-colors">

      {/* Header */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-xs font-semibold text-black-400 dark:text-white-400 flex-shrink-0">
          Source {index}
        </span>
        <span
          className="text-xs text-slate-600 dark:text-slate-400 truncate"
          title={chunk.filename}
        >
          {sourceIcon} {chunk.filename}
        </span>
      </div>

      {/* Relevance bar */}
      <SimilarityBar score={chunk.similarity} />

      {/* Chunk text */}
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-3 line-clamp-6">
        {chunk.chunk_text}
      </p>
    </div>
  )
}