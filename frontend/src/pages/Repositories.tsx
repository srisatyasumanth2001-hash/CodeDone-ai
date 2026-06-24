import { useEffect } from 'react'
import { useRepositories } from '../hooks/useRepositories'
import ConnectRepoForm from '../components/repositories/ConnectRepoForm'
import RepositoryCard from '../components/repositories/RepositoryCard'

export default function Repositories() {
  const { repositories, isConnecting, error, connect, loadRepositories } = useRepositories()

  useEffect(() => {
    loadRepositories()
  }, [loadRepositories])

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

        <div className="mt-6 space-y-3">
          {repositories.length === 0 && (
            <div className="text-center py-12 text-slate-600 dark:text-slate-400 text-sm">
              No repositories connected yet
            </div>
          )}

          {repositories.map(repo => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>

      </div>
    </div>
  )
}