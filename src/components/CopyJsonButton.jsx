import { useState } from 'react'
import Button from './Button'
import Toast from './Toast'
import { trackCopyJson } from '../lib/analytics'

function CopyJsonButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      
      // Track copy event
      trackCopyJson()
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <>
      <Button
        variant="primary"
        size="md"
        type="button"
        onClick={handleCopy}
        aria-label="Copy JSON to clipboard"
      >
        Copy JSON
      </Button>

      {copied && (
        <Toast 
          message="Copied to clipboard"
          onDismiss={() => setCopied(false)}
        />
      )}
    </>
  )
}

export default CopyJsonButton

