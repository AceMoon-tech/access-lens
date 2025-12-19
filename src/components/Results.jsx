import CopyAllButton from '../components/CopyAllButton'

function Results({ results }) {
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
      {/* Error */}
      {error && (
        <p className="text-sev-high text-lg" role="alert">
          {error}
        </p>
      )}

      {/* No issues */}
      {!error && issues.length === 0 && (
        <p className="text-muted text-lg">
          No accessibility issues found.
        </p>
      )}

      {/* Issues */}
      {issues.map((issue) => {
        const severityText = normalizeSeverityText(issue.severity)
        const sevClass = getSeverityColorClass(issue.severity)

        return (
          <div
            key={issue.id}
            role="group"
            aria-label={`${issue.title} (severity: ${severityText})`}
            className="border border-default bg-surface-1 p-24 rounded-sm shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-16">
              {issue.title}
            </h3>

            {/* Severity */}
            <p className="text-muted text-sm mb-16">
              Severity:{' '}
              <span className={sevClass}>
                {severityText}
              </span>
            </p>

            {/* Details */}
            {issue.details && (
              <p className="text-base mb-16">
                {issue.details}
              </p>
            )}

            {/* Fixes */}
            {issue.fixes?.length > 0 && (
              <ul className="list-disc space-y-8 pl-24">
                {issue.fixes.map((fix, i) => (
                  <li key={i} className="text-sm">
                    {fix}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}

      {/* Copy JSON */}
      <div className="pt-24">
        <CopyAllButton text={JSON.stringify(results, null, 2)} />
      </div>
    </div>
  )
}

export default Results
