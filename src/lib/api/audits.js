/**
 * Audit API service
 * Placeholder implementation with stub methods
 * TODO: Implement real backend integration
 */

import { post, get } from '../api.js'
import { API_ENDPOINTS } from '../config.js'

/**
 * Create a new audit and persist results to server
 * @param {Object} auditData - Audit input data (ui, copy, etc.)
 * @param {Object} results - Audit results from LLM
 * @returns {Promise<Object>} Response with audit_id and results
 */
export async function createAudit(auditData, results) {
  // TODO: Implement real API call
  // POST /api/audits
  // Body: { input: auditData, results: results }
  // Returns: { audit_id: string, results: {...}, created_at: string }
  
  // Stub implementation - mock response
  const mockAuditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    audit_id: mockAuditId,
    results: results,
    created_at: new Date().toISOString()
  }
  
  // Real implementation would be:
  // return post(API_ENDPOINTS.AUDITS, {
  //   input: auditData,
  //   results: results
  // })
}

/**
 * Get audit by ID from server
 * @param {string} auditId - Audit ID
 * @returns {Promise<Object>} Audit data with results
 */
export async function getAuditById(auditId) {
  // TODO: Implement real API call
  // GET /api/audits/:auditId
  // Returns: { audit_id: string, results: {...}, created_at: string }
  
  if (!auditId) {
    throw new Error('Audit ID is required')
  }
  
  // Stub implementation - mock response
  // In real implementation, this would fetch from server
  // For now, return error to indicate not found (since we don't have persistence)
  throw new Error(`Audit ${auditId} not found. TODO: Implement server persistence.`)
  
  // Real implementation would be:
  // return get(API_ENDPOINTS.AUDIT_BY_ID(auditId))
}

