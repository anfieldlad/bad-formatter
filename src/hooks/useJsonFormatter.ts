import { useMemo, useState } from "react";
import {
  beautifyJson,
  formatJsonError,
  minifyJson,
  validateJson,
} from "../domain/jsonFormatter";
import { sampleJson } from "../domain/sampleJson";
import { getTextStats } from "../domain/textStats";
import type { FormatterStatus, IndentSize } from "../types/formatter";

const readyStatus: FormatterStatus = {
  type: "ready",
  message: "Ready. Paste JSON or load a sample.",
};

const largeInputThreshold = 1024 * 1024;

function isEmpty(input: string) {
  return input.trim().length === 0;
}

function largeInputStatus(input: string): FormatterStatus | null {
  if (new TextEncoder().encode(input).length >= largeInputThreshold) {
    return {
      type: "info",
      message: "Large JSON may take a moment to process in your browser.",
    };
  }

  return null;
}

function timingTail(label: string, elapsedMs: number): string {
  const rounded = elapsedMs < 1 ? "<1" : Math.round(elapsedMs).toString();
  return `${label} in ${rounded} ms`;
}

export function useJsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState<IndentSize>(2);
  const [status, setStatus] = useState<FormatterStatus>(readyStatus);

  const inputStats = useMemo(() => getTextStats(input), [input]);
  const outputStats = useMemo(() => getTextStats(output), [output]);

  function runWithInput(
    action: () => void,
    emptyMessage = "Paste JSON before running this action.",
  ) {
    if (isEmpty(input)) {
      setStatus({ type: "info", message: emptyMessage });
      return;
    }

    const warning = largeInputStatus(input);
    if (warning) {
      setStatus(warning);
    }

    action();
  }

  function beautify() {
    runWithInput(() => {
      const start = performance.now();
      const result = beautifyJson(input, indentSize);
      const elapsed = performance.now() - start;

      if (!result.ok) {
        setStatus({ type: "error", message: formatJsonError(result) });
        return;
      }

      setOutput(result.output ?? "");
      setStatus({
        type: "success",
        message: "Valid JSON.",
        timing: timingTail("beautified", elapsed),
      });
    });
  }

  function minify() {
    runWithInput(() => {
      const start = performance.now();
      const result = minifyJson(input);
      const elapsed = performance.now() - start;

      if (!result.ok) {
        setStatus({ type: "error", message: formatJsonError(result) });
        return;
      }

      setOutput(result.output ?? "");
      setStatus({
        type: "success",
        message: "Valid JSON.",
        timing: timingTail("minified", elapsed),
      });
    });
  }

  function validate() {
    runWithInput(() => {
      const start = performance.now();
      const result = validateJson(input);
      const elapsed = performance.now() - start;

      if (!result.ok) {
        setStatus({ type: "error", message: formatJsonError(result) });
        return;
      }

      setStatus({
        type: "success",
        message: "Valid JSON.",
        timing: timingTail("validated", elapsed),
      });
    });
  }

  function loadShared(json: string) {
    setInput(json);
    const result = beautifyJson(json, indentSize);
    if (result.ok) {
      setOutput(result.output ?? "");
      setStatus({ type: "success", message: "Shared JSON loaded." });
    } else {
      setStatus({ type: "error", message: formatJsonError(result) });
    }
  }

  function loadSample() {
    setInput(sampleJson);
    setStatus({
      type: "info",
      message: "Sample loaded. Try Beautify or Validate.",
    });
  }

  function clearInput() {
    setInput("");
    setStatus({ type: "ready", message: "Input cleared." });
  }

  function clear() {
    setInput("");
    setOutput("");
    setStatus(readyStatus);
  }

  return {
    input,
    output,
    indentSize,
    status,
    inputStats,
    outputStats,
    setInput,
    setIndentSize,
    setStatus,
    beautify,
    minify,
    validate,
    loadShared,
    loadSample,
    clearInput,
    clear,
  };
}
