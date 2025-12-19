/**
 * API utility functions
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

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
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
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






