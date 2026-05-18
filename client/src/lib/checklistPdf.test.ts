/*
  §108 — checklistPdf invariants

  The bug we are guarding against: the previous /compliance/checklist
  download pointed at a static, pre-built PDF asset that had no idea
  which items the user had checked, so the file never matched the UI.

  This spec runs the new runtime generator end-to-end with a hand-
  crafted `checked` map and asserts that the resulting PDF (a) is a
  valid byte stream, (b) contains every surface title and item text
  from the source data, and (c) carries the right [x] / [ ] markers
  per item.

  We extract the rendered text using pdfjs-dist (the canonical PDF
  text-extraction library) instead of substring-matching the raw bytes
  because pdf-lib Flate-compresses content streams.
*/

import { describe, expect, it } from "vitest";
import {
  buildChecklistPdf,
  type ChecklistSurface,
} from "./checklistPdf";

const FIXTURE: ReadonlyArray<ChecklistSurface> = [
  {
    n: "01",
    slug: "alpha",
    title: "Alpha surface heading",
    accent: "alpha accent",
    intro: "Alpha intro paragraph that just exists to fill the layout.",
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
    intro: "Beta intro paragraph mirroring the page lede style.",
    items: [
      { id: "beta-1", text: "Beta item one body.", citation: "Beta cite 1" },
      { id: "beta-2", text: "Beta item two body.", citation: "Beta cite 2" },
    ],
  },
];

/**
 * Extract all text from a PDF byte stream using pdfjs-dist's legacy
 * Node build. Returns a single string with page contents concatenated
 * by spaces so substring matching is stable.
 */
async function extractPdfText(bytes: Uint8Array): Promise<string> {
  // Use the legacy build because the modern pdfjs entrypoint depends
  // on browser-only globals (DOMMatrix, OffscreenCanvas) that jsdom
  // does not provide.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // pdfjs needs a "data" buffer it can take ownership of. We pass a
  // copy so the original Uint8Array is untouched.
  const data = bytes.slice();
  const loadingTask = pdfjs.getDocument({
    data,
    // pdf-lib doesn't embed fonts that pdfjs needs to walk; the legacy
    // build emits warnings without these flags.
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

describe("§108 buildChecklistPdf", () => {
  it("emits a valid PDF byte stream starting with %PDF-", async () => {
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {},
    });
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(1000);
    const head = String.fromCharCode(...bytes.subarray(0, 5));
    expect(head).toBe("%PDF-");
  });

  it("includes every surface title and item text from the source data", async () => {
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {},
    });
    const txt = await extractPdfText(bytes);
    for (const surface of FIXTURE) {
      expect(txt).toContain(surface.title);
      for (const item of surface.items) {
        expect(txt).toContain(item.text);
        expect(txt).toContain(item.citation);
      }
    }
  });

  it("renders every item as [ ] when nothing is checked", async () => {
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: {},
    });
    const txt = await extractPdfText(bytes);
    const open = (txt.match(/\[ ?\]/g) ?? []).length;
    const closed = (txt.match(/\[\s*x\s*\]/g) ?? []).length;
    // Four items in the fixture, all unchecked → at least four `[ ]`
    // tokens. We use >= so future fixture growth doesn't break the
    // invariant.
    expect(open).toBeGreaterThanOrEqual(4);
    expect(closed).toBe(0);
  });

  it("renders [x] for checked items and [ ] for unchecked items", async () => {
    const checked = {
      "alpha-1": true,
      "beta-2": true,
    };
    const bytes = await buildChecklistPdf({ surfaces: FIXTURE, checked });
    const txt = await extractPdfText(bytes);
    const open = (txt.match(/\[ ?\]/g) ?? []).length;
    const closed = (txt.match(/\[\s*x\s*\]/g) ?? []).length;
    expect(closed).toBeGreaterThanOrEqual(2);
    expect(open).toBeGreaterThanOrEqual(2);
  });

  it("ignores `checked` keys that aren't in SURFACES (no rendering side-effects)", async () => {
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked: { "phantom-id": true },
    });
    const txt = await extractPdfText(bytes);
    expect(txt).not.toContain("phantom-id");
    const closed = (txt.match(/\[\s*x\s*\]/g) ?? []).length;
    expect(closed).toBe(0);
  });

  it("stamps the brand line and the progress count on the cover", async () => {
    const checked = { "alpha-1": true, "beta-1": true, "beta-2": true };
    const bytes = await buildChecklistPdf({
      surfaces: FIXTURE,
      checked,
    });
    const txt = await extractPdfText(bytes);
    expect(txt).toContain("Rapid Hire Solutions");
    expect(txt).toContain("3 of 4 items checked.");
  });
});

describe("§108 ComplianceChecklist.tsx wiring", () => {
  it("imports buildChecklistPdf + triggerChecklistDownload from the new module", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const src = readFileSync(
      resolve(__dirname, "..", "pages", "ComplianceChecklist.tsx"),
      "utf8",
    );
    expect(src).toContain('from "@/lib/checklistPdf"');
    expect(src).toContain("buildChecklistPdf");
    expect(src).toContain("triggerChecklistDownload");
    // The static-PDF anchor must be gone — the bug was that the static
    // PDF didn't reflect checked state.
    expect(src).not.toMatch(/href=\{CHECKLIST_PDF_URL\}/);
    expect(src).not.toContain(
      'href="/manus-storage/RapidHire-24-Point-Compliance-Checklist',
    );
  });

  it("the download button is now a <button> with onClick={handleDownload}", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const src = readFileSync(
      resolve(__dirname, "..", "pages", "ComplianceChecklist.tsx"),
      "utf8",
    );
    // Find the JSX block that carries the download testid and assert
    // it includes onClick={handleDownload}. We scope to a narrow
    // window around the testid so the regex doesn't drift across
    // unrelated source.
    const idx = src.indexOf('data-testid="checklist-cta-download"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 200), idx + 400);
    expect(window).toContain("onClick={handleDownload}");
    // It must be a <button> element, not an <a>.
    expect(window).toMatch(/<button[\s\S]*?data-testid="checklist-cta-download"/);
  });
});
