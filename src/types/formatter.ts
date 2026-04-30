export type IndentSize = 2 | 4;

export type FormatterStatus =
  | { type: "ready"; message: string; timing?: string }
  | { type: "success"; message: string; timing?: string }
  | { type: "error"; message: string; timing?: string }
  | { type: "info"; message: string; timing?: string };

export type JsonFormatSuccess = {
  ok: true;
  value: unknown;
  output?: string;
};

export type JsonFormatFailure = {
  ok: false;
  error: string;
  position?: number;
  line?: number;
  column?: number;
};

export type JsonFormatResult = JsonFormatSuccess | JsonFormatFailure;

export type TextStats = {
  chars: number;
  bytes: number;
  kb: number;
};

export type OutputView = "text" | "tree";
