import { Component } from 'react'

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Global UI Error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-24 max-w-content mx-auto text-default">
          <h1 className="text-3xl font-semibold text-sev-high mb-16">
            Something went wrong.
          </h1>
          <p className="text-muted">
            The interface encountered an unexpected error.  
            Try refreshing the page.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default GlobalErrorBoundary
