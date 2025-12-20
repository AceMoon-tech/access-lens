import useStableId from '../lib/useStableId'

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
  const textareaId = useStableId(id)
  const describedBy = ariaDescribedBy || undefined

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
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
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        className="form-input-base"
      />
    </div>
  )
}

export default TextArea
