/*
  §164 — LinkedIn carousel template (K-12) generator + page wiring

  Verifies that:
    1. buildLinkedInK12Carousel() emits a syntactically valid PDF.
    2. The deck is exactly 10 slides and uses the LinkedIn 4:5 portrait
       page geometry (1080 x 1350 pt) — the LinkedIn document-post
       sweet spot. Tests would catch any accidental Letter-format
       regression that turned the deck into a normal multi-page PDF.
    3. Every slide carries a "{n} / {total}" pagination chip.
    4. The deck's text content reflects k12MatrixCounts() and contains
       the 3 featured states' (CA / TX / FL) statute citations.
    5. The brand line + RHS monogram + closing-CTA URL are present.
    6. buildLinkedInK12CarouselFilename slugifies attribution.
    7. sanitize() neutralises smart-quote / em-dash / NBSP / control
       chars without losing other content.
    8. triggerLinkedInK12CarouselDownload follows the same DI host
       contract as the K12 PDF download helper (anchor created +
       appended + clicked, blob is application/pdf, cleanup deferred).
    9. The K-12 page source pins the new helper imports, the
       carousel button testid, the lucide Linkedin icon, the disabled
       loading copy, and the placement inside the hero afterLede slot.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildLinkedInK12Carousel,
  buildLinkedInK12CarouselFilename,
  buildCarouselSlides,
  sanitize,
  triggerLinkedInK12CarouselDownload,
  type CarouselDownloadHost,
} from "./linkedinK12Carousel";
import {
  K12_COMPLIANCE_MATRIX,
  k12MatrixCounts,
} from "./k12ComplianceMatrix";

const PAGE_PATH = resolve(
  __dirname,
  "../pages/ResourcesK12ComplianceGuide.tsx",
);
const PAGE_SRC = readFileSync(PAGE_PATH, "utf8");

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

describe("§164 — buildCarouselSlides (pure data)", () => {
  it("produces exactly 10 slides", () => {
    const slides = buildCarouselSlides();
    expect(slides).toHaveLength(10);
  });

  it("indexes slides 1..10 in order", () => {
    const slides = buildCarouselSlides();
    slides.forEach((s, i) => {
      expect(s.index).toBe(i + 1);
    });
  });

  it("starts with a cover and ends with a CTA", () => {
    const slides = buildCarouselSlides();
    expect(slides[0].kind).toBe("cover");
    expect(slides[slides.length - 1].kind).toBe("cta");
  });

  it("includes the three highest-volume state spotlights (CA, TX, FL)", () => {
    const slides = buildCarouselSlides();
    const matrixSlides = slides.filter((s) => s.kind === "matrix");
    expect(matrixSlides).toHaveLength(3);
    const eyebrows = matrixSlides.map((s) => s.eyebrow).join(" | ");
    expect(eyebrows).toContain("California");
    expect(eyebrows).toContain("Texas");
    expect(eyebrows).toContain("Florida");
  });

  it("reflects k12MatrixCounts() in the stat slide title", () => {
    const slides = buildCarouselSlides();
    const stat = slides.find((s) => s.kind === "stat");
    expect(stat).toBeDefined();
    const counts = k12MatrixCounts();
    expect(stat!.title).toContain(`${counts.fingerprintRequiredStates}`);
    expect(stat!.title).toContain(`${counts.states}`);
  });

  it("every slide has non-empty eyebrow / title / body", () => {
    const slides = buildCarouselSlides();
    for (const s of slides) {
      expect(s.eyebrow.length).toBeGreaterThan(0);
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
  });
});

describe("§164 — sanitize (WinAnsi safety)", () => {
  it("replaces em-dash, en-dash, ellipsis, smart quotes, NBSP", () => {
    const input = "K\u201312 \u2014 hire\u2019s a \u201Cfit\u201D\u2026\u00A0now";
    const out = sanitize(input);
    expect(out).not.toMatch(/\u2014|\u2013|\u2018|\u2019|\u201C|\u201D|\u2026|\u00A0/);
    expect(out).toContain("K-12");
    expect(out).toContain("hire's");
    expect(out).toContain('"fit"');
    expect(out).toContain("...");
  });

  it("strips control bytes without dropping printable text", () => {
    const out = sanitize("hello\u0000world\u0007ok");
    expect(out).toBe("helloworldok");
  });
});

describe("§164 — buildLinkedInK12Carousel (PDF emission)", () => {
  it("emits a valid PDF byte stream", async () => {
    const bytes = await buildLinkedInK12Carousel();
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(2000);
    const head = String.fromCharCode(...bytes.slice(0, 5));
    expect(head).toBe("%PDF-");
  });

  it("produces exactly 10 pages at 1080 x 1350 (LinkedIn 4:5 portrait)", async () => {
    const bytes = await buildLinkedInK12Carousel();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({
      data: bytes.slice(),
      isEvalSupported: false,
      useSystemFonts: false,
      disableFontFace: true,
    }).promise;
    expect(doc.numPages).toBe(10);
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      // pdfjs viewport at scale 1 reports dimensions in PDF user units.
      const viewport = page.getViewport({ scale: 1 });
      expect(Math.round(viewport.width)).toBe(1080);
      expect(Math.round(viewport.height)).toBe(1350);
    }
  });

  it("contains the brand line, full-guide URL, and the 3 featured states' statute citations", async () => {
    const bytes = await buildLinkedInK12Carousel();
    const text = await extractPdfText(bytes);
    expect(text).toContain("Rapid Hire Solutions");
    expect(text).toContain(
      "rapidhiresolutions.com/resources/k12-compliance-guide",
    );
    for (const code of ["CA", "TX", "FL"]) {
      const row = K12_COMPLIANCE_MATRIX.find((r) => r.code === code);
      expect(row).toBeDefined();
      // Statute strings include §, periods, and abbreviations that
      // pdfjs sometimes splits across spans, so match on the first
      // distinctive token (e.g. "Cal." from "Cal. Ed. Code §44830.1").
      // Sanitizer also converts em-dashes; first token is unaffected.
      const firstToken = row!.statute.split(/\s+/)[0];
      expect(text).toContain(firstToken);
    }
  });

  it("renders the {n} / {total} pagination chip on every slide", async () => {
    const bytes = await buildLinkedInK12Carousel();
    const text = await extractPdfText(bytes);
    for (let i = 1; i <= 10; i++) {
      expect(text).toContain(`${i} / 10`);
    }
  });

  it("renders the RHS monogram on cover + CTA slides", async () => {
    const bytes = await buildLinkedInK12Carousel();
    const text = await extractPdfText(bytes);
    expect(text).toContain("RHS");
  });

  it("honors generatedFor on the cover when supplied", async () => {
    const bytes = await buildLinkedInK12Carousel({
      generatedFor: "Acme USD",
    });
    const text = await extractPdfText(bytes);
    expect(text).toContain("Prepared for Acme USD");
  });
});

describe("§164 — buildLinkedInK12CarouselFilename", () => {
  it("returns a clean default when no attribution is supplied", () => {
    expect(buildLinkedInK12CarouselFilename()).toBe(
      "rapid-hire-k12-linkedin-carousel.pdf",
    );
  });

  it("slugifies attribution and caps the slug length", () => {
    expect(buildLinkedInK12CarouselFilename({ generatedFor: "Acme USD" })).toBe(
      "rapid-hire-k12-linkedin-carousel-acme-usd.pdf",
    );
    const long = "x".repeat(200);
    const out = buildLinkedInK12CarouselFilename({ generatedFor: long });
    const slug = out.replace(
      /^rapid-hire-k12-linkedin-carousel-/,
      "",
    ).replace(/\.pdf$/, "");
    expect(slug.length).toBeLessThanOrEqual(48);
  });
});

/* ---- browser-glue test rig (DI host, no jsdom required) -------- */

function makeFakeHost(): {
  host: CarouselDownloadHost;
  state: {
    created: number;
    appended: number;
    clicked: number;
    removed: number;
    revoked: number;
    href: string | null;
    download: string | null;
    blobType: string | null;
    objectUrl: string;
  };
} {
  const state = {
    created: 0,
    appended: 0,
    clicked: 0,
    removed: 0,
    revoked: 0,
    href: null as string | null,
    download: null as string | null,
    blobType: null as string | null,
    objectUrl: "blob:fake-carousel-url",
  };
  const host: CarouselDownloadHost = {
    createElement: () => {
      state.created += 1;
      return {
        get href() {
          return state.href ?? "";
        },
        set href(value: string) {
          state.href = value;
        },
        get download() {
          return state.download ?? "";
        },
        set download(value: string) {
          state.download = value;
        },
        click() {
          state.clicked += 1;
        },
        remove() {
          state.removed += 1;
        },
      };
    },
    appendChild: () => {
      state.appended += 1;
    },
    createObjectURL: (blob) => {
      state.blobType = blob.type;
      return state.objectUrl;
    },
    revokeObjectURL: () => {
      state.revoked += 1;
    },
  };
  return { host, state };
}

describe("§164 — triggerLinkedInK12CarouselDownload (browser glue)", () => {
  it("creates an anchor, sets href + download, appends and clicks it", () => {
    const { host, state } = makeFakeHost();
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-
    triggerLinkedInK12CarouselDownload(bytes, "test-carousel.pdf", host);

    expect(state.created).toBe(1);
    expect(state.appended).toBe(1);
    expect(state.clicked).toBe(1);
    expect(state.href).toBe("blob:fake-carousel-url");
    expect(state.download).toBe("test-carousel.pdf");
    expect(state.blobType).toBe("application/pdf");
  });

  it("uses the default filename when none is provided", () => {
    const { host, state } = makeFakeHost();
    triggerLinkedInK12CarouselDownload(
      new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]),
      undefined,
      host,
    );
    expect(state.download).toBe("rapid-hire-k12-linkedin-carousel.pdf");
  });

  it("defers cleanup to the next tick (does not remove/revoke synchronously)", async () => {
    const { host, state } = makeFakeHost();
    triggerLinkedInK12CarouselDownload(
      new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]),
      "k.pdf",
      host,
    );
    expect(state.removed).toBe(0);
    expect(state.revoked).toBe(0);
    await new Promise<void>((r) => setTimeout(r, 0));
    expect(state.removed).toBe(1);
    expect(state.revoked).toBe(1);
  });
});

describe("§164 — K-12 guide page wires the carousel button (source-pin)", () => {
  it("imports the three carousel helpers from @/lib/linkedinK12Carousel", () => {
    expect(PAGE_SRC).toContain('from "@/lib/linkedinK12Carousel"');
    expect(PAGE_SRC).toContain("buildLinkedInK12Carousel");
    expect(PAGE_SRC).toContain("buildLinkedInK12CarouselFilename");
    expect(PAGE_SRC).toContain("triggerLinkedInK12CarouselDownload");
  });

  it('renders <button data-testid="k12-guide-cta-carousel"> wired to a click handler', () => {
    const match = PAGE_SRC.match(/<button\b[\s\S]*?<\/button>/g);
    expect(match).not.toBeNull();
    const carouselBlock = (match ?? []).find((b) =>
      b.includes('data-testid="k12-guide-cta-carousel"'),
    );
    expect(carouselBlock).toBeDefined();
    expect(carouselBlock!).toContain("onClick={handleDownloadCarousel}");
    expect(carouselBlock!).toContain('type="button"');
  });

  it("exposes a disabled state while the carousel is being built", () => {
    expect(PAGE_SRC).toContain("disabled={downloadingCarousel}");
    expect(PAGE_SRC).toContain('"Building carousel…"');
    expect(PAGE_SRC).toContain('"Download LinkedIn carousel"');
  });

  it("uses the lucide Linkedin icon next to the label", () => {
    expect(PAGE_SRC).toMatch(
      /import\s*\{[\s\S]*?\bLinkedin\b[\s\S]*?\}\s*from\s*"lucide-react"/,
    );
    expect(PAGE_SRC).toMatch(/<Linkedin[\s\S]{0,200}?aria-hidden/);
  });

  it("sits inside the hero afterLede slot next to the existing CTAs", () => {
    const afterLedeMatch = PAGE_SRC.match(/afterLede=\{([\s\S]*?)\n\s{8}\}/);
    expect(afterLedeMatch).not.toBeNull();
    const slot = afterLedeMatch![1];
    expect(slot).toContain("k12-guide-cta-primary");
    expect(slot).toContain("k12-guide-cta-download");
    expect(slot).toContain("k12-guide-cta-carousel");
    expect(slot).toContain("k12-guide-cta-secondary");
  });
});
