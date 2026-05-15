/*
  Vitest pins for the /compliance/checklist 24-point checklist page (§65).

  These pins protect:
    - Route registration in App.tsx (must precede /compliance).
    - The exact 6-surface × 4-item structure (24 items total).
    - Statute / case-law citations are present on every item.
    - localStorage progress hook keys and reset affordance.
    - Hero CTA pair, trust strip, and the closing dark CTA back to
      /compliance/audit.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..", "..");
const file = fs.readFileSync(
  path.join(ROOT, "client/src/pages/ComplianceChecklist.tsx"),
  "utf-8",
);
const appFile = fs.readFileSync(
  path.join(ROOT, "client/src/App.tsx"),
  "utf-8",
);

describe("/compliance/checklist — page exists & is wired", () => {
  it("ComplianceChecklist page file exists with default export", () => {
    expect(file).toMatch(/export default function ComplianceChecklist/);
  });

  it("App.tsx imports the page and registers /compliance/checklist BEFORE /compliance", () => {
    expect(appFile).toMatch(
      /import ComplianceChecklist from "\.\/pages\/ComplianceChecklist"/,
    );
    const checklistIdx = appFile.indexOf(
      'path={"/compliance/checklist"} component={ComplianceChecklist}',
    );
    const baseIdx = appFile.indexOf(
      'path={"/compliance"} component={Compliance}',
    );
    expect(checklistIdx).toBeGreaterThan(-1);
    expect(baseIdx).toBeGreaterThan(-1);
    expect(checklistIdx).toBeLessThan(baseIdx);
  });
});

describe("/compliance/checklist — hero", () => {
  it("uses the '00 — 24-point checklist' eyebrow", () => {
    expect(file).toMatch(/eyebrow="00 — 24-point checklist"/);
  });

  it("headline carries the italic '24-point' accent", () => {
    expect(file).toMatch(
      /italic font-light text-\[color:var\(--color-accent-ink\)\][^>]*>\s*24-point/,
    );
  });

  it("hero exposes a primary 'Start the self-audit' CTA + a print affordance", () => {
    expect(file).toMatch(/data-testid="checklist-cta-start"/);
    expect(file).toMatch(/href="#checklist"/);
    expect(file).toMatch(/data-testid="checklist-cta-print"/);
    // Print button must wire to window.print() for native printability.
    expect(file).toMatch(/window\.print\(\)/);
  });

  it("trust strip lists the four hero promises", () => {
    const strip = file.slice(
      file.indexOf('data-testid="checklist-trust-strip"'),
      file.indexOf('data-testid="checklist-trust-strip"') + 1200,
    );
    const promises = [
      "Free · no email required",
      "Statute & case-law on every line",
      "Progress saved on this device only",
      "Print or work through it on screen",
    ];
    let cursor = 0;
    for (const p of promises) {
      const idx = strip.indexOf(p, cursor);
      expect(idx, `trust strip missing: ${p}`).toBeGreaterThan(-1);
      cursor = idx + p.length;
    }
  });

  it("right-rail progress card renders count, bar, and reset button", () => {
    expect(file).toMatch(/data-testid="checklist-progress-card"/);
    expect(file).toMatch(/data-testid="checklist-progress-count"/);
    expect(file).toMatch(/data-testid="checklist-progress-bar"/);
    expect(file).toMatch(/data-testid="checklist-reset"/);
    // The progress bar uses an inline `width` driven by checkedCount.
    expect(file).toMatch(/checkedCount \/ TOTAL_ITEMS/);
  });
});

describe("/compliance/checklist — six-surface structure", () => {
  it("SURFACES[] declares exactly six surfaces with the documented slugs in fixed order", () => {
    const arrIdx = file.indexOf("const SURFACES");
    expect(arrIdx).toBeGreaterThan(-1);
    const arrSlice = file.slice(arrIdx, arrIdx + 12000);
    const slugs = [
      "disclosure",
      "pre-adverse",
      "waiting",
      "eeoc",
      "disputes",
      "monitoring",
    ];
    let cursor = 0;
    for (const slug of slugs) {
      const marker = `slug: "${slug}"`;
      const idx = arrSlice.indexOf(marker, cursor);
      expect(idx, `surface slug missing or out of order: ${slug}`).toBeGreaterThan(-1);
      cursor = idx + marker.length;
    }
  });

  it("each surface declares its zero-padded n value (01–06) in order", () => {
    const arrIdx = file.indexOf("const SURFACES");
    const arrSlice = file.slice(arrIdx, arrIdx + 12000);
    let cursor = 0;
    for (const n of ["01", "02", "03", "04", "05", "06"]) {
      const marker = `n: "${n}"`;
      const idx = arrSlice.indexOf(marker, cursor);
      expect(idx, `surface n="${n}" missing or out of order`).toBeGreaterThan(-1);
      cursor = idx + marker.length;
    }
  });

  it("renders exactly 24 checklist items (6 surfaces × 4 items)", () => {
    const arrIdx = file.indexOf("const SURFACES");
    expect(arrIdx).toBeGreaterThan(-1);
    const arrEnd = file.indexOf("\nconst TOTAL_ITEMS", arrIdx);
    expect(arrEnd).toBeGreaterThan(arrIdx);
    const arrSlice = file.slice(arrIdx, arrEnd);
    // Each item is an object with a stable `id:` key — count those.
    const idLines = arrSlice.match(/^\s*id:\s*"/gm) ?? [];
    expect(idLines.length).toBe(24);
  });

  it("every item has both `text:` and `citation:` keys", () => {
    const arrIdx = file.indexOf("const SURFACES");
    const arrEnd = file.indexOf("\nconst TOTAL_ITEMS", arrIdx);
    const arrSlice = file.slice(arrIdx, arrEnd);
    const idCount = (arrSlice.match(/^\s*id:\s*"/gm) ?? []).length;
    const textCount = (arrSlice.match(/^\s*text:\s*"/gm) ?? []).length;
    const citationCount = (arrSlice.match(/^\s*citation:\s*"/gm) ?? []).length;
    expect(idCount).toBe(24);
    expect(textCount).toBe(24);
    expect(citationCount).toBe(24);
  });

  it("TOTAL_ITEMS constant is computed from SURFACES (not hardcoded)", () => {
    expect(file).toMatch(
      /const TOTAL_ITEMS = SURFACES\.reduce\(\(acc, s\) => acc \+ s\.items\.length, 0\)/,
    );
  });
});

describe("/compliance/checklist — body section + interactivity", () => {
  it("the checklist body section is anchored at id='checklist' with scroll-mt-24", () => {
    const matches = [...file.matchAll(/id="checklist"/g)];
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const lastIdx = matches[matches.length - 1].index!;
    const block = file.slice(lastIdx - 400, lastIdx + 400);
    expect(block).toMatch(/scroll-mt-24/);
  });

  it("renders surfaces via SURFACES.map() with runtime testid template", () => {
    expect(file).toMatch(/SURFACES\.map\(/);
    expect(file).toMatch(
      /data-testid=\{`checklist-surface-\$\{surface\.slug\}`\}/,
    );
  });

  it("each item renders an interactive checkbox with runtime testid + sr-only input", () => {
    expect(file).toMatch(/surface\.items\.map\(/);
    expect(file).toMatch(/data-testid=\{`checklist-item-\$\{item\.id\}`\}/);
    expect(file).toMatch(/data-testid=\{`checklist-input-\$\{item\.id\}`\}/);
    // Visually-hidden native checkbox keeps the control accessible.
    expect(file).toMatch(/className="sr-only"/);
  });

  it("progress is persisted to localStorage under a stable, versioned key", () => {
    expect(file).toMatch(
      /const STORAGE_KEY = "rhs\.compliance-checklist\.progress\.v1"/,
    );
    expect(file).toMatch(/window\.localStorage\.getItem\(STORAGE_KEY\)/);
    expect(file).toMatch(/window\.localStorage\.setItem\(STORAGE_KEY/);
  });

  it("reset button clears all checked state via setChecked({})", () => {
    expect(file).toMatch(/const reset = \(\) => \{\s*setChecked\(\{\}\);\s*\}/);
  });
});

describe("/compliance/checklist — closing dark CTA band", () => {
  it("uses --color-footer surface and links forward to /compliance/audit + back to /compliance", () => {
    const slice = file.slice(
      file.indexOf('data-testid="checklist-closing"'),
      file.indexOf('data-testid="checklist-closing"') + 2200,
    );
    expect(slice).toMatch(/bg-\[color:var\(--color-footer\)\]/);
    expect(slice).toMatch(/data-testid="checklist-closing-cta-audit"/);
    expect(slice).toMatch(/href="\/compliance\/audit"/);
    expect(slice).toMatch(/data-testid="checklist-closing-cta-back"/);
    expect(slice).toMatch(/href="\/compliance"/);
  });
});

describe("/compliance/checklist — SEO", () => {
  it("emits the 24-point checklist title via useSeo", () => {
    expect(file).toMatch(/useSeo\(/);
    expect(file).toMatch(
      /The 24-point employer compliance checklist — Rapid Hire Solutions/,
    );
  });
});
