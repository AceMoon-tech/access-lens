import ThemeToggle from './ThemeToggle'

function Header() {
  return (
    <header className="w-full border-b border-default bg-surface-1">
      <div className="mx-auto max-w-content px-24 py-16 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-default">
          Access Lens
        </h1>

        <nav aria-label="Global">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

export default Header
