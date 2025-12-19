import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import lightLogo from "../assets/logo/access_lens_logo_light.svg";

export default function Header() {
  return (
    <header className="w-full bg-surface-0">
      <div className="page-container__main flex items-center justify-between">

        {/* Left: Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={lightLogo}
            alt="Access Lens logo"
            className="w-auto"
            style={{ height: "calc(var(--space-32) + var(--space-24))" }}
          />
        </Link>

        {/* Right: Theme toggle */}
        <nav aria-label="Global" className="flex items-center">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
