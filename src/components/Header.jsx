import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import lightLogo from "../assets/logo/access_lens_logo_light.svg";
import darkLogo from "../assets/logo/access_lens_logo_dark.svg";
import { useThemeStore } from "../state/theme";

export default function Header() {
  const theme = useThemeStore((s) => s.theme) || "light";

  return (
    <header className="w-full bg-surface-0">
      <div className="page-container__main flex items-center justify-between">

        {/* Left: Logo */}
        <Link to="/" className="flex items-center" style={{ gap: 'var(--space-8)' }}>
          <img
            src={theme === "dark" ? darkLogo : lightLogo}
            alt="Access Lens logo"
            className="w-auto"
            style={{
              // Intentional exception: Layout constraint requires fixed logo height
              // No token exists for logo height (40px)
              height: "40px",
              width: "auto"
            }}
          />
          <span
            style={{
              fontSize: 'var(--text-xs)',
              lineHeight: 'var(--text-xs-leading)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Beta
          </span>
        </Link>

        {/* Right: Navigation */}
        <nav aria-label="Global" className="flex items-center gap-16">
          <Link
            to="/about"
            className="header-link text-sm font-medium"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

