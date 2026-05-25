/*
  §171 — /why-spa comparison-table column-order pin.

  The comparison table on the Why-SPA page intentionally orders columns
  as Pillar | Rapid Hire | Typical legacy vendor. English reads
  left-to-right, so the brand-blue "Rapid Hire" header lands as the
  first comparison cell a reader's eye hits, putting the positive
  solution statement *before* the negative legacy contrast.

  These pins guard:

    1. Header row order: Pillar -> Rapid Hire -> Typical legacy vendor.
    2. Body row order: pillar cell -> row.rapidHire cell -> row.legacyVendor cell.
    3. Brand-blue accent stays on the Rapid Hire header (its visual
       weight is part of why it goes first).
    4. The legacy-vendor header stays muted (so the contrast stays
       deliberately understated).

  These keep a future "tidy the comparison" pass from quietly reverting
  the column order or stripping the brand-color signaling that makes
  the order purposeful.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SPA_PATH = resolve(__dirname, "..", "pages", "Spa.tsx");
const SPA_SRC = readFileSync(SPA_PATH, "utf8");

describe("§171 — Why-SPA comparison column order", () => {
  it("the header row places Pillar, then Rapid Hire, then Typical legacy vendor", () => {
    const pillarIdx = SPA_SRC.indexOf(">\n                        Pillar\n");
    const rhIdx = SPA_SRC.indexOf(">\n                        Rapid Hire\n");
    const legacyIdx = SPA_SRC.indexOf(
      ">\n                        Typical legacy vendor\n",
    );
    expect(pillarIdx, "Pillar header must exist").toBeGreaterThan(-1);
    expect(rhIdx, "Rapid Hire header must exist").toBeGreaterThan(-1);
    expect(
      legacyIdx,
      "Typical legacy vendor header must exist",
    ).toBeGreaterThan(-1);
    expect(pillarIdx).toBeLessThan(rhIdx);
    expect(rhIdx).toBeLessThan(legacyIdx);
  });

  it("the body row renders {row.rapidHire} before {row.legacyVendor}", () => {
    const rhCell = SPA_SRC.indexOf("{row.rapidHire}");
    const legacyCell = SPA_SRC.indexOf("{row.legacyVendor}");
    expect(rhCell, "row.rapidHire cell must exist").toBeGreaterThan(-1);
    expect(legacyCell, "row.legacyVendor cell must exist").toBeGreaterThan(-1);
    expect(rhCell).toBeLessThan(legacyCell);
  });

  it("Rapid Hire header keeps the brand-blue accent class", () => {
    // Pull the th block immediately preceding "Rapid Hire" and check it
    // still uses the brand-accent-ink color token. If a future restyle
    // demotes RH to the muted color, this guard fires.
    const block = SPA_SRC.match(
      /<th[^>]*className="([^"]*)"[^>]*>\s*Rapid Hire\s*<\/th>/,
    );
    expect(block, "Rapid Hire <th> with className must exist").not.toBeNull();
    expect(block?.[1] ?? "").toMatch(/text-\[color:var\(--color-accent-ink\)\]/);
  });

  it("Typical legacy vendor header keeps the muted ink color", () => {
    const block = SPA_SRC.match(
      /<th[^>]*className="([^"]*)"[^>]*>\s*Typical legacy vendor\s*<\/th>/,
    );
    expect(
      block,
      "Typical legacy vendor <th> with className must exist",
    ).not.toBeNull();
    expect(block?.[1] ?? "").toMatch(/text-\[color:var\(--color-ink-muted\)\]/);
  });

  it("the brand-blue CheckCircle2 icon stays paired with the Rapid Hire body cell", () => {
    // Scope the search to the first Rapid Hire body <td> by slicing
    // the source between {row.rapidHire} and the legacy cell.
    const rhStart = SPA_SRC.indexOf("{row.rapidHire}");
    const legacyStart = SPA_SRC.indexOf("{row.legacyVendor}");
    const segment = SPA_SRC.slice(rhStart - 600, rhStart);
    expect(segment).toMatch(/CheckCircle2/);
    expect(segment).toMatch(/text-\[color:var\(--color-accent-ink\)\]/);
    // And confirm the XCircle icon is on the legacy side, not the RH side.
    const legacySegment = SPA_SRC.slice(legacyStart - 600, legacyStart);
    expect(legacySegment).toMatch(/XCircle/);
  });
});
