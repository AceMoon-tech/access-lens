function System() {
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
          Design Tokens
        </h1>
      </section>

      {/* Colors */}
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
          Colors
        </h2>

        <div className="space-y-24">
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
      </section>

      {/* Typography */}
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
          Typography
        </h2>

        <div className="space-y-24">
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
      </section>

      {/* Spacing */}
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
          Spacing
        </h2>

        <div className="space-y-24">
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
      </section>

      {/* Radius */}
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
          Radius
        </h2>

        <div className="space-y-24">
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
      </section>

      {/* Depth (Shadows) */}
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
          Depth (Shadows)
        </h2>

        <div className="space-y-24">
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
      </section>

      {/* States */}
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
          States
        </h2>

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
