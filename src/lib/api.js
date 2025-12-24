/**
 * API utility functions
 */

import { API_BASE_URL } from './config.js'

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      // Try to parse error response
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: 'API Error', message: `${response.status} ${response.statusText}` }
      }
      
      const error = new Error(errorData.message || errorData.error || `API Error: ${response.status}`)
      error.status = response.status
      error.data = errorData
      error.errorType = errorData.error // Preserve error type from API
      throw error
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    // Detect network errors (fetch failures)
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch'))) {
      const networkError = new Error('Network error: Unable to reach the server. Please check your connection.')
      networkError.status = 0
      networkError.data = {
        error: 'network_error',
        message: 'Network error: Unable to reach the server. Please check your connection.'
      }
      networkError.errorType = 'network_error'
      throw networkError
    }

    // Detect timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      const timeoutError = new Error('Request timed out. Please try again.')
      timeoutError.status = 504
      timeoutError.data = {
        error: 'timeout_error',
        message: 'Request timed out. Please try again.'
      }
      timeoutError.errorType = 'timeout_error'
      throw timeoutError
    }

    console.error('API Error:', error)
    throw error
  }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export function get(endpoint, options = {}) {
  return fetchAPI(endpoint, { ...options, method: 'GET' })
}

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export function post(endpoint, body, options = {}) {
  return fetchAPI(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export function put(endpoint, body, options = {}) {
  return fetchAPI(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export function del(endpoint, options = {}) {
  return fetchAPI(endpoint, { ...options, method: 'DELETE' })
}






