import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

function Home() {
  return (
    <Card className="space-y-24" surface="1">
      <h1 className="text-3xl font-semibold text-default">
        Access Lens
      </h1>

      <p className="text-base text-muted">
        Run early-stage accessibility audits for any screen description.
        Instant WCAG issues, fixes, severities, and Jira-ready output.
      </p>

      <Button
        variant="primary"
        size="md"
        as={Link}
        to="/audit"
      >
        Start New Audit
      </Button>
    </Card>
  );
}

export default Home;
