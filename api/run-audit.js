/**
 * Mock audit endpoint for frontend → backend → results rendering validation
 * Returns hardcoded AuditResult following auditContract.js structure
 * No LLM calls - pure mock data for testing
 */

/**
 * @typedef {Object} AuditResult
 * @property {Object} summary - Summary counts by severity
 * @property {number} summary.total - Total number of issues
 * @property {number} summary.high - High severity count
 * @property {number} summary.medium - Medium severity count
 * @property {number} summary.low - Low severity count
 * @property {Array} issues - Array of audit issues
 * @property {Object} metadata - Audit metadata
 * @property {string} metadata.model - Model identifier
 * @property {string} metadata.generatedAt - ISO 8601 timestamp
 */

/**
 * Generate mock audit result following auditContract.js structure
 * @returns {AuditResult} Mock audit result
 */
function generateMockAuditResult() {
  return {
    summary: {
      total: 4,
      high: 1,
      medium: 2,
      low: 1
    },
    issues: [
      {
        id: "issue-1",
        title: "Missing alternative text on images",
        severity: "high",
        wcagRef: "WCAG 2.2.1.1",
        description: "The login screen contains images without alternative text descriptions. Screen reader users will not be able to understand the content or purpose of these images.",
        recommendation: "Add descriptive alt attributes to all img elements. Use alt=\"\" for decorative images that don't convey meaningful information."
      },
      {
        id: "issue-2",
        title: "Insufficient color contrast for button text",
        severity: "medium",
        wcagRef: "WCAG 2.2.1.4.3",
        description: "The primary button text color does not meet the minimum contrast ratio of 4.5:1 against the background for normal text.",
        recommendation: "Increase the contrast ratio between the button text and background colors. Use a color contrast checker to verify the ratio meets WCAG 2.2 Level AA standards."
      },
      {
        id: "issue-3",
        title: "Form inputs lack associated labels",
        severity: "medium",
        wcagRef: "WCAG 2.2.1.3.1",
        description: "The email and password input fields do not have programmatically associated labels. This makes it difficult for screen reader users to understand what information is expected.",
        recommendation: "Associate labels with input fields using the 'for' attribute on label elements or by wrapping inputs within label elements. Ensure labels are descriptive and visible."
      },
      {
        id: "issue-4",
        title: "Keyboard focus indicator is not clearly visible",
        severity: "low",
        wcagRef: "WCAG 2.2.2.7",
        description: "When navigating with keyboard, the focus indicator on interactive elements is subtle and may be difficult to perceive for some users.",
        recommendation: "Enhance the keyboard focus indicator to be more prominent. Consider using a 2px solid outline or adding a high-contrast background highlight to ensure visibility."
      }
    ],
    metadata: {
      model: "mock-audit-service",
      generatedAt: new Date().toISOString()
    }
  }
}

export async function POST(req) {
  try {
    // Parse request body (not used for mock, but validates request format)
    const { input } = await req.json();

    if (!input || input.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "No input provided."
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Generate mock audit result
    const mockResult = generateMockAuditResult();

    // Return mock result as JSON
    return new Response(
      JSON.stringify(mockResult),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Mock endpoint error:", err);

    return new Response(
      JSON.stringify({
        error: "server_error",
        message: "An error occurred processing the request."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
