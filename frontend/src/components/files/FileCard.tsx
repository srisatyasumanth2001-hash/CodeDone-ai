import type { UploadedFile } from '../../types'

interface Props {
  file: UploadedFile
  onDelete: (id: number) => void
  onChat: (file: UploadedFile) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileType: string): string {
  const icons: Record<string, string> = {
    '.pdf': '📕', '.py': '🐍', '.js': '📜', '.ts': '📘',
    '.tsx': '⚛️', '.jsx': '⚛️', '.java': '☕', '.md': '📝',
    '.txt': '📄', '.json': '📋', '.cpp': '⚙️', '.go': '🐹'
  }
  return icons[fileType] || '📄'
}

export default function FileCard({ file, onDelete, onChat }: Props) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600 transition-colors">

      {/* file icon */}
      <div className="text-2xl flex-shrink-0">
        {getFileIcon(file.file_type)}
      </div>

      {/* file info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-200 truncate">
          {file.original_filename}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {file.file_type.toUpperCase().replace('.', '')} ·{' '}
          {formatFileSize(file.file_size)} ·{' '}
          {new Date(file.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onChat(file)}
          className="text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          Chat
        </button>
        <button
          onClick={() => onDelete(file.id)}
          className="text-xs bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}