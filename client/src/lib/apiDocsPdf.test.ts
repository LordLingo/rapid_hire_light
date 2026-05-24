/*
  §160 — API documentation PDF generator + Integrations page wiring
  -----------------------------------------------------------------

  Verifies that:
    1. The apiReference data model is internally consistent: every
       resource has at least one endpoint, slug is lowercase, and the
       cross-referenced API_ENDPOINT_TOTAL matches the sum of resource
       endpoint counts.
    2. buildApiDocsPdf() emits a syntactically valid PDF byte stream
       (begins with `%PDF-`) and is non-trivially sized.
    3. The generated PDF contains the API overview header, every
       resource name, every endpoint verb + path pair, and the
       brand footer.
    4. The cover stat band reflects API_RESOURCES.length and
       API_ENDPOINT_TOTAL exactly.
    5. The `generatedFor` field is rendered on the cover when provided.
    6. buildApiDocsPdfFilename produces a date-stamped filename in the
       expected shape.
    7. triggerApiDocsPdfDownload, given an injected ApiDocsDownloadHost,
       creates an anchor, sets href + download, appends + clicks, and
       defers cleanup to the next tick.
    8. The Integrations page source pins the three apiDocsPdf helpers,
       renders both `api-docs-download-btn` testids, references the
       Download icon, surfaces every resource via `api-resource-{slug}`,
       and wires the request form to FORMSPREE_INTEGRATIONS_ENDPOINT
       (§161 — dedicated partner inbox) with the integration-request
       testids — so the surface can never silently regress.

  Text extraction reuses the same pdfjs-dist legacy build that the
  K-12 generator's spec uses, so substring matching is stable across
  pdf-lib's Flate-compressed content streams.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildApiDocsPdf,
  buildApiDocsPdfFilename,
  triggerApiDocsPdfDownload,
  type ApiDocsDownloadHost,
} from "./apiDocsPdf";
import {
  API_ENDPOINT_TOTAL,
  API_HOST_PRODUCTION,
  API_HOST_STAGING,
  API_OVERVIEW,
  API_RESOURCES,
} from "./apiReference";

const PAGE_PATH = resolve(__dirname, "../pages/Integrations.tsx");
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

describe("§160 — API reference data model", () => {
  it("declares at least one resource", () => {
    expect(API_RESOURCES.length).toBeGreaterThan(0);
  });

  it("every resource has a lowercase slug, name, description, and >=1 endpoint", () => {
    for (const r of API_RESOURCES) {
      expect(r.slug).toMatch(/^[a-z0-9]+$/);
      expect(r.name.length).toBeGreaterThan(0);
      expect(r.shortDescription.length).toBeGreaterThan(0);
      expect(r.endpoints.length).toBeGreaterThan(0);
      for (const ep of r.endpoints) {
        expect(["GET", "POST", "PUT", "PATCH", "DELETE"]).toContain(ep.verb);
        expect(ep.path.length).toBeGreaterThan(0);
      }
    }
  });

  it("API_ENDPOINT_TOTAL equals the sum of resource endpoint counts", () => {
    const sum = API_RESOURCES.reduce((n, r) => n + r.endpoints.length, 0);
    expect(API_ENDPOINT_TOTAL).toBe(sum);
  });

  it("declares production + staging hosts that look like the published API", () => {
    expect(API_HOST_PRODUCTION).toMatch(/^https:\/\/.+\/api2$/);
    expect(API_HOST_STAGING).toMatch(/^https:\/\/.+\/api2$/);
  });

  it("declares transport, auth, version, and sample curl in the overview", () => {
    expect(API_OVERVIEW.version).toMatch(/^v\d+$/);
    expect(API_OVERVIEW.transport.toLowerCase()).toContain("https");
    expect(API_OVERVIEW.authentication.toLowerCase()).toContain("basic");
    expect(API_OVERVIEW.sampleCurl).toContain("curl");
  });
});

describe("§160 — buildApiDocsPdf", () => {
  it("emits a valid PDF byte stream", async () => {
    const bytes = await buildApiDocsPdf();
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(2000);
    const head = String.fromCharCode(...bytes.slice(0, 5));
    expect(head).toBe("%PDF-");
  });

  it("renders the Rapid Hire brand line in the page footer", async () => {
    const bytes = await buildApiDocsPdf();
    const text = await extractPdfText(bytes);
    expect(text).toContain("Rapid Hire Solutions");
    expect(text).toContain("rapidhiresolutions.com");
  });

  it("renders every resource name and every endpoint verb + path", async () => {
    const bytes = await buildApiDocsPdf();
    const text = await extractPdfText(bytes);
    for (const r of API_RESOURCES) {
      expect(text).toContain(r.name);
      for (const ep of r.endpoints) {
        expect(text).toContain(ep.verb);
        // pdfjs may split paths across spans on punctuation; match on
        // the first distinctive segment after the leading slash.
        const firstSeg = ep.path.replace(/^\//, "").split("/")[0];
        expect(text).toContain(firstSeg);
      }
    }
  });

  it("renders the cover stat band with resource and endpoint counts", async () => {
    const bytes = await buildApiDocsPdf();
    const text = await extractPdfText(bytes);
    expect(text).toContain(String(API_RESOURCES.length));
    expect(text).toContain(String(API_ENDPOINT_TOTAL));
    expect(text.toUpperCase()).toContain("RESOURCES");
    expect(text.toUpperCase()).toContain("ENDPOINTS");
  });

  it("includes the production host in the overview section", async () => {
    const bytes = await buildApiDocsPdf();
    const text = await extractPdfText(bytes);
    // pdfjs may break the URL on slashes/dots; check distinctive token.
    expect(text).toContain("dot.precisehire.com");
  });

  it("renders the generatedFor attribution when provided", async () => {
    const bytes = await buildApiDocsPdf({ generatedFor: "Acme Talent" });
    const text = await extractPdfText(bytes);
    expect(text).toContain("Acme Talent");
    expect(text).toContain("Generated for");
  });

  it("omits the Generated for prefix when no attribution is provided", async () => {
    const bytes = await buildApiDocsPdf();
    const text = await extractPdfText(bytes);
    expect(text).not.toContain("Generated for:");
  });

  it("uses Letter page geometry (612 x 792)", async () => {
    const bytes = await buildApiDocsPdf();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({
      data: bytes.slice(),
      isEvalSupported: false,
      useSystemFonts: false,
      disableFontFace: true,
    });
    const doc = await loadingTask.promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    expect(Math.round(viewport.width)).toBe(612);
    expect(Math.round(viewport.height)).toBe(792);
  });
});

describe("§160 — buildApiDocsPdfFilename", () => {
  it("produces a date-stamped, lowercase filename", () => {
    const fixed = new Date("2026-05-22T12:00:00Z");
    const name = buildApiDocsPdfFilename({ generatedAt: fixed });
    expect(name).toBe("rapid-hire-api-v2-reference-2026-05-22.pdf");
  });

  it("defaults to today when no date is provided", () => {
    const name = buildApiDocsPdfFilename();
    expect(name).toMatch(/^rapid-hire-api-v2-reference-\d{4}-\d{2}-\d{2}\.pdf$/);
  });
});

/*
  Browser-glue test rig — same shape the K-12 generator uses.
*/
function makeFakeHost(): {
  host: ApiDocsDownloadHost;
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
    objectUrl: "blob:fake-api-docs-url",
  };
  const host: ApiDocsDownloadHost = {
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

describe("§160 — triggerApiDocsPdfDownload (browser glue)", () => {
  it("creates an anchor, sets href + download, appends it, and clicks", () => {
    const { host, state } = makeFakeHost();
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-
    triggerApiDocsPdfDownload(bytes, "test-api.pdf", host);

    expect(state.created).toBe(1);
    expect(state.appended).toBe(1);
    expect(state.clicked).toBe(1);
    expect(state.href).toBe("blob:fake-api-docs-url");
    expect(state.download).toBe("test-api.pdf");
    expect(state.blobType).toBe("application/pdf");
  });

  it("uses the default filename (date-stamped) when none is provided", () => {
    const { host, state } = makeFakeHost();
    triggerApiDocsPdfDownload(
      new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]),
      undefined,
      host,
    );
    expect(state.download).toMatch(
      /^rapid-hire-api-v2-reference-\d{4}-\d{2}-\d{2}\.pdf$/,
    );
  });

  it("defers cleanup to the next tick (does not remove/revoke synchronously)", async () => {
    const { host, state } = makeFakeHost();
    triggerApiDocsPdfDownload(
      new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]),
      "a.pdf",
      host,
    );
    expect(state.removed).toBe(0);
    expect(state.revoked).toBe(0);
    await new Promise<void>((r) => setTimeout(r, 0));
    expect(state.removed).toBe(1);
    expect(state.revoked).toBe(1);
  });
});

describe("§160 — Integrations.tsx page wiring (source-pin)", () => {
  it("imports the three apiDocsPdf helpers from @/lib/apiDocsPdf", () => {
    expect(PAGE_SRC).toContain('from "@/lib/apiDocsPdf"');
    expect(PAGE_SRC).toContain("buildApiDocsPdf");
    expect(PAGE_SRC).toContain("buildApiDocsPdfFilename");
    expect(PAGE_SRC).toContain("triggerApiDocsPdfDownload");
  });

  it("imports the API reference data model from @/lib/apiReference", () => {
    expect(PAGE_SRC).toContain('from "@/lib/apiReference"');
    expect(PAGE_SRC).toContain("API_RESOURCES");
    expect(PAGE_SRC).toContain("API_OVERVIEW");
  });

  it("renders the API reference section + Download PDF button (hero + inline)", () => {
    expect(PAGE_SRC).toContain('data-testid="integrations-api-reference"');
    expect(PAGE_SRC).toContain('data-testid="api-docs-download-btn"');
    expect(PAGE_SRC).toContain('data-testid="api-docs-download-btn-inline"');
    // Both buttons must wire onClick to the same handler.
    expect(PAGE_SRC).toContain("onClick={handleDownloadPdf}");
    // The Download icon must be imported and used.
    expect(PAGE_SRC).toMatch(/Download[, ]/);
  });

  it("surfaces every API resource via a data-testid", () => {
    // The page iterates API_RESOURCES and renders a row per resource
    // with `data-testid={`api-resource-${r.slug}`}`. We assert the
    // structural wiring: the source imports API_RESOURCES, maps over it,
    // and emits the templated testid. Source-pin tests can't read
    // expanded runtime DOM strings without jsdom, so we lock the wiring
    // shape rather than each slug.
    expect(PAGE_SRC).toContain("API_RESOURCES");
    expect(PAGE_SRC).toMatch(/API_RESOURCES\.map\(/);
    expect(PAGE_SRC).toMatch(
      /data-testid=\{`api-resource-\$\{[a-zA-Z_.]+\.slug\}`\}/,
    );
    // Sanity: the rendered list must include both the name and the
    // endpoint chips, so a developer who deletes the map body would
    // still trip the next assertion.
    expect(PAGE_SRC).toMatch(/\.endpoints\.map\(/);
    expect(PAGE_SRC).toContain(".name");
  });

  it("renders the dedicated integration-request form anchored at #request-integration", () => {
    expect(PAGE_SRC).toContain('id="request-integration"');
    expect(PAGE_SRC).toContain('data-testid="request-integration-section"');
    expect(PAGE_SRC).toContain('data-testid="integration-request-form"');
    expect(PAGE_SRC).toContain('data-testid="integration-request-submit"');
  });

  it("posts to the dedicated integrations Formspree endpoint and tags the integration subject", () => {
    // §161: Integrations form routes to its own inbox (xgoqzprv) so partner
    // requests don't dilute the sales pipeline.
    expect(PAGE_SRC).toContain('from "@/lib/formspree"');
    expect(PAGE_SRC).toContain("FORMSPREE_INTEGRATIONS_ENDPOINT");
    expect(PAGE_SRC).toContain("fetch(FORMSPREE_INTEGRATIONS_ENDPOINT");
    // And it must NOT post to the sales endpoint anymore:
    expect(PAGE_SRC).not.toMatch(/fetch\(\s*FORMSPREE_ENDPOINT\b/);
    expect(PAGE_SRC).toContain("Integration request");
  });

  it("collects ATS name, integration direction, and monthly volume fields", () => {
    expect(PAGE_SRC).toContain('name="ats"');
    expect(PAGE_SRC).toContain('name="direction"');
    expect(PAGE_SRC).toContain('name="volume"');
    // And the helpful optional fields:
    expect(PAGE_SRC).toContain('name="api_docs_link"');
    expect(PAGE_SRC).toContain('name="timeline"');
  });

  it("closing CTA scrolls to the in-page form (no longer routes to /contact)", () => {
    // The CTA strip's anchor must point at #request-integration, not
    // /contact. We tolerate a /contact link inside the success-state
    // block since that's a secondary fallback action after submission.
    const ctaMatch = PAGE_SRC.match(
      /Closing CTA[\s\S]*?<a[^>]*href="([^"]+)"/,
    );
    expect(ctaMatch).not.toBeNull();
    if (ctaMatch) expect(ctaMatch[1]).toBe("#request-integration");
  });
});
