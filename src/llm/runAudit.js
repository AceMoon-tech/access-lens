import { post } from "../lib/api";
import normalizeResults from "./normalizeResults";

/**
 * runAudit — Formats input → calls server API → normalizes output
 * Returns normalized schema.
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
      return normalizeResults({ error: "No input provided for audit." });
    }

    // --- STEP 2: Server-side LLM call -------------------------------------
    const result = await post("/run-audit", { input: formattedInput });

    // --- STEP 3: Normalize + return ----------------------------------------
    return normalizeResults(result);
  } catch (error) {
    console.error("Audit execution error:", error);

    return normalizeResults({
      error: error.message || "Audit failed.",
    });
  }
}

export default runAudit;
