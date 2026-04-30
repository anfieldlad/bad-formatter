import { describe, expect, it } from "vitest";
import { getTextStats } from "./textStats";

describe("textStats", () => {
  it("returns character and byte counts", () => {
    expect(getTextStats("abc")).toEqual({
      chars: 3,
      bytes: 3,
      kb: 3 / 1024,
    });
  });

  it("counts utf-8 bytes separately from characters", () => {
    const stats = getTextStats("é");

    expect(stats.chars).toBe(1);
    expect(stats.bytes).toBe(2);
  });
});
