import { describe, expect, it } from "vitest";
import {
  arrayJson,
  invalidJson,
  nestedJson,
  objectJson,
  primitiveJson,
} from "../test/fixtures";
import { beautifyJson, minifyJson, validateJson } from "./jsonFormatter";

describe("jsonFormatter", () => {
  it("validates object JSON", () => {
    expect(validateJson(objectJson).ok).toBe(true);
  });

  it("validates array-root JSON", () => {
    expect(validateJson(arrayJson).ok).toBe(true);
  });

  it("validates primitive JSON", () => {
    expect(validateJson(primitiveJson).ok).toBe(true);
  });

  it("rejects invalid JSON", () => {
    const result = validateJson(invalidJson);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });

  it("beautifies JSON with 2 spaces", () => {
    const result = beautifyJson(objectJson, 2);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toBe(
        '{\n  "name": "Bad Formatter",\n  "private": true\n}',
      );
    }
  });

  it("beautifies JSON with 4 spaces", () => {
    const result = beautifyJson(objectJson, 4);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toContain('\n    "name"');
    }
  });

  it("beautifies nested JSON", () => {
    const result = beautifyJson(nestedJson, 2);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toContain('"features": [');
    }
  });

  it("does not beautify invalid JSON", () => {
    expect(beautifyJson(invalidJson, 2).ok).toBe(false);
  });

  it("minifies JSON", () => {
    const result = minifyJson('{\n  "name": "Bad Formatter"\n}');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toBe('{"name":"Bad Formatter"}');
    }
  });

  it("does not minify invalid JSON", () => {
    expect(minifyJson(invalidJson).ok).toBe(false);
  });
});
