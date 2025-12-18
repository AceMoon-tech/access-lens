function IssueCard({ issue }) {
  if (!issue) return null

  // Severity color classes using token system
  const severityColors = {
    low: "text-sev-low",
    medium: "text-sev-med",
    high: "text-sev-high",
  }

  const sevClass =
    severityColors[issue.severity?.toLowerCase()] ||
    "text-sev-low"

  return (
    <div className="bg-surface-1 border border-default p-24 rounded-sm shadow-sm space-y-12">
      {/* Title */}
      <h3 className="text-xl font-semibold text-default">
        {issue.title}
      </h3>

      {/* Severity */}
      <p className={`text-sm font-medium ${sevClass}`}>
        Severity: {issue.severity}
      </p>

      {/* Description */}
      {issue.description && (
        <p className="text-muted text-sm">
          {issue.description}
        </p>
      )}

      {/* Fixes */}
      {Array.isArray(issue.fixes) && issue.fixes.length > 0 && (
        <ul className="list-disc pl-16 space-y-8">
          {issue.fixes.map((fix, i) => (
            <li key={i} className="text-default text-sm">
              {fix}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default IssueCard
