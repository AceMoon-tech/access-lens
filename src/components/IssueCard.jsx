import { useState, useId } from 'react'
import Card from './Card'
import { formatWcagRef } from '../lib/wcagRefs'

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

function ChevronIcon({ expanded, className = '' }) {
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
      style={{
        flexShrink: 0,
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform var(--motion-normal) var(--ease-standard)',
        color: 'var(--text-muted)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function resolveIssueTitle(issue) {
  const title = issue.title?.trim() || issue.summary?.trim()
  if (title) return title

  const guidance = issue.guidance?.trim()
  if (guidance) {
    if (guidance.length <= 48) return guidance.replace(/\.$/, '')
    const cut = guidance.slice(0, 48)
    const lastSpace = cut.lastIndexOf(' ')
    return `${lastSpace > 20 ? cut.slice(0, lastSpace) : cut}…`
  }

  return 'Accessibility consideration'
}

function IssueSection({ label, children, preWrap = false }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-muted uppercase tracking-wide">
        {label}
      </p>
      <p
        className="text-default text-sm"
        style={preWrap ? { whiteSpace: 'pre-wrap' } : undefined}
      >
        {children}
      </p>
    </div>
  )
}

function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()
  const titleId = useId()

  if (!issue) return null

  const getSeverityConfig = (severity) => {
    const sev = (severity || '').toLowerCase()
    switch (sev) {
      case 'high':
        return {
          color: 'var(--sev-high)',
          fontWeight: 'var(--weight-semibold)',
          label: 'High',
          Icon: HighSeverityIcon,
        }
      case 'medium':
        return {
          color: 'var(--sev-med)',
          fontWeight: 'var(--weight-medium)',
          label: 'Medium',
          Icon: MediumSeverityIcon,
        }
      case 'low':
      default:
        return {
          color: 'var(--sev-low)',
          fontWeight: 'var(--weight-regular)',
          label: 'Low',
          Icon: LowSeverityIcon,
        }
    }
  }

  const severityConfig = getSeverityConfig(issue.severity)
  const SeverityIcon = severityConfig.Icon
  const titleText = resolveIssueTitle(issue)

  const issueText =
    issue.guidance?.trim() ||
    issue.description?.trim() ||
    issue.summary?.trim() ||
    'Not specified.'

  const hasSuggestedFix =
    !!issue.suggestedFix && String(issue.suggestedFix).trim() !== ''

  const hasDesignExample =
    !!issue.designExample && String(issue.designExample).trim() !== ''

  const hasWcagRefs = Array.isArray(issue.wcagRefs) && issue.wcagRefs.length > 0

  const hasDescription =
    !!issue.description &&
    String(issue.description).trim() !== '' &&
    String(issue.description).trim() !== issueText

  return (
    <Card
      className="rounded-sm space-y-12"
      style={{
        position: 'relative',
        paddingLeft: issue.severity
          ? 'calc(var(--space-24) + var(--space-4) + var(--space-12))'
          : undefined,
      }}
    >
      {issue.severity && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-8)',
            left: 'var(--space-24)',
            bottom: 'var(--space-8)',
            width: 'var(--space-4)',
            backgroundColor: severityConfig.color,
            borderRadius: 'var(--radius-sm)',
          }}
        />
      )}

      {issue.severity && (
        <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <SeverityIcon
            style={{
              flexShrink: 0,
              color: severityConfig.color,
              width: 'var(--space-16)',
              height: 'var(--space-16)',
            }}
          />
          <p
            className="text-xs uppercase tracking-wide"
            style={{
              color: severityConfig.color,
              fontWeight: severityConfig.fontWeight,
              margin: 0,
            }}
          >
            Potential impact: {severityConfig.label}
          </p>
        </div>
      )}

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
        className="flex items-center justify-between w-full"
        style={{
          gap: 'var(--space-16)',
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          color: 'var(--text-default)',
        }}
      >
        <span
          id={titleId}
          className="text-xl font-semibold"
          style={{ flex: 1, minWidth: 0 }}
        >
          {titleText}
        </span>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={titleId}
          className="space-y-12"
          style={{ paddingTop: 'var(--space-4)' }}
        >
          <IssueSection label="Issue">{issueText}</IssueSection>

          <IssueSection label="Who it affects">
            {issue.whoItAffects || 'Not specified.'}
          </IssueSection>

          <IssueSection label="Why it matters">
            {issue.whyItMatters || 'Not specified.'}
          </IssueSection>

          {hasSuggestedFix && (
            <IssueSection label="Suggested fix">{issue.suggestedFix}</IssueSection>
          )}

          {hasDesignExample && (
            <IssueSection label="Design example" preWrap>
              {issue.designExample}
            </IssueSection>
          )}

          {hasWcagRefs && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                WCAG references
              </p>
              <ul className="list-disc pl-16 space-y-8">
                {issue.wcagRefs.map((ref, i) => (
                  <li key={i} className="text-muted text-sm">
                    {formatWcagRef(ref)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasDescription && (
            <p className="text-muted text-sm">{issue.description}</p>
          )}

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
      )}
    </Card>
  )
}

export default IssueCard
