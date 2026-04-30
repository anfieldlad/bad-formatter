export function useDownload() {
  function downloadText(filename: string, text: string): boolean {
    try {
      const blob = new Blob([text], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename;
      anchor.rel = "noopener";
      anchor.click();

      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  }

  return { downloadText };
}
