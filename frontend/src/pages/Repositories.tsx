import {useState, useEffect } from 'react'
import { useRepositories } from '../hooks/useRepositories'
import ConnectRepoForm from '../components/repositories/ConnectRepoForm'
import RepositoryCard from '../components/repositories/RepositoryCard'
import ConfirmDialog from '../components/ui/ConfirmDialog'

export default function Repositories() {
  const {
    repositories, isConnecting, error, connect, loadRepositories,
    selectedIds, isDeleting, toggleSelect, clearSelection, deleteSelected, deleteOne
  } = useRepositories()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteMode, setDeleteMode] =
  useState<'single' | 'bulk'>('single')

const [selectedRepoId, setSelectedRepoId] =
  useState<number | null>(null)
  useEffect(() => {
    loadRepositories()
  }, [loadRepositories])
  const handleDeleteOne = (id: number) => {
    setSelectedRepoId(id)
    setShowDeleteModal(true)
  }
  const handleDeleteSelected = () => {
  setDeleteMode('bulk')
  setShowDeleteModal(true)
}
  const handleConfirmDelete = async () => {
  try {
    if (deleteMode === 'single') {

      if (!selectedRepoId) return

      await deleteOne(selectedRepoId)
    }

    if (deleteMode === 'bulk') {
      await deleteSelected()
    }

    setShowDeleteModal(false)
    setSelectedRepoId(null)

  } catch (error) {
    console.error(error)
  }
}

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto w-full">

        <div className="mb-6">
          <h1 className="text-lg font-semibold text-slate-600 dark:text-white">Repository Analysis</h1>
          <p className="text-slate-600 dark:text-white text-sm mt-0.5">
            Connect a public GitHub repository and ask questions about its codebase
          </p>
        </div>

        <ConnectRepoForm onConnect={connect} isConnecting={isConnecting} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400
                          text-sm rounded-xl p-4 mt-4">
            {error}
          </div>
        )}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 mt-4">
            <span className="text-sm text-gray-300">{selectedIds.size} selected</span>
            <div className="flex gap-3">
              <button
                onClick={clearSelection}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Selected'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {repositories.length === 0 && (
            <div className="text-center py-12 text-slate-600 dark:text-slate-400 text-sm">
              No repositories connected yet
            </div>
          )}

          {repositories.map(repo => (
            <RepositoryCard 
              key={repo.id}
              repository={repo}
              isSelected={selectedIds.has(repo.id)}
              onToggleSelect={toggleSelect}
              onDelete={handleDeleteOne} />
          ))}
        </div>
          <ConfirmDialog
            open={showDeleteModal}
            title={
              deleteMode === 'single'
                ? 'Delete Repository'
                : 'Delete Selected Repositories'
            }
            message={
              deleteMode === 'single'
                ? 'Are you sure you want to delete this repository and all indexed data? This action cannot be undone.'
                : `Are you sure you want to delete ${selectedIds.size} selected repositories and all indexed data? This action cannot be undone.`
            }
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setShowDeleteModal(false)
              setSelectedRepoId(null)
            }}
          />
      </div>
    </div>
  )
}