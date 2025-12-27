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
  console.log("NORMALIZE INPUT FIRST ISSUE:", raw?.issues?.[0]);

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
        guidance: issue.guidance || '',
        whoItAffects: issue.whoItAffects || '',
        whyItMatters: issue.whyItMatters || '',
        severity: issue.severity || 'low',
        wcagRefs: Array.isArray(issue.wcagRefs) ? issue.wcagRefs : [],
      }))
      
    }
  } catch (e) {
    return {
      issues: [],
      error: 'Failed to parse audit results.',
    }
  }

  console.log("NORMALIZE OUTPUT FIRST ISSUE:", issues?.[0]);

  return {
    issues,
    error: null,
  }
}
