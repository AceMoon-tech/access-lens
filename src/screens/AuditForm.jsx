import { useState, useEffect } from 'react'
import Button from '../components/Button'
import TextArea from '../components/TextArea'
import PageContainer from '../components/PageContainer'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import runAudit from '../llm/runAudit'
import { formMessages } from '../lib/formMessages'
import { trackAuditStarted, trackAuditFailed } from '../lib/analytics'
import { createAudit } from '../lib/api/audits'
import { useApp } from '../state/AppContext'

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
  
  // Sync local state with context when context changes
  useEffect(() => {
    setUiDescription(auditFormInputs.uiDescription)
    setCopyBlocks(auditFormInputs.copyBlocks)
  }, [auditFormInputs])
  
  // Field-level error states (hidden by default)
  const [uiDescriptionError, setUiDescriptionError] = useState('')
  const [wcagVersionError, setWcagVersionError] = useState('')
  const [hasBlurredDescription, setHasBlurredDescription] = useState(false)
  const [hasBlurredWcag, setHasBlurredWcag] = useState(false)

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
      const results = await runAudit({
        ui: uiDescription,
        copy: copyBlocks
      })

      // Persist results to server and get audit_id
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
    } catch (err) {
      console.error(err)
      setErrorMessage('Audit failed. Please try again.')
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
        <TextArea
          id="ui-description"
          label="Briefly describe the screen or interface you want reviewed for accessibility (required)"
          placeholder="Example: A mobile login screen with email field, password field, and a primary button."
          value={uiDescription}
          onChange={handleUiDescriptionChange}
          onBlur={handleUiDescriptionBlur}
          required={true}
          errorText={uiDescriptionError || undefined}
          isLoading={requestState === 'loading'}
        />

        <TextArea
          id="ui-copy"
          label="Add any extra details that may affect accessibility, such as user goals, constraints, or edge cases (optional)"
          placeholder="Example: Used in low-light environments by keyboard-only users"
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
          <div className="flex flex-col gap-16">
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

        <div className="space-y-8">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Your audit runs locally. Results appear on the next screen and can be exported.
          </p>

          <div 
            className="text-sm p-12 rounded-sm"
            style={{ 
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface-1)',
              border: '1px solid var(--border-default)'
            }}
          >
            <p className="mb-8">
              <strong style={{ color: 'var(--text-default)' }}>Privacy:</strong>
            </p>
            <p>
              Your UI description and copy blocks are sent to our audit service to generate feedback. Audit results are stored on our servers with a unique ID. We don't store your original input text—only the generated results.
            </p>
          </div>
          
          <div 
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <p className="mb-8">
              <strong style={{ color: 'var(--text-default)' }}>After the audit completes:</strong>
            </p>
            <ul className="list-disc space-y-4 pl-24">
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
