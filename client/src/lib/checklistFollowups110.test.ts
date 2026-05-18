/*
  §110 — three follow-up wiring invariants for ComplianceChecklist.

  Covered surfaces:
    A) Bulk actions row: hook exposes `markAllChecked`, page renders
       `Mark all 24 as checked` + `Reset progress` buttons with the
       documented testids, both have accessible disabled states tied to
       the current progress count, and `markAllChecked` is wired to the
       `SURFACES` constant.
    B) URL persistence for `generatedFor` (`?for=<company>`): the page
       reads the URL on hydrate (URL > localStorage > default), writes
       via `history.replaceState` on change, and STRIPS the param when
       the field is empty.
    C) Export-count preview chip: the page computes `exportCount =
       uncheckedOnly ? uncheckedCount : TOTAL_ITEMS`, renders a chip
       with the documented testid, hides it while downloading, and
       pluralizes by the count.

  These are source-text invariants (not jsdom render tests) because the
  ComplianceChecklist page composes a SiteShell + lots of side-effects,
  so static-string assertions are the simplest way to keep the contract
  honest without spinning up a full DOM.
*/

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PAGE_PATH = resolve(
  __dirname,
  "..",
  "pages",
  "ComplianceChecklist.tsx",
);
function readPage(): string {
  return readFileSync(PAGE_PATH, "utf8");
}

/* -------------------------------------------------------------- A */

describe("§110 bulk actions on /compliance/checklist", () => {
  it("useChecklistProgress exposes a markAllChecked helper", () => {
    const src = readPage();
    expect(src).toMatch(/markAllChecked\s*=\s*\(\s*surfaces\s*:/);
    // The helper rebuilds the map (not mutates) so React's persistence
    // effect actually fires.
    expect(src).toContain("const next: Record<string, boolean> = {}");
    // Hook's return object exposes it for the page.
    expect(src).toMatch(
      /return\s*\{\s*checked,\s*toggle,\s*reset,\s*markAllChecked,\s*checkedCount,\s*hydrated\s*\}/,
    );
  });

  it("page destructures markAllChecked from the hook", () => {
    const src = readPage();
    expect(src).toMatch(
      /const\s*\{\s*checked,\s*toggle,\s*reset,\s*markAllChecked,\s*checkedCount\s*\}\s*=\s*useChecklistProgress\(\)/,
    );
  });

  it("renders both bulk-action buttons with the documented testids", () => {
    const src = readPage();
    expect(src).toContain('data-testid="checklist-bulk-actions"');
    expect(src).toContain('data-testid="checklist-mark-all"');
    expect(src).toContain('data-testid="checklist-reset-bulk"');
  });

  it("Mark all wires onClick → markAllChecked(SURFACES) and disables when complete", () => {
    const src = readPage();
    const idx = src.indexOf('data-testid="checklist-mark-all"');
    expect(idx).toBeGreaterThan(-1);
    const win = src.slice(Math.max(0, idx - 200), idx + 800);
    expect(win).toContain("onClick={() => markAllChecked(SURFACES)}");
    expect(win).toContain("disabled={checkedCount === TOTAL_ITEMS}");
    expect(win).toContain("Mark all 24 as checked");
  });

  it("Reset (bulk) wires onClick → reset and disables when nothing is checked", () => {
    const src = readPage();
    const idx = src.indexOf('data-testid="checklist-reset-bulk"');
    expect(idx).toBeGreaterThan(-1);
    const win = src.slice(Math.max(0, idx - 200), idx + 800);
    expect(win).toContain("onClick={reset}");
    expect(win).toContain("disabled={checkedCount === 0}");
    expect(win).toContain("Reset progress");
  });
});

/* -------------------------------------------------------------- B */

describe("§110 ?for= URL persistence for generatedFor", () => {
  it("hydrate effect reads ?for= first, then GENERATED_FOR_KEY from localStorage", () => {
    const src = readPage();
    expect(src).toMatch(/url\.searchParams\.get\(\s*["']for["']\s*\)/);
    expect(src).toMatch(
      /window\.localStorage\.getItem\(\s*GENERATED_FOR_KEY\s*\)/,
    );
    // Precedence: when fromUrl is non-empty, prefer it. When it's empty
    // / missing, fall back to localStorage (`else if`).
    expect(src).toMatch(
      /if\s*\(\s*typeof\s+fromUrl\s*===\s*["']string["']\s*&&\s*fromUrl\.trim\(\)\.length\s*>\s*0\s*\)\s*\{[\s\S]*?setGeneratedFor\(\s*fromUrl\s*\)/,
    );
    expect(src).toMatch(
      /\}\s*else\s+if\s*\(\s*typeof\s+fromStorage\s*===\s*["']string["']\s*\)\s*\{[\s\S]*?setGeneratedFor\(\s*fromStorage\s*\)/,
    );
  });

  it("write effect uses history.replaceState on change", () => {
    const src = readPage();
    expect(src).toContain("window.history.replaceState");
    // We construct a fresh URL object, manipulate searchParams, then
    // build the next path from pathname + qs + hash so we don't drop
    // the user's anchor or other params.
    expect(src).toContain(
      "const next = url.pathname + (qs ? `?${qs}` : \"\") + url.hash;",
    );
  });

  it("strips ?for= cleanly when the field is empty / whitespace", () => {
    const src = readPage();
    // `.trim().length === 0` then `delete`; otherwise `.set`.
    expect(src).toMatch(
      /const\s+trimmed\s*=\s*generatedFor\.trim\(\);[\s\S]*?if\s*\(\s*trimmed\.length\s*===\s*0\s*\)\s*\{[\s\S]*?url\.searchParams\.delete\(\s*["']for["']\s*\)/,
    );
    expect(src).toMatch(
      /\}\s*else\s*\{[\s\S]*?url\.searchParams\.set\(\s*["']for["']\s*,\s*trimmed\s*\)/,
    );
  });

  it("never uses pushState (so URL changes don't pollute history)", () => {
    const src = readPage();
    expect(src).not.toContain("window.history.pushState");
  });

  it("write effect runs alongside the localStorage persistence (same effect)", () => {
    const src = readPage();
    // Both writes must depend on the same `[generatedFor, uncheckedOnly,
    // optionsHydrated]` array so an empty-on-first-tick `setItem` race
    // can't race the URL writeback.
    expect(src).toMatch(
      /\}, \[generatedFor, uncheckedOnly, optionsHydrated\]\);/,
    );
  });
});

/* -------------------------------------------------------------- C */

describe("§110 export-count preview chip", () => {
  it("computes exportCount from uncheckedOnly ? uncheckedCount : TOTAL_ITEMS", () => {
    const src = readPage();
    expect(src).toMatch(
      /const\s+exportCount\s*=\s*uncheckedOnly\s*\?\s*uncheckedCount\s*:\s*TOTAL_ITEMS;/,
    );
  });

  it("renders the chip with the documented testid + aria-live", () => {
    const src = readPage();
    expect(src).toContain('data-testid="checklist-export-count-chip"');
    const idx = src.indexOf('data-testid="checklist-export-count-chip"');
    expect(idx).toBeGreaterThan(-1);
    const win = src.slice(Math.max(0, idx - 400), idx + 600);
    expect(win).toContain('aria-live="polite"');
  });

  it("chip text shows count + pluralization (item / items)", () => {
    const src = readPage();
    const idx = src.indexOf('data-testid="checklist-export-count-chip"');
    const win = src.slice(Math.max(0, idx - 100), idx + 800);
    expect(win).toContain("Will export {exportCount}");
    expect(win).toMatch(
      /\{exportCount === 1 \? "item" : "items"\}/,
    );
  });

  it("chip is hidden while downloading", () => {
    const src = readPage();
    // The chip is rendered inside a ternary on `!downloading`.
    expect(src).toMatch(
      /\{!downloading\s*\?\s*\(\s*<span[\s\S]*?data-testid="checklist-export-count-chip"/,
    );
  });

  it("chip's tooltip clarifies which set is being exported", () => {
    const src = readPage();
    expect(src).toContain(
      "Only items still to address will be in the PDF.",
    );
    expect(src).toContain("Every checklist item will be in the PDF.");
  });
});
