import Card from './Card'

function IssueCard({ issue }) {
  if (!issue) return null

  // Severity configuration
  const getSeverityConfig = (severity) => {
    const sev = (severity || "").toLowerCase()
    switch (sev) {
      case 'high':
        return {
          color: 'var(--sev-high)',
          fontWeight: 'var(--weight-semibold)',
          label: 'High'
        }
      case 'medium':
        return {
          color: 'var(--sev-med)',
          fontWeight: 'var(--weight-medium)',
          label: 'Medium'
        }
      case 'low':
      default:
        return {
          color: 'var(--sev-low)',
          fontWeight: 'var(--weight-regular)',
          label: 'Low'
        }
    }
  }

  const severityConfig = getSeverityConfig(issue.severity)

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
    <Card className="rounded-sm space-y-12" style={{ position: 'relative', paddingLeft: issue.severity ? 'calc(var(--space-24) + var(--space-4))' : undefined }}>
      {/* Severity indicator bar */}
      {issue.severity && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 'var(--space-24)',
            bottom: 0,
            width: 'var(--space-4)',
            backgroundColor: severityConfig.color,
            borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)'
          }}
        />
      )}

      {/* Severity header */}
      {issue.severity && (
        <div className="flex items-center gap-8">
          <div
            style={{
              width: 'var(--space-8)',
              height: 'var(--space-8)',
              borderRadius: '50%',
              backgroundColor: severityConfig.color,
              flexShrink: 0
            }}
          />
          <p
            className="text-xs uppercase tracking-wide"
            style={{
              color: severityConfig.color,
              fontWeight: severityConfig.fontWeight,
              margin: 0
            }}
          >
            Potential impact: {severityConfig.label}
          </p>
        </div>
      )}

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
    </Card>
  )
}

export default IssueCard
