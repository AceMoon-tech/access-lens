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
        <Link to="/" className="flex items-center">
          <img
            src={theme === "dark" ? darkLogo : lightLogo}
            alt="Access Lens logo"
            className="w-auto"
            style={{ height: "40px", width: "auto" }}
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

