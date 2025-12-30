import Card from './Card'

// Severity icons
function HighSeverityIcon({ className = '', style }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function MediumSeverityIcon({ className = '', style }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function LowSeverityIcon({ className = '', style }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

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
          label: 'High',
          Icon: HighSeverityIcon
        }
      case 'medium':
        return {
          color: 'var(--sev-med)',
          fontWeight: 'var(--weight-medium)',
          label: 'Medium',
          Icon: MediumSeverityIcon
        }
      case 'low':
      default:
        return {
          color: 'var(--sev-low)',
          fontWeight: 'var(--weight-regular)',
          label: 'Low',
          Icon: LowSeverityIcon
        }
    }
  }

  const severityConfig = getSeverityConfig(issue.severity)
  const SeverityIcon = severityConfig.Icon

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
    <Card className="rounded-sm space-y-12" style={{ position: 'relative', paddingLeft: issue.severity ? 'calc(var(--space-24) + var(--space-4) + var(--space-12))' : undefined }}>
      {/* Severity indicator rail */}
      {issue.severity && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-8)',
            left: 'var(--space-24)',
            bottom: 'var(--space-8)',
            width: 'var(--space-4)',
            backgroundColor: severityConfig.color,
            borderRadius: 'var(--radius-sm)'
          }}
        />
      )}

      {/* Severity header */}
      {issue.severity && (
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <SeverityIcon
            style={{
              flexShrink: 0,
              color: severityConfig.color,
              width: 'var(--space-16)',
              height: 'var(--space-16)'
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
