import { Wand2 } from "lucide-react";

export function EmptyOutput() {
  return (
    <div
      className="output-empty"
      role="presentation"
      aria-hidden="true"
    >
      <span className="empty-icon">
        <Wand2 size={20} />
      </span>
      <p>Run an action to see formatted output here.</p>
    </div>
  );
}
