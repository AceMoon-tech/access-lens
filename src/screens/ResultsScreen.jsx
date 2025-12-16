import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Results from '../components/Results'

function ResultsScreen() {
  const location = useLocation()
  const navigate = useNavigate()

  const results = location.state?.results

  function handleNewAudit() {
    navigate('/audit')
  }

  // No results guard
  if (!results) {
    return (
      <div className="space-y-24">
        <p className="text-sev-high text-lg">
          No results found. Please run an audit first.
        </p>

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
    <div className="space-y-32">
      <Results results={results} />

      <div className="pt-16">
        <Button
          variant="primary"
          size="md"
          onClick={handleNewAudit}
        >
          Run New Audit
        </Button>
      </div>
    </div>
  )
}

export default ResultsScreen
