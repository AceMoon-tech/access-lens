import { create } from 'zustand'

/**
 * Theme Store - Zustand store for theme management
 * Manages light/dark theme state and updates data-theme attribute
 */
export const useThemeStore = create((set) => ({
  theme: 'light',
  
  setTheme: (theme) => {
    set({ theme })
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  },
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
      return { theme: newTheme }
    })
  },
  
  // Initialize theme from localStorage or system preference
  initTheme: () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    
    document.documentElement.setAttribute('data-theme', initialTheme)
    set({ theme: initialTheme })
  },
}))

