function Loading({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-12 h-12',
  }

  // Add w-16, h-16, w-32, h-32 utilities if needed

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-default rounded-full loading-spinner`}
        style={{ borderTopColor: 'var(--accent-600)' }}
      />
    </div>
  )
}

export default Loading
