import type {
  IndentSize,
  JsonFormatFailure,
  JsonFormatResult,
} from "../types/formatter";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Unable to parse JSON.";
}

function extractPosition(message: string): number | undefined {
  const patterns = [
    /position\s+(\d+)/i,
    /at\s+(\d+)$/i,
    /column\s+(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      const parsed = Number.parseInt(match[1], 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function toLineColumn(input: string, position: number) {
  const safePosition = Math.max(0, Math.min(position, input.length));
  const beforePosition = input.slice(0, safePosition);
  const lines = beforePosition.split(/\r\n|\r|\n/);
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;

  return { line, column };
}

function normalizeJsonError(input: string, error: unknown): JsonFormatFailure {
  const message = getErrorMessage(error);
  const position = extractPosition(message);

  if (typeof position === "number") {
    return {
      ok: false,
      error: message,
      position,
      ...toLineColumn(input, position),
    };
  }

  return {
    ok: false,
    error: message,
  };
}

export function validateJson(input: string): JsonFormatResult {
  try {
    const value = JSON.parse(input) as unknown;
    return { ok: true, value };
  } catch (error) {
    return normalizeJsonError(input, error);
  }
}

export function beautifyJson(
  input: string,
  indentSize: IndentSize,
): JsonFormatResult {
  const result = validateJson(input);

  if (!result.ok) {
    return result;
  }

  return {
    ...result,
    output: JSON.stringify(result.value, null, indentSize),
  };
}

export function minifyJson(input: string): JsonFormatResult {
  const result = validateJson(input);

  if (!result.ok) {
    return result;
  }

  return {
    ...result,
    output: JSON.stringify(result.value),
  };
}

export function formatJsonError(result: JsonFormatFailure): string {
  if (result.line && result.column) {
    return `Invalid JSON: ${result.error} at line ${result.line}, column ${result.column}`;
  }

  return `Invalid JSON: ${result.error}`;
}
