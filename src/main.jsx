import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { validateEnv, ConfigError } from "./lib/config.js";
import App from "./App.jsx";
import { AppProvider } from "./state/AppContext";

// Validate environment configuration before rendering app
let configError = null;

try {
  validateEnv();
} catch (error) {
  if (
    error instanceof ConfigError ||
    error.name === "ConfigError" ||
    error.constructor?.name === "ConfigError"
  ) {
    configError = error;
  } else {
    throw error;
  }
}

const rootEl = document.getElementById("root");

// --- CONFIG ERROR SCREEN (ACCESSIBLE) ---
// NOTE: Missing tokens for this pre-React error screen:
// - --error-screen-bg (currently #0E1116, closest: --bg-default #0E131A)
// - --error-screen-text (currently #E4E7EB, closest: --text-default #D1D9E6)
// - --error-screen-heading-color (currently #EF4444, closest: --sev-high #E11D48)
// - --error-screen-muted (currently #9CA3AF, closest: --text-muted #9BA7B5)
// - --error-screen-muted-alt (currently #6B7280, no close match)
// - --error-screen-max-width (currently 600px, no token exists)
if (configError && rootEl) {
  rootEl.innerHTML = `
    <div
      role="alert"
      aria-live="assertive"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: var(--space-32);
        font-family: var(--font-base);
        background: var(--bg-default);
        color: var(--text-default);
        text-align: center;
      "
    >
      <h1 style="font-size: var(--text-h2); margin-bottom: var(--space-16); color: var(--sev-high);">
        Configuration Error
      </h1>

      <p style="max-width: 600px; line-height: var(--text-body-leading); color: var(--text-muted);">
        ${configError.message}
      </p>

      <p style="margin-top: var(--space-16); font-size: var(--text-sm); color: var(--text-muted);">
        Missing variable:
        <code style="background: var(--bg-surface-3); padding: var(--space-4) var(--space-8); border-radius: var(--radius-xs);">
          ${configError.missingVar || "Unknown"}
        </code>
      </p>
    </div>
  `;
} else if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
}
