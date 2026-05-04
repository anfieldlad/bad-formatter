import { Moon, ShieldCheck, Sun } from "lucide-react";

interface HeaderProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-row">
        <div className="site-brand">
          <h1>
            <span className="brand-accent">Bad</span> Formatter
          </h1>
          <span className="brand-tagline">Format text. Privately. Fast.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            className="privacy-chip"
            role="status"
            aria-label="Privacy: this tool runs entirely in your browser"
          >
            <ShieldCheck aria-hidden="true" size={13} />
            <span>Browser-only · No upload</span>
          </div>
          <button
            type="button"
            className="button ghost theme-toggle"
            onClick={onThemeToggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun aria-hidden="true" size={16} />
            ) : (
              <Moon aria-hidden="true" size={16} />
            )}
          </button>
        </div>
      </div>
      <nav className="format-tabs" aria-label="Formatter type">
        <button
          type="button"
          className="format-tab active"
          aria-current="page"
          tabIndex={-1}
        >
          JSON
        </button>
      </nav>
    </header>
  );
}
