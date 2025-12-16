import { useState } from 'react'
import Button from '../components/Button'
import TextArea from '../components/TextArea'
import runAudit from '../llm/runAudit'

function AuditForm({ onResults }) {
  const [uiDescription, setUiDescription] = useState('')
  const [copyBlocks, setCopyBlocks] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const errorId = 'audit-form-error'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const results = await runAudit({
        ui: uiDescription,
        copy: copyBlocks
      })

      onResults(results)
    } catch (err) {
      console.error(err)
      setError('Audit failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isLoading}
      className="space-y-24"
    >
      <TextArea
        id="ui-description"
        label="Describe the UI or screen (required)"
        placeholder="Example: A mobile login screen with email field, password field, and a primary button."
        value={uiDescription}
        onChange={(e) => setUiDescription(e.target.value)}
        required={true}
      />

      <TextArea
        id="ui-copy"
        label="Paste any UI copy (optional)"
        placeholder="Example: 'Sign In', 'Forgot Password?', etc."
        value={copyBlocks}
        onChange={(e) => setCopyBlocks(e.target.value)}
        required={false}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-sev-high text-sm"
        >
          {error}
        </p>
      )}

      <Button
        variant="primary"
        size="md"
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Running audit…' : 'Run Audit'}
      </Button>
    </form>
  )
}

export default AuditForm
