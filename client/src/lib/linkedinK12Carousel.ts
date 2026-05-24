/*
  §164 — LinkedIn carousel template generator (K-12 compliance guide)
  -------------------------------------------------------------------

  Produces a portrait-format, 10-slide, square-corner PDF carousel sized
  for LinkedIn document posts (1080 × 1350 pt — the 4:5 portrait that
  LinkedIn renders at full size in-feed without cropping). The deck is
  built from the same source-of-truth data as `k12Pdf.ts`:
  `K12_COMPLIANCE_MATRIX`, `K12_FEDERAL_LAYERS`, `k12MatrixCounts()`.

  Why a separate generator (instead of reusing k12Pdf.ts):
  - K12 PDF is a Letter-format, multi-page reference document.
    LinkedIn carousels are a different medium: portrait, sparse, one
    idea per slide, designed to be tapped through in 30 seconds.
  - The visual hierarchy is different — display sizes are 2-3× larger,
    every slide carries a slide-number stamp + persistent brand chip,
    and the closing slide is a CTA, not a footnote.
  - Keeping the two generators decoupled means tweaking the carousel
    cadence, palette, or slide count never risks regressions on the
    canonical Letter-format guide PDF.

  Brand parity with the rest of the export toolkit:
  - Same pdf-lib + StandardFonts.Helvetica family (bold/regular/oblique).
  - Same brand cobalt accent + editorial dark ink + soft ink + soft rule.
  - Same RHS monogram watermark, repositioned for portrait format.
  - Same WinAnsi-safe sanitize() pipeline as `apiDocsPdf.ts` so any
    em-dash / smart-quote in the source data renders cleanly.

  Public API:
    buildLinkedInK12Carousel(opts?): Promise<Uint8Array>
    buildLinkedInK12CarouselFilename(opts?): string
    triggerLinkedInK12CarouselDownload(bytes, filename?, host?): void
*/

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  K12_COMPLIANCE_MATRIX,
  K12_FEDERAL_LAYERS,
  k12MatrixCounts,
} from "./k12ComplianceMatrix";

export type BuildLinkedInK12CarouselOptions = {
  /** Override the brand line printed on every slide. */
  brandLine?: string;
  /** Override the cover-slide generated date. Defaults to "now". */
  generatedAt?: Date;
  /** Optional company / district / team to print on the cover. */
  generatedFor?: string;
};

/* ---- geometry ---------------------------------------------------- */

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350;
const MARGIN_X = 80;
const MARGIN_TOP = 96;
const MARGIN_BOTTOM = 100;
const CONTENT_WIDTH = SLIDE_WIDTH - MARGIN_X * 2;

/* ---- color palette (mirrors k12Pdf.ts) -------------------------- */

const INK = rgb(0.07, 0.1, 0.15);
const INK_SOFT = rgb(0.27, 0.32, 0.39);
const ACCENT = rgb(0.13, 0.39, 0.84);
const ACCENT_SOFT = rgb(0.84, 0.9, 1.0);
const RULE = rgb(0.85, 0.87, 0.9);
const PAPER = rgb(1, 1, 1);
const PAPER_SOFT = rgb(0.97, 0.97, 0.96);
const WATERMARK = rgb(0.92, 0.94, 0.97);

/* ---- WinAnsi-safe sanitizer (matches apiDocsPdf.ts pattern) ----- */

/**
 * Replace characters that StandardFonts.Helvetica's WinAnsi encoding
 * cannot render (em-dashes, smart quotes, ellipsis, NBSP, control
 * chars). Keeps the deck from throwing at draw time on any source-data
 * string that wasn't authored ASCII-clean.
 */
export function sanitize(input: string): string {
  return input
    .replace(/\u2014/g, "--")
    .replace(/\u2013/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u00a0/g, " ")
    // Strip remaining non-printable / non-WinAnsi-encodable control bytes.
    .replace(/[\u0000-\u001f\u007f]/g, "");
}

/* ---- slide-content data model ----------------------------------- */

/**
 * Each slide carries a kind + a small payload. The kind drives the
 * layout (cover / stat / data / CTA), but the data is otherwise
 * uniform so tests can iterate the deck and assert invariants.
 */
export type SlideKind =
  | "cover"
  | "intro"
  | "stat"
  | "matrix"
  | "federal"
  | "workflow"
  | "cta";

export interface CarouselSlide {
  index: number;
  kind: SlideKind;
  eyebrow: string;
  title: string;
  body: string;
}

/**
 * Build the ordered slide list from K-12 source-of-truth data. Pure
 * function — same input, same output, easy to test.
 */
export function buildCarouselSlides(): readonly CarouselSlide[] {
  const counts = k12MatrixCounts();
  const slides: CarouselSlide[] = [];
  let i = 1;

  // Slide 1 — Cover hook
  slides.push({
    index: i++,
    kind: "cover",
    eyebrow: "K-12 Compliance",
    title: "K-12 hiring is its own discipline.",
    body:
      "A 10-slide field guide for school-district HR leaders. Statute citations you can hand to counsel.",
  });

  // Slide 2 — Why this exists
  slides.push({
    index: i++,
    kind: "intro",
    eyebrow: "01 -- Why this matters",
    title: "Five layers stacked on every K-12 hire.",
    body:
      "State statute. Federal floor. License-renewal cadence. Volunteer + contractor scope. FCRA. Miss any one and a single hire becomes an audit finding.",
  });

  // Slide 3 — Coverage stat band
  slides.push({
    index: i++,
    kind: "stat",
    eyebrow: "02 -- The numbers",
    title: `${counts.fingerprintRequiredStates} of ${counts.states} states mandate fingerprints.`,
    body: `${counts.rapBackStates} run continuous rap-back. ${counts.tieredBarStates} codify statutory permanent-bar tiers. The other ${counts.states - counts.tieredBarStates} leave it to district policy.`,
  });

  // Slides 4-6 — Three highest-volume state spotlights (CA / TX / FL)
  const featured = ["CA", "TX", "FL"];
  for (const code of featured) {
    const row = K12_COMPLIANCE_MATRIX.find((r) => r.code === code);
    if (!row) continue;
    slides.push({
      index: i++,
      kind: "matrix",
      eyebrow: `03 -- ${row.state}`,
      title: row.statute,
      body: `${row.fingerprintRequired}. Re-print: ${row.reFingerprintCadence}. Volunteers: ${row.volunteerCoverage}. Tiered offenses: ${row.tieredOffenseHandling}.`,
    });
  }

  // Slide 7 — Federal floor (ESSA + FCRA fused into a single slide)
  const essa = K12_FEDERAL_LAYERS.find((l) => l.id === "essa-8546");
  const fcra = K12_FEDERAL_LAYERS.find((l) => l.id === "fcra");
  slides.push({
    index: i++,
    kind: "federal",
    eyebrow: "04 -- The federal floor",
    title: "Even when state law clears, federal still applies.",
    body:
      `${essa ? `ESSA Sec. 8546 (${essa.citation}): verify employment history before any federally funded LEA finalizes a hire. ` : ""}` +
      `${fcra ? `FCRA (${fcra.citation}): standalone authorization + pre-adverse-action when a CRA assembles the report.` : ""}`,
  });

  // Slide 8 — The one move that prevents most audit findings
  slides.push({
    index: i++,
    kind: "workflow",
    eyebrow: "05 -- The one move",
    title: "Write the re-fingerprint cadence into your HRIS.",
    body:
      "PA, FL, OH = 5 years. TX + MI = continuous rap-back. The single most common audit finding: a 5-year window quietly lapsing during a hiring freeze. Tie the cadence to license-renewal reminders so it can't.",
  });

  // Slide 9 — The trap most districts miss
  slides.push({
    index: i++,
    kind: "workflow",
    eyebrow: "06 -- The trap",
    title: "Volunteers + contractors aren't free.",
    body:
      "FL, PA, and CA extend statutory screening to volunteers and on-campus contractors. Most districts apply substitute-teacher policy to an HVAC vendor by accident -- and discover it during a state audit.",
  });

  // Slide 10 — CTA
  slides.push({
    index: i++,
    kind: "cta",
    eyebrow: "Get the full guide",
    title: "Read the 10-state matrix in full.",
    body:
      "rapidhiresolutions.com/resources/k12-compliance-guide -- the unabridged 10-row matrix, all 4 federal layers, and the 5-move district workflow. Reference, not legal advice.",
  });

  return slides;
}

/* ---- text helpers ----------------------------------------------- */

function measure(
  text: string,
  size: number,
  font: import("pdf-lib").PDFFont,
): number {
  return font.widthOfTextAtSize(text, size);
}

/** Word-wrap a paragraph to a width budget. */
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

/* ---- main builder ----------------------------------------------- */

/**
 * Build the LinkedIn carousel PDF and return the encoded bytes.
 */
export async function buildLinkedInK12Carousel(
  opts: BuildLinkedInK12CarouselOptions = {},
): Promise<Uint8Array> {
  const {
    brandLine = "Rapid Hire Solutions  ·  rapidhiresolutions.com",
    generatedAt = new Date(),
    generatedFor,
  } = opts;

  const slides = buildCarouselSlides();
  const total = slides.length;

  const pdf = await PDFDocument.create();
  pdf.setTitle("Rapid Hire Solutions — K-12 compliance carousel");
  pdf.setAuthor("Rapid Hire Solutions");
  pdf.setSubject(
    "LinkedIn carousel template — K-12 employment screening compliance",
  );
  pdf.setProducer("Rapid Hire Solutions LinkedIn carousel generator");

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const generatedForClean =
    typeof generatedFor === "string" && generatedFor.trim().length > 0
      ? sanitize(generatedFor.trim())
      : undefined;

  for (const slide of slides) {
    const page = pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT]);

    // Backdrop: alternating paper / paper-soft so the deck has rhythm
    // when scrolled in the LinkedIn feed thumbnail strip.
    const isAccentBack = slide.kind === "cover" || slide.kind === "cta";
    page.drawRectangle({
      x: 0,
      y: 0,
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      color: isAccentBack ? PAPER_SOFT : PAPER,
    });

    // Top hairline brand-blue rule (cover only) for visual identity.
    if (slide.kind === "cover") {
      page.drawRectangle({
        x: MARGIN_X,
        y: SLIDE_HEIGHT - MARGIN_TOP + 36,
        width: 96,
        height: 3,
        color: ACCENT,
      });
    }

    // Slide number chip at top-right (so reader knows pagination at a glance).
    const chipText = `${slide.index} / ${total}`;
    const chipPad = 14;
    const chipW = measure(chipText, 14, helvBold) + chipPad * 2;
    const chipH = 30;
    const chipX = SLIDE_WIDTH - MARGIN_X - chipW;
    const chipY = SLIDE_HEIGHT - MARGIN_TOP + 8;
    page.drawRectangle({
      x: chipX,
      y: chipY,
      width: chipW,
      height: chipH,
      color: ACCENT_SOFT,
    });
    page.drawText(chipText, {
      x: chipX + chipPad,
      y: chipY + 9,
      size: 14,
      font: helvBold,
      color: ACCENT,
    });

    // Eyebrow
    let y = SLIDE_HEIGHT - MARGIN_TOP - 24;
    page.drawText(sanitize(slide.eyebrow.toUpperCase()), {
      x: MARGIN_X,
      y,
      size: 16,
      font: helvBold,
      color: ACCENT,
    });
    y -= 56;

    // Title — display weight, sized down per slide kind
    const titleSize = slide.kind === "cover" ? 70 : 54;
    const titleLineHeight = titleSize + 10;
    const titleLines = wrap(
      sanitize(slide.title),
      titleSize,
      helvBold,
      CONTENT_WIDTH,
    );
    for (const line of titleLines) {
      page.drawText(line, {
        x: MARGIN_X,
        y: y - titleSize,
        size: titleSize,
        font: helvBold,
        color: INK,
      });
      y -= titleLineHeight;
    }
    y -= 28;

    // Body
    const bodySize = 26;
    const bodyLineHeight = bodySize + 12;
    const bodyLines = wrap(
      sanitize(slide.body),
      bodySize,
      helv,
      CONTENT_WIDTH,
    );
    for (const line of bodyLines) {
      page.drawText(line, {
        x: MARGIN_X,
        y: y - bodySize,
        size: bodySize,
        font: helv,
        color: INK_SOFT,
      });
      y -= bodyLineHeight;
    }

    // Tap-to-advance affordance on the cover only.
    if (slide.kind === "cover") {
      const swipe = "Swipe -->";
      const sw = measure(swipe, 18, helvBold);
      page.drawText(swipe, {
        x: SLIDE_WIDTH - MARGIN_X - sw,
        y: MARGIN_BOTTOM + 60,
        size: 18,
        font: helvBold,
        color: ACCENT,
      });
    }

    // Footer hairline rule
    page.drawLine({
      start: { x: MARGIN_X, y: MARGIN_BOTTOM - 6 },
      end: { x: SLIDE_WIDTH - MARGIN_X, y: MARGIN_BOTTOM - 6 },
      thickness: 1,
      color: RULE,
    });

    // Footer brand line + date
    page.drawText(sanitize(brandLine), {
      x: MARGIN_X,
      y: MARGIN_BOTTOM - 36,
      size: 14,
      font: helvBold,
      color: INK,
    });
    const dateText = `Generated ${formatDate(generatedAt)}`;
    const dateW = measure(dateText, 14, helv);
    page.drawText(dateText, {
      x: SLIDE_WIDTH - MARGIN_X - dateW,
      y: MARGIN_BOTTOM - 36,
      size: 14,
      font: helv,
      color: INK_SOFT,
    });

    // Generated-for line on cover only.
    if (slide.kind === "cover" && generatedForClean) {
      const tagged = `Prepared for ${generatedForClean}`;
      page.drawText(tagged, {
        x: MARGIN_X,
        y: MARGIN_BOTTOM - 60,
        size: 14,
        font: helvOblique,
        color: INK_SOFT,
      });
    }

    // RHS monogram watermark — bottom-right, behind footer text.
    if (slide.kind === "cover" || slide.kind === "cta") {
      const mono = "RHS";
      const monoSize = 110;
      const mw = measure(mono, monoSize, helvBold);
      page.drawText(mono, {
        x: SLIDE_WIDTH - MARGIN_X - mw,
        y: MARGIN_BOTTOM + 24,
        size: monoSize,
        font: helvBold,
        color: WATERMARK,
      });
    }

    // CTA-slide accent: brand-blue button rectangle drawn as a visual
    // anchor (PDF doesn't carry interactive links here intentionally --
    // LinkedIn document posts strip them; the URL is in the body copy
    // so it's still discoverable from the carousel preview).
    if (slide.kind === "cta") {
      const btnText = "Read the full guide -->";
      const btnSize = 22;
      const btnPadX = 28;
      const btnPadY = 18;
      const btnW = measure(btnText, btnSize, helvBold) + btnPadX * 2;
      const btnH = btnSize + btnPadY * 2;
      const btnX = MARGIN_X;
      const btnY = MARGIN_BOTTOM + 110;
      page.drawRectangle({
        x: btnX,
        y: btnY,
        width: btnW,
        height: btnH,
        color: ACCENT,
      });
      page.drawText(btnText, {
        x: btnX + btnPadX,
        y: btnY + btnPadY - 4,
        size: btnSize,
        font: helvBold,
        color: PAPER,
      });
    }
  }

  return pdf.save();
}

/**
 * Build a sensible filename for the carousel download.
 *
 *   buildLinkedInK12CarouselFilename({})
 *     -> rapid-hire-k12-linkedin-carousel.pdf
 *   buildLinkedInK12CarouselFilename({ generatedFor: "Acme USD" })
 *     -> rapid-hire-k12-linkedin-carousel-acme-usd.pdf
 */
export function buildLinkedInK12CarouselFilename(
  opts: { generatedFor?: string } = {},
): string {
  const base = "rapid-hire-k12-linkedin-carousel";
  const slug = (opts.generatedFor ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug ? `${base}-${slug}.pdf` : `${base}.pdf`;
}

/**
 * Minimal contract the trigger helper needs from the host environment.
 * Mirrors the K12DownloadHost shape so vitest can exercise the
 * download glue without jsdom.
 */
export type CarouselDownloadHost = {
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

function defaultHost(): CarouselDownloadHost {
  return {
    createElement: (tag) =>
      document.createElement(tag) as unknown as ReturnType<
        CarouselDownloadHost["createElement"]
      >,
    appendChild: (node) => {
      document.body.appendChild(node as Node);
    },
    createObjectURL: (blob) => URL.createObjectURL(blob),
    revokeObjectURL: (url) => URL.revokeObjectURL(url),
  };
}

/**
 * Trigger a browser download of the carousel PDF. Split out from the
 * generator so the latter is unit-testable in Node without jsdom.
 */
export function triggerLinkedInK12CarouselDownload(
  bytes: Uint8Array,
  filename = "rapid-hire-k12-linkedin-carousel.pdf",
  host: CarouselDownloadHost = defaultHost(),
): void {
  const buf = bytes.slice().buffer;
  const blob = new Blob([buf], { type: "application/pdf" });
  const url = host.createObjectURL(blob);
  const a = host.createElement("a");
  a.href = url;
  a.download = filename;
  host.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    host.revokeObjectURL(url);
  }, 0);
}
