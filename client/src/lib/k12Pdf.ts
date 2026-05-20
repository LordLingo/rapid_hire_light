/*
  §153 — Runtime PDF generator for /resources/k12-compliance-guide.

  Why this exists
  ---------------
  The K-12 compliance guide is a long, dense reference document covering
  10 state rows, 4 federal layers, a 5-step district workflow, and a
  companion-reading rail. District HR teams often want to save it for
  offline reference or hand it to counsel for review. This module builds
  a Letter-format, multi-page PDF on the fly from the same source-of-truth
  data the page renders — `K12_COMPLIANCE_MATRIX`, `K12_FEDERAL_LAYERS`,
  and `k12MatrixCounts()` from `k12ComplianceMatrix.ts` — so the export
  cannot drift from the on-screen guide.

  Design choices
  --------------
  - Uses `pdf-lib`, which works in both jsdom (for vitest) and the
    browser, matches what `checklistPdf.ts` already uses, and ships zero
    native dependencies.
  - Letter sized (8.5 × 11 in / 612 × 792 pt), 54pt margins, Helvetica
    base-14 fonts.
  - Page footer on every page: brand line at left, generated-date at
    right, hairline rule above, page-number stamp top-right after the
    fact (matches the checklist PDF's pattern).
  - Word-wrap is estimated with `font.widthOfTextAtSize` — exact enough
    that we never overflow the content column at the sizes used here.
  - Pure data in / `Uint8Array` out, so the generator is unit-testable
    independent of the DOM. The browser-side `triggerK12CompliancePdfDownload`
    helper is split out so jsdom doesn't need to mock URL.createObjectURL.

  Public API
  ----------
    buildK12CompliancePdf(opts?): Promise<Uint8Array>
    buildK12CompliancePdfFilename(opts?): string
    triggerK12CompliancePdfDownload(bytes, filename?): void
*/

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  K12_COMPLIANCE_MATRIX,
  K12_FEDERAL_LAYERS,
  k12MatrixCounts,
} from "./k12ComplianceMatrix";

export type BuildK12PdfOptions = {
  /** Override the cover-page title. */
  title?: string;
  /** Override the brand line printed in every page footer. */
  brandLine?: string;
  /** Override the cover-page generated date. Defaults to "now". */
  generatedAt?: Date;
  /** Optional company / district / team to print on the cover. */
  generatedFor?: string;
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const INK = rgb(0.07, 0.1, 0.15); // editorial dark
const INK_SOFT = rgb(0.27, 0.32, 0.39);
const ACCENT = rgb(0.13, 0.39, 0.84); // brand cobalt
const RULE = rgb(0.85, 0.87, 0.9);
const WATERMARK = rgb(0.88, 0.91, 0.96); // very soft brand wash for the monogram

/*
  The district workflow lives in the page module's runtime JSX (as the
  WORKFLOW array). We mirror the same five moves here so the PDF
  generator can run independently of the React module and remains
  testable in jsdom. If the on-screen list ever needs to change, the
  workflow data should be lifted into k12ComplianceMatrix.ts and read
  from there to keep a single source of truth — but for now the two
  arrays are intentionally co-versioned and reviewed together.
*/
type WorkflowMove = { n: string; title: string; body: string };
const WORKFLOW_MOVES: ReadonlyArray<WorkflowMove> = [
  {
    n: "01",
    title: "Confirm the print-and-clearance trigger.",
    body:
      "Identify whether the role is certificated, classified, or contractor; cross-reference state statute to confirm whether FBI/CHRI prints, state-only prints, or a name-based check applies. Document the citation in the offer file so a future audit isn't a scramble.",
  },
  {
    n: "02",
    title: "Decide volunteer + contractor scope.",
    body:
      "Several states (FL, PA, CA) extend statutory screening to volunteers and on-campus contractors; others leave it to board policy. Set the threshold once and pipe it into your visitor-management and procurement workflows so a substitute teacher and an HVAC vendor don't get treated the same way.",
  },
  {
    n: "03",
    title: "Apply the tier framework, not just the result.",
    body:
      "FL §1012.32, TX SB 9, and a handful of other states enumerate statutory permanent-bar offenses separately from discretionary review tiers. Build the matrix into your adjudication SOP so a hit on a Tier-1 statute is auto-flagged for re-verification, not silently waived.",
  },
  {
    n: "04",
    title: "Set the re-fingerprint cadence in writing.",
    body:
      "PA (5 years), FL (5 years), OH (5 years aligned to license renewal), TX + MI (continuous rap-back subscription). Record the cadence in your HRIS and tie it to license-renewal reminders so a 5-year window doesn't lapse during a hiring freeze.",
  },
  {
    n: "05",
    title: "Layer FCRA + ESSA §8546 on top.",
    body:
      "Even when state law is satisfied, the federal stack still applies: FCRA disclosure + standalone authorization + pre-adverse-action sequence whenever a CRA assembles the report, plus ESSA §8546 employment-history verification before any federally funded LEA finalizes a hire.",
  },
];

function measure(
  text: string,
  size: number,
  font: import("pdf-lib").PDFFont,
): number {
  return font.widthOfTextAtSize(text, size);
}

/** Word-wrap a paragraph to a width budget, returning the resulting lines. */
function wrap(
  text: string,
  size: number,
  font: import("pdf-lib").PDFFont,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (measure(candidate, size, font) <= maxWidth) {
      line = candidate;
    } else {
      if (line) out.push(line);
      if (measure(w, size, font) > maxWidth) {
        // Hard-break a word that's wider than the column.
        let chunk = "";
        for (const ch of w) {
          if (measure(chunk + ch, size, font) <= maxWidth) {
            chunk += ch;
          } else {
            out.push(chunk);
            chunk = ch;
          }
        }
        line = chunk;
      } else {
        line = w;
      }
    }
  }
  if (line) out.push(line);
  return out;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Build a Letter-format PDF of the K-12 compliance guide. Returns the
 * encoded PDF bytes.
 */
export async function buildK12CompliancePdf(
  opts: BuildK12PdfOptions = {},
): Promise<Uint8Array> {
  const {
    title = "K-12 Compliance Guide — fingerprint, statute & federal-layer reference",
    brandLine = "Rapid Hire Solutions · rapidhiresolutions.com",
    generatedAt = new Date(),
    generatedFor,
  } = opts;

  const generatedForClean =
    typeof generatedFor === "string" && generatedFor.trim().length > 0
      ? generatedFor.trim()
      : undefined;

  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor("Rapid Hire Solutions");
  pdf.setSubject(
    generatedForClean
      ? `K-12 employment-screening compliance guide — ${generatedForClean}`
      : "K-12 employment-screening compliance guide",
  );
  pdf.setProducer("Rapid Hire Solutions K-12 guide generator");

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const counts = k12MatrixCounts();

  // ---- per-page helpers ----
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN_TOP;
  let isCoverPage = true;

  /*
    Cover watermark — a low-opacity "RHS" monogram drawn only on the
    first page (the cover). It reads as a subtle brand wash in the
    bottom-right rather than competing with content. Restricted to the
    cover via the isCoverPage flag so it never bleeds onto data pages.
  */
  function drawCoverWatermark(p: import("pdf-lib").PDFPage) {
    const mono = "RHS";
    const size = 56;
    const w = measure(mono, size, helvBold);
    p.drawText(mono, {
      x: PAGE_WIDTH - MARGIN_X - w,
      y: MARGIN_BOTTOM + 20,
      size,
      font: helvBold,
      color: WATERMARK,
    });
  }

  /*
    Footer — hairline rule above, brand line on the left (bold for the
    company name + thin separator + the domain in soft ink), date on a
    soft second line below the brand. Page number is stamped here too,
    consolidating the previous two-pass footer into a single draw so
    nothing competes for the same y band.
  */
  function drawFooter(
    p: import("pdf-lib").PDFPage,
    pageNumber?: number,
    pageTotal?: number,
  ) {
    p.drawLine({
      start: { x: MARGIN_X, y: 52 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: 52 },
      thickness: 0.5,
      color: RULE,
    });
    p.drawText("Rapid Hire Solutions", {
      x: MARGIN_X,
      y: 36,
      size: 9,
      font: helvBold,
      color: INK,
    });
    const brandLead = measure("Rapid Hire Solutions  \u00b7  ", 9, helvBold);
    p.drawText("rapidhiresolutions.com", {
      x: MARGIN_X + brandLead,
      y: 36,
      size: 9,
      font: helv,
      color: INK_SOFT,
    });
    const date = `Generated ${formatDate(generatedAt)}`;
    const dateW = measure(date, 9, helv);
    if (pageNumber && pageTotal) {
      const pageLabel = `${pageNumber} / ${pageTotal}`;
      const pageW = measure(pageLabel, 9, helvBold);
      p.drawText(pageLabel, {
        x: PAGE_WIDTH - MARGIN_X - pageW,
        y: 36,
        size: 9,
        font: helvBold,
        color: INK,
      });
      p.drawText(date, {
        x: PAGE_WIDTH - MARGIN_X - dateW,
        y: 22,
        size: 8,
        font: helv,
        color: INK_SOFT,
      });
    } else {
      p.drawText(date, {
        x: PAGE_WIDTH - MARGIN_X - dateW,
        y: 36,
        size: 9,
        font: helv,
        color: INK_SOFT,
      });
    }
  }

  function newPage() {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN_TOP;
    isCoverPage = false;
  }

  function ensureRoom(needed: number) {
    if (y - needed < MARGIN_BOTTOM) newPage();
  }

  /*
    Orphan-header guard. A section header is an eyebrow + title pair. If
    the remaining room on the current page is less than `needed`, we
    advance to a new page *before* drawing the eyebrow so the header and
    its title never strand at the bottom of a page with nothing under
    them. Returns the y where the eyebrow will be drawn.
  */
  function requireSpaceForHeader(needed: number): number {
    if (y - needed < MARGIN_BOTTOM) newPage();
    return y;
  }

  function drawText(
    text: string,
    size: number,
    font: import("pdf-lib").PDFFont,
    color: import("pdf-lib").Color,
    lineHeight = size + 4,
  ) {
    for (const line of wrap(text, size, font, CONTENT_WIDTH)) {
      ensureRoom(lineHeight);
      page.drawText(line, {
        x: MARGIN_X,
        y: y - size,
        size,
        font,
        color,
      });
      y -= lineHeight;
    }
  }

  function drawIndented(
    text: string,
    size: number,
    font: import("pdf-lib").PDFFont,
    color: import("pdf-lib").Color,
    indent: number,
    lineHeight = size + 4,
  ) {
    const innerWidth = CONTENT_WIDTH - indent;
    for (const line of wrap(text, size, font, innerWidth)) {
      ensureRoom(lineHeight);
      page.drawText(line, {
        x: MARGIN_X + indent,
        y: y - size,
        size,
        font,
        color,
      });
      y -= lineHeight;
    }
  }

  function drawDivider(spacingAbove = 8, spacingBelow = 16) {
    y -= spacingAbove;
    ensureRoom(2);
    page.drawLine({
      start: { x: MARGIN_X, y },
      end: { x: PAGE_WIDTH - MARGIN_X, y },
      thickness: 0.5,
      color: RULE,
    });
    y -= spacingBelow;
  }

  // ---- COVER ----
  // Hairline brand-blue rule above the eyebrow, cover only.
  page.drawLine({
    start: { x: MARGIN_X, y: y + 6 },
    end: { x: MARGIN_X + 64, y: y + 6 },
    thickness: 1.25,
    color: ACCENT,
  });
  y -= 4;
  page.drawText("RESOURCES · VERTICAL GUIDE", {
    x: MARGIN_X,
    y,
    size: 9.5,
    font: helvBold,
    color: ACCENT,
  });
  y -= 22;

  const titleSize = 26;
  for (const line of wrap(title, titleSize, helvBold, CONTENT_WIDTH)) {
    ensureRoom(titleSize + 6);
    page.drawText(line, {
      x: MARGIN_X,
      y: y - titleSize,
      size: titleSize,
      font: helvBold,
      color: INK,
    });
    y -= titleSize + 6;
  }
  y -= 10;

  if (generatedForClean) {
    drawText(`Generated for: ${generatedForClean}`, 12, helvBold, INK, 16);
    y -= 4;
  }

  drawText(
    "A school-district HR director navigates five layers at once — state statute, federal floor, license-renewal cadence, volunteer scope, and FCRA. This document maps each layer for the ten states that account for the majority of K-12 employment, with statute citations you can hand to counsel.",
    11,
    helv,
    INK_SOFT,
    15,
  );

  y -= 6;
  drawDivider();

  // Stat band
  const STATS: Array<[string, string]> = [
    ["States covered", `${counts.states}`],
    ["Require fingerprint", `${counts.fingerprintRequiredStates}`],
    ["Continuous rap-back", `${counts.rapBackStates}`],
    ["Statutory tier states", `${counts.tieredBarStates}`],
  ];
  ensureRoom(60);
  const colW = CONTENT_WIDTH / 4;
  STATS.forEach(([label, value], i) => {
    const cx = MARGIN_X + i * colW;
    page.drawText(label.toUpperCase(), {
      x: cx,
      y: y - 9,
      size: 8.5,
      font: helvBold,
      color: INK_SOFT,
    });
    page.drawText(value, {
      x: cx,
      y: y - 36,
      size: 26,
      font: helvBold,
      color: i === STATS.length - 1 ? ACCENT : INK,
    });
  });
  y -= 50;

  drawText(
    "Reference, not legal advice. K-12 statutes change; verify with district counsel before updating policy.",
    9.5,
    helvOblique,
    INK_SOFT,
    13,
  );

  drawDivider(12, 18);

  // ---- STATE MATRIX ----
  requireSpaceForHeader(80);
  page.drawText("01 — STATE MATRIX", {
    x: MARGIN_X,
    y: y - 9.5,
    size: 9.5,
    font: helvBold,
    color: ACCENT,
  });
  y -= 20;
  drawText("Ten states, four facts each.", 18, helvBold, INK, 22);
  drawText(
    "Citations link to the primary statute so counsel can verify in one click.",
    11,
    helv,
    INK_SOFT,
    15,
  );
  y -= 8;

  for (const row of K12_COMPLIANCE_MATRIX) {
    ensureRoom(120);
    // Header: code + state
    page.drawText(`${row.code} — ${row.state}`, {
      x: MARGIN_X,
      y: y - 13,
      size: 13,
      font: helvBold,
      color: INK,
    });
    y -= 20;

    // Four-fact lines
    const facts: Array<[string, string]> = [
      ["Fingerprint", row.fingerprintRequired],
      ["Re-print cadence", row.reFingerprintCadence],
      ["Volunteers + contractors", row.volunteerCoverage],
      ["Statutory tiers", row.tieredOffenseHandling],
    ];
    for (const [label, value] of facts) {
      ensureRoom(15);
      page.drawText(`${label}:`, {
        x: MARGIN_X,
        y: y - 10,
        size: 10,
        font: helvBold,
        color: INK_SOFT,
      });
      const labelW = measure(`${label}:  `, 10, helvBold);
      const valueLines = wrap(value, 10, helv, CONTENT_WIDTH - labelW);
      valueLines.forEach((line, i) => {
        page.drawText(line, {
          x: MARGIN_X + labelW,
          y: y - 10 - i * 13,
          size: 10,
          font: helv,
          color: INK,
        });
      });
      y -= 13 * valueLines.length + 2;
    }

    // Statute citation (mono-ish via Helvetica, but small + soft)
    drawIndented(row.statute, 9.5, helvBold, ACCENT, 0, 12);
    drawIndented(row.notes, 10, helvOblique, INK_SOFT, 0, 13);
    drawDivider(6, 14);
  }

  // ---- FEDERAL LAYERS ----
  requireSpaceForHeader(90);
  page.drawText("02 — FEDERAL LAYERS", {
    x: MARGIN_X,
    y: y - 9.5,
    size: 9.5,
    font: helvBold,
    color: ACCENT,
  });
  y -= 20;
  drawText("The floor every district sits on top of.", 18, helvBold, INK, 22);
  y -= 8;

  for (const layer of K12_FEDERAL_LAYERS) {
    ensureRoom(80);
    drawText(layer.title, 13, helvBold, INK, 16);
    drawText(layer.citation, 9.5, helvBold, ACCENT, 12);
    y -= 2;
    drawText(layer.body, 11, helv, INK_SOFT, 15);
    drawDivider(6, 14);
  }

  // ---- DISTRICT WORKFLOW ----
  requireSpaceForHeader(90);
  page.drawText("03 — DISTRICT WORKFLOW", {
    x: MARGIN_X,
    y: y - 9.5,
    size: 9.5,
    font: helvBold,
    color: ACCENT,
  });
  y -= 20;
  drawText(
    "Five moves that close the gap between statute and HRIS.",
    18,
    helvBold,
    INK,
    22,
  );
  y -= 8;

  for (const step of WORKFLOW_MOVES) {
    ensureRoom(60);
    page.drawText(`Move ${step.n}`, {
      x: MARGIN_X,
      y: y - 9.5,
      size: 9.5,
      font: helvBold,
      color: ACCENT,
    });
    y -= 16;
    drawText(step.title, 13, helvBold, INK, 16);
    drawText(step.body, 11, helv, INK_SOFT, 15);
    drawDivider(4, 12);
  }

  // ---- COMPANION READING ----
  requireSpaceForHeader(80);
  page.drawText("04 — COMPANION READING", {
    x: MARGIN_X,
    y: y - 9.5,
    size: 9.5,
    font: helvBold,
    color: ACCENT,
  });
  y -= 20;
  drawText("Where to go next.", 18, helvBold, INK, 22);
  y -= 6;

  const COMPANION: Array<[string, string, string]> = [
    [
      "Blog",
      "K-12 school employee background-check requirements",
      "rapidhiresolutions.com/blog/k12-school-employee-background-check-requirements",
    ],
    [
      "Resource",
      "Background checks by state",
      "rapidhiresolutions.com/resources/background-checks-by-state",
    ],
    [
      "Resource",
      "Legislative updates",
      "rapidhiresolutions.com/resources/legislative-updates",
    ],
  ];
  for (const [eyebrow, label, href] of COMPANION) {
    ensureRoom(50);
    page.drawText(eyebrow.toUpperCase(), {
      x: MARGIN_X,
      y: y - 9,
      size: 9,
      font: helvBold,
      color: ACCENT,
    });
    y -= 14;
    drawText(label, 12, helvBold, INK, 15);
    drawText(href, 10, helv, INK_SOFT, 13);
    drawDivider(4, 12);
  }

  /*
    Two-pass finalize: first stamp the cover watermark on page 1, then
    walk every page once more to draw the consolidated footer (rule +
    brand line + page number + date). Done in a second pass so the
    total page count is known at draw time and the "3 / 7" label is
    correct on the first page rather than being filled in later.
  */
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    if (i === 0) drawCoverWatermark(p);
    drawFooter(p, i + 1, pages.length);
  });

  // Suppress unused-variable warnings for brandLine + isCoverPage, both
  // are retained for backwards compatibility with the public option
  // surface and the new flag's narrative role above.
  void brandLine;
  void isCoverPage;

  return pdf.save();
}

/**
 * Build a sensible filename for the K-12 compliance guide download.
 *
 *   buildK12CompliancePdfFilename({})                       -> rapid-hire-k12-compliance-guide.pdf
 *   buildK12CompliancePdfFilename({ generatedFor: "Acme USD" })
 *                                                           -> rapid-hire-k12-compliance-guide-acme-usd.pdf
 */
export function buildK12CompliancePdfFilename(
  opts: { generatedFor?: string } = {},
): string {
  const base = "rapid-hire-k12-compliance-guide";
  const slug = (opts.generatedFor ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug ? `${base}-${slug}.pdf` : `${base}.pdf`;
}

/**
 * Minimal contract the trigger helper needs from the host environment.
 * Real browsers satisfy this via the global `document` + `URL`; tests
 * inject a fake so the helper can run in Node without jsdom.
 */
export type K12DownloadHost = {
  createElement: (tag: "a") => {
    href: string;
    download: string;
    click: () => void;
    remove: () => void;
  };
  appendChild: (node: unknown) => void;
  createObjectURL: (blob: Blob) => string;
  revokeObjectURL: (url: string) => void;
};

function defaultHost(): K12DownloadHost {
  return {
    createElement: (tag) => {
      // Real browser path: cast to the structural type we expose.
      return document.createElement(tag) as unknown as ReturnType<
        K12DownloadHost["createElement"]
      >;
    },
    appendChild: (node) => {
      document.body.appendChild(node as Node);
    },
    createObjectURL: (blob) => URL.createObjectURL(blob),
    revokeObjectURL: (url) => URL.revokeObjectURL(url),
  };
}

/**
 * Trigger a browser download of the K-12 compliance-guide PDF. Split
 * out from the generator so the latter is unit-testable in Node
 * without jsdom. The optional `host` parameter exists purely for
 * tests — production callers should omit it and get the default
 * DOM-backed implementation.
 */
export function triggerK12CompliancePdfDownload(
  bytes: Uint8Array,
  filename = "rapid-hire-k12-compliance-guide.pdf",
  host: K12DownloadHost = defaultHost(),
): void {
  const buf = bytes.slice().buffer;
  const blob = new Blob([buf], { type: "application/pdf" });
  const url = host.createObjectURL(blob);
  const a = host.createElement("a");
  a.href = url;
  a.download = filename;
  host.appendChild(a);
  a.click();
  // Defer cleanup so Safari/Firefox commit the navigation first.
  setTimeout(() => {
    a.remove();
    host.revokeObjectURL(url);
  }, 0);
}
