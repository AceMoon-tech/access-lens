import Loading from './Loading'
import Card from './Card'

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

  const { issues, error } = results

  // Severity → token color classes
  const getSeverityColorClass = (severity) => {
    if (!severity) return "text-sev-low"
    const s = severity.toLowerCase().trim()
    if (s === "medium" || s === "med") return "text-sev-med"
    if (s === "high") return "text-sev-high"
    if (s === "low") return "text-sev-low"
    return "text-sev-low"
  }

  const normalizeSeverityText = (severity) => {
    if (!severity) return 'low'
    const s = severity.toLowerCase().trim()
    if (s === 'med') return 'medium'
    if (['low', 'medium', 'high'].includes(s)) return s
    return 'low'
  }

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Accessibility audit results"
      className="space-y-24"
    >
      {/* Error state UI */}
      {errorText && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-12 p-16 rounded-sm border"
          style={{
            backgroundColor: 'var(--surface-1)',
            borderColor: 'var(--sev-high)',
            color: 'var(--sev-high)'
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

      {/* Issues - Vertical card stack */}
      <div className="flex flex-col gap-24">
        {issues.map((issue) => {
          const severityText = normalizeSeverityText(issue.severity)
          
          // Get severity color token for badge background
          const getSeverityColor = (severity) => {
            const s = severity?.toLowerCase().trim() || 'low'
            if (s === 'medium' || s === 'med') return 'var(--sev-med)'
            if (s === 'high') return 'var(--sev-high)'
            return 'var(--sev-low)'
          }

          return (
            <Card
              key={issue.id}
              role="group"
              aria-label={`${issue.title} (severity: ${severityText})`}
              className="flex flex-col gap-16"
            >
              {/* Header: Severity badge + Rule name */}
              <div className="flex items-start gap-16">
                {/* Severity badge */}
                <span
                  className="inline-flex items-center px-12 py-4 rounded-sm text-xs font-medium uppercase tracking-wide"
                  style={{
                    backgroundColor: getSeverityColor(issue.severity),
                    color: 'var(--text-inverse)',
                  }}
                  aria-label={`Severity: ${severityText}`}
                >
                  {severityText}
                </span>
                
                {/* Rule name */}
                <h3 
                  className="flex-1 font-semibold"
                  style={{
                    fontSize: 'var(--text-h2)',
                    lineHeight: 'var(--text-h2-leading)',
                    fontWeight: 'var(--text-h2-weight)',
                    color: 'var(--text-default)'
                  }}
                >
                  {issue.title}
                </h3>
              </div>

              {/* Short description */}
              {issue.details && (
                <p 
                  className="text-base"
                  style={{
                    fontSize: 'var(--text-body)',
                    lineHeight: 'var(--text-body-leading)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {issue.details}
                </p>
              )}

              {/* Fix suggestion */}
              {issue.fixes?.length > 0 && (
                <div className="flex flex-col gap-8">
                  <p 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-default)' }}
                  >
                    Fix suggestion:
                  </p>
                  <ul className="list-disc space-y-8 pl-24">
                    {issue.fixes.map((fix, i) => (
                      <li 
                        key={i} 
                        className="text-sm"
                        style={{
                          fontSize: 'var(--text-body)',
                          lineHeight: 'var(--text-body-leading)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Results
