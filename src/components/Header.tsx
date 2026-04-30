import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-row">
        <div className="site-brand">
          <h1>
            <span className="brand-accent">Bad</span> Formatter
          </h1>
          <span className="brand-tagline">Format text. Privately. Fast.</span>
        </div>
        <div
          className="privacy-chip"
          role="status"
          aria-label="Privacy: this tool runs entirely in your browser"
        >
          <ShieldCheck aria-hidden="true" size={13} />
          <span>Browser-only · No upload</span>
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
