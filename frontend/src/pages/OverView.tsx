import { useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import StatCard from '../components/dashboard/StatCard'
import ActivityChart from '../components/dashboard/ActivityChart'

export default function Overview() {
  const { stats, isLoading, loadStats } = useDashboard()

  useEffect(() => {
    loadStats()
  }, [loadStats])

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-600 dark:text-slate-400 text-sm">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-y-auto h-full bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-lg font-semibold text-black-600 dark:text-white">Overview</h1>
          <p className="text-slate-800 dark:text-white text-sm mt-0.5">
            Your activity across CodeDone AI
          </p>
        </div>

        {/* Stat cards grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Conversations" value={stats.total_conversations} icon="💬" />
        <StatCard label="Messages sent" value={stats.total_messages} icon="✉️" />
        <StatCard label="Files uploaded" value={stats.total_files} icon="📄" />
        <StatCard label="Repositories" value={stats.total_repositories} icon="🗂️" />
        <StatCard label="Documents indexed" value={stats.uploaded_documents} icon="📚" />
        <StatCard label="Repo files indexed" value={stats.repository_files} icon="📁" />
        <StatCard label="Embedded chunks" value={stats.total_embedded_chunks} icon="🔗" />
        <StatCard label="Est. tokens used" value={stats.estimated_tokens_used} icon="⚡" />
</div>

        {/* Activity chart */}
        <ActivityChart data={stats.daily_activity} />

      </div>
    </div>
  )
}