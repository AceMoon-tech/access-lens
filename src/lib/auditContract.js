/**
 * Audit Result Contract
 * Shared type definitions for audit results used by frontend and backend
 * This is a contract definition only - no implementation or API connections
 */

/**
 * Severity level for an audit issue
 * @typedef {'low' | 'medium' | 'high'} AuditSeverity
 */

/**
 * WCAG reference for an audit issue
 * @typedef {string} WCAGRef - WCAG 2.2 criterion reference (e.g., "WCAG 2.2.1.1")
 */

/**
 * Individual audit issue
 * @typedef {Object} AuditIssue
 * @property {string} id - Unique identifier for the issue
 * @property {string} title - Brief title/summary of the issue
 * @property {AuditSeverity} severity - Severity level (low, medium, high)
 * @property {WCAGRef} wcagRef - WCAG 2.2 criterion reference
 * @property {string} description - Detailed description of the accessibility issue
 * @property {string} recommendation - Recommended fix or solution
 */

/**
 * Summary counts of audit issues by severity
 * @typedef {Object} AuditSummaryCounts
 * @property {number} total - Total number of issues found
 * @property {number} high - Number of high severity issues
 * @property {number} medium - Number of medium severity issues
 * @property {number} low - Number of low severity issues
 */

/**
 * Metadata about the audit execution
 * @typedef {Object} AuditMetadata
 * @property {string} model - Model identifier used for the audit (e.g., "gpt-4o-mini")
 * @property {string} generatedAt - ISO 8601 timestamp when the audit was generated
 */

/**
 * Complete audit result structure
 * @typedef {Object} AuditResult
 * @property {AuditSummaryCounts} summary - Summary counts of issues by severity
 * @property {AuditIssue[]} issues - Array of individual audit issues
 * @property {AuditMetadata} metadata - Metadata about the audit execution
 */

/**
 * Example AuditResult structure (for reference only):
 * @example
 * {
 *   summary: {
 *     total: 3,
 *     high: 1,
 *     medium: 1,
 *     low: 1
 *   },
 *   issues: [
 *     {
 *       id: "issue-1",
 *       title: "Missing alt text on images",
 *       severity: "high",
 *       wcagRef: "WCAG 2.2.1.1",
 *       description: "Images in the login screen lack alternative text descriptions.",
 *       recommendation: "Add descriptive alt attributes to all img elements."
 *     }
 *   ],
 *   metadata: {
 *     model: "gpt-4o-mini",
 *     generatedAt: "2024-01-15T10:30:00Z"
 *   }
 * }
 */

// Note: This file contains type definitions only (JSDoc)
// These types are for documentation and can be used in JSDoc comments throughout the codebase
// Runtime validation should be implemented separately using the auditSchema.js validation functions

