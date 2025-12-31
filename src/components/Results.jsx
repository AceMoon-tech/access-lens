import Loading from './Loading'
import IssueCard from './IssueCard'
import Alert from './Alert'

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
          Audit in progress. Please wait…
        </p>
      </div>
    )
  }

  if (!results) return null

  const { issues = [], error, lowConfidence } = results

  // Detect partial results
  const hedgingPhrases = ['if present', 'consider whether', 'ensure that']
  const hasPartialResults = issues.length > 0 && (
    issues.length <= 2 ||
    issues.every(issue => (issue.severity || 'low').toLowerCase() !== 'high') ||
    issues.every(issue => {
      const guidance = (issue.guidance || '').toLowerCase().trim()
      return hedgingPhrases.some(phrase => guidance.startsWith(phrase))
    })
  )

  // Sort issues by severity: High → Medium → Low
  const severityOrder = { high: 3, medium: 2, low: 1 }
  const sortedIssues = [...issues].sort((a, b) => {
    const aSev = severityOrder[(a.severity || 'low').toLowerCase()] || 1
    const bSev = severityOrder[(b.severity || 'low').toLowerCase()] || 1
    return bSev - aSev // Descending order
  })

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Accessibility audit results"
      className="space-y-24"
    >
      {/* Error state UI (client-side / pipeline errorText) */}
      {errorText && (
        <Alert variant="error">
          {errorText}
        </Alert>
      )}

      {/* Results error (from API) */}
      {error && !errorText && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Low confidence input notice */}
      {lowConfidence && !error && (
        <Alert variant="info">
          Low confidence input. Results are based on common accessibility patterns and may not reflect a specific UI.
        </Alert>
      )}

      {/* Partial results warning */}
      {hasPartialResults && !error && issues.length > 0 && (
        <Alert variant="warning">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <strong style={{ fontWeight: 'var(--weight-semibold)' }}>Limited confidence results</strong>
            <span>These results are based on a small or generalized signal. They may not capture higher-impact accessibility issues. Consider adding more specific UI details.</span>
          </div>
        </Alert>
      )}

      {/* No issues - Empty state */}
      {!error && issues.length === 0 && (
        <div className="text-center py-32">
          <h3 className="text-lg font-semibold mb-8" style={{ color: 'var(--text-muted)' }}>
            No potential issues surfaced
          </h3>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Based on this screen description, no potential accessibility risks surfaced.
          </p>
        </div>
      )}

      {/* Issues - use IssueCard (single source of truth) */}
      <div className="flex flex-col gap-24">
        {sortedIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  )
}

export default Results
