/*
  §66 — vitest pins for the post-§64/§65 follow-ups.

  Two surfaces protected here:

  A) Footer "Company" column now exposes the compliance funnel:
     - "Compliance"          → /compliance       (existing)
     - "24-point checklist"  → /compliance/checklist
     - "Free 15-min audit"   → /compliance/audit
     The two new items must sit AFTER "Compliance" and BEFORE "Contact".

  B) /compliance/checklist hero CTA pair gains a "Download the PDF"
     anchor between "Start the self-audit" and "Print this page". The
     anchor must reference the manus-storage PDF artifact and use the
     native download attribute.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..", "..");
const FOOTER_SRC = fs.readFileSync(
  path.join(ROOT, "client/src/components/site/Footer.tsx"),
  "utf-8",
);
const CHECKLIST_SRC = fs.readFileSync(
  path.join(ROOT, "client/src/pages/ComplianceChecklist.tsx"),
  "utf-8",
);

describe("§66 — Footer 'Company' column surfaces the compliance funnel", () => {
  it("Company array still declares the existing /compliance entry", () => {
    expect(FOOTER_SRC).toMatch(
      /\{\s*label:\s*"Compliance",\s*to:\s*"\/compliance"\s*\}/,
    );
  });

  it("adds a '24-point checklist' entry pointing at /compliance/checklist", () => {
    expect(FOOTER_SRC).toMatch(
      /\{\s*label:\s*"24-point checklist",\s*to:\s*"\/compliance\/checklist"\s*\}/,
    );
  });

  it("adds a 'Free 15-min audit' entry pointing at /compliance/audit", () => {
    expect(FOOTER_SRC).toMatch(
      /\{\s*label:\s*"Free 15-min audit",\s*to:\s*"\/compliance\/audit"\s*\}/,
    );
  });

  it("renders the new entries in the documented order: Compliance → 24-point checklist → Free 15-min audit → Contact", () => {
    const arrIdx = FOOTER_SRC.indexOf("const COMPANY");
    expect(arrIdx).toBeGreaterThan(-1);
    const arrSlice = FOOTER_SRC.slice(arrIdx, arrIdx + 1500);
    const i1 = arrSlice.indexOf('label: "Compliance"');
    const i2 = arrSlice.indexOf('label: "24-point checklist"');
    const i3 = arrSlice.indexOf('label: "Free 15-min audit"');
    const i4 = arrSlice.indexOf('label: "Contact"');
    expect(i1).toBeGreaterThan(-1);
    expect(i2).toBeGreaterThan(i1);
    expect(i3).toBeGreaterThan(i2);
    expect(i4).toBeGreaterThan(i3);
  });
});

describe("§66 — /compliance/checklist Download the PDF affordance", () => {
  it("declares a CHECKLIST_PDF_URL constant pointing at /manus-storage/...pdf", () => {
    expect(CHECKLIST_SRC).toMatch(/const CHECKLIST_PDF_URL =/);
    const m = CHECKLIST_SRC.match(/const CHECKLIST_PDF_URL =\s*"([^"]+)"/);
    expect(m, "CHECKLIST_PDF_URL must be a string literal").toBeTruthy();
    const url = m![1];
    expect(url).toMatch(
      /^\/manus-storage\/RapidHire-24-Point-Compliance-Checklist_[a-z0-9]+\.pdf$/,
    );
  });

  it("imports the Download icon from lucide-react", () => {
    expect(CHECKLIST_SRC).toMatch(/Download,/);
  });

  it("renders an anchor with data-testid=\"checklist-cta-download\" using the URL constant + native download attr", () => {
    expect(CHECKLIST_SRC).toMatch(/data-testid="checklist-cta-download"/);
    const block = CHECKLIST_SRC.match(
      /<a[\s\S]*?data-testid="checklist-cta-download"[\s\S]*?Download the PDF[\s\S]*?<\/a>/,
    );
    expect(block, "download anchor block must exist").toBeTruthy();
    const text = block![0];
    expect(text).toMatch(/href=\{CHECKLIST_PDF_URL\}/);
    // The bare `download` attribute (no value) hints the browser to save
    // rather than navigate, preserving the original filename.
    expect(text).toMatch(/\bdownload\b/);
    expect(text).toMatch(/<Download/);
    // Outlined CTA — same visual weight as Print this page.
    expect(text).toMatch(/border-\[color:var\(--color-border\)\]/);
    expect(text).toMatch(/bg-transparent/);
    expect(text).toMatch(/btn-press/);
  });

  it("places the Download CTA between Start the self-audit and Print this page", () => {
    const startIdx = CHECKLIST_SRC.indexOf(
      'data-testid="checklist-cta-start"',
    );
    const downloadIdx = CHECKLIST_SRC.indexOf(
      'data-testid="checklist-cta-download"',
    );
    const printIdx = CHECKLIST_SRC.indexOf(
      'data-testid="checklist-cta-print"',
    );
    expect(startIdx).toBeGreaterThan(-1);
    expect(downloadIdx).toBeGreaterThan(startIdx);
    expect(printIdx).toBeGreaterThan(downloadIdx);
  });

  it("PDF asset exists on disk in webdev-static-assets/", () => {
    // Sanity check that the source PDF artifact is present in the
    // checked-in static-assets staging area; an upload may rotate its
    // hash suffix, but the source filename is stable.
    const assetPath = path.resolve(
      ROOT,
      "..",
      "webdev-static-assets",
      "RapidHire-24-Point-Compliance-Checklist.pdf",
    );
    expect(fs.existsSync(assetPath)).toBe(true);
    const stat = fs.statSync(assetPath);
    // PDF should be non-trivial (10kB+) and reasonably small for a
    // text-only artifact (under 1MB).
    expect(stat.size).toBeGreaterThan(10_000);
    expect(stat.size).toBeLessThan(1_000_000);
  });
});
