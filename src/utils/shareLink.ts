import LZString from "lz-string";

// Thresholds are for the encoded URL payload length (roughly bytes, ASCII only)
const WARN_BYTES = 8 * 1024;   // 8 KB — works most places, but URLs get long
const MAX_BYTES  = 40 * 1024;  // 40 KB — unreliable in most sharing contexts

export type ShareSizeState = "ok" | "warn" | "too-large";

export interface SharePayload {
  encoded: string;
  bytes: number;
  state: ShareSizeState;
  label: string; // human-readable size, e.g. "12.3 KB"
}

export function encodeShare(json: string): SharePayload {
  const encoded = LZString.compressToEncodedURIComponent(json);
  const bytes = encoded.length;
  const state: ShareSizeState =
    bytes > MAX_BYTES ? "too-large" : bytes > WARN_BYTES ? "warn" : "ok";
  const label =
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
  return { encoded, bytes, state, label };
}

export function buildShareUrl(encoded: string): string {
  const url = new URL(window.location.href);
  url.hash = `d=${encoded}`;
  return url.toString();
}

export function decodeShareFromUrl(): string | null {
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const encoded = params.get("d");
  if (!encoded) return null;
  try {
    return LZString.decompressFromEncodedURIComponent(encoded) ?? null;
  } catch {
    return null;
  }
}
