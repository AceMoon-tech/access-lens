import { Link } from 'react-router-dom'

function DevNav() {
  // Only show in development
  if (import.meta.env.PROD) return null

  return (
    <nav
      aria-label="Development navigation"
      className="border-b"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--surface-1)',
        padding: 'var(--space-8) 0',
      }}
    >
      <div className="page-container__main">
        <div
          className="flex items-center gap-16 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <span
            className="font-medium px-8 py-4 rounded-sm"
            style={{
              backgroundColor: 'var(--sev-med)',
              color: 'var(--text-inverse)',
              // Intentional exception: Internal dev-only UI uses 10px for compact badge
              // No token exists for this size (closest: --text-xs = 12px)
              fontSize: '10px',
            }}
          >
            DEV
          </span>
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/audit" className="hover:underline">Audit</Link>
          <Link to="/results" className="hover:underline">Results</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/notfound-test" className="hover:underline">NotFound</Link>
        </div>
      </div>
    </nav>
  )
}

export default DevNav

