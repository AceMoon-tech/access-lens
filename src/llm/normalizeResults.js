/**
 * Normalize raw LLM audit results into a safe, predictable structure.
 * This prevents UI crashes from malformed LLM output.
 */

export const severityColors = {
  low: 'text-[var(--sev-low)]',
  med: 'text-[var(--sev-med)]',
  high: 'text-[var(--sev-high)]',
  medium: 'text-[var(--sev-med)]', // Handle "medium" from LLM
}

export default function normalizeResults(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      issues: [],
      error: 'Invalid LLM response shape.',
    }
  }

  // If LLM returned its own error structure
  if (raw.error) {
    return {
      issues: [],
      error: raw.error,
    }
  }

  let issues = []

  // Defensive parsing
  try {
    if (Array.isArray(raw.issues)) {
      issues = raw.issues.map((issue) => ({
        id: issue.id || crypto.randomUUID(),
        title: issue.title || 'Untitled Issue',
        severity: issue.severity || 'low',
        details: issue.details || '',
        fixes: issue.fixes || [],
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
