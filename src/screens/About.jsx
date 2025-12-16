import Card from "../components/Card";

function About() {
  return (
    <div className="mx-auto max-w-content space-y-24 py-24">
      {/* Overview Card */}
      <Card>
        <h1 className="text-3xl font-semibold text-default mb-16">
          About Access Lens
        </h1>

        <p className="text-base text-muted mb-16">
          Access Lens is a lightweight accessibility auditor designed to help you
          evaluate UI concepts using natural language descriptions.
        </p>

        <ul className="list-disc list-inside space-y-8 text-base text-muted">
          <li>React 19</li>
          <li>Vite for fast development</li>
          <li>Custom CSS (with a full design-token system)</li>
          <li>React Router for navigation</li>
          <li>State layer with lightweight stores</li>
        </ul>
      </Card>

      {/* Project Structure Card */}
      <Card>
        <h2 className="text-2xl font-semibold text-default mb-16">
          Project Structure
        </h2>

        <div className="space-y-8 text-base text-muted">
          <p>
            <strong>components/</strong> – Reusable UI components
          </p>
          <p>
            <strong>screens/</strong> – Page-level application views
          </p>
          <p>
            <strong>state/</strong> – Theme + global stores
          </p>
          <p>
            <strong>lib/</strong> – LLM logic and shared utilities
          </p>
          <p>
            <strong>styles/</strong> – Global CSS variables and tokens
          </p>
        </div>
      </Card>
    </div>
  );
}

export default About;
