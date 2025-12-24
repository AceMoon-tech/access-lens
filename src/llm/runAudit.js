import { post } from "../lib/api";
import { API_ENDPOINTS } from "../lib/config";
import normalizeResults from "./normalizeResults";

/**
 * runAudit — Formats input → calls server API → normalizes output
 * Returns normalized schema with error handling.
 */
export async function runAudit(input) {
  try {
    // --- STEP 1: Format Input ----------------------------------------------
    let formattedInput = "";

    if (typeof input === "object" && input !== null) {
      const parts = [];
      if (input.ui) parts.push(`UI Description:\n${input.ui}`);
      if (input.copy) parts.push(`UI Copy:\n${input.copy}`);
      formattedInput = parts.join("\n\n");
    } else {
      formattedInput = input || "";
    }

    if (!formattedInput.trim()) {
      return normalizeResults({ 
        error: "Validation error",
        message: "No input provided for audit." 
      });
    }

    // --- STEP 2: Server-side LLM call -------------------------------------
    try {
      const result = await post(API_ENDPOINTS.RUN_AUDIT, { input: formattedInput });

      // --- STEP 3: Normalize + return ----------------------------------------
      return normalizeResults(result);
    } catch (apiError) {
      // Handle API errors (network, HTTP errors, etc.)
      console.error("API request error:", apiError);
      
      // If API returned structured error, use it (preserves error type)
      if (apiError.data) {
        return normalizeResults(apiError.data);
      }
      
      // Map error types to user-friendly messages
      const errorType = apiError.errorType || (apiError.status === 400 ? "validation_error" : "server_error")
      
      let errorMessage = "Failed to connect to audit service."
      if (errorType === 'network_error') {
        errorMessage = "Network error: Unable to reach the audit service. Please check your connection and try again."
      } else if (errorType === 'timeout_error') {
        errorMessage = "Request timed out. Please try again with a shorter description."
      } else if (errorType === 'config_error') {
        errorMessage = "Server configuration error. Please contact support."
      } else if (apiError.status === 400) {
        errorMessage = apiError.message || "Invalid input. Please check your description and try again."
      }
      
      return normalizeResults({
        error: errorType,
        message: errorMessage,
      });
    }
  } catch (error) {
    console.error("Audit execution error:", error);

    return normalizeResults({
      error: "Unexpected error",
      message: error.message || "An unexpected error occurred.",
    });
  }
}

export default runAudit;
