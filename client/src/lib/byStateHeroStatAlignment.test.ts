/*
  §176 — By-state hero stat trio alignment.

  The /resources/background-checks-by-state hero renders three Stat
  cards in a 3-column grid. Their eyebrow labels wrap to different
  line-counts, so without explicit baselines the big numerals and the
  trailing context copy fall onto different vertical positions across
  the row. This spec source-pins the four properties the alignment
  fix relies on so a future visual edit can't quietly regress the row:

    1. Card root is `flex h-full flex-col` so siblings on the grid row
       all match the tallest card's height.
    2. Eyebrow has a `min-h-[2.6em]` slot sized for two lines at the
       configured leading, so single-line and two-line labels share a
       baseline.
    3. Value uses a fixed `leading-[1]` line box so the big numeral
       baseline is invariant to the eyebrow's wrap state above it.
    4. Context paragraph is `mt-auto`-anchored to the bottom of the
       card so the trailing copy aligns even if one card grows.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PATH = resolve(
  __dirname,
  "../pages/ResourcesBackgroundChecksByState.tsx",
);
const src = readFileSync(PATH, "utf8");

/** Slice from `function Stat(` onward so card-internal pins can't match
 * unrelated copy elsewhere on the page. */
function statSlice(): string {
  const idx = src.indexOf("function Stat(");
  expect(idx, "function Stat( marker present").toBeGreaterThan(-1);
  return src.slice(idx);
}

describe("§176 — By-state hero stat trio alignment", () => {
  it("renders the three labelled stats inside the hero visual", () => {
    // Anti-regression — the trio is what visually anchors the hero,
    // and these three labels are what the alignment fix targets.
    expect(src).toContain("States with private-sector ban-the-box");
    expect(src).toContain("States with cannabis protections");
    expect(src).toContain("States with salary-history bans");
  });

  it("each stat card is a full-height flex column", () => {
    const slice = statSlice();
    const rootIdx = slice.indexOf('data-testid="by-state-hero-stat"');
    expect(rootIdx, "stat root testid present").toBeGreaterThan(-1);
    const root = slice.slice(rootIdx, rootIdx + 600);
    expect(root).toMatch(/flex/);
    expect(root).toMatch(/h-full/);
    expect(root).toMatch(/flex-col/);
  });

  it("eyebrow label reserves a two-line vertical slot so wrap state doesn't shift the value baseline", () => {
    const slice = statSlice();
    const labelIdx = slice.indexOf('data-testid="by-state-hero-stat-label"');
    expect(labelIdx, "stat label testid present").toBeGreaterThan(-1);
    const label = slice.slice(labelIdx, labelIdx + 600);
    // 2.6em == 1.3 line-height × 2 lines, large enough for the longest
    // 2-line wrap ("private-sector ban-the-box") at 11px / 0.18em tracking.
    expect(label).toMatch(/min-h-\[2\.6em\]/);
    expect(label).toMatch(/leading-\[1\.3\]/);
    expect(label).toMatch(/text-\[11px\]/);
    expect(label).toMatch(/uppercase tracking-\[0\.18em\]/);
  });

  it("value sits on a fixed leading-[1] line box for stable baselines", () => {
    const slice = statSlice();
    const valueIdx = slice.indexOf('data-testid="by-state-hero-stat-value"');
    expect(valueIdx, "stat value testid present").toBeGreaterThan(-1);
    const value = slice.slice(valueIdx, valueIdx + 600);
    expect(value).toMatch(/font-display/);
    expect(value).toMatch(/text-\[32px\]/);
    expect(value).toMatch(/leading-\[1\]/);
    // Anti-regression — the previous shape used `leading-tight`, which
    // varies with content and let baselines drift across the trio.
    expect(value).not.toMatch(/leading-tight/);
  });

  it("context paragraph hangs from the bottom of the card via mt-auto", () => {
    const slice = statSlice();
    const ctxIdx = slice.indexOf('data-testid="by-state-hero-stat-context"');
    expect(ctxIdx, "stat context testid present").toBeGreaterThan(-1);
    const ctx = slice.slice(ctxIdx, ctxIdx + 600);
    expect(ctx).toMatch(/mt-auto/);
    expect(ctx).toMatch(/text-\[12px\]/);
    expect(ctx).toMatch(/leading-snug/);
  });

  it("anti-regression: the three Stat callsites still feed the same labels and counts in order", () => {
    // The visual relies on these three cards staying in this order so
    // the wrap-state pattern (two-line, one-line, two-line) is stable.
    const btb = src.indexOf("States with private-sector ban-the-box");
    const cannabis = src.indexOf("States with cannabis protections");
    const salary = src.indexOf("States with salary-history bans");
    expect(btb).toBeGreaterThan(-1);
    expect(cannabis).toBeGreaterThan(btb);
    expect(salary).toBeGreaterThan(cannabis);
  });
});
