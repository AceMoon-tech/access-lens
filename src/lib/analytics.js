/**
 * Analytics hooks for key events
 * Stub functions only - no external services
 * Ready for future analytics integration
 */

/**
 * Track when an audit is started
 * @param {Object} data - Optional event data
 */
export function trackAuditStarted(data = {}) {
  // Stub function - no-op
  // Future: Send event to analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] audit_started', data)
  }
}

/**
 * Track when an audit fails
 * @param {Object} data - Optional event data (e.g., error message)
 */
export function trackAuditFailed(data = {}) {
  // Stub function - no-op
  // Future: Send event to analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] audit_failed', data)
  }
}

/**
 * Track when JSON is exported/downloaded
 * @param {Object} data - Optional event data
 */
export function trackExportJson(data = {}) {
  // Stub function - no-op
  // Future: Send event to analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] export_json', data)
  }
}

/**
 * Track when JSON is copied to clipboard
 * @param {Object} data - Optional event data
 */
export function trackCopyJson(data = {}) {
  // Stub function - no-op
  // Future: Send event to analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] copy_json', data)
  }
}

