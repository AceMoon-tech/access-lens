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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform var(--motion-normal) var(--ease-standard)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const WCAG_CRITERION_TITLES = {
  '1.1.1': 'Non-text Content',
  '1.3.1': 'Info Structure',
  '1.4.3': 'Color Contrast',
  '1.4.11': 'Non-text Contrast',
  '2.4.3': 'Focus Order',
  '2.4.4': 'Link Purpose',
  '2.4.6': 'Field Labels',
  '2.5.5': 'Touch Target Size',
  '3.3.1': 'Error Messaging',
  '3.3.2': 'Field Labels',
  '3.3.3': 'Error Messaging',
  '4.1.2': 'Accessible Names',
}

const WCAG_ID_PATTERN = /(\d+\.\d+\.\d+)/

const TITLE_KEYWORD_RULES = [
  { pattern: /\bcontrast\b/i, title: 'Color Contrast' },
  { pattern: /\blabels?\b|\binstruction/i, title: 'Field Labels' },
  { pattern: /\bfocus\b|\btab order\b/i, title: 'Focus Order' },
  { pattern: /\berror\b|\bvalidation\b|\bmessage\b/i, title: 'Error Messaging' },
  { pattern: /\btouch\b|\btarget size\b|\btap\b/i, title: 'Touch Target Size' },
  { pattern: /\bheadings?\b/i, title: 'Headings' },
  { pattern: /\bkeyboard\b/i, title: 'Keyboard Access' },
  { pattern: /\balt\b|\bnon-text\b|\bimage text\b/i, title: 'Non-text Content' },
]

const TITLE_STOPWORDS = new Set([
  'that', 'the', 'a', 'an', 'between', 'and', 'or', 'of', 'to', 'for', 'in', 'on',
  'with', 'their', 'users', 'present', 'be', 'is', 'are', 'has', 'have', 'this',
])

const CONDITIONAL_TITLE_PATTERN = /\b(if|may|could|ensure|consider)\b/i

function countTitleWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function toTitleCase(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function isValidTitle(title, guidance) {
  const t = typeof title === 'string' ? title.trim() : ''
  if (!t) return false

  const words = countTitleWords(t)
  if (words < 2 || words > 5) return false
  if (t.length > 48) return false
  if (/^\s*(if|may|could|ensure|consider|when|should)\b/i.test(t)) return false
  if (CONDITIONAL_TITLE_PATTERN.test(t)) return false
  if (WCAG_ID_PATTERN.test(t) || /\bWCAG\b/i.test(t)) return false
  if (/[.,;:!?]/.test(t)) return false

  const g = typeof guidance === 'string' ? guidance.trim() : ''
  if (g) {
    const tLower = t.toLowerCase()
    const gLower = g.toLowerCase()
    if (t.length >= 20 && gLower.startsWith(tLower.slice(0, 20))) return false
    if (gLower.startsWith(tLower.slice(0, Math.min(30, t.length)))) return false
  }

  return true
}

function titleFromWcagRefs(wcagRefs) {
  if (!Array.isArray(wcagRefs)) return null
  for (const ref of wcagRefs) {
    const raw = String(ref ?? '').trim()
    const match = raw.match(WCAG_ID_PATTERN)
    if (match && WCAG_CRITERION_TITLES[match[1]]) {
      return WCAG_CRITERION_TITLES[match[1]]
    }
  }
  return null
}

function titleFromKeywords(text) {
  if (!text) return null
  for (const { pattern, title } of TITLE_KEYWORD_RULES) {
    if (pattern.test(text)) return title
  }
  return null
}

function stripConditionalLead(text) {
  let result = text.trim()
  let previous = ''
  while (previous !== result) {
    previous = result
    result = result.replace(
      /^\s*(if present,?|if|may|could|ensure that|consider whether|when|should)\s+/i,
      ''
    )
  }
  return result
}

function titleFromGuidance(guidance) {
  const stripped = stripConditionalLead(typeof guidance === 'string' ? guidance : '')
  if (!stripped) return null

  const words = stripped
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !TITLE_STOPWORDS.has(word))

  if (words.length === 0) return null

  const topic = toTitleCase(words.slice(0, 4).join(' '))
  return countTitleWords(topic) >= 2 ? topic : null
}

function deriveIssueTitle(issue) {
  const fromWcag = titleFromWcagRefs(issue.wcagRefs)
  if (fromWcag) return fromWcag

  const keywordSource = [issue.guidance, issue.suggestedFix]
    .filter((part) => typeof part === 'string' && part.trim())
    .join(' ')

  const fromKeywords = titleFromKeywords(keywordSource)
  if (fromKeywords) return fromKeywords

  const fromGuidance = titleFromGuidance(issue.guidance)
  if (fromGuidance) return fromGuidance

  return 'Accessibility Topic'
}

function resolveIssueTitle(issue) {
  if (!issue) return 'Accessibility Topic'

  const guidance = issue.guidance?.trim() || ''

  const title = issue.title?.trim()
  if (title && isValidTitle(title, guidance)) return title

  const summary = issue.summary?.trim()
  if (summary && isValidTitle(summary, guidance)) return summary

  return deriveIssueTitle(issue)
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
        className="flex items-center justify-between w-full hover:bg-subtle transition"
        style={{
          gap: 'var(--space-16)',
          marginInline: 'calc(-1 * var(--space-12))',
          padding: 'var(--space-8) var(--space-12)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
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
        <span
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            minWidth: 'var(--space-32)',
            minHeight: 'var(--space-32)',
            color: 'color-mix(in srgb, var(--text-muted) 65%, var(--text-default))',
          }}
        >
          <ChevronIcon expanded={expanded} />
        </span>
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
