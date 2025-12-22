import { useState } from 'react'
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
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy JSON to clipboard"
        className="btn-base btn-primary btn-md"
      >
        Copy JSON
      </button>

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

