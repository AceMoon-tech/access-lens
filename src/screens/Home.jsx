import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="hero">
      <h1 className="hero-title">
        Accessibility, surfaced early...
      </h1>

      <p className="hero-subtitle">
        Turn screen descriptions into early accessibility signals, before design or code exists.
      </p>

      <Link
        to="/audit"
        className="hero-cta"
      >
        Start a new audit
      </Link>
    </div>
  );
}

export default Home;
