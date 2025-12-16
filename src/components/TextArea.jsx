function TextArea({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  className = '',
  required = false,
  id,
  ariaDescribedBy,
  ariaInvalid = false,
}) {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId}
          className="form-label"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className="form-input-base"
      />
    </div>
  )
}

export default TextArea
