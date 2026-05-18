/**
 * §122 — /integrations: tall portrait editorial illustration replaces both
 * the small under-eyebrow plate (illegible at hero scale) and the
 * user-supplied infographic (had on-image copy that competed with the page
 * typography).
 *
 * The illustration tells the same data-flow story — ATS dashboard at top,
 * interlocking link rings at center, background-check report at bottom —
 * inside a "04 — The handshake" section sitting between the white "How
 * it works" band and the paper integrations grid.
 *
 * This invariant pins:
 *   A)  the small under-eyebrow plate has been removed
 *   B)  the user-uploaded infographic has been removed
 *   C)  the new portrait illustration is mounted in the handshake section,
 *       framed in white-mat + paper-shadow + hover-zoom, with a self-
 *       descriptive alt text
 *   D)  the page numbering is monotonic (02 hero → 03 how it works →
 *       04 handshake → 05 grid)
 */
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC = resolve(__dirname, "..");

const PAGE = readFileSync(resolve(SRC, "pages/Integrations.tsx"), "utf-8");

describe("§122.A — small under-eyebrow plate has been removed", () => {
  it("PageHero on /integrations no longer ships a belowEyebrow plate", () => {
    expect(PAGE).toContain('eyebrow="02 — Integrations"');
    expect(PAGE).not.toContain("belowEyebrow=");
  });

  it("the legacy small-plate testid is gone", () => {
    expect(PAGE).not.toContain('data-testid="integrations-hero-image"');
  });

  it("the legacy 16rem aspect-square wrapper class combo is gone", () => {
    expect(PAGE).not.toMatch(/aspect-square[^"]*max-w-\[16rem\]/);
  });

  it("the legacy small-plate webp is no longer referenced", () => {
    expect(PAGE).not.toContain("integrations-plate-5gAXFzjQrFTUZZGW4UdbC7.webp");
  });
});

describe("§122.B — user-uploaded portrait infographic has been removed", () => {
  it("the manus-storage infographic asset is no longer referenced", () => {
    expect(PAGE).not.toContain("integrations-infographic_ad1c2dd4.png");
  });
});

describe("§122.C — tall portrait illustration is mounted in the handshake section", () => {
  it("the handshake figure testid still anchors the section", () => {
    expect(PAGE).toContain('data-testid="integrations-handshake-figure"');
  });

  it("references the §122 portrait cloudfront webp", () => {
    expect(PAGE).toContain(
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/integrations-portrait-XH6BidmDFbRqVY2bnuYWAp.webp",
    );
  });

  it("portrait is wrapped in a hover-zoom-image white-mat figure with paper-shadow", () => {
    const figureSlice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-handshake-figure"'),
      PAGE.indexOf("{/* Integrations grid */}"),
    );
    expect(figureSlice).toMatch(/<figure[^>]*hover-zoom-image[^>]*>/);
    expect(figureSlice).toContain("bg-white");
    expect(figureSlice).toMatch(/p-3/);
    expect(figureSlice).toMatch(/shadow-\[0_1px_2px[^\]]*0_18px_44px[^\]]*\]/);
    // image fills the figure at native portrait ratio (no aspect-square clip)
    expect(figureSlice).not.toMatch(/aspect-square/);
    expect(figureSlice).toContain("h-auto w-full");
  });

  it("portrait carries explicit width + height to reserve correct layout space (3:4)", () => {
    const figureSlice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-handshake-figure"'),
      PAGE.indexOf("{/* Integrations grid */}"),
    );
    expect(figureSlice).toMatch(/width=\{1056\}/);
    expect(figureSlice).toMatch(/height=\{1408\}/);
  });

  it("portrait alt text describes the ATS → rings → report flow at length", () => {
    const altMatch = PAGE.match(
      /integrations-portrait-XH6BidmDFbRqVY2bnuYWAp\.webp"[^>]*alt="([^"]+)"/s,
    );
    expect(altMatch, "could not find alt for portrait").not.toBeNull();
    const alt = (altMatch![1] ?? "").toLowerCase();
    expect(alt.length).toBeGreaterThanOrEqual(140);
    expect(alt).not.toMatch(/^image of/);
    // mentions all three layers of the flow
    expect(alt).toMatch(/ats|hris/);
    expect(alt).toContain("link rings");
    expect(alt).toContain("background-check report");
    // mentions the central handshake/check
    expect(alt).toMatch(/check pip|sage-green check|secure handshake/);
  });

  it("ships with lazy + async loading", () => {
    const figureSlice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-handshake-figure"'),
      PAGE.indexOf("{/* Integrations grid */}"),
    );
    expect(figureSlice).toContain('loading="lazy"');
    expect(figureSlice).toContain('decoding="async"');
  });
});

describe("§122.D — page numbering is monotonic", () => {
  it("section ordering: 02 hero → 03 how it works → 04 handshake → 05 grid", () => {
    const i02 = PAGE.indexOf("02 — Integrations");
    const i03 = PAGE.indexOf("03 — How integrations work");
    const i04 = PAGE.indexOf("04 — The handshake");
    const i05 = PAGE.indexOf("05 — Available today");
    expect(i02).toBeGreaterThanOrEqual(0);
    expect(i03).toBeGreaterThan(i02);
    expect(i04).toBeGreaterThan(i03);
    expect(i05).toBeGreaterThan(i04);
  });

  it("anti-regression: the old 04 — Available today numbering is gone", () => {
    expect(PAGE).not.toContain('eyebrow">04 — Available today</p>');
  });
});
