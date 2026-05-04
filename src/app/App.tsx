import { useEffect, useMemo, useState } from "react";
import { Clipboard, Download, Eraser, Share2, Sparkles } from "lucide-react";
import { ActionToolbar } from "../components/ActionToolbar";
import { EditorPanel } from "../components/EditorPanel";
import { EmptyOutput } from "../components/EmptyOutput";
import { Header } from "../components/Header";
import { JsonTreeView } from "../components/JsonTreeView";
import { StatusMessage } from "../components/StatusMessage";
import { validateJson } from "../domain/jsonFormatter";
import { useClipboard } from "../hooks/useClipboard";
import { useDownload } from "../hooks/useDownload";
import { useJsonFormatter } from "../hooks/useJsonFormatter";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useTheme } from "../hooks/useTheme";
import {
  buildShareUrl,
  decodeShareFromUrl,
  encodeShare,
} from "../utils/shareLink";
import type { OutputView } from "../types/formatter";
import "./App.css";

export function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const formatter = useJsonFormatter();
  const [outputView, setOutputView] = useState<OutputView>("text");
  const { copyText } = useClipboard();
  const { downloadText } = useDownload();
  const hasInput = formatter.input.trim().length > 0;
  const hasOutput = formatter.output.length > 0;

  // Bootstrap from a shared URL on first load
  useEffect(() => {
    const shared = decodeShareFromUrl();
    if (shared) {
      formatter.setInput(shared);
      // Remove the hash so subsequent refreshes start clean
      window.history.replaceState(null, "", window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outputJson = useMemo(() => {
    if (!hasOutput) {
      return null;
    }

    const result = validateJson(formatter.output);
    return result.ok ? result.value : null;
  }, [formatter.output, hasOutput]);

  const canShowTree =
    Array.isArray(outputJson) ||
    (typeof outputJson === "object" && outputJson !== null);

  // Compute share payload whenever output changes
  const sharePayload = useMemo(
    () => (hasOutput ? encodeShare(formatter.output) : null),
    [hasOutput, formatter.output],
  );

  async function handleCopy() {
    if (!hasOutput) {
      return;
    }

    const copied = await copyText(formatter.output);
    formatter.setStatus(
      copied
        ? { type: "success", message: "Output copied." }
        : {
            type: "error",
            message: "Could not copy output. Try selecting it manually.",
          },
    );
  }

  function handleDownload() {
    if (!hasOutput) {
      return;
    }

    const downloaded = downloadText("formatted.json", formatter.output);
    formatter.setStatus(
      downloaded
        ? { type: "success", message: "Download started." }
        : { type: "error", message: "Could not download output." },
    );
  }

  async function handleShare() {
    if (!hasOutput || !sharePayload) {
      return;
    }

    const url = buildShareUrl(sharePayload.encoded);
    const copied = await copyText(url);

    if (!copied) {
      formatter.setStatus({
        type: "error",
        message: "Could not copy share link.",
      });
      return;
    }

    if (sharePayload.state === "warn") {
      formatter.setStatus({
        type: "success",
        message: `Share link copied — URL is ${sharePayload.label}. May not work in all apps.`,
      });
    } else {
      formatter.setStatus({
        type: "success",
        message: "Share link copied to clipboard.",
      });
    }
  }

  function handleClearInput() {
    formatter.clear();
    setOutputView("text");
  }

  useKeyboardShortcuts({
    b: (event) => {
      event.preventDefault();
      formatter.beautify();
    },
    m: (event) => {
      event.preventDefault();
      formatter.minify();
    },
    l: (event) => {
      event.preventDefault();
      formatter.validate();
    },
  });

  const inputHeaderActions = (
    <>
      <button
        type="button"
        className="button ghost"
        onClick={formatter.loadSample}
      >
        <Sparkles aria-hidden="true" size={14} />
        Sample
      </button>
      <button
        type="button"
        className="button ghost danger"
        onClick={handleClearInput}
        disabled={!hasInput}
      >
        <Eraser aria-hidden="true" size={14} />
        Clear
      </button>
    </>
  );

  const outputViewToggle = (
    <div className="view-toggle" aria-label="Output view">
      <button
        type="button"
        aria-pressed={outputView === "text"}
        className={outputView === "text" ? "view-option active" : "view-option"}
        onClick={() => setOutputView("text")}
      >
        Text
      </button>
      <button
        type="button"
        aria-pressed={outputView === "tree" && canShowTree}
        className={
          outputView === "tree" && canShowTree
            ? "view-option active"
            : "view-option"
        }
        disabled={!canShowTree}
        onClick={() => setOutputView("tree")}
      >
        Tree
      </button>
    </div>
  );

  const tooLarge = sharePayload?.state === "too-large";

  const outputHeaderActions = (
    <>
      <button
        type="button"
        className="button ghost"
        onClick={handleCopy}
        disabled={!hasOutput}
      >
        <Clipboard aria-hidden="true" size={14} />
        Copy
      </button>
      <button
        type="button"
        className="button ghost"
        onClick={handleDownload}
        disabled={!hasOutput}
      >
        <Download aria-hidden="true" size={14} />
        Download
      </button>
      <div className="share-action">
        {sharePayload && sharePayload.state !== "ok" && (
          <span
            className={`share-size-chip share-size-${sharePayload.state}`}
            title={
              tooLarge
                ? "JSON is too large to share via URL"
                : "URL will be long and may not work in all apps"
            }
          >
            {sharePayload.label}
            {tooLarge ? " · Too large" : " · Long URL"}
          </span>
        )}
        <button
          type="button"
          className="button ghost"
          onClick={handleShare}
          disabled={!hasOutput || tooLarge}
          title={tooLarge ? "JSON too large to share via URL" : undefined}
        >
          <Share2 aria-hidden="true" size={14} />
          Share
        </button>
      </div>
    </>
  );

  return (
    <main className="app-shell">
      <Header theme={theme} onThemeToggle={toggleTheme} />

      <ActionToolbar
        indentSize={formatter.indentSize}
        onBeautify={formatter.beautify}
        onMinify={formatter.minify}
        onValidate={formatter.validate}
        onIndentSizeChange={formatter.setIndentSize}
      />

      <section className="workspace" aria-label="JSON formatter workspace">
        <EditorPanel
          id="json-input"
          label="Input"
          value={formatter.input}
          placeholder="Paste or type your JSON here…"
          stats={formatter.inputStats}
          onChange={formatter.setInput}
          headerRightSlot={inputHeaderActions}
        />

        <EditorPanel
          id="json-output"
          label="Output"
          value={formatter.output}
          placeholder="Formatted output appears here"
          readOnly
          stats={formatter.outputStats}
          headerLeftSlot={outputViewToggle}
          headerRightSlot={outputHeaderActions}
        >
          {outputView === "tree" && canShowTree ? (
            <JsonTreeView value={outputJson} />
          ) : (
            <>
              <textarea
                id="json-output"
                className="editor"
                value={formatter.output}
                placeholder="Formatted output appears here"
                readOnly
                spellCheck={false}
              />
              {!hasOutput ? <EmptyOutput /> : null}
            </>
          )}
        </EditorPanel>
      </section>

      <StatusMessage status={formatter.status} />

      <footer className="site-footer">
        <p>
          &copy; 2025{" "}
          <a href="http://badai.tech" target="_blank" rel="noopener noreferrer">
            BAD AI
          </a>
        </p>
      </footer>
    </main>
  );
}
