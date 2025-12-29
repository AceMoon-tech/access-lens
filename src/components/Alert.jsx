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

function Alert({ 
  variant = 'error', 
  children, 
  id,
  className = '',
  role
}) {
  const alertId = useStableId(id)
  
  const variants = {
    error: {
      icon: ErrorIcon,
      iconColor: 'var(--sev-high)',
      textColor: 'var(--sev-high)',
      borderColor: 'var(--sev-high)',
      backgroundColor: 'transparent',
      defaultRole: 'alert'
    },
    success: {
      icon: SuccessIcon,
      iconColor: 'var(--sev-low)',
      textColor: 'var(--sev-low)',
      borderColor: 'var(--sev-low)',
      backgroundColor: 'transparent',
      defaultRole: 'status'
    },
    info: {
      icon: InfoIcon,
      iconColor: 'var(--text-muted)',
      textColor: 'var(--text-muted)',
      borderColor: 'var(--border-default)',
      backgroundColor: 'transparent',
      defaultRole: 'status'
    }
  }

  const config = variants[variant] || variants.error
  const Icon = config.icon
  const alertRole = role || config.defaultRole

  return (
    <div
      id={alertId}
      role={alertRole}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={`alert alert--${variant} ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-8)',
        padding: 'var(--space-8) var(--space-12)',
        border: `1px solid ${config.borderColor}`,
        borderRadius: 'var(--radius-sm)',
        backgroundColor: config.backgroundColor,
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--text-sm-leading)',
        color: config.textColor
      }}
    >
      <Icon 
        style={{ 
          flexShrink: 0,
          marginTop: 'var(--space-4)',
          color: config.iconColor
        }} 
      />
      <span>{children}</span>
    </div>
  )
}

export default Alert

