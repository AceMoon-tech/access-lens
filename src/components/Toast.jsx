import { useEffect } from 'react'
import useStableId from '../lib/useStableId'

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

function Toast({ 
  message,
  id,
  onDismiss,
  duration = 3000
}) {
  const toastId = useStableId(id)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) {
        onDismiss()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div
      id={toastId}
      role="status"
      aria-live="polite"
      className="toast"
      style={{
        position: 'fixed',
        bottom: 'var(--space-24)',
        right: 'var(--space-24)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-8)',
        padding: 'var(--space-12) var(--space-16)',
        backgroundColor: 'var(--bg-surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-md)',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--text-sm-leading)',
        color: 'var(--text-default)',
        zIndex: 1000,
        maxWidth: '320px'
      }}
    >
      <SuccessIcon 
        style={{ 
          flexShrink: 0,
          color: 'var(--sev-low)'
        }} 
      />
      <span>{message}</span>
    </div>
  )
}

export default Toast

