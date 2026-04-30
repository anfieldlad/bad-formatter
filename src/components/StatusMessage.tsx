import { AlertCircle, CheckCircle2, Info, Sparkles } from "lucide-react";
import type { FormatterStatus } from "../types/formatter";

type StatusMessageProps = {
  status: FormatterStatus;
};

const statusIcons = {
  ready: Sparkles,
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function StatusMessage({ status }: StatusMessageProps) {
  const Icon = statusIcons[status.type];

  return (
    <section
      className={`status-line ${status.type}`}
      aria-live="polite"
      aria-label="Formatter status"
    >
      <span className="status-icon">
        <Icon aria-hidden="true" size={16} />
      </span>
      <span className="status-message">{status.message}</span>
      {status.timing ? (
        <span className="status-timing">· {status.timing}</span>
      ) : null}
    </section>
  );
}
