import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Alert from '../components/Alert'
import TextArea from '../components/TextArea'
import Loading from '../components/Loading'
import IssueCard from '../components/IssueCard'

const h1Style = {
  fontSize: 'var(--text-h1)',
  lineHeight: 'var(--text-h1-leading)',
  fontWeight: 'var(--text-h1-weight)',
  color: 'var(--text-default)',
}

const h2Style = {
  fontSize: 'var(--text-h2)',
  lineHeight: 'var(--text-h2-leading)',
  fontWeight: 'var(--text-h2-weight)',
  color: 'var(--text-default)',
}

const h3Style = {
  fontSize: 'var(--text-body)',
  fontWeight: 'var(--weight-semibold)',
  color: 'var(--text-default)',
}

const mutedBody = {
  fontSize: 'var(--text-body)',
  lineHeight: 'var(--text-body-leading)',
  color: 'var(--text-muted)',
}

const DEMO_ISSUE = {
  id: 'system-demo',
  severity: 'medium',
  guidance: 'If present, ensure controls have visible labels or accessible names.',
  whoItAffects: 'People using assistive technology may be affected.',
  whyItMatters: 'Could impact completion if names are unclear.',
  suggestedFix: 'Consider visible labels paired with each interactive control.',
  wcagRefs: ['3.3.2'],
}

/** Design system reference page (components + foundation tokens). */
function System() {
  const [demoInput, setDemoInput] = useState('')
  return (
    <div className="space-y-24">
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
          Design System
        </h1>
        <p style={{ ...mutedBody, marginBottom: 0 }}>
          Component and pattern reference for Access Lens. Foundation tokens are at the bottom.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Positioning</h2>
        <Card className="rounded-sm">
          <p style={{ ...mutedBody, marginBottom: 'var(--space-8)' }}>
            <strong style={{ color: 'var(--text-default)' }}>Guidance only</strong> — not a compliance check, validator, or certification tool.
          </p>
          <p style={{ ...mutedBody, marginBottom: 0 }}>
            <strong style={{ color: 'var(--text-default)' }}>Severity</strong> means <em>potential impact</em> (high / medium / low), not pass, fail, or WCAG conformance.
          </p>
        </Card>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Buttons</h2>
        <p className="mb-16" style={mutedBody}>
          Primary (main action), secondary (alternate), tertiary (low emphasis). Sizes: md, sm.
        </p>
        <div className="flex flex-wrap gap-16 mb-16">
          <Button variant="primary" size="md" type="button">Primary</Button>
          <Button variant="secondary" size="md" type="button">Secondary</Button>
          <Button variant="tertiary" size="md" type="button">Tertiary</Button>
          <Button variant="primary" size="sm" type="button">Primary sm</Button>
        </div>
        <div className="flex flex-wrap gap-16">
          <Button variant="primary" size="md" type="button" disabled>Disabled</Button>
          <Button variant="primary" size="md" type="button" className="btn-loading" aria-busy="true">Loading</Button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Cards &amp; surfaces</h2>
        <div className="flex flex-col gap-16">
          <div>
            <h3 className="font-semibold mb-12" style={h3Style}>Default card</h3>
            <Card>
              <p style={{ ...mutedBody, marginBottom: 0 }}>Standard <code>card-base</code> surface for results and summaries.</p>
            </Card>
          </div>
          <div>
            <h3 className="font-semibold mb-12" style={h3Style}>Compact review card</h3>
            <Card className="rounded-sm p-16">
              <p className="text-sm font-medium mb-8" style={{ color: 'var(--text-default)', marginTop: 0 }}>Screen description</p>
              <p className="text-sm" style={{ ...mutedBody, marginBottom: 0 }}>Guided review step 5 — tighter padding; not a button.</p>
            </Card>
          </div>
          <div>
            <h3 className="font-semibold mb-12" style={h3Style}>Static card</h3>
            <Card>
              <p style={{ ...mutedBody, marginBottom: 0 }}>Display-only. No hover elevation or pointer cursor unless the card is the action.</p>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Review mode selector</h2>
        <p className="mb-16" style={mutedBody}>Audit form choice tiles. Selected: <code>review-mode-option--selected</code>.</p>
        <div className="review-mode-options-grid">
          <button type="button" className="review-mode-option" aria-pressed={false}>
            <span className="review-mode-option__title">Default</span>
            <span className="review-mode-option__description">Unselected tile on the mode chooser.</span>
          </button>
          <button type="button" className="review-mode-option review-mode-option--selected" aria-pressed={true}>
            <span className="review-mode-option__title">Selected</span>
            <span className="review-mode-option__description">Stronger border after guided or quick is chosen.</span>
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Form controls</h2>
        <div className="flex flex-col gap-24">
          <TextArea id="ds-textarea-default" label="Default" value={demoInput} onChange={(e) => setDemoInput(e.target.value)} placeholder="Describe a screen or flow…" helperText="Helper text — muted tone with info icon." />
          <TextArea id="ds-textarea-error" label="Error" value="" onChange={() => {}} errorText="Example validation message." />
          <TextArea id="ds-textarea-warning" label="Warning" value="" onChange={() => {}} warningText="Example soft warning." />
          <TextArea id="ds-textarea-success" label="Success" value="" onChange={() => {}} successText="Example success hint." />
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Alerts &amp; status</h2>
        <div className="flex flex-col gap-16">
          <Alert variant="error">Error — blocking or failed action.</Alert>
          <Alert variant="warning">Warning — limited input or partial guidance.</Alert>
          <Alert variant="success">Success — confirmation or positive status.</Alert>
          <Alert variant="info">Info — neutral context (e.g. low-confidence input).</Alert>
          <div className="flex items-center gap-16">
            <Loading size="md" />
            <p style={{ ...mutedBody, marginBottom: 0 }}>Loading spinner with caption on results and guidance flows.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Result card pattern</h2>
        <p className="mb-16" style={mutedBody}><code>IssueCard</code> — severity rail, potential impact, section labels.</p>
        <IssueCard issue={DEMO_ISSUE} />
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Focus states</h2>
        <p className="mb-16" style={mutedBody}>Tab to see <code>--focus-ring</code> on controls; inputs also use <code>--focus-bg</code>.</p>
        <div className="flex flex-wrap gap-16 mb-16">
          <Button variant="secondary" size="md" type="button">Tab to focus</Button>
          <input type="text" className="form-input-base" placeholder="Tab to focus input" aria-label="Focus demo input" style={{ maxWidth: '240px' }} />
        </div>
        <div className="flex flex-wrap gap-16">
          <div className="p-16 rounded-sm border" style={{ borderColor: 'var(--focus-ring)' }}>
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--focus-ring</code>
          </div>
          <div className="p-16 rounded-sm border" style={{ backgroundColor: 'var(--focus-bg)', borderColor: 'var(--border-default)' }}>
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--focus-bg</code>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Usage rules</h2>
        <ul className="list-disc pl-24 space-y-8" style={{ ...mutedBody, marginBottom: 0 }}>
          <li>Use tokens and <code>premium-components.css</code> — no ad-hoc shadows or colors.</li>
          <li>Prefer <code>Card</code>, <code>Button</code>, and <code>Alert</code> over one-off styled divs.</li>
          <li>Static summary cards must not look clickable.</li>
          <li>Severity colors mean potential impact, not compliance pass or fail.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-16" style={h2Style}>Foundation</h2>
        <p className="mb-24" style={{ ...mutedBody, marginTop: 0 }}>Raw token reference. Use component sections above when building UI.</p>

        <h3 className="font-semibold mb-16" style={h3Style}>Colors</h3>
        <div className="space-y-24 mb-24">
          {/* Backgrounds & Surfaces */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Backgrounds & Surfaces
            </h3>
            <div className="grid grid-cols-2 gap-16">
              <div>
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--bg-default)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--bg-default</code>
                </div>
              </div>
              <div>
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--bg-subtle</code>
                </div>
              </div>
              <div>
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--bg-surface-0)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--bg-surface-0</code>
                </div>
              </div>
              <div>
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--surface-1)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--surface-1</code>
                </div>
              </div>
              <div>
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--surface-2)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--surface-2</code>
                </div>
              </div>
              <div>
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--surface-3)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--surface-3</code>
                </div>
              </div>
            </div>
          </div>

          {/* Text Colors */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Text Colors
            </h3>
            <div className="space-y-8">
              <div>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-default)' }}>
                  <code>--text-default</code> — Default text color
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
                  <code>--text-muted</code> — Muted text color
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-inverse)' }}>
                  <code>--text-inverse</code> — Inverse text color
                </p>
              </div>
            </div>
          </div>

          {/* Borders */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Borders
            </h3>
            <div className="space-y-8">
              <div className="p-16 rounded-sm" style={{ border: '2px solid var(--border-default)' }}>
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--border-default</code>
              </div>
              <div className="p-16 rounded-sm" style={{ border: '2px solid var(--border-strong)' }}>
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>--border-strong</code>
              </div>
            </div>
          </div>

          {/* Severity Colors */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Severity
            </h3>
            <div className="grid grid-cols-3 gap-16">
              <div className="space-y-8">
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--sev-low)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-inverse)' }}>--sev-low</code>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Low / Success</p>
              </div>
              <div className="space-y-8">
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--sev-med)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-inverse)' }}>--sev-med</code>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Medium / Warning</p>
              </div>
              <div className="space-y-8">
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--sev-high)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-inverse)' }}>--sev-high</code>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>High / Error</p>
              </div>
            </div>
          </div>

          {/* Button Colors */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Button Colors (Primary)
            </h3>
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-8">
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--button-primary-bg)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--button-primary-text)' }}>--button-primary-bg</code>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Background</p>
              </div>
              <div className="space-y-8">
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--button-primary-bg-hover)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--button-primary-text)' }}>--button-primary-bg-hover</code>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Hover</p>
              </div>
              <div className="space-y-8">
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--button-primary-disabled-bg)',
                    borderColor: 'var(--border-default)',
                    opacity: 0.5
                  }}
                >
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--button-primary-text)', opacity: 1 }}>--button-primary-disabled-bg</code>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Disabled (opacity: 0.5)</p>
              </div>
              <div className="space-y-8">
                <div 
                  className="p-16 rounded-sm border"
                  style={{
                    backgroundColor: 'var(--surface-1)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--button-primary-text)' }}>
                    <code>--button-primary-text</code>
                  </p>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Text color</p>
              </div>
            </div>
          </div>

          {/* Accent Ramp */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Accent Ramp
            </h3>
            <div className="grid grid-cols-5 gap-16">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((num) => (
                <div key={num}>
                  <div 
                    className="p-16 rounded-sm border"
                    style={{
                      backgroundColor: `var(--accent-${num})`,
                      borderColor: 'var(--border-default)'
                    }}
                  >
                    <code style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>{num}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="font-semibold mb-16" style={h3Style}>Typography</h3>
        <div className="space-y-24 mb-24">
          {/* Semantic Scale */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Semantic Scale
            </h3>
            <div className="space-y-16">
              <div>
                <p 
                  style={{
                    fontSize: 'var(--text-hero)',
                    lineHeight: 'var(--text-hero-leading)',
                    fontWeight: 'var(--text-hero-weight)',
                    color: 'var(--text-default)'
                  }}
                >
                  Hero — <code>--text-hero</code>
                </p>
              </div>
              <div>
                <p 
                  style={{
                    fontSize: 'var(--text-h1)',
                    lineHeight: 'var(--text-h1-leading)',
                    fontWeight: 'var(--text-h1-weight)',
                    color: 'var(--text-default)'
                  }}
                >
                  Heading 1 — <code>--text-h1</code>
                </p>
              </div>
              <div>
                <p 
                  style={{
                    fontSize: 'var(--text-h2)',
                    lineHeight: 'var(--text-h2-leading)',
                    fontWeight: 'var(--text-h2-weight)',
                    color: 'var(--text-default)'
                  }}
                >
                  Heading 2 — <code>--text-h2</code>
                </p>
              </div>
              <div>
                <p 
                  style={{
                    fontSize: 'var(--text-body)',
                    lineHeight: 'var(--text-body-leading)',
                    fontWeight: 'var(--text-body-weight)',
                    color: 'var(--text-default)'
                  }}
                >
                  Body — <code>--text-body</code>
                </p>
              </div>
              <div>
                <p 
                  style={{
                    fontSize: 'var(--text-caption)',
                    lineHeight: 'var(--text-caption-leading)',
                    fontWeight: 'var(--text-caption-weight)',
                    color: 'var(--text-default)'
                  }}
                >
                  Caption — <code>--text-caption</code>
                </p>
              </div>
            </div>
          </div>

          {/* Font Weights */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Font Weights
            </h3>
            <div className="space-y-8">
              <div>
                <p style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-light)', color: 'var(--text-default)' }}>
                  Light (300) — <code>--weight-light</code>
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-regular)', color: 'var(--text-default)' }}>
                  Regular (400) — <code>--weight-regular</code>
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-medium)', color: 'var(--text-default)' }}>
                  Medium (500) — <code>--weight-medium</code>
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-default)' }}>
                  Semibold (600) — <code>--weight-semibold</code>
                </p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-bold)', color: 'var(--text-default)' }}>
                  Bold (700) — <code>--weight-bold</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-semibold mb-16" style={h3Style}>Spacing</h3>
        <div className="space-y-24 mb-24">
          {[4, 8, 12, 16, 20, 24, 32, 64].map((size) => (
            <div key={size} className="flex items-center gap-16">
              <div 
                style={{
                  width: `var(--space-${size})`,
                  height: `var(--space-${size})`,
                  backgroundColor: 'var(--text-default)',
                  minWidth: `var(--space-${size})`
                }}
              />
              <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
                --space-{size}
              </code>
            </div>
          ))}
        </div>

        <h3 className="font-semibold mb-16" style={h3Style}>Radius</h3>
        <div className="space-y-24 mb-24">
          <div className="flex items-center gap-16">
            <div 
              className="border"
              style={{
                width: 'var(--space-64)',
                height: 'var(--space-64)',
                borderRadius: 'var(--radius-xs)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--surface-1)'
              }}
            />
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
              --radius-xs
            </code>
          </div>
          <div className="flex items-center gap-16">
            <div 
              className="border"
              style={{
                width: 'var(--space-64)',
                height: 'var(--space-64)',
                borderRadius: 'var(--radius-sm)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--surface-1)'
              }}
            />
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
              --radius-sm
            </code>
          </div>
          <div className="flex items-center gap-16">
            <div 
              className="border"
              style={{
                width: 'var(--space-64)',
                height: 'var(--space-64)',
                borderRadius: 'var(--radius-md)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--surface-1)'
              }}
            />
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
              --radius-md
            </code>
          </div>
          <div className="flex items-center gap-16">
            <div 
              className="border"
              style={{
                width: 'var(--space-64)',
                height: 'var(--space-64)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--surface-1)'
              }}
            />
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
              --radius-lg
            </code>
          </div>
          <div className="flex items-center gap-16">
            <div 
              className="border"
              style={{
                width: 'var(--space-64)',
                height: 'var(--space-64)',
                borderRadius: 'var(--radius-full)',
                borderColor: 'var(--border-default)',
                backgroundColor: 'var(--surface-1)'
              }}
            />
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
              --radius-full
            </code>
          </div>
        </div>

        <h3 className="font-semibold mb-16" style={h3Style}>Depth (Shadows)</h3>
        <div className="space-y-24 mb-24">
          <div className="flex items-center gap-16">
            <div 
              className="p-24 rounded-sm"
              style={{
                backgroundColor: 'var(--surface-1)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
                --shadow-sm
              </code>
            </div>
          </div>
          <div className="flex items-center gap-16">
            <div 
              className="p-24 rounded-sm"
              style={{
                backgroundColor: 'var(--surface-1)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
                --shadow-md
              </code>
            </div>
          </div>
          <div className="flex items-center gap-16">
            <div 
              className="p-24 rounded-sm"
              style={{
                backgroundColor: 'var(--surface-1)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
                --shadow-lg
              </code>
            </div>
          </div>
        </div>

        <h3 className="font-semibold mb-16" style={h3Style}>States</h3>
        <div className="space-y-24">
          {/* Focus */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Focus
            </h3>
            <div className="space-y-8">
              <div className="p-16 rounded-sm border" style={{ borderColor: 'var(--focus-ring)' }}>
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
                  --focus-ring
                </code>
              </div>
              <div 
                className="p-16 rounded-sm border"
                style={{
                  backgroundColor: 'var(--focus-bg)',
                  borderColor: 'var(--border-default)'
                }}
              >
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>
                  --focus-bg
                </code>
              </div>
            </div>
          </div>

          {/* Error */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Error
            </h3>
            <div className="space-y-8">
              <div className="p-16 rounded-sm border" style={{ borderColor: 'var(--sev-high)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--sev-high)' }}>
                  Error state uses <code>--sev-high</code>
                </p>
              </div>
            </div>
          </div>

          {/* Disabled */}
          <div>
            <h3 
              className="font-semibold mb-12"
              style={{
                fontSize: 'var(--text-body)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-default)'
              }}
            >
              Disabled
            </h3>
            <div className="space-y-8">
              <div 
                className="p-16 rounded-sm border"
                style={{
                  backgroundColor: 'var(--button-primary-disabled-bg)',
                  borderColor: 'var(--border-default)',
                  opacity: 0.5
                }}
              >
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--button-primary-text)', opacity: 1 }}>
                  --button-primary-disabled-bg (opacity: 0.5)
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default System;
