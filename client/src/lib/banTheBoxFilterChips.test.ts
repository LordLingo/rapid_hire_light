/*
  §181 — Ban-the-box filter chip selected-state contrast.

  The "All stages" / "All scopes" chips on /resources/ban-the-box were
  unreadable in the active state because the selected branch used the
  shadcn `--color-accent` token (a pale tint hue ~#eff6ff family) as the
  surface and white as the text, which produced near-white-on-near-white.

  This spec source-pins the unified treatment so the chips match the
  rest of the site (Get-a-Quote CTA, marijuana-laws filter chips, header
  active underline, etc.):

    - Selected branch uses `bg-[color:var(--color-brand-blue)]` +
      `text-white` (the canonical site-wide selected-chip surface,
      backed by the §179 brand-blue alias to --color-accent-ink).
    - Unselected branch uses the same paper-friendly /25 hairline + white
      surface + ink text + /40 hover-border treatment as §178's
      marijuana-laws chips, so the resting state is legible against the
      paper-soft tray.
    - `--color-accent` is explicitly banned in this slice, since that's
      the token that caused the regression.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PATH = resolve(__dirname, "../pages/ResourcesBanTheBox.tsx");
const src = readFileSync(PATH, "utf8");

/** Slice the filter-chips block so assertions can't be tricked by
 * unrelated chrome (table rows, cta banners, etc). The block is
 * delimited by the `{/* Filter chips * /}` marker and ends just before
 * the aria-live "Showing N of M jurisdictions" status line. */
function chipSlice(): string {
  const idx = src.indexOf("{/* Filter chips */}");
  expect(idx, "filter chips marker present").toBeGreaterThan(-1);
  const end = src.indexOf("aria-live=\"polite\"", idx);
  expect(end, "filter chips block end marker present").toBeGreaterThan(idx);
  return src.slice(idx, end);
}

describe("§181 — Ban-the-box filter chip contrast unification", () => {
  it("selected branch paints brand-blue / white-on-dark on BOTH filter rows", () => {
    const slice = chipSlice();
    const matches =
      slice.match(
        /bg-\[color:var\(--color-brand-blue\)\] text-white/g,
      ) ?? [];
    expect(matches.length, "two chip groups, two selected-class strings").toBe(
      2,
    );
  });

  it("anti-regression: the pale shadcn --color-accent token is banned in this slice", () => {
    const slice = chipSlice();
    expect(slice).not.toMatch(/bg-\[color:var\(--color-accent\)\]/);
    expect(slice).not.toMatch(/border-\[color:var\(--color-accent\)\]/);
  });

  it("unselected branch uses bg-white + /25 hairline + ink text (matches §178 marijuana-laws treatment)", () => {
    const slice = chipSlice();
    const unselected = slice
      .split("\n")
      .filter((l) => l.includes("hover:bg-[color:var(--color-paper)]"));
    expect(
      unselected.length,
      "two chip groups, two unselected-class strings",
    ).toBe(2);
    for (const line of unselected) {
      expect(line).toMatch(/border-\[color:var\(--color-ink\)\]\/25/);
      expect(line).toMatch(/bg-white/);
      expect(line).toMatch(/text-\[color:var\(--color-ink\)\]/);
      expect(line).toMatch(/hover:border-\[color:var\(--color-ink\)\]\/40/);
    }
  });

  it("anti-regression: unselected chips do NOT silently fall back to paper-soft surface (the old border-border treatment)", () => {
    const slice = chipSlice();
    // The previous "border-border" + "hover:bg-paper-soft" pair was the
    // weak treatment that paired with the broken selected state. Pin
    // that combo as banned in the chip lines so a future class re-shuffle
    // can't quietly bring back the unreadable state.
    const lines = slice.split("\n").filter((l) => l.includes("border-border"));
    expect(lines.length, "border-border is gone from the chip lines").toBe(0);
  });

  it("aria-pressed flag stays wired so the chips remain accessible", () => {
    const slice = chipSlice();
    const pressed = slice.match(/aria-pressed=\{active\}/g) ?? [];
    expect(pressed.length).toBe(2);
  });

  it("each chip exposes a stable testid + data-active flag for future a11y/UI tests", () => {
    expect(src).toContain(
      "data-testid={`ban-the-box-stage-filter-${f.value}`}",
    );
    expect(src).toContain(
      "data-testid={`ban-the-box-scope-filter-${f.value}`}",
    );
    const slice = chipSlice();
    const dataActive = slice.match(/data-active=\{active\}/g) ?? [];
    expect(dataActive.length).toBe(2);
  });

  it("anti-regression: STAGE_FILTERS and SCOPE_FILTERS still lead with an 'all' option (the regression target chips)", () => {
    expect(src).toMatch(/STAGE_FILTERS[^=]*=\s*\[\s*\{\s*value:\s*"all"/);
    expect(src).toMatch(/SCOPE_FILTERS[^=]*=\s*\[\s*\{\s*value:\s*"all"/);
  });
});
