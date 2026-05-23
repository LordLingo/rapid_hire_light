/*
  §160 — Runtime PDF generator for the Rapid Hire Solutions API v2
  reference.

  Why this exists
  ---------------
  /integrations needs a downloadable, brand-coherent companion to the
  in-page API reference so engineering teams evaluating an integration
  can grab a complete spec for offline review or distribution. The
  generator mirrors the on-screen reference one-for-one because both
  surfaces consume the same data model — `API_OVERVIEW` and
  `API_RESOURCES` from `apiReference.ts`. Updating the reference data
  updates both surfaces in lock-step.

  Design choices
  --------------
  - Uses `pdf-lib`, the same dependency the K-12 PDF generator uses, so
    we avoid pulling in a second PDF library.
  - Letter sized (8.5 × 11 in / 612 × 792 pt), 54pt margins, Helvetica
    base. Endpoint paths use Courier so verb/path pairs read like code.
  - Cover page carries a brand-blue accent rule, eyebrow, and a soft
    "RHS" monogram in the bottom-right (cover-only). Every page draws a
    consolidated footer: hairline rule, bold company name + soft domain
    on the left, page number + generated date on the right.
  - Each resource gets its own header band ("01 — BRANCHES"), an
    endpoint table, the resource's verbatim docs (rendered from the
    scraped Markdown), and a soft divider.
  - Pure data in / `Uint8Array` out, so the generator is unit-testable
    independent of the DOM. The browser-side
    `triggerApiDocsPdfDownload` helper is split out so jsdom does not
    need to mock URL.createObjectURL — it accepts an injected document
    host the tests use to verify the trigger plumbing.

  Public API
  ----------
    buildApiDocsPdf(opts?): Promise<Uint8Array>
    buildApiDocsPdfFilename(opts?): string
    triggerApiDocsPdfDownload(bytes, filename?, host?): void
*/

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  API_OVERVIEW,
  API_RESOURCES,
  API_HOST_PRODUCTION,
  API_HOST_STAGING,
  API_ENDPOINT_TOTAL,
} from "./apiReference";

export type BuildApiDocsPdfOptions = {
  /** Override the cover-page title. */
  title?: string;
  /** Override the brand line printed in every page footer. */
  brandLine?: string;
  /** Override the cover-page generated date. Defaults to "now". */
  generatedAt?: Date;
  /** Optional company / team to print on the cover. */
  generatedFor?: string;
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const INK = rgb(0.07, 0.1, 0.15);
const INK_SOFT = rgb(0.27, 0.32, 0.39);
const ACCENT = rgb(0.13, 0.39, 0.84);
const RULE = rgb(0.85, 0.87, 0.9);
const WATERMARK = rgb(0.88, 0.91, 0.96);
const CODE_BG = rgb(0.96, 0.97, 0.99);
const CODE_INK = rgb(0.18, 0.22, 0.3);

/**
 * Make a string safe for pdf-lib's standard (WinAnsi) fonts. WinAnsi
 * cannot encode tabs (0x09), other control chars, or characters outside
 * its 8-bit code page. The scraped Markdown carries literal tabs inside
 * code fences (curl + JSON examples) plus the occasional smart quote /
 * en-dash, so we normalize them to safe ASCII before any pdf-lib call.
 * Centralizing this in `sanitize` means every drawText/measure path is
 * automatically safe.
 */
function sanitize(text: string): string {
  return text
    .replace(/\t/g, "    ")            // tabs -> four spaces
    .replace(/\r\n?/g, "\n")            // CRLF -> LF (will be split later)
    // ASCII-fold common typographic punctuation that may appear in the
    // scraped Markdown but is not in WinAnsi's coverage.
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    // Strip any remaining control characters (other than LF) and
    // non-WinAnsi code points above 0xFF; pdf-lib would otherwise throw.
    // We accept the occasional lossy fallback (a missing glyph rendered
    // as "?") to avoid a hard error.
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .replace(/[^\x00-\xFF]/g, "?");
}

function measure(
  text: string,
  size: number,
  font: import("pdf-lib").PDFFont,
): number {
  return font.widthOfTextAtSize(sanitize(text), size);
}

/** Word-wrap a paragraph to a width budget. */
function wrap(
  text: string,
  size: number,
  font: import("pdf-lib").PDFFont,
  maxWidth: number,
): string[] {
  // Sanitize once at the wrap entry so downstream draw calls only ever
  // see WinAnsi-safe text.
  const safe = sanitize(text);
  const words = safe.split(/\s+/);
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

/**
 * Strip basic Markdown decorations so the scraped docs render cleanly
 * in PDF body type. We preserve fenced code blocks (which carry the
 * sample requests/responses) and pass them through to the code-block
 * draw helper.
 */
type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "h4"; text: string }
  | { kind: "p"; text: string }
  | { kind: "code"; text: string };

function parseBlocks(markdown: string): Block[] {
  const out: Block[] = [];
  const lines = markdown.split("\n");
  let i = 0;
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      const text = para.join(" ").replace(/\s+/g, " ").trim();
      if (text) out.push({ kind: "p", text });
      para = [];
    }
  };
  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const line = raw.replace(/\r$/, "");
    if (line.startsWith("```")) {
      flushPara();
      i++;
      const code: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      // Trim leading/trailing all-whitespace lines for a cleaner block.
      while (code.length && code[0].trim() === "") code.shift();
      while (code.length && code[code.length - 1].trim() === "") code.pop();
      out.push({ kind: "code", text: code.join("\n") });
      i++;
      continue;
    }
    const h2 = /^##\s+(.*)$/.exec(line);
    if (h2) {
      flushPara();
      out.push({ kind: "h2", text: h2[1].trim() });
      i++;
      continue;
    }
    const h3 = /^###\s+(.*)$/.exec(line);
    if (h3) {
      flushPara();
      out.push({ kind: "h3", text: h3[1].trim() });
      i++;
      continue;
    }
    const h4 = /^####\s+(.*)$/.exec(line);
    if (h4) {
      flushPara();
      out.push({ kind: "h4", text: h4[1].trim() });
      i++;
      continue;
    }
    if (line.trim() === "") {
      flushPara();
      i++;
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flushPara();
  return out;
}

/**
 * Build a Letter-format PDF of the API reference.
 */
export async function buildApiDocsPdf(
  opts: BuildApiDocsPdfOptions = {},
): Promise<Uint8Array> {
  const {
    title = "Rapid Hire Solutions API v2 — developer reference",
    brandLine = "Rapid Hire Solutions · rapidhiresolutions.com",
    generatedAt = new Date(),
    generatedFor,
  } = opts;
  void brandLine; // referenced through the footer composer below

  const generatedForClean =
    typeof generatedFor === "string" && generatedFor.trim().length > 0
      ? generatedFor.trim()
      : undefined;

  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor("Rapid Hire Solutions");
  pdf.setSubject(
    generatedForClean
      ? `Rapid Hire Solutions API v2 reference — ${generatedForClean}`
      : "Rapid Hire Solutions API v2 reference",
  );
  pdf.setProducer("Rapid Hire Solutions API docs generator");

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const courier = await pdf.embedFont(StandardFonts.Courier);

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN_TOP;
  let isCoverPage = true;

  function drawCoverWatermark(p: import("pdf-lib").PDFPage) {
    const mono = "RHS";
    const size = 56;
    const w = measure(mono, size, helvBold);
    p.drawText(sanitize(mono), {
      x: PAGE_WIDTH - MARGIN_X - w,
      y: MARGIN_BOTTOM + 20,
      size,
      font: helvBold,
      color: WATERMARK,
    });
  }

  function newPage() {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN_TOP;
    isCoverPage = false;
  }

  function ensureRoom(needed: number) {
    if (y - needed < MARGIN_BOTTOM) newPage();
  }

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
    indent = 0,
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

  /** Draw a fenced code block with a soft tinted background. */
  function drawCode(text: string) {
    const size = 8.5;
    const lineHeight = size + 3;
    // Code lines are NOT wrapped — we honor the source linebreaks and
    // hard-truncate any line that overflows the column rather than
    // re-wrapping JSON in the middle of a key.
    const lines = text.split("\n");
    const innerWidth = CONTENT_WIDTH - 12;
    const totalH = lines.length * lineHeight + 14;
    ensureRoom(totalH);
    page.drawRectangle({
      x: MARGIN_X,
      y: y - totalH + 4,
      width: CONTENT_WIDTH,
      height: totalH,
      color: CODE_BG,
      borderColor: RULE,
      borderWidth: 0.5,
    });
    y -= 8;
    for (const raw of lines) {
      let line = raw;
      // Hard-truncate over-wide lines (rare; only happens for very long
      // sample JSON strings). We append a `…` so readers know it was
      // clipped — the source remains in the on-page reference.
      while (measure(line, size, courier) > innerWidth && line.length > 1) {
        line = line.slice(0, -1);
      }
      if (line !== raw) line = line.slice(0, -1) + "\u2026";
      ensureRoom(lineHeight);
      page.drawText(line, {
        x: MARGIN_X + 6,
        y: y - size,
        size,
        font: courier,
        color: CODE_INK,
      });
      y -= lineHeight;
    }
    y -= 6;
  }

  function drawEndpointRow(verb: string, path: string) {
    const size = 10;
    const lineHeight = size + 4;
    ensureRoom(lineHeight);
    const verbW = measure(verb, size, helvBold);
    page.drawRectangle({
      x: MARGIN_X,
      y: y - size - 2,
      width: verbW + 10,
      height: size + 6,
      color: rgb(0.92, 0.95, 1),
      borderColor: ACCENT,
      borderWidth: 0.5,
    });
    page.drawText(sanitize(verb), {
      x: MARGIN_X + 5,
      y: y - size,
      size,
      font: helvBold,
      color: ACCENT,
    });
    page.drawText(sanitize(path), {
      x: MARGIN_X + verbW + 18,
      y: y - size,
      size,
      font: courier,
      color: INK,
    });
    y -= lineHeight + 2;
  }

  // ----- COVER -----
  page.drawLine({
    start: { x: MARGIN_X, y: y + 6 },
    end: { x: MARGIN_X + 64, y: y + 6 },
    thickness: 1.25,
    color: ACCENT,
  });
  y -= 4;
  page.drawText(sanitize("DEVELOPER REFERENCE"), {
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

  drawText(API_OVERVIEW.summary, 11, helv, INK_SOFT, 15);
  y -= 6;
  drawDivider();

  // Cover stat band.
  const STATS: Array<[string, string]> = [
    ["Resources", `${API_RESOURCES.length}`],
    ["Endpoints", `${API_ENDPOINT_TOTAL}`],
    ["Transport", "HTTPS"],
    ["Auth", "HTTP Basic"],
  ];
  ensureRoom(60);
  const colW = CONTENT_WIDTH / 4;
  STATS.forEach(([label, value], i) => {
    const cx = MARGIN_X + i * colW;
    page.drawText(sanitize(label.toUpperCase()), {
      x: cx,
      y: y - 9,
      size: 8.5,
      font: helvBold,
      color: INK_SOFT,
    });
    const isLast = i === STATS.length - 1;
    page.drawText(sanitize(value), {
      x: cx,
      y: y - 36,
      size: isLast || i === 2 ? 18 : 26,
      font: helvBold,
      color: i === STATS.length - 1 ? ACCENT : INK,
    });
  });
  y -= 50;

  drawText(
    "Reference, not contract. Endpoint behavior and field shapes follow the live API; verify against staging before production cutover.",
    9.5,
    helvOblique,
    INK_SOFT,
    13,
  );
  drawDivider(12, 18);

  // ----- OVERVIEW -----
  requireSpaceForHeader(80);
  page.drawText(sanitize("00 — OVERVIEW"), {
    x: MARGIN_X,
    y: y - 9.5,
    size: 9.5,
    font: helvBold,
    color: ACCENT,
  });
  y -= 20;
  drawText("Host, transport, authentication.", 18, helvBold, INK, 22);
  y -= 4;
  drawText("Production host", 10.5, helvBold, INK, 14);
  drawCode(API_HOST_PRODUCTION);
  drawText("Staging host", 10.5, helvBold, INK, 14);
  drawCode(API_HOST_STAGING);
  drawText("Transport", 10.5, helvBold, INK, 14);
  drawText(API_OVERVIEW.transport, 10.5, helv, INK_SOFT, 14);
  y -= 4;
  drawText("Authentication", 10.5, helvBold, INK, 14);
  drawText(API_OVERVIEW.authentication, 10.5, helv, INK_SOFT, 14);
  y -= 4;
  drawText("Example curl", 10.5, helvBold, INK, 14);
  drawCode(API_OVERVIEW.sampleCurl);
  drawDivider();

  // ----- PER-RESOURCE SECTIONS -----
  API_RESOURCES.forEach((resource, index) => {
    const n = String(index + 1).padStart(2, "0");
    requireSpaceForHeader(80);
    page.drawText(sanitize(`${n} — ${resource.name.toUpperCase()}`), {
      x: MARGIN_X,
      y: y - 9.5,
      size: 9.5,
      font: helvBold,
      color: ACCENT,
    });
    y -= 20;
    drawText(resource.name, 18, helvBold, INK, 22);
    drawText(resource.shortDescription, 11, helv, INK_SOFT, 15);
    y -= 4;

    drawText("Endpoints", 10.5, helvBold, INK, 14);
    for (const ep of resource.endpoints) {
      drawEndpointRow(ep.verb, ep.path);
    }
    y -= 4;

    // Render the verbatim docs in block form.
    for (const block of parseBlocks(resource.markdown)) {
      if (block.kind === "h2") {
        // Skip the "## Precise Hire, Inc. API v2" repeating crumb — it
        // mirrors the header we already drew.
        if (/^Precise Hire.*API v2$/i.test(block.text)) continue;
        ensureRoom(22);
        drawText(block.text, 12.5, helvBold, INK, 16);
      } else if (block.kind === "h3") {
        ensureRoom(20);
        drawText(block.text, 11.5, helvBold, ACCENT, 15);
      } else if (block.kind === "h4") {
        ensureRoom(18);
        drawText(block.text, 10.5, helvBold, INK, 14);
      } else if (block.kind === "code") {
        drawCode(block.text);
      } else {
        drawText(block.text, 10.5, helv, INK_SOFT, 14.5);
      }
    }
    drawDivider();
  });

  // ----- FOOTER STAMPING -----
  // Draw footer on every page (including the cover) and stamp page numbers
  // in a single pass at the end, once we know the total page count.
  const pages = pdf.getPages();
  pages.forEach((p, idx) => {
    p.drawLine({
      start: { x: MARGIN_X, y: 52 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: 52 },
      thickness: 0.5,
      color: RULE,
    });
    p.drawText(sanitize("Rapid Hire Solutions"), {
      x: MARGIN_X,
      y: 36,
      size: 9,
      font: helvBold,
      color: INK,
    });
    const brandLead = measure("Rapid Hire Solutions  \u00b7  ", 9, helvBold);
    p.drawText(sanitize("rapidhiresolutions.com"), {
      x: MARGIN_X + brandLead,
      y: 36,
      size: 9,
      font: helv,
      color: INK_SOFT,
    });
    const pageLabel = `${idx + 1} / ${pages.length}`;
    const pageW = measure(pageLabel, 9, helvBold);
    p.drawText(sanitize(pageLabel), {
      x: PAGE_WIDTH - MARGIN_X - pageW,
      y: 36,
      size: 9,
      font: helvBold,
      color: INK,
    });
    const date = `Generated ${formatDate(generatedAt)}`;
    const dateW = measure(date, 8, helv);
    p.drawText(sanitize(date), {
      x: PAGE_WIDTH - MARGIN_X - dateW,
      y: 22,
      size: 8,
      font: helv,
      color: INK_SOFT,
    });
  });

  // Watermark on cover only.
  if (pages.length > 0) drawCoverWatermark(pages[0]);
  // Reference the isCoverPage flag so the type checker doesn't flag it
  // as unused — it's preserved here so a future refactor can re-enable
  // page-aware behavior without re-introducing the state.
  void isCoverPage;

  return pdf.save();
}

/**
 * Compose the download filename for a given options bundle. Kept as a
 * pure helper so the page module can derive the name without building
 * the full document.
 */
export function buildApiDocsPdfFilename(
  opts: BuildApiDocsPdfOptions = {},
): string {
  const { generatedAt = new Date() } = opts;
  return `rapid-hire-api-v2-reference-${formatDate(generatedAt)}.pdf`;
}

/**
 * Minimal subset of the DOM we need from the host page so the trigger
 * helper can run in jsdom-free vitest. Mirrors the shape used by
 * `triggerK12CompliancePdfDownload` in `k12Pdf.ts` so both downloads
 * can share the same fake-host test rig and operate the same way in
 * production.
 */
export type ApiDocsDownloadHost = {
  createElement: (tagName: string) => {
    href: string;
    download: string;
    click: () => void;
    remove: () => void;
  };
  appendChild: (el: unknown) => void;
  createObjectURL: (blob: { type: string }) => string;
  revokeObjectURL: (url: string) => void;
};

/**
 * Trigger a browser-side download of the encoded PDF bytes. Accepts an
 * injected host so unit tests can verify the plumbing without needing
 * jsdom — production callers omit the host argument and pick up the
 * real window/document at call time. The removal + revoke step is
 * deferred to the next tick so the click handler can fire before the
 * anchor is detached (matches K-12 download semantics).
 */
export function triggerApiDocsPdfDownload(
  bytes: Uint8Array,
  filename = buildApiDocsPdfFilename(),
  host?: ApiDocsDownloadHost,
): void {
  const real: ApiDocsDownloadHost =
    host ??
    ({
      createElement: (tag: string) =>
        window.document.createElement(tag) as unknown as ReturnType<
          ApiDocsDownloadHost["createElement"]
        >,
      appendChild: (el: unknown) => {
        window.document.body.appendChild(el as Node);
      },
      createObjectURL: (blob: { type: string }) =>
        window.URL.createObjectURL(blob as unknown as Blob),
      revokeObjectURL: (url: string) => {
        window.URL.revokeObjectURL(url);
      },
    } satisfies ApiDocsDownloadHost);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = real.createObjectURL(blob);
  const link = real.createElement("a");
  link.href = url;
  link.download = filename;
  real.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    real.revokeObjectURL(url);
  }, 0);
}
