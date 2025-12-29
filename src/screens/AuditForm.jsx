import { useState, useEffect, useRef } from 'react'
import Button from '../components/Button'
import TextArea from '../components/TextArea'
import PageContainer from '../components/PageContainer'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import Card from '../components/Card'
import { formMessages } from '../lib/formMessages'
import { trackAuditStarted, trackAuditFailed } from '../lib/analytics'
import { createAudit } from '../lib/api/audits'
import { useApp } from '../state/AppContext'

// Info icon for guidance
function InfoIcon({ className = '' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

// Chevron icon for expandable
function ChevronIcon({ isOpen, className = '' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease'
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// Form feedback placeholder copy available:
// - formMessages.requiredError: "This field is required"
// - formMessages.tooBriefHint: "Add a bit more detail to help identify potential accessibility issues"
// - formMessages.overlyDetailedWarning: "A brief screen-level description works best. Focus on key elements and interactions"
// - formMessages.loadingMessage: "Running audit…"
// - formMessages.successConfirmation: "Ready to audit"

function AuditForm({ onResults }) {
  const { auditFormInputs, updateAuditFormInputs, setAuditResults } = useApp()
  
  // Initialize form from context
  const [uiDescription, setUiDescription] = useState(auditFormInputs.uiDescription)
  const [copyBlocks, setCopyBlocks] = useState(auditFormInputs.copyBlocks)
  const [requestState, setRequestState] = useState('idle') // "idle" | "loading" | "error" | "success"
  const [errorMessage, setErrorMessage] = useState('')
  const errorId = 'audit-form-error'
  const errorAlertRef = useRef(null)
  
  // Sync local state with context when context changes
  useEffect(() => {
    setUiDescription(auditFormInputs.uiDescription)
    setCopyBlocks(auditFormInputs.copyBlocks)
  }, [auditFormInputs])

  // Focus error Alert when error state appears
  useEffect(() => {
    if (requestState === 'error' && errorMessage && errorAlertRef.current) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        errorAlertRef.current?.focus()
      }, 0)
    }
  }, [requestState, errorMessage])
  
  // Field-level error states (hidden by default)
  const [uiDescriptionError, setUiDescriptionError] = useState('')
  const [wcagVersionError, setWcagVersionError] = useState('')
  const [hasBlurredDescription, setHasBlurredDescription] = useState(false)
  const [hasBlurredWcag, setHasBlurredWcag] = useState(false)
  const [showInputGuidance, setShowInputGuidance] = useState(false)

  // Validation function for ui-description
  function validateUiDescription(value) {
    const trimmed = value.trim()
    if (!trimmed) {
      return formMessages.requiredError
    }
    if (trimmed.length < 20) {
      return formMessages.tooBriefHint
    }
    return ''
  }

  // Validation function for WCAG version select (if present)
  function validateWcagVersion(value) {
    if (!value || value.trim() === '') {
      return formMessages.requiredError
    }
    return ''
  }

  // Handle blur validation for ui-description
  function handleUiDescriptionBlur() {
    setHasBlurredDescription(true)
    const error = validateUiDescription(uiDescription)
    setUiDescriptionError(error)
  }

  // Handle blur validation for WCAG version (if present)
  function handleWcagVersionBlur() {
    setHasBlurredWcag(true)
    // Uncomment when WCAG select is added:
    // const error = validateWcagVersion(wcagVersion)
    // setWcagVersionError(error)
  }

  // Handle input change - clear error if field becomes valid
  function handleUiDescriptionChange(e) {
    const value = e.target.value
    setUiDescription(value)
    // Persist to context
    updateAuditFormInputs({ uiDescription: value })
    // Clear error if field becomes valid and has been blurred
    if (hasBlurredDescription) {
      const error = validateUiDescription(value)
      setUiDescriptionError(error)
    }
  }
  
  // Handle copy blocks change - persist to context
  function handleCopyBlocksChange(e) {
    const value = e.target.value
    setCopyBlocks(value)
    updateAuditFormInputs({ copyBlocks: value })
  }

  // Check if form is valid (required fields must pass validation)
  // WCAG version validation only applies if field is present
  const isFormValid = validateUiDescription(uiDescription) === ''

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate required fields before submit
    const descriptionError = validateUiDescription(uiDescription)
    // const wcagError = validateWcagVersion(wcagVersion) // Uncomment when WCAG select is added
    
    if (descriptionError) {
      setUiDescriptionError(descriptionError)
      setHasBlurredDescription(true)
      return
    }
    
    // If WCAG select is present, validate it
    // if (wcagError) {
    //   setWcagVersionError(wcagError)
    //   setHasBlurredWcag(true)
    //   return
    // }

    setUiDescriptionError('')
    setWcagVersionError('')
    setErrorMessage('')
    setRequestState('loading')

    // Track audit started
    trackAuditStarted({
      hasCopyBlocks: !!copyBlocks.trim()
    })

    try {
      let results
      try {
        const response = await fetch('/api/run-audit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: uiDescription,
            context: copyBlocks
          })
        })
        
        results = await response.json()
        
        if (!response.ok) {
          results = {
            error: results.error || 'server_error',
            message: results.message || 'An error occurred with the audit service.'
          }
        }
      } catch (apiError) {
        // Convert API errors to expected format
        results = {
          error: 'network_error',
          message: apiError.message || 'An error occurred with the audit service.'
        }
      }

      // Check if audit returned an error
      if (results.error) {
        // Map error types to user-friendly messages
        let userMessage = results.message || results.error || 'Audit failed. Please try again.'
        
        // Enhance error messages based on error type
        if (results.error === 'network_error') {
          userMessage = 'Network error: Unable to reach the audit service. Please check your connection and try again.'
        } else if (results.error === 'timeout_error') {
          userMessage = 'Request timed out. The audit is taking too long. Please try again with a shorter description.'
        } else if (results.error === 'config_error') {
          userMessage = 'Server configuration error. The audit service is not properly configured. Please contact support.'
        } else if (results.error === 'validation_error') {
          userMessage = results.message || 'Invalid input. Please provide a more detailed description and try again.'
        } else if (results.error === 'invalid_response') {
          userMessage = 'The audit service returned an invalid response. Please try again.'
        } else if (results.error === 'rate_limit_error') {
          userMessage = 'The audit service is temporarily unavailable due to high demand. Please try again in a moment.'
        } else if (results.error === 'api_error') {
          userMessage = 'The AI service returned an error. Please try again.'
        }
        
        setErrorMessage(userMessage)
        setRequestState('error')
        
        // Track audit failed
        trackAuditFailed({
          error: results.error,
          message: results.message
        })
        // User input is preserved - form state is not cleared
        return
      }

      // Audit succeeded - persist results to server and get audit_id
      try {
        const auditResponse = await createAudit(
          { ui: uiDescription, copy: copyBlocks },
          results
        )

        // Persist results to context
        setAuditResults(results)
        setRequestState('success')
        
        // Navigate with audit_id instead of full results
        onResults({
          audit_id: auditResponse.audit_id,
          results: auditResponse.results
        })
      } catch (persistError) {
        // If persistence fails, still show results but log the error
        console.error('Failed to persist audit:', persistError)
        setAuditResults(results)
        setRequestState('success')
        
        // Navigate with results (temporary bridge until persistence works)
        onResults({
          audit_id: `temp_${Date.now()}`,
          results: results
        })
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.')
      setRequestState('error')
      
      // Track audit failed
      trackAuditFailed({
        error: err.message || 'Unknown error'
      })
    }
  }

  // Retry handler - re-triggers the audit request
  function handleRetry() {
    const fakeEvent = {
      preventDefault: () => {}
    }
    handleSubmit(fakeEvent)
  }

  return (
    <PageContainer>
      <form
        onSubmit={handleSubmit}
        aria-busy={requestState === 'loading'}
        className="space-y-32"
        noValidate
      >
        <div className="flex flex-col gap-16">
          <TextArea
            id="ui-description"
            label="Describe the screen or interface you want reviewed (required)"
            placeholder="Example: A mobile login screen with email field, password field, and a primary button."
            value={uiDescription}
            onChange={handleUiDescriptionChange}
            onBlur={handleUiDescriptionBlur}
            required={true}
            errorText={uiDescriptionError || undefined}
            isLoading={requestState === 'loading'}
          />
          
          {/* Discoverable guidance toggle */}
          <button
            type="button"
            onClick={() => setShowInputGuidance(!showInputGuidance)}
            className="flex items-center gap-8 text-sm"
            style={{
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
            aria-expanded={showInputGuidance}
            aria-controls="input-guidance"
          >
            <InfoIcon style={{ color: 'var(--text-muted)' }} />
            <span>What works best for audits?</span>
            <ChevronIcon isOpen={showInputGuidance} style={{ color: 'var(--text-muted)' }} />
          </button>

          {/* Expandable guidance content */}
          {showInputGuidance && (
            <Card
              id="input-guidance"
              className="rounded-sm p-16"
            >
              <div className="space-y-12">
                <div>
                  <p className="text-sm font-medium mb-8" style={{ color: 'var(--text-default)' }}>
                    Best results come from:
                  </p>
                  <ul className="list-disc space-y-4 pl-20 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <li>Single screens or small user flows (2–3 steps)</li>
                    <li>Specific UI components, interactions, and states</li>
                    <li>Clear descriptions of user actions and goals</li>
                    <li>Context about user constraints or environments</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium mb-8" style={{ color: 'var(--text-default)' }}>
                    Less effective for:
                  </p>
                  <ul className="list-disc space-y-4 pl-20 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <li>Entire products or complex multi-screen workflows</li>
                    <li>High-level feature descriptions without UI details</li>
                    <li>Abstract concepts without concrete interface elements</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>

        <TextArea
          id="ui-copy"
          label="Add context about user goals, constraints, or edge cases (optional)"
          placeholder="Example: Users navigate with keyboard only, or used in low-light environments"
          value={copyBlocks}
          onChange={handleCopyBlocksChange}
          required={false}
          isLoading={requestState === 'loading'}
        />

        {/* Loading state UI */}
        {requestState === 'loading' && (
          <div className="flex items-center gap-16" role="status" aria-live="polite">
            <Loading size="sm" />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {formMessages.loadingMessage}
            </p>
          </div>
        )}

        {/* Error state UI with Retry button */}
        {requestState === 'error' && errorMessage && (
          <div 
            ref={errorAlertRef}
            tabIndex="-1"
            className="flex flex-col gap-16"
          >
            <Alert id={errorId} variant="error">
              {errorMessage}
            </Alert>
            <Button
              variant="primary"
              size="md"
              type="button"
              onClick={handleRetry}
            >
              Retry audit
            </Button>
          </div>
        )}

        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={requestState === 'loading' || !isFormValid}
          aria-busy={requestState === 'loading'}
          className={requestState === 'loading' ? 'btn-loading' : ''}
        >
          {requestState === 'loading' ? formMessages.loadingMessage : 'Run Audit'}
        </Button>

        <div className="space-y-24">
          {/* Helper text block */}
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Your audit runs locally. Results appear on the next screen and can be exported.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Guidance only — not a compliance check.
            </p>
          </div>

          {/* Privacy section */}
          <Card className="rounded-sm p-16">
            <p className="mb-8 text-sm" style={{ color: 'var(--text-default)' }}>
              <strong>Privacy:</strong>
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Your UI description and copy blocks are sent to our audit service to generate feedback. Audit results are stored on our servers with a unique ID. We don't store your original input text—only the generated results.
            </p>
          </Card>
          
          {/* After the audit completes section */}
          <div 
            style={{ 
              fontSize: 'var(--text-body)',
              lineHeight: 'var(--text-body-leading)',
              color: 'var(--text-muted)'
            }}
          >
            <p className="mb-8">
              <strong style={{ color: 'var(--text-default)' }}>After the audit completes:</strong>
            </p>
            <ul className="list-disc space-y-8 pl-24">
              <li>Results are displayed on the next screen</li>
              <li>Results are stored on our servers and accessible via audit ID</li>
              <li>To keep results permanently, use the "Download JSON" button or copy the output</li>
              <li>Results may be cleared when you close your browser or start a new audit</li>
            </ul>
          </div>
        </div>
      </form>
    </PageContainer>
  )
}

export default AuditForm
