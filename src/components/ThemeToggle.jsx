import { useThemeStore } from '../state/theme'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-8 rounded-sm bg-surface-1 border border-default shadow-sm hover:bg-subtle transition"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-default" />
      ) : (
        <SunIcon className="w-5 h-5 text-default" />
      )}
    </button>
  )
}

export default ThemeToggle
