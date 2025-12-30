function Footer() {
  return (
    <footer className="page-container__main" style={{ paddingTop: 'var(--space-32)', paddingBottom: 'var(--space-32)' }}>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--text-sm-leading)',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}
      >
        Access Lens is in beta. Results are guidance only and may change.{' '}
        <a
          href="mailto:feedback@accesslens.dev"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'underline'
          }}
        >
          Send feedback
        </a>
        .
      </p>
    </footer>
  )
}

export default Footer

