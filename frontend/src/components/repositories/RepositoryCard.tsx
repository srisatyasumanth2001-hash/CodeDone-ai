import type { Repository } from '../../types'

interface Props {
  repository: Repository
}

const STATUS_CONFIG = {
  pending:   { label: 'Queued',     color: 'text-gray-400',   dot: 'bg-gray-500' },
  ingesting: { label: 'Indexing...', color: 'text-blue-400',  dot: 'bg-blue-400 animate-pulse' },
  completed: { label: 'Ready',      color: 'text-green-400',  dot: 'bg-green-500' },
  failed:    { label: 'Failed',     color: 'text-red-400',    dot: 'bg-red-500' },
}

export default function RepositoryCard({ repository }: Props) {
  const config = STATUS_CONFIG[repository.status]

  return (
    <div className="border border-gray-700 rounded-xl p-4 bg-gray-800/40">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-white">
            {repository.owner}/{repository.repo_name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {repository.repo_url}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className={`text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      {repository.status === 'completed' && (
        <div className="text-xs text-gray-400 mt-3">
          📁 {repository.files_ingested} files indexed and searchable
        </div>
      )}

      {repository.status === 'ingesting' && (
        <div className="text-xs text-gray-400 mt-3">
          Reading repository files and generating embeddings...
        </div>
      )}

      {repository.status === 'failed' && (
        <div className="text-xs text-red-400 mt-3">
          Could not process this repository. Verify the URL is a public GitHub repo.
        </div>
      )}
    </div>
  )
}