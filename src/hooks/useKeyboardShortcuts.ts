import { useEffect } from "react";

export type ShortcutHandler = (event: KeyboardEvent) => void;

export type ShortcutMap = Record<string, ShortcutHandler>;

export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
}

export function modKeyLabel(): string {
  return isMacPlatform() ? "⌘" : "Ctrl";
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier) {
        return;
      }

      const key = event.key.toLowerCase();
      const handler = shortcuts[key];
      if (!handler) {
        return;
      }

      handler(event);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
