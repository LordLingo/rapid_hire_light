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

describe("§66/§108 — /compliance/checklist Download affordance", () => {
  /*
    §108 update: the static manus-storage URL was retired because it
    couldn't reflect the user's checked state, which was the original
    bug. The download is now generated at click-time from the live
    `checked` map. This block now pins the runtime wiring instead of
    the static-URL constant.
  */
  it("no longer references the legacy static CHECKLIST_PDF_URL constant", () => {
    expect(CHECKLIST_SRC).not.toMatch(/const CHECKLIST_PDF_URL =/);
    expect(CHECKLIST_SRC).not.toMatch(
      /href=\{CHECKLIST_PDF_URL\}/,
    );
  });

  it("imports the Download icon from lucide-react", () => {
    expect(CHECKLIST_SRC).toMatch(/Download,/);
  });

  it("imports the runtime PDF generator from @/lib/checklistPdf", () => {
    expect(CHECKLIST_SRC).toContain('from "@/lib/checklistPdf"');
    expect(CHECKLIST_SRC).toContain("buildChecklistPdf");
    expect(CHECKLIST_SRC).toContain("triggerChecklistDownload");
  });

  it("renders a <button> with data-testid=\"checklist-cta-download\" wired to handleDownload", () => {
    const idx = CHECKLIST_SRC.indexOf(
      'data-testid="checklist-cta-download"',
    );
    expect(idx).toBeGreaterThan(-1);
    const win = CHECKLIST_SRC.slice(
      Math.max(0, idx - 250),
      idx + 600,
    );
    // Must be a button, not the legacy anchor.
    expect(win).toMatch(/<button[\s\S]*?data-testid="checklist-cta-download"/);
    expect(win).toContain("onClick={handleDownload}");
    // Outlined CTA — same visual weight as Print this page.
    expect(win).toMatch(/border-\[color:var\(--color-border\)\]/);
    expect(win).toMatch(/bg-transparent/);
    expect(win).toMatch(/btn-press/);
    expect(win).toMatch(/<Download/);
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
});
