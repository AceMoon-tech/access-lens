import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";

import "./index.css";

import { validateEnv, ConfigError } from "./lib/config.js";
import App from "./App.jsx";
import { AppProvider } from "./state/AppContext";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";

// Initialize Sentry (production and preview only)
const isProduction = import.meta.env.PROD;
const isPreview = import.meta.env.VITE_VERCEL_ENV === "preview";
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const isSentryEnabled = (isProduction || isPreview) && sentryDsn;

if (isSentryEnabled) {
  Sentry.init({
    dsn: sentryDsn,
    environment: isPreview ? "preview" : "production",
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    beforeSend(event, hint) {
      // Remove user input, request bodies, and form values from events
      if (event.request) {
        delete event.request.data;
        delete event.request.body;
        delete event.request.cookies;
      }
      if (event.contexts) {
        delete event.contexts.request?.data;
        delete event.contexts.request?.body;
      }
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      // Don't capture breadcrumbs for console input or DOM input values
      if (breadcrumb.category === "console" || breadcrumb.category === "ui.input") {
        return null;
      }
      // Remove input values from DOM breadcrumbs
      if (breadcrumb.data && breadcrumb.data.value) {
        delete breadcrumb.data.value;
      }
      return breadcrumb;
    },
  });
}

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
  // TEMPORARY: Sentry test error - REMOVE AFTER VERIFICATION
  // Uncomment the line below to test Sentry integration:
  // throw new Error("Sentry test");

  const AppWithErrorBoundary = isSentryEnabled ? (
    <Sentry.ErrorBoundary fallback={null} showDialog={false}>
      <GlobalErrorBoundary>
        <AppProvider>
          <App />
        </AppProvider>
      </GlobalErrorBoundary>
    </Sentry.ErrorBoundary>
  ) : (
    <GlobalErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </GlobalErrorBoundary>
  );

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      {AppWithErrorBoundary}
    </React.StrictMode>
  );
}
