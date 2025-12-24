/**
 * Strict audit response contract schema
 * Defines the exact structure for audit results with no extra keys allowed
 */

/**
 * JSON Schema for audit response validation
 */
export const auditResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['issues'],
  properties: {
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'summary', 'description', 'severity', 'wcagRefs', 'confidence'],
        properties: {
          id: {
            type: 'string',
            minLength: 1
          },
          summary: {
            type: 'string',
            minLength: 1
          },
          description: {
            type: 'string'
          },
          severity: {
            type: 'string',
            enum: ['low', 'medium', 'high']
          },
          wcagRefs: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          confidence: {
            type: 'number',
            minimum: 0,
            maximum: 1
          }
        }
      }
    }
  }
}

/**
 * Validate audit response against schema
 * @param {any} data - Data to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateAuditResponse(data) {
  const errors = []

  // Check root object
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Root must be an object'] }
  }

  // Check for extra keys at root level
  const allowedRootKeys = ['issues']
  const rootKeys = Object.keys(data)
  const extraRootKeys = rootKeys.filter(key => !allowedRootKeys.includes(key))
  if (extraRootKeys.length > 0) {
    errors.push(`Extra keys at root level: ${extraRootKeys.join(', ')}`)
  }

  // Check issues array
  if (!('issues' in data)) {
    errors.push('Missing required property: issues')
  } else if (!Array.isArray(data.issues)) {
    errors.push('Property "issues" must be an array')
  } else {
    // Validate each issue
    data.issues.forEach((issue, index) => {
      if (!issue || typeof issue !== 'object') {
        errors.push(`Issue at index ${index} must be an object`)
        return
      }

      // Check for extra keys
      const allowedIssueKeys = ['id', 'summary', 'description', 'severity', 'wcagRefs', 'confidence']
      const issueKeys = Object.keys(issue)
      const extraIssueKeys = issueKeys.filter(key => !allowedIssueKeys.includes(key))
      if (extraIssueKeys.length > 0) {
        errors.push(`Issue at index ${index} has extra keys: ${extraIssueKeys.join(', ')}`)
      }

      // Validate required fields
      if (!('id' in issue) || typeof issue.id !== 'string' || issue.id.trim() === '') {
        errors.push(`Issue at index ${index}: "id" must be a non-empty string`)
      }

      if (!('summary' in issue) || typeof issue.summary !== 'string' || issue.summary.trim() === '') {
        errors.push(`Issue at index ${index}: "summary" must be a non-empty string`)
      }

      if (!('description' in issue) || typeof issue.description !== 'string') {
        errors.push(`Issue at index ${index}: "description" must be a string`)
      }

      if (!('severity' in issue) || !['low', 'medium', 'high'].includes(issue.severity)) {
        errors.push(`Issue at index ${index}: "severity" must be "low", "medium", or "high"`)
      }

      if (!('wcagRefs' in issue) || !Array.isArray(issue.wcagRefs)) {
        errors.push(`Issue at index ${index}: "wcagRefs" must be an array`)
      } else {
        issue.wcagRefs.forEach((ref, refIndex) => {
          if (typeof ref !== 'string') {
            errors.push(`Issue at index ${index}, wcagRefs[${refIndex}]: must be a string`)
          }
        })
      }

      if (!('confidence' in issue) || typeof issue.confidence !== 'number') {
        errors.push(`Issue at index ${index}: "confidence" must be a number`)
      } else if (issue.confidence < 0 || issue.confidence > 1) {
        errors.push(`Issue at index ${index}: "confidence" must be between 0 and 1`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * TypeScript-style type definition (for reference/documentation)
 * @typedef {Object} AuditIssue
 * @property {string} id - Unique identifier for the issue
 * @property {string} summary - Brief summary of the issue
 * @property {string} description - Detailed description of the issue
 * @property {'low'|'medium'|'high'} severity - Severity level
 * @property {string[]} wcagRefs - Array of WCAG reference strings
 * @property {number} confidence - Confidence score between 0 and 1
 */

/**
 * @typedef {Object} AuditResponse
 * @property {AuditIssue[]} issues - Array of audit issues
 */

