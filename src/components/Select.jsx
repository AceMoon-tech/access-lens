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

function Select({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Select…',
  className = '',
  required = false,
  id,
  ariaDescribedBy,
  ariaInvalid = false,
  errorText,
}) {
  const selectId = useStableId(id)
  const describedBy = ariaDescribedBy || undefined
  
  // Normalize errorText to ensure empty strings are treated as falsy
  const hasError = errorText && errorText.trim().length > 0
  
  // Build describedBy IDs for accessibility
  const feedbackIds = []
  if (hasError) feedbackIds.push(`${selectId}-error`)
  const allDescribedBy = [describedBy, ...feedbackIds].filter(Boolean).join(' ') || undefined

  return (
    <div className={`flex flex-col gap-16 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="form-label"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        aria-required={required}
        aria-invalid={hasError || ariaInvalid}
        aria-describedby={allDescribedBy}
        className={`form-input-base ${hasError ? 'is-error' : ''}`.trim()}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <div 
          id={`${selectId}-error`} 
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
    </div>
  )
}

export default Select
