import React from "react";
import ReactDOM from "react-dom/client";

// Global styles (tokens and premium components already imported via index.css)
import "./index.css";

// Import config - validate environment variables on app load
// If validation fails, show error UI instead of rendering app
import { validateEnv, ConfigError } from "./lib/config.js";

import App from "./App.jsx";
import { AppProvider } from "./state/AppContext";

// Validate environment configuration before rendering app
let configError = null;
try {
  validateEnv();
} catch (error) {
  if (error instanceof ConfigError || error.name === 'ConfigError') {
    configError = error;
  } else {
    // Re-throw non-config errors
    throw error;
  }
}

// Show configuration error UI if validation failed
if (configError) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        font-family: system-ui, -apple-system, sans-serif;
        background: #0E1116;
        color: #E4E7EB;
      ">
        <h1 style="font-size: 1.5rem; margin-bottom: 1rem; color: #EF4444;">
          Configuration Error
        </h1>
        <p style="text-align: center; max-width: 600px; line-height: 1.6; color: #9CA3AF;">
          ${configError.message}
        </p>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: #6B7280;">
          Missing variable: <code style="background: #1E2430; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${configError.missingVar || 'Unknown'}</code>
        </p>
      </div>
    `;
  }
} else {
  // Render app only if configuration is valid
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
}
