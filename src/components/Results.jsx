import Loading from './Loading'
import IssueCard from './IssueCard'

function Results({ results, loading = false, errorText }) {
  // Loading state
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading audit results"
        className="flex flex-col items-center justify-center py-64 gap-16"
      >
        <Loading size="md" />
        <p className="text-muted text-base" style={{ color: 'var(--text-muted)' }}>
          Running audit…
        </p>
      </div>
    )
  }

  if (!results) return null

  const { issues = [], error } = results

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Accessibility audit results"
      className="space-y-24"
    >
      {/* Error state UI (client-side / pipeline errorText) */}
      {errorText && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-12 p-16 rounded-sm border"
          style={{
            backgroundColor: 'var(--surface-1)',
            borderColor: 'var(--sev-high)',
            color: 'var(--sev-high)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: '2px' }}
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-base" style={{ color: 'var(--sev-high)' }}>
            {errorText}
          </p>
        </div>
      )}

      {/* Results error (from API) */}
      {error && !errorText && (
        <p className="text-sev-high text-lg" role="alert">
          {error}
        </p>
      )}

      {/* No issues - Empty state */}
      {!error && issues.length === 0 && (
        <div className="text-center py-32">
          <h3 className="text-lg font-semibold mb-8" style={{ color: 'var(--text-muted)' }}>
            No issues found
          </h3>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            This screen description didn't surface accessibility issues.
          </p>
        </div>
      )}

      {/* Issues - use IssueCard (single source of truth) */}
      <div className="flex flex-col gap-24">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  )
}

export default Results
