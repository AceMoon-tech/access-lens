function Select({ 
  label, 
  value, 
  onChange, 
  children, 
  className = '',
  id,
  required = false,
  ariaDescribedBy,
}) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId}
          className="form-label"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-describedby={ariaDescribedBy}
        className="form-input-base form-select"
      >
        {children}
      </select>
    </div>
  )
}

export default Select
