import { Braces, CheckCircle2, Minimize2 } from "lucide-react";
import type { IndentSize } from "../types/formatter";
import { modKeyLabel } from "../hooks/useKeyboardShortcuts";

type ActionToolbarProps = {
  indentSize: IndentSize;
  onBeautify: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onIndentSizeChange: (indentSize: IndentSize) => void;
};

export function ActionToolbar({
  indentSize,
  onBeautify,
  onMinify,
  onValidate,
  onIndentSizeChange,
}: ActionToolbarProps) {
  const mod = modKeyLabel();

  return (
    <section className="action-bar" aria-label="Primary formatter actions">
      <div className="action-bar-group">
        <button
          type="button"
          className="button primary"
          onClick={onBeautify}
          title={`Beautify (${mod}+B)`}
        >
          <Braces aria-hidden="true" size={16} />
          Beautify
          <span className="kbd-hint" aria-hidden="true">
            {mod}B
          </span>
        </button>
        <button
          type="button"
          className="button primary"
          onClick={onMinify}
          title={`Minify (${mod}+M)`}
        >
          <Minimize2 aria-hidden="true" size={16} />
          Minify
          <span className="kbd-hint" aria-hidden="true">
            {mod}M
          </span>
        </button>
        <button
          type="button"
          className="button primary"
          onClick={onValidate}
          title={`Validate (${mod}+L)`}
        >
          <CheckCircle2 aria-hidden="true" size={16} />
          Validate
          <span className="kbd-hint" aria-hidden="true">
            {mod}L
          </span>
        </button>
      </div>

      <div className="action-bar-group indent-control">
        <span className="indent-label">Indent</span>
        <fieldset>
          <legend>Indentation size</legend>
          <label className={indentSize === 2 ? "segmented active" : "segmented"}>
            <input
              type="radio"
              name="indent-size"
              value="2"
              checked={indentSize === 2}
              onChange={() => onIndentSizeChange(2)}
            />
            2
          </label>
          <label className={indentSize === 4 ? "segmented active" : "segmented"}>
            <input
              type="radio"
              name="indent-size"
              value="4"
              checked={indentSize === 4}
              onChange={() => onIndentSizeChange(4)}
            />
            4
          </label>
        </fieldset>
      </div>
    </section>
  );
}
