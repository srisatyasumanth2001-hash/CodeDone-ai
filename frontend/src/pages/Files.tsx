import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUploadZone from '../components/files/FileUploadZone'
import FileCard from '../components/files/FileCard'
import { getFiles, deleteFile } from '../api/file'
import type { UploadedFile, UploadResponse } from '../types'
import ConfirmDialog from '../components/ui/ConfirmDialog'

export default function Files() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const loadFiles = async () => {
    try {
      const data = await getFiles()
      setFiles(data)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const handleUploadComplete = (result: UploadResponse) => {
    // reload the file list after a successful upload
    loadFiles()
  }

 const handleDelete = (fileId: number) => {
  setSelectedFileId(fileId)
  setShowDeleteModal(true)
}
  const handleConfirmDelete = async () => {
  if (!selectedFileId) return

  setIsDeleting(true)

  try {
    await deleteFile(selectedFileId)

    setFiles(prev =>
      prev.filter(f => f.id !== selectedFileId)
    )

    setShowDeleteModal(false)
    setSelectedFileId(null)
  } catch (error) {
    console.error('Failed to delete file:', error)
  } finally {
    setIsDeleting(false)
  }
}

  const handleChat = (file: UploadedFile) => {
    // navigate to a dedicated file chat page
    // we'll create this route in App.tsx
    navigate(`/dashboard/files/${file.id}/chat`)
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-950">
    <div className="p-6 max-w-3xl mx-auto ">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Files</h1>
        <p className="text-gray-900 dark:text-white text-sm">
          Upload code files, PDFs, or documents and chat with AI about them.
        </p>
      </div>

      {/* upload zone */}
      <div className="mb-8">
        <FileUploadZone onUploadComplete={handleUploadComplete} />
      </div>

      {/* file list */}
      <div>
        <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Your Files {files.length > 0 && `(${files.length})`}
        </h2>

        {isLoading ? (
          <div className="text-gray-900 dark:text-white dark:text-white text-sm">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 border border-dashed  rounded-xl">
            <div className="text-3xl mb-2">📂</div>
            <p className="text-gray-500 text-sm">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map(file => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={showDeleteModal}
        title="Delete File"
        message="Are you sure you want to delete this file and its chat history? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false)
          setSelectedFileId(null)
        }}
      />
    </div>
    </div>
  )
}