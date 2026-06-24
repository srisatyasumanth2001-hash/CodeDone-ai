import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

function getInitialTheme(): Theme {
  // Check localStorage first — respects a returning user's previous choice
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored === 'light' || stored === 'dark') return stored

  // Fall back to OS preference for first-time visitors
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  // This is the actual mechanism — toggling the class Tailwind watches for
  const root = document.documentElement // the <html> element
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

const initial = getInitialTheme()
applyTheme(initial) // apply immediately on load, before React even renders

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initial,

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  }
}))