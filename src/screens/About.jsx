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
          Access Lens is a lightweight tool for early accessibility guidance on UI concepts described in natural language.
        </p>

        <p 
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          This tool provides hypothetical, design-phase accessibility guidance based on screen descriptions.
          It is not an accessibility checker, validator, or certification tool, and does not determine compliance.
        </p>
      </section>

      {/* Positioning: vs general AI */}
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
          Why not just use a general AI tool?
        </h2>

        <p 
          className="mb-16"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          General AI tools can provide accessibility advice, but they often depend on how well the prompt is written. Access Lens gives that process structure. It helps turn screen descriptions into focused accessibility guidance, using consistent output fields like potential consideration, affected users, rationale, suggested fix, and related WCAG criteria for discussion.
        </p>

        <p 
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          It is not a compliance checker or automated validator. It is a design-phase assistant for surfacing risks earlier, before design or code hardens.
        </p>
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
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <p style={{ marginBottom: 'var(--space-8)' }}>
              <strong style={{ color: 'var(--text-default)' }}>What we send:</strong>
            </p>
            <p>
              When you request guidance, we send your UI description and copy blocks to our guidance service to generate accessibility feedback. This is the only data transmitted.
            </p>
          </div>

          <div style={{ marginBottom: 'var(--space-16)' }}>
            <p style={{ marginBottom: 'var(--space-8)' }}>
              <strong style={{ color: 'var(--text-default)' }}>What we store:</strong>
            </p>
            <p>
              Guidance results are stored on our servers with a unique results ID. This allows you to access your results later via the results ID. We don't store your original input text separately—only the generated guidance results.
            </p>
          </div>

          <div>
            <p style={{ marginBottom: 'var(--space-8)' }}>
              <strong style={{ color: 'var(--text-default)' }}>Your control:</strong>
            </p>
            <p>
              You can download or copy your guidance results at any time. Results are accessible via the results ID until you choose to delete them or they expire per our retention policy.
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
