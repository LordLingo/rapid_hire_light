/*
  §153 — K-12 compliance guide PDF generator + page wiring
  --------------------------------------------------------

  Verifies that:
    1. buildK12CompliancePdf() emits a syntactically valid PDF byte
       stream (begins with `%PDF-`).
    2. The generated PDF contains every state's two-letter code AND
       full state name AND statute citation from K12_COMPLIANCE_MATRIX.
    3. The generated PDF contains every federal-layer title + citation
       from K12_FEDERAL_LAYERS.
    4. Every workflow move (01–05) is present.
    5. The cover stat band reflects k12MatrixCounts() exactly.
    6. The `generatedFor` field is rendered on the cover when provided
       and omitted (no "Generated for:" prefix) when not.
    7. buildK12CompliancePdfFilename slugifies attribution and falls
       back to a clean default when no attribution is supplied.
    8. The K-12 page (ResourcesK12ComplianceGuide.tsx) imports the three
       public helpers, renders a `data-testid="k12-guide-cta-download"`
       <button>, wires it to a click handler, and uses the lucide
       `Download` icon — so the hero CTA can never silently regress.

  Text is extracted via the same pdfjs-dist legacy build used by the
  checklist generator's spec so substring-matching is stable across
  pdf-lib's Flate-compressed content streams.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildK12CompliancePdf,
  buildK12CompliancePdfFilename,
  triggerK12CompliancePdfDownload,
  type K12DownloadHost,
} from "./k12Pdf";
import {
  K12_COMPLIANCE_MATRIX,
  K12_FEDERAL_LAYERS,
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

describe("§153 — buildK12CompliancePdf", () => {
  it("emits a valid PDF byte stream", async () => {
    const bytes = await buildK12CompliancePdf();
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(1000);
    // First five bytes are the PDF magic header.
    const head = String.fromCharCode(...bytes.slice(0, 5));
    expect(head).toBe("%PDF-");
  });

  it("contains every state code, state name, and statute citation", async () => {
    const bytes = await buildK12CompliancePdf();
    const text = await extractPdfText(bytes);
    for (const row of K12_COMPLIANCE_MATRIX) {
      expect(text).toContain(row.code);
      expect(text).toContain(row.state);
      // Statute strings include §, periods, and abbreviations that
      // pdfjs sometimes splits across spans. Match on the first
      // distinctive token (e.g. "Cal." from "Cal. Ed. Code §44830.1").
      const firstToken = row.statute.split(/\s+/)[0];
      expect(text).toContain(firstToken);
    }
  });

  it("contains every federal-layer title and citation", async () => {
    const bytes = await buildK12CompliancePdf();
    const text = await extractPdfText(bytes);
    for (const layer of K12_FEDERAL_LAYERS) {
      // Titles include en-dashes and ampersands; assert on the first
      // distinctive word so pdfjs text-item splitting can't trip us up.
      const firstWord = layer.title.split(/\s+/)[0];
      expect(text).toContain(firstWord);
      const citationToken = layer.citation.split(/\s+/)[0];
      expect(text).toContain(citationToken);
    }
  });

  it("contains all five district-workflow moves", async () => {
    const bytes = await buildK12CompliancePdf();
    const text = await extractPdfText(bytes);
    for (const n of ["01", "02", "03", "04", "05"]) {
      expect(text).toMatch(new RegExp(`Move\\s+${n}`));
    }
    expect(text).toContain("Confirm");
    expect(text).toContain("volunteer");
    expect(text).toContain("tier");
    expect(text).toContain("re-fingerprint");
    expect(text).toContain("FCRA");
  });

  it("cover stat band reflects k12MatrixCounts() exactly", async () => {
    const bytes = await buildK12CompliancePdf();
    const text = await extractPdfText(bytes);
    const counts = k12MatrixCounts();
    expect(text).toContain(String(counts.states));
    expect(text).toContain(String(counts.fingerprintRequiredStates));
    expect(text).toContain(String(counts.rapBackStates));
    expect(text).toContain(String(counts.tieredBarStates));
    expect(text.toUpperCase()).toContain("STATES COVERED");
  });

  it("renders 'Generated for:' on the cover when generatedFor is provided", async () => {
    const bytes = await buildK12CompliancePdf({
      generatedFor: "Acme Unified School District",
    });
    const text = await extractPdfText(bytes);
    expect(text).toContain("Generated for:");
    expect(text).toContain("Acme Unified School District");
  });

  it("omits the 'Generated for:' line when no attribution is supplied", async () => {
    const bytes = await buildK12CompliancePdf();
    const text = await extractPdfText(bytes);
    expect(text).not.toContain("Generated for:");
  });

  it("brand line + reference-not-legal-advice disclaimer appear in the document", async () => {
    const bytes = await buildK12CompliancePdf();
    const text = await extractPdfText(bytes);
    expect(text).toContain("Rapid Hire Solutions");
    expect(text.toLowerCase()).toContain("not legal advice");
  });

  it("emits a multi-page document (matrix + federal + workflow + companion)", async () => {
    const bytes = await buildK12CompliancePdf();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({
      data: bytes.slice(),
      isEvalSupported: false,
      useSystemFonts: false,
      disableFontFace: true,
    });
    const doc = await loadingTask.promise;
    expect(doc.numPages).toBeGreaterThanOrEqual(3);
  });
});

describe("§153 — buildK12CompliancePdfFilename", () => {
  it("defaults to rapid-hire-k12-compliance-guide.pdf", () => {
    expect(buildK12CompliancePdfFilename()).toBe(
      "rapid-hire-k12-compliance-guide.pdf",
    );
    expect(buildK12CompliancePdfFilename({})).toBe(
      "rapid-hire-k12-compliance-guide.pdf",
    );
    expect(buildK12CompliancePdfFilename({ generatedFor: "" })).toBe(
      "rapid-hire-k12-compliance-guide.pdf",
    );
    expect(buildK12CompliancePdfFilename({ generatedFor: "   " })).toBe(
      "rapid-hire-k12-compliance-guide.pdf",
    );
  });

  it("slugifies and appends the attribution when provided", () => {
    expect(
      buildK12CompliancePdfFilename({
        generatedFor: "Acme Unified School District!",
      }),
    ).toBe("rapid-hire-k12-compliance-guide-acme-unified-school-district.pdf");
    expect(
      buildK12CompliancePdfFilename({ generatedFor: "  Multi   Space  " }),
    ).toBe("rapid-hire-k12-compliance-guide-multi-space.pdf");
  });

  it("caps the slug at 48 characters so filenames stay manageable", () => {
    const longName = "A".repeat(120);
    const filename = buildK12CompliancePdfFilename({ generatedFor: longName });
    // base ("rapid-hire-k12-compliance-guide") + "-" + slug + ".pdf"
    const slug = filename
      .replace(/^rapid-hire-k12-compliance-guide-/, "")
      .replace(/\.pdf$/, "");
    expect(slug.length).toBeLessThanOrEqual(48);
  });
});

/*
  Browser-glue test rig: the helper accepts a `K12DownloadHost` for
  dependency-injected testing so we don't need jsdom (which isn't in
  the dependency tree on this template). The fake captures everything
  the helper does so we can assert on each side-effect deterministically.
*/
function makeFakeHost(): {
  host: K12DownloadHost;
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
    objectUrl: "blob:fake-k12-url",
  };
  const host: K12DownloadHost = {
    createElement: () => {
      state.created += 1;
      const a = {
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
      return a;
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

describe("§153 — triggerK12CompliancePdfDownload (browser glue)", () => {
  it("creates an anchor, sets href + download, appends it, and clicks", () => {
    const { host, state } = makeFakeHost();
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-
    triggerK12CompliancePdfDownload(bytes, "test-k12.pdf", host);

    expect(state.created).toBe(1);
    expect(state.appended).toBe(1);
    expect(state.clicked).toBe(1);
    expect(state.href).toBe("blob:fake-k12-url");
    expect(state.download).toBe("test-k12.pdf");
    expect(state.blobType).toBe("application/pdf");
  });

  it("uses the default filename when none is provided", () => {
    const { host, state } = makeFakeHost();
    triggerK12CompliancePdfDownload(
      new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]),
      undefined,
      host,
    );
    expect(state.download).toBe("rapid-hire-k12-compliance-guide.pdf");
  });

  it("defers cleanup to the next tick (does not remove/revoke synchronously)", async () => {
    const { host, state } = makeFakeHost();
    triggerK12CompliancePdfDownload(
      new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]),
      "k.pdf",
      host,
    );
    // Immediately after the call, cleanup must not have run yet.
    expect(state.removed).toBe(0);
    expect(state.revoked).toBe(0);
    // Drain the macrotask queue.
    await new Promise<void>((r) => setTimeout(r, 0));
    expect(state.removed).toBe(1);
    expect(state.revoked).toBe(1);
  });
});

describe("§153 — K-12 guide page wires the download button (source-pin)", () => {
  it("imports the three k12Pdf helpers from @/lib/k12Pdf", () => {
    expect(PAGE_SRC).toContain('from "@/lib/k12Pdf"');
    expect(PAGE_SRC).toContain("buildK12CompliancePdf");
    expect(PAGE_SRC).toContain("buildK12CompliancePdfFilename");
    expect(PAGE_SRC).toContain("triggerK12CompliancePdfDownload");
  });

  it("renders <button data-testid=\"k12-guide-cta-download\"> wired to a click handler", () => {
    // Direction-agnostic: assert the button tag, the testid, and the
    // onClick handler all coexist within a single <button>...</button>
    // block. The attribute order varies depending on formatter rules.
    const match = PAGE_SRC.match(/<button\b[\s\S]*?<\/button>/g);
    expect(match).not.toBeNull();
    const downloadBlock = (match ?? []).find((b) =>
      b.includes('data-testid="k12-guide-cta-download"'),
    );
    expect(downloadBlock).toBeDefined();
    expect(downloadBlock!).toContain("onClick={handleDownloadPdf}");
    expect(downloadBlock!).toContain("type=\"button\"");
  });

  it("exposes a disabled state while the PDF is being built", () => {
    expect(PAGE_SRC).toContain("disabled={downloadingPdf}");
    expect(PAGE_SRC).toContain('"Building your PDF…"');
    expect(PAGE_SRC).toContain('"Download PDF"');
  });

  it("uses the lucide Download icon next to the label", () => {
    expect(PAGE_SRC).toMatch(/import\s*\{[\s\S]*?\bDownload\b[\s\S]*?\}\s*from\s*"lucide-react"/);
    expect(PAGE_SRC).toMatch(/<Download[\s\S]{0,200}?aria-hidden/);
  });

  it("sits inside the hero afterLede slot next to the existing CTAs", () => {
    // The three hero CTAs must all live inside the PageHero afterLede.
    const afterLedeMatch = PAGE_SRC.match(/afterLede=\{([\s\S]*?)\n\s{8}\}/);
    expect(afterLedeMatch).not.toBeNull();
    const slot = afterLedeMatch![1];
    expect(slot).toContain("k12-guide-cta-primary");
    expect(slot).toContain("k12-guide-cta-download");
    expect(slot).toContain("k12-guide-cta-secondary");
  });
});
