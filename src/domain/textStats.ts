import type { TextStats } from "../types/formatter";

const encoder = new TextEncoder();

export function getTextStats(text: string): TextStats {
  const bytes = encoder.encode(text).length;

  return {
    chars: text.length,
    bytes,
    kb: bytes / 1024,
  };
}

export function formatCharacterCount(chars: number): string {
  return `${new Intl.NumberFormat("en").format(chars)} chars`;
}

export function formatKilobytes(kb: number): string {
  return `${kb.toFixed(kb >= 10 ? 1 : 2)} KB`;
}
