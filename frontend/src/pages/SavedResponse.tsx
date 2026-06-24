import { useEffect, useState } from 'react'
import type { SavedResponse } from '../types'
import { getSavedResponses, deleteSavedResponse } from '../api/savedResponse'
import { Trash2 } from 'lucide-react'
import MessageContent from '../components/chat/MessageContent'

export default function SavedResponses() {
  const [items, setItems] = useState<SavedResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSavedResponses().then(setItems).finally(() => setIsLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    await deleteSavedResponse(id)
    setItems(prev => prev.filter(item => item.id !== id))
    
  }
  console.log(items)

  if (isLoading) return <div className="p-6 text-gray-500 text-sm">Loading...</div>
  

  return (
    <div className="p-6 overflow-y-auto h-full bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-lg font-semibold mb-1 text-black-600 dark:text-white">Saved Responses</h1>
        <p className=" text-sm mb-6 text-black-600 dark:text-white">Bookmarked AI answers you wanted to keep</p>

        {items.length === 0 && (
          <div className="text-center py-12 text-black-600 dark:text-white text-sm">
            No saved responses yet — bookmark any AI answer from the chat to see it here.
          </div>
        )}

        <div className="space-y-3 ">
          {items.map(item => (
            <div key={item.id} className="border border-gray-700 rounded-xl p-4 bg-white dark:bg-slate-950">
              <div className="flex items-center justify-between mb-2 ">
                <span className="text-xs text-gray-500 ">
                  { ''}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-gray-500 hover:text-red-400 animate-pulse"
                >
                  <Trash2 size={20}></Trash2>
                </button>
              </div>
             <MessageContent content={item.content}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}