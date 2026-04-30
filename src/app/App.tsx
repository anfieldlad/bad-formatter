import { useMemo, useState } from "react";
import { Clipboard, Download, Eraser, Sparkles } from "lucide-react";
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
import type { OutputView } from "../types/formatter";
import "./App.css";

export function App() {
  const formatter = useJsonFormatter();
  const [outputView, setOutputView] = useState<OutputView>("text");
  const { copyText } = useClipboard();
  const { downloadText } = useDownload();
  const hasInput = formatter.input.trim().length > 0;
  const hasOutput = formatter.output.length > 0;

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
    </>
  );

  return (
    <main className="app-shell">
      <Header />

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
    </main>
  );
}
