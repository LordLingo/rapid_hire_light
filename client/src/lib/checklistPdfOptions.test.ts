/*
  §109 — generatedFor + uncheckedOnly options on the runtime PDF.

  Covers three surfaces:
    A) `buildChecklistFilename` slugifies the company name and appends
       a `-gaps` suffix when uncheckedOnly is on.
    B) `buildChecklistPdf({ generatedFor })` stamps the cover with
       "Generated for: <company>" and bakes the company into the PDF
       Subject metadata.
    C) `buildChecklistPdf({ uncheckedOnly: true })` omits surfaces with
       zero unchecked items, only renders unchecked items in surviving
       surfaces, and uses the gaps-only cover title + headline.
    D) `ComplianceChecklist.tsx` mounts a generated-for input + an
       unchecked-only toggle, and threads both into `buildChecklistPdf`
       and `buildChecklistFilename` calls.

  Text extraction goes through `pdfjs-dist`'s legacy build, mirroring
  §108's checklistPdf.test.ts — the canonical way to read pdf-lib
  output back as plain text.
*/

import { describe, expect, it } from "vitest";
import {
  buildChecklistFilename,
  buildChecklistPdf,
  type ChecklistSurface,
} from "./checklistPdf";

const FIXTURE: ReadonlyArray<ChecklistSurface> = [
  {
    n: "01",
    slug: "alpha",
    title: "Alpha surface heading",
    accent: "alpha accent",
    intro: "Alpha intro paragraph.",
    items: [
      { id: "alpha-1", text: "Alpha item one body.", citation: "Alpha cite 1" },
      { id: "alpha-2", text: "Alpha item two body.", citation: "Alpha cite 2" },
    ],
  },
  {
    n: "02",
    slug: "beta",
    title: "Beta surface heading",
    accent: "beta accent",
    intro: "Beta intro paragraph.",
    items: [
      { id: "beta-1", text: "Beta item one body.", citation: "Beta cite 1" },
      { id: "beta-2", text: "Beta item two body.", citation: "Beta cite 2" },
    ],
  },
];

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = bytes.slice();
  const loadingTask = pdfjs.getDocument({
    data,
    isEvalSupported: false,
    useSystemFonts: false,
    disableFontFace: true,
  });
  const doc = await loadingTask.promise;
  const out: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    out.push(content.items.map((it: any) => it.str ?? "").join(" "));
  }
  return out.join("\n");
}

describe("§109 buildChecklistFilename", () => {
  it("returns the bare default filename when no options are passed", () => {
    expect(buildChecklistFilename()).toBe(
      "rapid-hire-24-point-compliance-checklist.pdf",
    );
    expect(buildChecklistFilename({})).toBe(
      "rapid-hire-24-point-compliance-checklist.pdf",
    );
  });

  it("slugifies the company name and appends it before the extension", () => {
    expect(buildChecklistFilename({ generatedFor: "Acme Co." })).toBe(
      "rapid-hire-24-point-compliance-checklist-acme-co.pdf",
    );
    // Mixed case + symbols + accented chars + multiple spaces.
    expect(
      buildChecklistFilename({ generatedFor: "  HR @ Café/Tech!  " }),
    ).toBe("rapid-hire-24-point-compliance-checklist-hr-caf-tech.pdf");
  });

  it("appends `-gaps` when uncheckedOnly is on, with or without a company", () => {
    expect(buildChecklistFilename({ uncheckedOnly: true })).toBe(
      "rapid-hire-24-point-compliance-checklist-gaps.pdf",
    );
    expect(
      buildChecklistFilename({ generatedFor: "Acme", uncheckedOnly: true }),
    ).toBe("rapid-hire-24-point-compliance-checklist-acme-gaps.pdf");
  });

  it("ignores empty / whitespace-only company names", () => {
    expect(buildChecklistFilename({ generatedFor: "" })).toBe(
      "rapid-hire-24-point-compliance-checklist.pdf",
    );
    expect(buildChecklistFilename({ generatedFor: "   " })).toBe(
      "rapid-hire-24-point-compliance-checklist.pdf",
    );
  });

  it("caps the slug at a reasonable length so filenames stay readable", () => {
    const long = "A".repeat(120);
    const out = buildChecklistFilename({ generatedFor: long });
    // Slug portion (everything between the base and `.pdf`) must be
    // capped at 48 chars per the implementation.
    const m = out.match(
      /^rapid-hire-24-point-compliance-checklist-([a-z0-9-]+)\.pdf$/,
    );
    expect(m).not.toBeNull();
    expect(m![1].length).toBeLessThanOrEqual(48);
  });
});

describe("§109 buildChecklistPdf — generatedFor cover attribution", () => {
  it("stamps `Generated for: <company>` on the cover when provided", async () => {
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {},
      generatedFor: "Acme Manufacturing",
    });
    const txt = await extractPdfText(bytes);
    expect(txt).toContain("Generated for: Acme Manufacturing");
  });

  it("omits the attribution line cleanly when generatedFor is empty / missing", async () => {
    const noOpt = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {},
    });
    const empty = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {},
      generatedFor: "",
    });
    const ws = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {},
      generatedFor: "   ",
    });
    for (const bytes of [noOpt, empty, ws]) {
      const txt = await extractPdfText(bytes);
      expect(txt).not.toContain("Generated for:");
    }
  });
});

describe("§109 buildChecklistPdf — uncheckedOnly mode", () => {
  it("uses the gaps-only cover title and headline", async () => {
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: { "alpha-1": true },
      uncheckedOnly: true,
    });
    const txt = await extractPdfText(bytes);
    expect(txt).toContain("UNCHECKED ITEMS ONLY");
    expect(txt).toContain("Outstanding compliance items");
    // 4 items in fixture, 1 checked → 3 still to address.
    expect(txt).toContain("3 items still to address.");
  });

  it("skips surfaces whose items are all checked", async () => {
    // Check both items in the alpha surface; beta is fully unchecked.
    const checked = { "alpha-1": true, "alpha-2": true };
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked,
      uncheckedOnly: true,
    });
    const txt = await extractPdfText(bytes);
    // Alpha surface must NOT appear at all.
    expect(txt).not.toContain("Alpha surface heading");
    expect(txt).not.toContain("Alpha item one body.");
    expect(txt).not.toContain("Alpha item two body.");
    // Beta surface must appear with both items.
    expect(txt).toContain("Beta surface heading");
    expect(txt).toContain("Beta item one body.");
    expect(txt).toContain("Beta item two body.");
  });

  it("only renders unchecked items inside surviving surfaces", async () => {
    // Check beta-1 only; both surfaces have remaining unchecked items so
    // both surfaces render, but beta-1 must be omitted from the output.
    const checked = { "beta-1": true };
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked,
      uncheckedOnly: true,
    });
    const txt = await extractPdfText(bytes);
    expect(txt).toContain("Alpha surface heading");
    expect(txt).toContain("Beta surface heading");
    expect(txt).toContain("Alpha item one body.");
    expect(txt).toContain("Alpha item two body.");
    expect(txt).toContain("Beta item two body.");
    // Beta-1 was checked → omitted in gaps-only mode.
    expect(txt).not.toContain("Beta item one body.");
    // No `[x]` markers in this mode (we only render unchecked items).
    const closed = (txt.match(/\[\s*x\s*\]/g) ?? []).length;
    expect(closed).toBe(0);
  });

  it("singular vs plural in the gaps headline (`1 item` vs `2 items`)", async () => {
    // 1 item still to address (3 of 4 checked).
    const oneLeft = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {
        "alpha-1": true,
        "alpha-2": true,
        "beta-1": true,
      },
      uncheckedOnly: true,
    });
    const oneTxt = await extractPdfText(oneLeft);
    expect(oneTxt).toContain("1 item still to address.");

    // 2 items still to address (2 of 4 checked).
    const twoLeft = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: { "alpha-1": true, "alpha-2": true },
      uncheckedOnly: true,
    });
    const twoTxt = await extractPdfText(twoLeft);
    expect(twoTxt).toContain("2 items still to address.");
  });
});

describe("§109 ComplianceChecklist.tsx wiring", () => {
  async function read(): Promise<string> {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    return readFileSync(
      resolve(__dirname, "..", "pages", "ComplianceChecklist.tsx"),
      "utf8",
    );
  }

  it("imports buildChecklistFilename alongside the existing helpers", async () => {
    const src = await read();
    expect(src).toContain("buildChecklistFilename");
    expect(src).toContain("buildChecklistPdf");
    expect(src).toContain("triggerChecklistDownload");
  });

  it("renders an input for the company name with the documented testid + maxlength", async () => {
    const src = await read();
    const idx = src.indexOf(
      'data-testid="checklist-generated-for-input"',
    );
    expect(idx).toBeGreaterThan(-1);
    const win = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(win).toContain("value={generatedFor}");
    expect(win).toContain("setGeneratedFor(e.target.value)");
    // Cap input to keep the cover line + filename slug bounded.
    expect(win).toMatch(/maxLength=\{80\}/);
  });

  it("renders a checkbox toggle for unchecked-only mode with the documented testid", async () => {
    const src = await read();
    const idx = src.indexOf(
      'data-testid="checklist-unchecked-only-toggle"',
    );
    expect(idx).toBeGreaterThan(-1);
    const win = src.slice(Math.max(0, idx - 400), idx + 800);
    expect(win).toContain("checked={uncheckedOnly}");
    expect(win).toContain("setUncheckedOnly(e.target.checked)");
    expect(win).toContain('type="checkbox"');
    // Live remaining-count badge so the user sees what they'd export.
    expect(win).toContain("Unchecked items only ({uncheckedCount})");
  });

  it("threads generatedFor + uncheckedOnly into buildChecklistPdf and the filename", async () => {
    const src = await read();
    // Generator call must include both new fields.
    expect(src).toMatch(/buildChecklistPdf\(\{[\s\S]*?generatedFor[\s\S]*?uncheckedOnly[\s\S]*?\}\)/);
    // Download trigger must include the matching filename helper.
    expect(src).toMatch(
      /triggerChecklistDownload\([\s\S]*?buildChecklistFilename\(\{[\s\S]*?generatedFor[\s\S]*?uncheckedOnly[\s\S]*?\}\)/,
    );
  });

  it("guards against empty exports when uncheckedOnly is on with everything checked", async () => {
    const src = await read();
    expect(src).toContain("uncheckedOnly && uncheckedCount === 0");
    expect(src).toContain("Nothing left to flag");
  });

  it("persists the new options to localStorage under the documented keys", async () => {
    const src = await read();
    expect(src).toContain(
      '"rhs.compliance-checklist.generated-for.v1"',
    );
    expect(src).toContain(
      '"rhs.compliance-checklist.unchecked-only.v1"',
    );
  });
});
