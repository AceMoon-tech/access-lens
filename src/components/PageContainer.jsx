import { useEffect } from 'react'
import { useThemeStore } from '../state/theme'

function PageContainer({ children, className = '' }) {
  const theme = useThemeStore((state) => state.theme)
  const initTheme = useThemeStore((state) => state.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <div data-theme={theme} className={`page-container ${className}`}>
      <main id="main-content" className="page-container__main px-24">
        {children}
      </main>
    </div>
  )
}

export default PageContainer
