import { Link } from "react-router-dom";
import { useApp } from "../state/AppContext";

function Home() {
  const { clearAuditFormInputs } = useApp();

  function handleStartNewAudit() {
    clearAuditFormInputs();
  }

  return (
    <div className="hero homepage-hero">
      <h1 className="hero-title">
        Accessibility, surfaced early.
      </h1>

      <p className="hero-subtitle">
      Turn rough screen descriptions into structured accessibility guidance before design or code hardens.
      </p>

      <Link
        to="/audit"
        className="hero-cta"
        onClick={handleStartNewAudit}
      >
        Start a new audit
      </Link>
    </div>
  );
}

export default Home;
