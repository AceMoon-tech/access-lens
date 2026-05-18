/**
 * WCAG 2.2 success criterion numbers → short names for result display.
 */

const WCAG_CRITERION_NAMES = {
  '1.1.1': 'Non-text Content',
  '1.3.1': 'Info and Relationships',
  '1.4.3': 'Contrast (Minimum)',
  '1.4.11': 'Non-text Contrast',
  '2.4.3': 'Focus Order',
  '2.4.4': 'Link Purpose (In Context)',
  '2.5.5': 'Target Size',
  '3.3.1': 'Error Identification',
  '3.3.2': 'Labels or Instructions',
  '3.3.3': 'Error Suggestion',
  '4.1.2': 'Name, Role, Value',
}

const WCAG_CRITERION_ID_PATTERN = /(\d+\.\d+\.\d+)/

/**
 * @param {string} ref - Raw WCAG reference from audit results
 * @returns {string} "id — Name" when mapped, otherwise the original ref
 */
export function formatWcagRef(ref) {
  if (ref == null) return ''
  const raw = String(ref).trim()
  if (!raw) return ''

  const match = raw.match(WCAG_CRITERION_ID_PATTERN)
  if (!match) return raw

  const id = match[1]
  const name = WCAG_CRITERION_NAMES[id]
  if (!name) return raw

  return `${id} — ${name}`
}
