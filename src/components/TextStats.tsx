import type { TextStats as TextStatsType } from "../types/formatter";
import { formatCharacterCount, formatKilobytes } from "../domain/textStats";

type TextStatsProps = {
  label: string;
  stats: TextStatsType;
};

export function TextStats({ label, stats }: TextStatsProps) {
  const empty = stats.chars === 0;

  return (
    <p className="text-stats" aria-label={`${label} stats`}>
      {empty
        ? "—"
        : `${formatCharacterCount(stats.chars)} · ${formatKilobytes(stats.kb)}`}
    </p>
  );
}
