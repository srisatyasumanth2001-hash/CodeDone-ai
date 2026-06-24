import { useThemeStore } from '../../store/themeStore'
import {Sun, Moon} from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800
                 hover:text-gray-200 transition-colors"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={20} className="w-6 h-6 text-amber-500 fill-amber-400 animate-pulse"/> : <Moon size={20} className="w-6 h-6 animate-pulse"/>}
    </button>
  )
}