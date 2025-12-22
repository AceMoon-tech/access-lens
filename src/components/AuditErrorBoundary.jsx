import { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

// Wrapper component to use navigate hook
function ErrorFallbackWithNavigation({ onReset }) {
  const navigate = useNavigate()

  function handleStartNewAudit() {
    onReset()
    navigate('/audit')
  }

  return (
    <div 
      className="flex flex-col items-center justify-center py-64 gap-24"
      role="alert"
      aria-live="assertive"
    >
      <h1 
        className="font-semibold text-center"
        style={{
          fontSize: 'var(--text-h1)',
          lineHeight: 'var(--text-h1-leading)',
          fontWeight: 'var(--text-h1-weight)',
          color: 'var(--text-default)'
        }}
      >
        Something went wrong
      </h1>
      
      <p 
        className="text-center max-w-content"
        style={{
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--text-body-leading)',
          color: 'var(--text-muted)'
        }}
      >
        An error occurred while processing your audit. Please try starting a new audit.
      </p>

      <Button
        variant="primary"
        size="md"
        onClick={handleStartNewAudit}
      >
        Start new audit
      </Button>
    </div>
  )
}

class AuditErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging, but don't show in UI
    console.error('Audit ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackWithNavigation onReset={this.handleReset} />
    }

    return this.props.children
  }
}

export default AuditErrorBoundary

