import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Results from '../components/Results'
import Toast from '../components/Toast'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import Card from '../components/Card'
import CopyJsonButton from '../components/CopyJsonButton'
import { trackExportJson } from '../lib/analytics'
import { getAuditById } from '../lib/api/audits'

function ResultsScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [downloaded, setDownloaded] = useState(false)
  const errorAlertRef = useRef(null)

  // Get audit_id from URL params (primary) or location state (temporary bridge)
  const auditId = params.auditId || location.state?.audit_id

  // Fetch audit results by ID from server
  useEffect(() => {
    if (!auditId) {
      setError('No audit ID provided')
      return
    }

    async function fetchAudit() {
      setLoading(true)
      setError(null)
      
      try {
        // TODO: Once getAuditById() is fully implemented, this will fetch from server
        // For now, stub implementation throws error, so use location.state as temporary bridge
        const auditData = await getAuditById(auditId)
        setResults(auditData.results)
      } catch (err) {
        // Stub implementation: Use results from location.state as temporary bridge
        // TODO: Remove this fallback once server persistence is implemented
        if (location.state?.results) {
          setResults(location.state.results)
        } else {
          setError(err.message || 'Failed to load audit results')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAudit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditId]) // Only re-fetch if auditId changes

  function handleNewAudit() {
    navigate('/audit')
  }

  function handleDownloadJSON() {
    if (!results) return

    // Serialize results to JSON
    const jsonString = JSON.stringify(results, null, 2)
    
    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob)
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = 'access-lens-audit.json'
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Track export event
    trackExportJson()
    
    // Show success toast
    setDownloaded(true)
  }

  // Get JSON string for copy action
  const jsonString = results ? JSON.stringify(results, null, 2) : ''

  // Focus error Alert when error state appears
  useEffect(() => {
    if (error && errorAlertRef.current) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        errorAlertRef.current?.focus()
      }, 0)
    }
  }, [error])

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-64 gap-16">
        <Loading size="md" />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading audit results…
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-24">
        <div
          ref={errorAlertRef}
          tabIndex="-1"
        >
          <Alert variant="error">
            {error}
          </Alert>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleNewAudit}
        >
          Start New Audit
        </Button>
      </div>
    )
  }

  // No results guard
  if (!results) {
    return (
      <div className="space-y-24">
        <Alert variant="error">
          No results found. Please run an audit first.
        </Alert>

        <Button
          variant="primary"
          size="md"
          onClick={handleNewAudit}
        >
          Start New Audit
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-24">
      <Results results={results} />

      <Card className="rounded-sm p-24">
        <h2 
          className="font-semibold mb-12"
          style={{
            fontSize: 'var(--text-h2)',
            lineHeight: 'var(--text-h2-leading)',
            fontWeight: 'var(--text-h2-weight)',
            color: 'var(--text-default)'
          }}
        >
          Save your results
        </h2>
        <p 
          className="mb-16"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          These results are temporarily stored in your browser. To keep them permanently:
        </p>
        <ul 
          className="list-disc space-y-8 pl-24 mb-16"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          <li>Use the <strong style={{ color: 'var(--text-default)' }}>Download JSON</strong> button to save results as a file</li>
          <li>Use the <strong style={{ color: 'var(--text-default)' }}>Copy JSON</strong> button below to copy results to your clipboard</li>
          <li>Results may be cleared when you close your browser or start a new audit</li>
        </ul>

        <div className="pt-16 flex flex-col gap-16">
          <div className="flex gap-16">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadJSON}
              disabled={!results}
            >
              Download JSON
            </Button>
            <CopyJsonButton text={jsonString} />
            <Button
              variant="primary"
              size="md"
              onClick={handleNewAudit}
            >
              Run New Audit
            </Button>
          </div>
        </div>
      </Card>

      {downloaded && (
        <Toast 
          message="Downloaded successfully"
          onDismiss={() => setDownloaded(false)}
        />
      )}
    </div>
  )
}

export default ResultsScreen
