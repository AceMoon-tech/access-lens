import { useState, useEffect, useRef } from 'react'
import Button from '../components/Button'
import TextArea from '../components/TextArea'
import PageContainer from '../components/PageContainer'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import Card from '../components/Card'
import { formMessages } from '../lib/formMessages'
import { improveInput } from '../lib/improveInput.js'
import { trackAuditStarted, trackAuditFailed } from '../lib/analytics'
import { createAudit } from '../lib/api/audits'
import { useApp } from '../state/AppContext'

// Chevron icon for expandable (e.g. privacy disclosure)
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

const GUIDED_QUESTIONS = [
  'What screen or flow is this?',
  'What should we picture on that screen?',
  'What are users trying to do?',
  'Any constraints or edge cases? (optional)'
]

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
  const [showPrivacyDisclosure, setShowPrivacyDisclosure] = useState(false)
  const [improveLoading, setImproveLoading] = useState(false)
  const [improveErrorMessage, setImproveErrorMessage] = useState('')
  const [reviewMode, setReviewMode] = useState('unset') // "unset" | "quick" | "guided"
  const [guidedStep, setGuidedStep] = useState(1) // 1–5 (1–4 questions, 5 review)
  const [guidedAnswers, setGuidedAnswers] = useState(['', '', '', ''])

  // Validation function for ui-description
  function validateUiDescription(value) {
    const trimmed = value.trim()
    if (!trimmed) {
      return formMessages.requiredError
    }
    if (trimmed.length < 20) {
      return formMessages.tooBriefHint
    }

    const text = trimmed.toLowerCase()

    // Check for non-UI domain keywords
    const nonUIKeywords = ['database', 'schema', 'sql', 'api', 'backend', 'server', 'infrastructure', 'endpoint', 'query']
    if (nonUIKeywords.some(keyword => text.includes(keyword))) {
      return formMessages.invalidInputHint
    }

    // Check for UI-related keywords
    const uiKeywords = ['screen', 'page', 'form', 'button', 'input', 'modal', 'dialog', 'table', 'navigation', 'nav', 'menu', 'list', 'chart', 'link']
    const hasUIKeywords = uiKeywords.some(keyword => text.includes(keyword))
    if (!hasUIKeywords) {
      return formMessages.invalidInputHint
    }

    // Check for gibberish: excessive repeated characters (e.g., gggggggg)
    const repeatedCharPattern = /(.)\1{6,}/
    if (repeatedCharPattern.test(text)) {
      return formMessages.invalidInputHint
    }

    // Check for high ratio of symbols/numbers (potential gibberish)
    const specialCharCount = (text.match(/[^a-z0-9\s]/g) || []).length
    const numberCount = (text.match(/[0-9]/g) || []).length
    const totalChars = text.replace(/\s/g, '').length
    if (totalChars > 0 && (specialCharCount + numberCount) / totalChars > 0.5) {
      return formMessages.invalidInputHint
    }

    // Check for recognizable words (at least 2 words of 3+ characters)
    const words = text.split(/\s+/).filter(word => word.length >= 3)
    if (words.length < 2) {
      return formMessages.invalidInputHint
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
    setImproveErrorMessage('')
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

  function handleBuildAuditDescription() {
    const [a1, a2, a3, a4] = guidedAnswers
    const parts = [a1, a2, a3].map((s) => s.trim()).filter(Boolean)
    const nextDescription = parts.join('\n\n')
    const nextCopy = (a4 ?? '').trim()
    setUiDescription(nextDescription)
    setCopyBlocks(nextCopy)
    updateAuditFormInputs({ uiDescription: nextDescription, copyBlocks: nextCopy })
    setUiDescriptionError(validateUiDescription(nextDescription))
    setGuidedStep(5)
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
        setErrorMessage("Audit failed to run. We couldn't generate results right now. Please try again in a moment.")
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
      setErrorMessage("Audit failed to run. We couldn't generate results right now. Please try again in a moment.")
      setRequestState('error')
      
      // Track audit failed
      trackAuditFailed({
        error: err.message || 'Unknown error'
      })
    }
  }

  async function handleImproveInputClick() {
    setImproveErrorMessage('')
    if (!uiDescription.trim()) return

    setImproveLoading(true)
    try {
      const next = await improveInput(uiDescription)
      setUiDescription(next)
      updateAuditFormInputs({ uiDescription: next })
      if (hasBlurredDescription) {
        setUiDescriptionError(validateUiDescription(next))
      }
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.message ||
        'Unable to improve your description right now. Please try again.'
      setImproveErrorMessage(msg)
    } finally {
      setImproveLoading(false)
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
      {/* Page title */}
      <div className="mb-32">
        <h1 
          className="font-semibold mb-16"
          style={{
            fontSize: 'var(--text-h1)',
            lineHeight: 'var(--text-h1-leading)',
            fontWeight: 'var(--text-h1-weight)',
            color: 'var(--text-default)'
          }}
        >
          Run Accessibility Audit
        </h1>

        <p 
          className="mb-16"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          Early accessibility guidance for screens, flows, and UI concepts.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        aria-busy={requestState === 'loading'}
        className="flex flex-col"
        noValidate
      >
        <div className="mb-32">
          {reviewMode === 'unset' ? (
            <>
          <h2
            id="review-mode-heading"
            className="font-semibold mb-16"
            style={{
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2-leading)',
              fontWeight: 'var(--text-h2-weight)',
              color: 'var(--text-default)'
            }}
          >
            Choose how you want to start
          </h2>
          <div
            className="review-mode-options-grid"
            role="group"
            aria-labelledby="review-mode-heading"
          >
            <button
              type="button"
              className="review-mode-option"
              aria-pressed={false}
              disabled={requestState === 'loading'}
              onClick={() => setReviewMode('quick')}
            >
              <span className="review-mode-option__title">Quick Review</span>
              <span className="review-mode-option__description">
                Paste or describe a screen yourself. Best when you already know what you want reviewed.
              </span>
            </button>
            <button
              type="button"
              className="review-mode-option"
              aria-pressed={false}
              disabled={requestState === 'loading'}
              onClick={() => setReviewMode('guided')}
            >
              <span className="review-mode-option__title">Guided Review</span>
              <span className="review-mode-option__description">
                Answer a few questions and Access Lens builds the audit description. Best when you want help shaping the input.
              </span>
            </button>
          </div>
            </>
          ) : (
            <div className="review-mode-active-header">
              <p
                id="review-mode-heading"
                className="font-semibold"
                style={{
                  fontSize: 'var(--text-h2)',
                  lineHeight: 'var(--text-h2-leading)',
                  fontWeight: 'var(--text-h2-weight)',
                  color: 'var(--text-default)'
                }}
              >
                {reviewMode === 'quick' ? 'Quick Review' : 'Guided Review'}
              </p>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                disabled={requestState === 'loading'}
                onClick={() => setReviewMode('unset')}
              >
                Switch type
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-32">
        {/* Describe section */}
        <div className="flex flex-col gap-16">
          {reviewMode === 'quick' ? (
            <>
          <TextArea
            id="ui-description"
            label="Describe the screen or flow"
            placeholder="Example: A mobile login screen with email field, password field, and a primary button."
            value={uiDescription}
            onChange={handleUiDescriptionChange}
            onBlur={handleUiDescriptionBlur}
            required={true}
            errorText={uiDescriptionError || undefined}
            isLoading={requestState === 'loading'}
          />

          <div className="flex flex-col items-start gap-8">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={
                requestState === 'loading' ||
                improveLoading ||
                !uiDescription.trim()
              }
              aria-busy={improveLoading}
              onClick={handleImproveInputClick}
            >
              {improveLoading ? 'Improving…' : 'Improve my input'}
            </Button>
            {improveErrorMessage ? (
              <Alert variant="error">{improveErrorMessage}</Alert>
            ) : null}
          </div>
            </>
          ) : reviewMode === 'guided' ? (
            <>
              {guidedStep === 5 ? (
                <>
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-muted)' }}
                    aria-live="polite"
                  >
                    Step 5 of 5
                  </p>
                  <h2
                    className="font-semibold mb-16"
                    style={{
                      fontSize: 'var(--text-h2)',
                      lineHeight: 'var(--text-h2-leading)',
                      fontWeight: 'var(--text-h2-weight)',
                      color: 'var(--text-default)'
                    }}
                  >
                    Review your audit description
                  </h2>
                  {uiDescriptionError ? (
                    <div className="mb-16">
                      <Alert variant="error">{uiDescriptionError}</Alert>
                    </div>
                  ) : null}
                  <Card className="rounded-sm p-16 mb-16">
                    <p
                      className="text-sm font-medium mb-8"
                      style={{ color: 'var(--text-default)' }}
                    >
                      Audit description
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: 'var(--text-muted)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 'var(--text-body-leading)'
                      }}
                    >
                      {uiDescription}
                    </p>
                  </Card>
                  {copyBlocks.trim() ? (
                    <Card className="rounded-sm p-16 mb-16">
                      <p
                        className="text-sm font-medium mb-8"
                        style={{ color: 'var(--text-default)' }}
                      >
                        Optional context
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          color: 'var(--text-muted)',
                          whiteSpace: 'pre-wrap',
                          lineHeight: 'var(--text-body-leading)'
                        }}
                      >
                        {copyBlocks}
                      </p>
                    </Card>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-16">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      disabled={requestState === 'loading'}
                      onClick={() => setGuidedStep(4)}
                    >
                      Back
                    </Button>
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
                  </div>
                </>
              ) : (
                <>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--text-muted)' }}
                aria-live="polite"
              >
                Step {guidedStep} of 5
              </p>
              <TextArea
                id={`guided-answer-${guidedStep}`}
                label={GUIDED_QUESTIONS[guidedStep - 1]}
                placeholder=""
                value={guidedAnswers[guidedStep - 1]}
                onChange={(e) => {
                  const idx = guidedStep - 1
                  setGuidedAnswers((prev) => {
                    const next = [...prev]
                    next[idx] = e.target.value
                    return next
                  })
                }}
                required={false}
                isLoading={requestState === 'loading'}
              />
              <div className="flex flex-wrap items-center gap-16">
                {guidedStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  disabled={requestState === 'loading'}
                  onClick={() => setGuidedStep((s) => Math.max(1, s - 1))}
                >
                  Back
                </Button>
                ) : null}
                {guidedStep < 4 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    disabled={
                      requestState === 'loading' ||
                      !guidedAnswers[guidedStep - 1].trim()
                    }
                    onClick={() =>
                      setGuidedStep((s) => (s < 4 ? s + 1 : s))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    disabled={
                      requestState === 'loading' ||
                      !guidedAnswers
                        .slice(0, 3)
                        .every((s) => s.trim().length > 0)
                    }
                    onClick={handleBuildAuditDescription}
                  >
                    Build description
                  </Button>
                )}
              </div>
                </>
              )}
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-16">
          {/* Optional context section */}
          {reviewMode === 'quick' ? (
          <div className="flex flex-col gap-16">
            <TextArea
              id="ui-copy"
              label="Add context about user goals, constraints, or edge cases (optional)"
              placeholder="Example: Users navigate with keyboard only, or used in low-light environments"
              value={copyBlocks}
              onChange={handleCopyBlocksChange}
              required={false}
              isLoading={requestState === 'loading'}
            />
          </div>
          ) : null}

          {/* Submit section */}
          {reviewMode === 'quick' || (reviewMode === 'guided' && guidedStep === 5) ? (
          <div className="space-y-24">
          {/* Loading state UI */}
          {requestState === 'loading' && (
            <div className="flex items-center gap-16" role="status" aria-live="polite">
              <Loading size="sm" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {formMessages.loadingMessage}
              </p>
            </div>
          )}

          {/* Error state UI */}
          {requestState === 'error' && errorMessage && (
            <div 
              ref={errorAlertRef}
              tabIndex="-1"
            >
              <Alert id={errorId} variant="error">
                {errorMessage}
              </Alert>
            </div>
          )}

          {/* Warning: Field 2 has content but Field 1 is empty */}
          {copyBlocks.trim().length > 0 && !uiDescription.trim() && (
            <Alert variant="warning">
              Add a screen description above to run an audit. This field is optional context.
            </Alert>
          )}

          {reviewMode === 'quick' ? (
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
          ) : null}
          </div>
          ) : null}
        </div>
        </div>

        {/* Supporting info section */}
        {reviewMode === 'quick' ? (
        <div className="space-y-24 mt-64">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Guidance only — not a compliance check.
          </p>

          <button
            type="button"
            onClick={() => setShowPrivacyDisclosure(!showPrivacyDisclosure)}
            className="flex items-center gap-8 text-sm"
            style={{
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
            aria-expanded={showPrivacyDisclosure}
            aria-controls="privacy-disclosure-panel"
          >
            <span>Privacy and data</span>
            <ChevronIcon isOpen={showPrivacyDisclosure} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showPrivacyDisclosure && (
            <Card
              id="privacy-disclosure-panel"
              className="rounded-sm p-16"
            >
              <p className="mb-8 text-sm" style={{ color: 'var(--text-default)' }}>
                <strong>Privacy:</strong>
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Your screen description and optional context are sent to our audit service to generate results. We store generated audit results with a unique ID, not your original input text separately.
              </p>
            </Card>
          )}
        </div>
        ) : null}
      </form>
    </PageContainer>
  )
}

export default AuditForm
