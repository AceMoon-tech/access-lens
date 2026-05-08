/**
 * Calls the Improve my input API helper
 */

import { post } from './api.js'

const IMPROVE_INPUT_PATH = '/improve-input'

/**
 * @param {string} input
 * @returns {Promise<string>}
 */
export async function improveInput(input) {
  let data
  try {
    data = await post(IMPROVE_INPUT_PATH, { input })
  } catch (apiError) {
    console.error('improve-input request error:', apiError)
    throw apiError
  }

  const { improvedInput } = data
  if (typeof improvedInput !== 'string' || !improvedInput.trim()) {
    const err = new Error('Unable to improve description.')
    err.status = 502
    err.data = {
      error: 'invalid_response',
      message: 'Unable to improve description.',
    }
    err.errorType = 'invalid_response'
    throw err
  }

  return improvedInput.trim()
}
