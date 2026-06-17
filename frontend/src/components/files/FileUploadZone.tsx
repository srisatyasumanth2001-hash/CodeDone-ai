import  { useState, useRef} from 'react'
import type {DragEvent} from 'react'
import { uploadFile } from '../../api/file'
import type { UploadResponse } from '../../types'

interface Props {
  onUploadComplete: (result: UploadResponse) => void
}

export default function FileUploadZone({ onUploadComplete }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError('')
    setIsUploading(true)
    setUploadProgress('Uploading...')

    try {
      setUploadProgress('Extracting text...')
      const result = await uploadFile(file)
      setUploadProgress('Done!')
      onUploadComplete(result)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress('')
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <div className="text-4xl mb-3">📄</div>

        {isUploading ? (
          <div>
            <div className="text-gray-300 text-sm font-medium mb-1">
              {uploadProgress}
            </div>
            <div className="w-32 h-1 bg-gray-700 rounded mx-auto overflow-hidden">
              <div className="h-full bg-blue-500 rounded animate-pulse w-full" />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 text-sm font-medium mb-1">
              Drop a file here or click to upload
            </p>
            <p className="text-gray-500 text-xs">
              PDF, Python, JavaScript, TypeScript, and more · Max 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleInputChange}
        className="hidden"
        accept=".pdf,.py,.js,.ts,.tsx,.jsx,.java,.cpp,.c,.go,.rs,.md,.txt,.json"
      />
    </div>
  )
}