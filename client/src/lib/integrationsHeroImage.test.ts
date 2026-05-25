/**
 * §124 — /integrations: dual-illustration layout.
 *
 *   1) The §122 portrait editorial illustration is mounted vertically under
 *      the "02 — Integrations" eyebrow on the PageHero left rail (portrait
 *      aspect 3/4, white inner mat, paper-shadow, hover-zoom, max-w-[260px])
 *      so the empty space below the eyebrow carries weight without
 *      overpowering the headline column.
 *
 *   2) The user's portrait infographic stays in the "04 — The handshake"
 *      section at the §121 layout (4-col copy + 8-col figure,
 *      max-w-[560px], paper-bg figure mat). The full version with embedded
 *      type still reads at native size where it has the room.
 *
 * This invariant pins both placements + monotonic page numbering.
 */
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC = resolve(__dirname, "..");

const PAGE = readFileSync(resolve(SRC, "pages/Integrations.tsx"), "utf-8");

describe("§124.A — under-eyebrow portrait plate is mounted on the PageHero", () => {
  it("PageHero declares a belowEyebrow slot with the §124 testid", () => {
    expect(PAGE).toContain('eyebrow="02 — Integrations"');
    expect(PAGE).toContain("belowEyebrow={");
    expect(PAGE).toContain('data-testid="integrations-hero-image"');
  });

  it("plate references the §122 portrait cloudfront webp", () => {
    expect(PAGE).toContain(
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/integrations-portrait-XH6BidmDFbRqVY2bnuYWAp.webp",
    );
  });

  it("plate is portrait-shaped (aspect-[3/4]) and capped to fit the left rail", () => {
    const slice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-hero-image"'),
      PAGE.indexOf("title={"),
    );
    expect(slice).toMatch(/aspect-\[3\/4\]/);
    expect(slice).toMatch(/max-w-\[260px\]/);
    // explicitly NOT the legacy 16rem square
    expect(slice).not.toMatch(/aspect-square[^"]*max-w-\[16rem\]/);
  });

  it("plate ships with hover-zoom, white inner mat, and paper-shadow", () => {
    const slice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-hero-image"'),
      PAGE.indexOf("title={"),
    );
    expect(slice).toMatch(/hover-zoom-image/);
    expect(slice).toMatch(/bg-white/);
    expect(slice).toMatch(/p-2/);
    expect(slice).toMatch(/shadow-\[0_1px_2px[^\]]*0_8px_24px[^\]]*\]/);
    expect(slice).toMatch(/border border-border/);
  });

  it("plate alt text is descriptive, mentions the full ATS → rings → report flow", () => {
    const altMatch = PAGE.match(
      /integrations-portrait-XH6BidmDFbRqVY2bnuYWAp\.webp"[\s\S]*?alt="([^"]+)"/,
    );
    expect(altMatch, "could not find alt for portrait plate").not.toBeNull();
    const alt = (altMatch![1] ?? "").toLowerCase();
    expect(alt.length).toBeGreaterThanOrEqual(140);
    expect(alt).not.toMatch(/^image of/);
    expect(alt).toMatch(/ats|hris/);
    expect(alt).toContain("link rings");
    expect(alt).toContain("background-check report");
  });

  it("plate carries explicit width + height + lazy + async loading", () => {
    const slice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-hero-image"'),
      PAGE.indexOf("title={"),
    );
    expect(slice).toMatch(/width=\{1056\}/);
    expect(slice).toMatch(/height=\{1408\}/);
    expect(slice).toContain('loading="lazy"');
    expect(slice).toContain('decoding="async"');
  });
});

describe("§124.B — user's infographic stays in the handshake section", () => {
  it("the handshake figure testid still anchors the section", () => {
    expect(PAGE).toContain('data-testid="integrations-handshake-figure"');
  });

  it("references the user-uploaded infographic at /static/", () => {
    // §189: migrated from /manus-storage/ to /static/ so the asset ships
    // with the Vercel build instead of relying on a Manus-only host route.
    expect(PAGE).toContain('src="/static/integrations-infographic.webp"');
  });

  it("figure carries the §121 framing (paper-bg mat, p-3, max-w-[560px], paper-shadow)", () => {
    const figureSlice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-handshake-figure"'),
      PAGE.indexOf("{/* Integrations grid */}"),
    );
    expect(figureSlice).toMatch(/<figure[^>]*max-w-\[560px\][^>]*>/);
    expect(figureSlice).toMatch(/bg-\[color:var\(--color-paper\)\]/);
    expect(figureSlice).toMatch(/p-3/);
    expect(figureSlice).toMatch(/shadow-\[0_1px_2px[^\]]*0_12px_32px[^\]]*\]/);
    expect(figureSlice).not.toMatch(/aspect-square/);
    expect(figureSlice).toContain("h-auto w-full");
  });

  it("layout is 4-col copy + 8-col figure (the §121 split)", () => {
    expect(PAGE).toMatch(/lg:col-span-4 reveal-on-scroll[\s\S]*?eyebrow">04 — The handshake/);
    expect(PAGE).toMatch(/data-testid="integrations-handshake-figure"\s+className="col-span-12 lg:col-span-8/);
  });

  it("alt text is informative (mentions ATS/HRIS, the four checks, security footer)", () => {
    const altMatch = PAGE.match(
      /integrations-infographic\.webp"[\s\S]*?alt="([^"]+)"/,
    );
    expect(altMatch).not.toBeNull();
    const alt = (altMatch![1] ?? "").toLowerCase();
    expect(alt.length).toBeGreaterThanOrEqual(140);
    expect(alt).toContain("identity verification");
    expect(alt).toContain("criminal records");
    expect(alt).toContain("employment verification");
    expect(alt).toContain("education verification");
    expect(alt).toMatch(/soc 2|gdpr|encryption/);
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

describe("§124.C — page numbering is monotonic", () => {
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
