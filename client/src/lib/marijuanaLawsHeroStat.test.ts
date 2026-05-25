/*
  §177 — Marijuana-laws hero stat row visual parity.

  All four hero stat cards on /resources/marijuana-laws must share the
  same warm-paper surface and ink-color tokens. The earlier shape gave
  the fourth card a `highlight` variant (brand-blue surface, white
  text), which on this hero background rendered as a washed-out grey
  and made the eyebrow, value, and caption unreadable. This spec
  source-pins the structural rules so the regression cannot return
  through a future visual edit.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PATH = resolve(__dirname, "../pages/ResourcesMarijuanaLaws.tsx");
const src = readFileSync(PATH, "utf8");

function statSlice(): string {
  const idx = src.indexOf("function Stat(");
  expect(idx, "function Stat( marker present").toBeGreaterThan(-1);
  return src.slice(idx);
}

describe("§177 — Marijuana-laws hero stat row visual parity", () => {
  it("retires the `highlight` prop that painted the 4th card brand-blue", () => {
    // Source-level ban: the prop, the call-site usage, and the
    // brand-blue / white surface tokens must all be gone from the
    // Stat component so a copy-paste from the previous shape can't
    // sneak the dark variant back in. Note that the brand-blue token
    // is still used legitimately elsewhere on the page (jump-link
    // CTA, filter chips, "Updated" badge), so the surface ban is
    // scoped to the Stat slice.
    expect(src).not.toMatch(/highlight\?:\s*boolean/);
    expect(src).not.toMatch(/highlight={true}/);
    expect(src).not.toMatch(/\shighlight\s*\/?>/);
    const slice = statSlice();
    expect(slice).not.toMatch(/bg-\[color:var\(--color-brand-blue\)\]/);
    expect(slice).not.toMatch(/text-white\/80/);
    expect(slice).not.toMatch(/text-white\/85/);
  });

  it("the 4th call-site uses the new caption + icon props instead of highlight", () => {
    // The "2024 cycle" caption + leaf icon preserve the meaning of
    // the retired "Most-recent cycle" badge without the dark surface.
    expect(src).toContain("States that updated in 2024");
    expect(src).toMatch(/caption="2024 cycle"/);
    expect(src).toMatch(/icon="leaf"/);
  });

  it("all four cards render on the warm-paper surface", () => {
    const slice = statSlice();
    const rootIdx = slice.indexOf('data-testid="marijuana-laws-hero-stat"');
    expect(rootIdx, "stat root testid present").toBeGreaterThan(-1);
    const root = slice.slice(rootIdx, rootIdx + 600);
    expect(root).toMatch(/bg-\[color:var\(--color-paper\)\]/);
    expect(root).toMatch(/flex/);
    expect(root).toMatch(/h-full/);
    expect(root).toMatch(/flex-col/);
  });

  it("eyebrow uses ink-soft and reserves a 2-line slot so labels share a baseline", () => {
    const slice = statSlice();
    const labelIdx = slice.indexOf('data-testid="marijuana-laws-hero-stat-label"');
    expect(labelIdx, "stat label testid present").toBeGreaterThan(-1);
    const label = slice.slice(labelIdx, labelIdx + 600);
    expect(label).toMatch(/text-\[color:var\(--color-ink-soft\)\]/);
    expect(label).toMatch(/min-h-\[2\.6em\]/);
    expect(label).toMatch(/leading-\[1\.3\]/);
    expect(label).toMatch(/uppercase tracking-\[0\.18em\]/);
  });

  it("value uses the ink color on a fixed leading-[1] line box", () => {
    const slice = statSlice();
    const valueIdx = slice.indexOf('data-testid="marijuana-laws-hero-stat-value"');
    expect(valueIdx, "stat value testid present").toBeGreaterThan(-1);
    const value = slice.slice(valueIdx, valueIdx + 600);
    expect(value).toMatch(/text-\[color:var\(--color-ink\)\]/);
    expect(value).toMatch(/font-display/);
    expect(value).toMatch(/text-\[32px\]/);
    expect(value).toMatch(/leading-\[1\]/);
  });

  it("caption hangs from the bottom of the card with mt-auto and ink-soft", () => {
    const slice = statSlice();
    const ctxIdx = slice.indexOf('data-testid="marijuana-laws-hero-stat-caption"');
    expect(ctxIdx, "stat caption testid present").toBeGreaterThan(-1);
    const ctx = slice.slice(ctxIdx, ctxIdx + 600);
    expect(ctx).toMatch(/mt-auto/);
    expect(ctx).toMatch(/text-\[color:var\(--color-ink-soft\)\]/);
  });

  it("anti-regression: the four call-sites remain in the original order", () => {
    const rec = src.indexOf("States with recreational legality");
    const med = src.indexOf("States with medical programs");
    const emp = src.indexOf("States with employment protections");
    const upd = src.indexOf("States that updated in 2024");
    expect(rec).toBeGreaterThan(-1);
    expect(med).toBeGreaterThan(rec);
    expect(emp).toBeGreaterThan(med);
    expect(upd).toBeGreaterThan(emp);
  });
});
