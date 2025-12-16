import { useState } from 'react'

function CopyAllButton({ text }) {
  const [copied, setCopied] = useState(false)
  const statusId = 'copy-status'

  async function handleCopy() {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy full audit JSON to clipboard"
        aria-describedby={copied ? statusId : undefined}
        className="btn-base btn-primary btn-sm"
      >
        {copied ? 'Copied!' : 'Copy All'}
      </button>

      {copied && (
        <span 
          id={statusId}
          role="status" 
          aria-live="polite" 
          className="sr-only"
        >
          Copied to clipboard
        </span>
      )}
    </>
  )
}

export default CopyAllButton
