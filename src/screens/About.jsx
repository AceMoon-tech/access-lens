import PageContainer from '../components/PageContainer'

function About() {
  return (
    <PageContainer>
      <div className="space-y-24">
      {/* Overview Section */}
      <section>
        <h1 
          className="font-semibold mb-16"
          style={{
            fontSize: 'var(--text-h1)',
            lineHeight: 'var(--text-h1-leading)',
            fontWeight: 'var(--text-h1-weight)',
            color: 'var(--text-default)'
          }}
        >
          About Access Lens
        </h1>

        <p 
          className="mb-16"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          Access Lens is a lightweight accessibility auditor designed to help you
          evaluate UI concepts using natural language descriptions.
        </p>

        <p 
          className="mb-16"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          This tool provides early accessibility guidance based on screen descriptions.
          It is not an accessibility checker, validator, or certification tool, and does not determine compliance.
        </p>

        <ul 
          className="list-disc list-inside space-y-8"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          <li>React 19</li>
          <li>Vite for fast development</li>
          <li>Custom CSS (with a full design-token system)</li>
          <li>React Router for navigation</li>
          <li>State layer with lightweight stores</li>
        </ul>
      </section>

      {/* Privacy Section */}
      <section>
        <h2 
          className="font-semibold mb-16"
          style={{
            fontSize: 'var(--text-h2)',
            lineHeight: 'var(--text-h2-leading)',
            fontWeight: 'var(--text-h2-weight)',
            color: 'var(--text-default)'
          }}
        >
          Privacy & Data
        </h2>

        <div 
          className="space-y-16"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            <p className="mb-8">
              <strong style={{ color: 'var(--text-default)' }}>What we send:</strong>
            </p>
            <p>
              When you run an audit, we send your UI description and copy blocks to our audit service to generate accessibility feedback. This is the only data transmitted.
            </p>
          </div>

          <div>
            <p className="mb-8">
              <strong style={{ color: 'var(--text-default)' }}>What we store:</strong>
            </p>
            <p>
              Audit results are stored on our servers with a unique audit ID. This allows you to access your results later via the audit ID. We don't store your original input text separately—only the generated audit results.
            </p>
          </div>

          <div>
            <p className="mb-8">
              <strong style={{ color: 'var(--text-default)' }}>Your control:</strong>
            </p>
            <p>
              You can download or copy your audit results at any time. Results are accessible via the audit ID until you choose to delete them or they expire per our retention policy.
            </p>
          </div>
        </div>
      </section>

      {/* Project Structure Section */}
      <section>
        <h2 
          className="font-semibold mb-16"
          style={{
            fontSize: 'var(--text-h2)',
            lineHeight: 'var(--text-h2-leading)',
            fontWeight: 'var(--text-h2-weight)',
            color: 'var(--text-default)'
          }}
        >
          Project Structure
        </h2>

        <div 
          className="space-y-8"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          <p>
            <strong style={{ color: 'var(--text-default)' }}>components/</strong> – Reusable UI components
          </p>
          <p>
            <strong style={{ color: 'var(--text-default)' }}>screens/</strong> – Page-level application views
          </p>
          <p>
            <strong style={{ color: 'var(--text-default)' }}>state/</strong> – Theme + global stores
          </p>
          <p>
            <strong style={{ color: 'var(--text-default)' }}>lib/</strong> – LLM logic and shared utilities
          </p>
          <p>
            <strong style={{ color: 'var(--text-default)' }}>styles/</strong> – Global CSS variables and tokens
          </p>
        </div>
      </section>
      </div>
    </PageContainer>
  );
}

export default About;
