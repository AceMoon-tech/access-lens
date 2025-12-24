/**
 * Environment configuration
 * Production-ready environment variable handling
 * All values read from import.meta.env (Vite client-side)
 */

/**
 * Environment mode detection
 */
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const mode = import.meta.env.MODE

/**
 * Configuration error class for graceful error handling
 */
export class ConfigError extends Error {
  constructor(message, missingVar) {
    super(message)
    this.name = 'ConfigError'
    this.missingVar = missingVar
  }
}

/**
 * Get API base URL from environment variable
 * Always defaults to '/api' for relative path resolution
 * VITE_API_BASE_URL can override if needed, but relative paths work on same domain
 */
function getApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  // If explicitly set, use it (allows override for testing or different domains)
  if (apiBaseUrl && apiBaseUrl.trim() !== '') {
    return apiBaseUrl.trim()
  }

  // Default to relative path - works in both dev and production on same domain
  return '/api'
}

/**
 * API base URL
 * Always returns a valid base URL (defaults to '/api' for relative paths)
 */
export const API_BASE_URL = getApiBaseUrl()

/**
 * API endpoints
 * Centralized endpoint definitions (relative to API_BASE_URL)
 */
export const API_ENDPOINTS = {
  RUN_AUDIT: '/run-audit',
  AUDITS: '/audits',
  AUDIT_BY_ID: (id) => `/audits/${id}`,
}

/**
 * Validate environment configuration
 * Called in main.jsx before app renders
 */
export function validateEnv() {
  if (isDevelopment) {
    console.log('[Config] Environment configuration validated')
    console.log('[Config] API_BASE_URL:', API_BASE_URL)
    console.log('[Config] Mode:', mode)
  }
  
  // Configuration is always valid (defaults to '/api' if not set)
  return true
}

// Note: Validation is called in main.jsx on app initialization
// This ensures errors are caught before the app renders

