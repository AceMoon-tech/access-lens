/**
 * Normalize raw API audit results into a safe, predictable structure.
 * Handles the strict audit schema: id, summary, description, severity, wcagRefs, confidence
 */

export const severityColors = {
  low: 'text-[var(--sev-low)]',
  med: 'text-[var(--sev-med)]',
  high: 'text-[var(--sev-high)]',
  medium: 'text-[var(--sev-med)]', // Handle "medium" from API
}

export default function normalizeResults(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      issues: [],
      error: 'Invalid API response shape.',
    }
  }

  // If API returned an error structure
  if (raw.error) {
    return {
      issues: [],
      error: raw.message || raw.error || 'An error occurred during the audit.',
      details: raw.details || null,
    }
  }

  let issues = []

  // Parse issues from validated API response
  try {
    if (Array.isArray(raw.issues)) {
      issues = raw.issues.map((issue) => ({
        id: issue.id || crypto.randomUUID(),
        guidance: issue.guidance || issue.title || issue.summary || 'No guidance provided',
        whoItAffects: issue.whoItAffects || '',
        whyItMatters: issue.whyItMatters || '',
        severity: issue.severity || 'low',
        wcagRefs: Array.isArray(issue.wcagRefs) ? issue.wcagRefs : (issue.wcagRef ? [issue.wcagRef] : []),
        confidence: issue.confidence || 'low',
        // Legacy fields for backward compatibility with UI
        summary: issue.guidance || issue.title || issue.summary || 'No guidance provided',
        title: issue.guidance || issue.title || issue.summary || 'No guidance provided',
        description: issue.guidance || issue.description || '',
        details: issue.guidance || issue.description || '',
        fixes: issue.recommendation ? [issue.recommendation] : [], // Map recommendation to fixes for backward compatibility
      }))
    }
  } catch (e) {
    return {
      issues: [],
      error: 'Failed to parse audit results.',
    }
  }

  return {
    issues,
    error: null,
  }
}
