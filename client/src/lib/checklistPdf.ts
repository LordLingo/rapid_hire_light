/*
  §108 — Runtime PDF generator for /compliance/checklist.

  Why this exists
  ---------------
  The earlier implementation linked a static, pre-built PDF asset hosted
  on manus-storage. That PDF was authored once by `scripts/build-checklist-pdf.mjs`
  and has no idea what the user has checked at click-time, so the
  download never reflected the live UI state — the user-reported bug.

  This module produces a PDF on the fly from (a) the same SURFACES data
  the page renders and (b) the user's `checked` map. The result is a
  Letter-format, multi-page PDF whose section titles, item text, and
  citations match the on-screen checklist exactly, with each item
  prefixed by `[x]` (checked) or `[ ]` (unchecked).

  Design choices
  --------------
  - Uses `pdf-lib`, which works in both jsdom (for vitest) and the
    browser. No native deps, no fonts to load — we use Helvetica/
    Helvetica-Bold which are PDF base-14 fonts (always present).
  - Wraps long lines manually using Helvetica's average glyph width
    estimate; we don't need pixel-perfect typography because this is
    an audit artifact, not a marketing PDF.
  - Keeps the file fully tree-shakable: zero React imports, pure data
    in / Uint8Array out.

  Public API
  ----------
    buildChecklistPdf({ surfaces, checked, totalItems? }): Promise<Uint8Array>
    triggerChecklistDownload(bytes, filename?): void

  The download helper is intentionally split out so the generator can be
  unit-tested in jsdom without poking at `URL.createObjectURL`.
*/

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ChecklistItem = {
  id: string;
  text: string;
  citation: string;
};

export type ChecklistSurface = {
  n: string;
  slug: string;
  title: string;
  accent: string;
  intro: string;
  items: ReadonlyArray<ChecklistItem>;
};

export type BuildChecklistPdfArgs = {
  surfaces: ReadonlyArray<ChecklistSurface>;
  checked: Record<string, boolean>;
  /**
   * Optional override for the total-items count displayed on the cover.
   * Defaults to the sum of items across all surfaces.
   */
  totalItems?: number;
  /**
   * Optional override for the title shown on the cover. Defaults to
   * "The 24-point employer compliance checklist."
   */
  title?: string;
  /**
   * Optional override for the brand line at the bottom of every page.
   * Defaults to "Rapid Hire Solutions · rapidhiresolutions.com".
   */
  brandLine?: string;
  /**
   * Optional override for the cover-page date string. When omitted, the
   * generator stamps the current local date in `YYYY-MM-DD` form.
   */
  generatedAt?: Date;
};

const PAGE_WIDTH = 612; // Letter, points
const PAGE_HEIGHT = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const INK = rgb(0.07, 0.1, 0.15); // editorial dark
const INK_SOFT = rgb(0.27, 0.32, 0.39);
const ACCENT = rgb(0.13, 0.39, 0.84); // brand cobalt
const RULE = rgb(0.85, 0.87, 0.9);

/**
 * Estimate text width using Helvetica's average glyph advance. This is
 * not pixel-perfect but is consistent enough that wrapping never
 * overflows the content column at the sizes we use here.
 */
function measure(text: string, size: number, font: import("pdf-lib").PDFFont): number {
  return font.widthOfTextAtSize(text, size);
}

/** Word-wrap a paragraph to a width budget, returning lines. */
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
      // If the single word is wider than the column, hard-break it.
      if (measure(w, size, font) > maxWidth) {
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
 * Build a Letter-format PDF whose content mirrors the on-screen
 * checklist, with checked-state passthrough. Returns the PDF bytes.
 */
export async function buildChecklistPdf({
  surfaces,
  checked,
  totalItems,
  title = "The 24-point employer compliance checklist.",
  brandLine = "Rapid Hire Solutions · rapidhiresolutions.com",
  generatedAt = new Date(),
}: BuildChecklistPdfArgs): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor("Rapid Hire Solutions");
  pdf.setSubject("Employer compliance self-audit");
  pdf.setProducer("Rapid Hire Solutions checklist generator");

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const total =
    totalItems ?? surfaces.reduce((acc, s) => acc + s.items.length, 0);
  const checkedCount = surfaces.reduce(
    (acc, s) => acc + s.items.filter((it) => checked[it.id] === true).length,
    0,
  );

  // ---- shared per-page helpers ----
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN_TOP;

  function newPage() {
    drawFooter(page);
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN_TOP;
  }

  function ensureRoom(needed: number) {
    if (y - needed < MARGIN_BOTTOM) {
      newPage();
    }
  }

  function drawFooter(p: import("pdf-lib").PDFPage) {
    const text = brandLine;
    p.drawText(text, {
      x: MARGIN_X,
      y: 36,
      size: 9,
      font: helv,
      color: INK_SOFT,
    });
    const date = `Generated ${formatDate(generatedAt)}`;
    const dateW = measure(date, 9, helv);
    p.drawText(date, {
      x: PAGE_WIDTH - MARGIN_X - dateW,
      y: 36,
      size: 9,
      font: helv,
      color: INK_SOFT,
    });
    // Hairline rule above the footer line.
    p.drawLine({
      start: { x: MARGIN_X, y: 52 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: 52 },
      thickness: 0.5,
      color: RULE,
    });
  }

  // ---- cover ----
  // Eyebrow
  page.drawText("00 — 24-POINT CHECKLIST", {
    x: MARGIN_X,
    y,
    size: 9.5,
    font: helvBold,
    color: ACCENT,
  });
  y -= 22;

  // Title (wrap if needed)
  const titleSize = 28;
  const titleLines = wrap(title, titleSize, helvBold, CONTENT_WIDTH);
  for (const line of titleLines) {
    ensureRoom(titleSize + 8);
    page.drawText(line, {
      x: MARGIN_X,
      y: y - titleSize,
      size: titleSize,
      font: helvBold,
      color: INK,
    });
    y -= titleSize + 6;
  }
  y -= 14;

  // Progress headline
  const progressLine = `${checkedCount} of ${total} items checked.`;
  page.drawText(progressLine, {
    x: MARGIN_X,
    y: y - 16,
    size: 16,
    font: helvBold,
    color: ACCENT,
  });
  y -= 24;

  // Lede
  const lede =
    "Six surfaces — disclosure and authorization, pre-adverse workflow, waiting-period cushion, EEOC individualized assessment, dispute handling, and continuous-monitoring posture — with the federal statute, regulation, or case-law citation behind every line.";
  for (const line of wrap(lede, 11, helv, CONTENT_WIDTH)) {
    ensureRoom(16);
    page.drawText(line, {
      x: MARGIN_X,
      y: y - 11,
      size: 11,
      font: helv,
      color: INK_SOFT,
    });
    y -= 15;
  }
  y -= 12;

  // Hairline divider
  page.drawLine({
    start: { x: MARGIN_X, y },
    end: { x: PAGE_WIDTH - MARGIN_X, y },
    thickness: 0.5,
    color: RULE,
  });
  y -= 22;

  // ---- surfaces ----
  for (const surface of surfaces) {
    // Surface header block: "01 — SURFACE" + title + accent + intro.
    ensureRoom(140);

    // Section eyebrow
    const eyebrow = `${surface.n} — SURFACE`;
    page.drawText(eyebrow, {
      x: MARGIN_X,
      y: y - 9.5,
      size: 9.5,
      font: helvBold,
      color: ACCENT,
    });
    y -= 18;

    // Section title
    for (const line of wrap(surface.title, 18, helvBold, CONTENT_WIDTH)) {
      ensureRoom(22);
      page.drawText(line, {
        x: MARGIN_X,
        y: y - 18,
        size: 18,
        font: helvBold,
        color: INK,
      });
      y -= 22;
    }

    // Section accent (italic)
    for (const line of wrap(surface.accent, 12, helvOblique, CONTENT_WIDTH)) {
      ensureRoom(16);
      page.drawText(line, {
        x: MARGIN_X,
        y: y - 12,
        size: 12,
        font: helvOblique,
        color: ACCENT,
      });
      y -= 16;
    }
    y -= 4;

    // Section intro
    for (const line of wrap(surface.intro, 11, helv, CONTENT_WIDTH)) {
      ensureRoom(15);
      page.drawText(line, {
        x: MARGIN_X,
        y: y - 11,
        size: 11,
        font: helv,
        color: INK_SOFT,
      });
      y -= 15;
    }
    y -= 10;

    // Items
    for (const item of surface.items) {
      // Each item layout:
      //   [x] item.text (wrapped)
      //       item.citation (smaller, ink-soft)
      //
      // We hang the textual content from a fixed indent so the [x]
      // marker sits in its own gutter and wrapped lines stay aligned.
      const isChecked = checked[item.id] === true;
      const marker = isChecked ? "[x]" : "[ ]";
      const indentX = MARGIN_X + 22;
      const indentWidth = CONTENT_WIDTH - 22;

      // Draw marker
      const textLines = wrap(item.text, 11.5, helvBold, indentWidth);
      const citationLines = wrap(item.citation, 9.5, helv, indentWidth);
      const blockHeight =
        textLines.length * 14 + citationLines.length * 12 + 12;
      ensureRoom(blockHeight);

      page.drawText(marker, {
        x: MARGIN_X,
        y: y - 11.5,
        size: 11.5,
        font: helvBold,
        color: isChecked ? ACCENT : INK_SOFT,
      });

      // Wrapped item text
      for (const line of textLines) {
        page.drawText(line, {
          x: indentX,
          y: y - 11.5,
          size: 11.5,
          font: helvBold,
          color: INK,
        });
        y -= 14;
      }

      // Wrapped citation
      for (const line of citationLines) {
        page.drawText(line, {
          x: indentX,
          y: y - 9.5,
          size: 9.5,
          font: helv,
          color: INK_SOFT,
        });
        y -= 12;
      }
      y -= 10;
    }

    // Section closer rule
    ensureRoom(28);
    page.drawLine({
      start: { x: MARGIN_X, y },
      end: { x: PAGE_WIDTH - MARGIN_X, y },
      thickness: 0.5,
      color: RULE,
    });
    y -= 22;
  }

  // Footer on the last page
  drawFooter(page);

  // Number every page in the bottom-right corner above the brand line.
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    const label = `${i + 1} / ${pages.length}`;
    const w = measure(label, 9, helv);
    p.drawText(label, {
      x: PAGE_WIDTH - MARGIN_X - w,
      y: 56,
      size: 9,
      font: helv,
      color: INK_SOFT,
    });
  });

  return pdf.save();
}

/**
 * Trigger a browser download of the given PDF bytes. Split out from
 * `buildChecklistPdf` so the generator stays unit-testable in jsdom
 * without needing to mock `URL.createObjectURL`.
 */
export function triggerChecklistDownload(
  bytes: Uint8Array,
  filename = "rapid-hire-24-point-compliance-checklist.pdf",
): void {
  // Use ArrayBuffer slice so the Blob owns its own buffer (works in
  // both browsers and tests where the underlying buffer might be a
  // SharedArrayBuffer in some runtimes).
  const buf = bytes.slice().buffer;
  const blob = new Blob([buf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // Defer cleanup to next tick so Safari / Firefox have time to commit
  // the navigation to the download.
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 0);
}
