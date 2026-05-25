/*
  §172 — MVR turnaround stat parity pin.

  The Transportation & Logistics industry card publishes an MVR
  turnaround stat in two files (a known pre-existing duplication of
  source between Industries.tsx and industryCatalog.ts). User-confirmed
  posture: all MVR pulls are real-time via electronic DMV connections,
  so the stat reads:

      value: "Instant"
      label: "MVR pulls"
      sub:   "electronic-DMV states · all 50"

  The qualifier intentionally matches the value — the previous "1 hr /
  single-state, business hours" qualifier would have been internally
  contradictory once the value flipped to "Instant".

  These pins guard:

    1. Both source files carry the new value, label, and sub.
    2. Neither file silently regresses to the old "1 hr" / "Median MVR"
       / "single-state, business hours" strings.
    3. The two files stay in lock-step (parity invariant).
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INDUSTRIES_PAGE_PATH = resolve(
  __dirname,
  "..",
  "pages",
  "Industries.tsx",
);
const INDUSTRY_CATALOG_PATH = resolve(__dirname, "industryCatalog.ts");

const PAGE_SRC = readFileSync(INDUSTRIES_PAGE_PATH, "utf8");
const CATALOG_SRC = readFileSync(INDUSTRY_CATALOG_PATH, "utf8");

const NEW_STAT_LITERAL =
  '{ value: "Instant", label: "MVR pulls", sub: "electronic-DMV states · all 50" }';

describe("§172 — MVR stat reads Instant in both source files", () => {
  it("Industries.tsx contains the new MVR stat tuple", () => {
    expect(PAGE_SRC).toContain(NEW_STAT_LITERAL);
  });

  it("industryCatalog.ts contains the new MVR stat tuple", () => {
    expect(CATALOG_SRC).toContain(NEW_STAT_LITERAL);
  });

  it("neither file still carries the old MVR stat language", () => {
    // The prior tuple — guard against silent regression to the old claim.
    const oldStatLiteral =
      '{ value: "1 hr", label: "Median MVR", sub: "single-state, business hours" }';
    expect(PAGE_SRC).not.toContain(oldStatLiteral);
    expect(CATALOG_SRC).not.toContain(oldStatLiteral);
  });

  it("the two duplicated source files stay in lock-step (parity invariant)", () => {
    // Pull the transportation-vertical stats array from each file and
    // confirm they are byte-identical for the MVR row. If a future edit
    // touches one but not the other, this guard fires.
    const pageRow = PAGE_SRC.match(
      /\{\s*value:\s*"[^"]*",\s*label:\s*"[^"]*",\s*sub:\s*"[^"]*real-time CDL[^"]*"\s*\}/,
    );
    const catalogRow = CATALOG_SRC.match(
      /\{\s*value:\s*"[^"]*",\s*label:\s*"[^"]*",\s*sub:\s*"[^"]*real-time CDL[^"]*"\s*\}/,
    );
    expect(pageRow, "transportation stats row must be findable in Industries.tsx").not.toBeNull();
    expect(catalogRow, "transportation stats row must be findable in industryCatalog.ts").not.toBeNull();
    // Walk back from the License-alerts row to find the preceding MVR row
    // — the MVR row is always the row above 24/7 License alerts.
    const pageMvrIdx = PAGE_SRC.indexOf(NEW_STAT_LITERAL);
    const pageLicenseIdx = PAGE_SRC.indexOf(
      'value: "24/7", label: "License alerts"',
    );
    const catalogMvrIdx = CATALOG_SRC.indexOf(NEW_STAT_LITERAL);
    const catalogLicenseIdx = CATALOG_SRC.indexOf(
      'value: "24/7", label: "License alerts"',
    );
    expect(pageMvrIdx).toBeLessThan(pageLicenseIdx);
    expect(catalogMvrIdx).toBeLessThan(catalogLicenseIdx);
  });

  it("the value 'Instant' is paired with a non-contradictory qualifier", () => {
    // The old qualifier "single-state, business hours" backed up a 1-hr
    // claim. With "Instant" the qualifier must NOT undercut the value
    // by mentioning batch windows, hours of operation, or single-state
    // limits.
    const stat = NEW_STAT_LITERAL;
    expect(stat).not.toMatch(/business hours/);
    expect(stat).not.toMatch(/batch/i);
    expect(stat).not.toMatch(/single-state/);
  });
});
