import useStableId from '../lib/useStableId'

// Error icon (alert circle)
function ErrorIcon({ className = '' }) {
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
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// Warning icon (alert triangle)
function WarningIcon({ className = '' }) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

// Success icon (check circle)
function SuccessIcon({ className = '' }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

// Info icon (info circle)
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

function TextArea({
  label,
  value,
  onChange,
  onBlur,
  placeholder = '',
  className = '',
  required = false,
  id,
  ariaDescribedBy,
  ariaInvalid = false,
  helperText,
  errorText,
  warningText,
  successText,
  isLoading = false,
}) {
  const textareaId = useStableId(id)
  const describedBy = ariaDescribedBy || undefined
  
  // Normalize errorText to ensure empty strings are treated as falsy
  const hasError = errorText && errorText.trim().length > 0
  const hasWarning = warningText && warningText.trim().length > 0
  const hasSuccess = successText && successText.trim().length > 0
  
  // Determine input state class - error takes priority
  let inputStateClass = ''
  if (hasError) {
    inputStateClass = 'is-error'
  } else if (hasWarning) {
    inputStateClass = 'is-warning'
  } else if (hasSuccess) {
    inputStateClass = 'is-success'
  }
  
  // Build describedBy IDs for accessibility
  const feedbackIds = []
  if (helperText && helperText.trim().length > 0) feedbackIds.push(`${textareaId}-helper`)
  if (hasError) feedbackIds.push(`${textareaId}-error`)
  if (hasWarning) feedbackIds.push(`${textareaId}-warning`)
  if (hasSuccess) feedbackIds.push(`${textareaId}-success`)
  const allDescribedBy = [describedBy, ...feedbackIds].filter(Boolean).join(' ') || undefined

  return (
    <div className={`flex flex-col gap-16 ${className} ${isLoading ? 'form-loading' : ''}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="form-label"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={hasError || ariaInvalid}
        aria-describedby={allDescribedBy}
        className={`form-input-base ${inputStateClass}`.trim()}
        disabled={isLoading}
      />
      
      {helperText && helperText.trim().length > 0 && (
        <div 
          id={`${textareaId}-helper`} 
          className="form-helper-text"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-8)'
          }}
        >
          <InfoIcon 
            style={{ 
              flexShrink: 0,
              marginTop: '2px',
              color: 'var(--text-muted)'
            }} 
          />
          <span>{helperText}</span>
        </div>
      )}
      
      {hasError && (
        <div 
          id={`${textareaId}-error`} 
          className="form-error-text" 
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-8)'
          }}
        >
          <ErrorIcon 
            style={{ 
              flexShrink: 0,
              marginTop: '2px',
              color: 'var(--sev-high)'
            }} 
          />
          <span>{errorText}</span>
        </div>
      )}
      
      {hasWarning && (
        <div 
          id={`${textareaId}-warning`} 
          className="form-warning-text"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-8)'
          }}
        >
          <WarningIcon 
            style={{ 
              flexShrink: 0,
              marginTop: '2px',
              color: 'var(--sev-med)'
            }} 
          />
          <span>{warningText}</span>
        </div>
      )}
      
      {hasSuccess && (
        <div 
          id={`${textareaId}-success`} 
          className="form-success-text"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-8)'
          }}
        >
          <SuccessIcon 
            style={{ 
              flexShrink: 0,
              marginTop: '2px',
              color: 'var(--sev-low)'
            }} 
          />
          <span>{successText}</span>
        </div>
      )}
    </div>
  )
}

export default TextArea
