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
 * In production, fails gracefully if not set
 * In development, falls back to '/api' with warning
 */
function getApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (isProduction) {
    // In production, require explicit configuration
    if (!apiBaseUrl || apiBaseUrl.trim() === '') {
      throw new ConfigError(
        'VITE_API_BASE_URL is required in production but is not set. ' +
        'Please configure this environment variable in your deployment settings.',
        'VITE_API_BASE_URL'
      )
    }
    return apiBaseUrl.trim()
  }

  // Development: fallback to default with warning
  if (!apiBaseUrl) {
    console.warn(
      '[Config] VITE_API_BASE_URL not set, using default: /api'
    )
    return '/api'
  }

  return apiBaseUrl.trim()
}

/**
 * API base URL
 * Safe evaluation - never throws during module load
 * Errors are deferred to validateEnv() call
 */
function getApiBaseUrlSafe() {
  try {
    return getApiBaseUrl()
  } catch (error) {
    // In development, always return default
    if (isDevelopment) {
      console.warn('[Config] Error getting API_BASE_URL, using default:', error.message)
      return '/api'
    }
    // In production, return null to signal error (will be caught in validateEnv)
    return null
  }
}

// Export API base URL - safe for module load
// In development: always returns '/api' (never throws)
// In production: returns null if missing (error caught in validateEnv)
export const API_BASE_URL = getApiBaseUrlSafe() || '/api'

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
 * Throws ConfigError in production if required vars are missing
 * Called in main.jsx before app renders
 */
export function validateEnv() {
  // Check if API_BASE_URL is properly configured
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (isProduction) {
    // In production, require explicit configuration
    if (!apiBaseUrl || apiBaseUrl.trim() === '') {
      throw new ConfigError(
        'VITE_API_BASE_URL is required in production but is not set. ' +
        'Please configure this environment variable in your deployment settings.',
        'VITE_API_BASE_URL'
      )
    }
  }

  if (isDevelopment) {
    console.log('[Config] Environment configuration validated')
    console.log('[Config] API_BASE_URL:', API_BASE_URL)
    console.log('[Config] Mode:', mode)
  }
  
  // If we get here, configuration is valid
  return true
}

// Note: Validation is called in main.jsx on app initialization
// This ensures errors are caught before the app renders

