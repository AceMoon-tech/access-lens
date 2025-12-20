import useStableId from '../lib/useStableId'

function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className = '',
  required = false,
  id,
  ariaDescribedBy,
  ariaInvalid = false,
}) {
  const selectId = useStableId(id)
  const describedBy = ariaDescribedBy || undefined

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
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
        required={required}
        aria-required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        className="form-input-base"
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
    </div>
  )
}

export default Select
