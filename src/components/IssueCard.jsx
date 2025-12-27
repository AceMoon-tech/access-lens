function IssueCard({ issue }) {
  if (!issue) return null

  // Severity color classes using token system
  const severityColors = {
    low: "text-sev-low",
    medium: "text-sev-med",
    high: "text-sev-high",
  }

  const sev = (issue.severity || "").toLowerCase()
  const sevClass = severityColors[sev] || "text-sev-low"

  // Primary display text (new contract first, fallback to old)
  const titleText =
    issue.guidance ||
    issue.title ||
    issue.summary ||
    "Accessibility recommendation"

  const hasDescription =
    !!issue.description && String(issue.description).trim() !== ""

  const hasWcagRefs = Array.isArray(issue.wcagRefs) && issue.wcagRefs.length > 0

  return (
    <div className="bg-surface-1 border border-default p-24 rounded-sm shadow-sm space-y-12">
      {/* Title (Guidance) */}
      <h3 className="text-xl font-semibold text-default">
        {titleText}
      </h3>

      {/* Who it affects */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide">
          Who it affects
        </p>
        <p className="text-default text-sm">{issue.whoItAffects || "Not specified."}</p>
      </div>

      {/* Why it matters */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide">
          Why it matters
        </p>
        <p className="text-default text-sm">{issue.whyItMatters || "Not specified."}</p>
      </div>

      {/* WCAG refs */}
      {hasWcagRefs && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            WCAG references
          </p>
          <p className="text-muted text-sm">
            {issue.wcagRefs.join(", ")}
          </p>
        </div>
      )}

      {/* Severity */}
      {issue.severity && (
        <p className={`text-sm font-medium ${sevClass}`}>
          Potential impact: {issue.severity}
        </p>
      )}

      {/* Description (old contract support) */}
      {hasDescription && (
        <p className="text-muted text-sm">
          {issue.description}
        </p>
      )}

      {/* Fixes (old contract support) */}
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
