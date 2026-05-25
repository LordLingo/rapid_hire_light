/*
  §178 — Marijuana-laws filter chip resting-state contrast.

  The "All" chips on both filter rows (Recreational + Protection) were
  rendering invisibly against the paper-soft tray because the unselected
  chip used `border-[color:var(--color-ink)]/15` + `bg-[color:var(--color-paper)]`
  + `text-[color:var(--color-ink-soft)]` — all three tokens are nearly
  identical to the tray's own background. This spec source-pins the new
  resting-state treatment so the chips stay visible in CI:

    - Border bumped to /25 + a hover bump to /40.
    - Surface flipped to plain white so the chip pops off the warm tray.
    - Text uses the full ink color (not ink-soft) so the label is legible.
    - Selected state remains the brand-blue / white-on-dark fill so the
      active filter still reads as the dominant chip.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PATH = resolve(__dirname, "../pages/ResourcesMarijuanaLaws.tsx");
const src = readFileSync(PATH, "utf8");

/** Slice from the filter bar wrapper to the closing `</div>` after the
 * Protection chip row, so the assertions can't match copy elsewhere on
 * the page (e.g. the stat cards or the cannabis matrix table). */
function filterSlice(): string {
  const idx = src.indexOf("{/* Filter bar */}");
  expect(idx, "filter bar marker present").toBeGreaterThan(-1);
  // Cap the slice at the "Showing N of M states." line that immediately
  // follows the filter bar — the bar itself ends just above it.
  const end = src.indexOf("Showing {filtered.length}", idx);
  expect(end, "filter bar end marker present").toBeGreaterThan(idx);
  return src.slice(idx, end);
}

describe("§178 — Marijuana-laws filter chip contrast", () => {
  it("unselected chips render on a white surface so they pop off the paper-soft tray", () => {
    const slice = filterSlice();
    // Both chip groups must use bg-white in the unselected branch.
    const whiteMatches = slice.match(/bg-white/g) ?? [];
    expect(whiteMatches.length, "bg-white appears in both chip groups").toBe(2);
  });

  it("unselected chip border is bumped to /25 (was /15, too faint on paper-soft)", () => {
    const slice = filterSlice();
    const ban = slice.match(/border-\[color:var\(--color-ink\)\]\/15/g) ?? [];
    expect(ban.length, "no chip still uses the /15 border").toBe(0);
    const ok = slice.match(/border-\[color:var\(--color-ink\)\]\/25/g) ?? [];
    expect(ok.length, "both chip groups use the /25 border").toBe(2);
  });

  it("unselected chip text uses the full ink color (not ink-soft)", () => {
    const slice = filterSlice();
    // Each chip group has exactly one ink-color rule on the unselected
    // branch. The eyebrow labels above the chips ("Recreational:" /
    // "Protection:") plus the Filter icon row still use ink-soft, so
    // we don't pin the page-wide count — instead we pin the
    // unselected-chip branch directly by extracting the ternary
    // strings and asserting on those.
    const inkText = slice.match(/text-\[color:var\(--color-ink\)\]/g) ?? [];
    expect(inkText.length).toBeGreaterThanOrEqual(2);
    // Anti-regression: scope the ink-soft ban to the chip class strings
    // themselves. The unselected branch of each chip is the second arm
    // of the ternary, recognizable by the `bg-white` token introduced
    // in §178. Each such line must NOT contain `ink-soft` for the chip.
    const chipUnselectedLines = slice
      .split("\n")
      .filter((line) => line.includes("bg-white"));
    expect(
      chipUnselectedLines.length,
      "two chip groups, two unselected-class strings",
    ).toBe(2);
    for (const line of chipUnselectedLines) {
      expect(line).not.toMatch(/text-\[color:var\(--color-ink-soft\)\]/);
      expect(line).toMatch(/text-\[color:var\(--color-ink\)\]/);
    }
  });

  it("hover state bumps the border to /40 for a clearer hover affordance", () => {
    const slice = filterSlice();
    const hovers = slice.match(/hover:border-\[color:var\(--color-ink\)\]\/40/g) ?? [];
    expect(hovers.length, "both chip groups have the hover-border treatment").toBe(2);
  });

  it("selected chip still paints brand-blue / white-on-dark so the active filter dominates", () => {
    const slice = filterSlice();
    const selected =
      slice.match(/bg-\[color:var\(--color-brand-blue\)\] text-white/g) ?? [];
    expect(selected.length).toBe(2);
  });

  it("each chip exposes a stable testid + data-active flag so future a11y/UI tests can rely on it", () => {
    expect(src).toContain('data-testid={`marijuana-laws-rec-filter-${f}`}');
    expect(src).toContain('data-testid={`marijuana-laws-protection-filter-${f}`}');
    expect(src).toContain("data-active={recFilter === f}");
    expect(src).toContain("data-active={protectionFilter === f}");
  });

  it("anti-regression: REC_FILTERS still leads with 'All' so the test target chip exists", () => {
    // The bug was specifically about the 'All' chip being invisible, so
    // we pin the array's leading slot here. Without this, a future
    // re-ordering could move 'All' off the page and silently retire
    // the regression target.
    expect(src).toMatch(/REC_FILTERS:[^=]*=\s*\[\s*\n?\s*"All"/);
    expect(src).toMatch(/PROTECTION_FILTERS:[^=]*=\s*\[\s*\n?\s*"All"/);
  });
});
