/**
 * §123 — /integrations: user's portrait infographic restored in the
 * "04 — The handshake" section at the §121 layout (4-col copy + 8-col
 * figure, max-w-[560px], paper-bg figure mat). The §122 editorial
 * portrait was rolled back per user feedback ("looked good in the center
 * of the page"). The small under-eyebrow plate from earlier rounds stays
 * dropped — the handshake section carries the visual on its own.
 *
 * This invariant pins:
 *   A)  the small under-eyebrow plate stays removed (legacy testid + URL
 *       gone, PageHero ships no belowEyebrow plate)
 *   B)  the §122 editorial portrait is gone
 *   C)  the user's portrait infographic is mounted inside the handshake
 *       section's figure with the §121 framing (paper-bg, p-3 mat,
 *       max-w-[560px] cap, descriptive alt text)
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

describe("§123.A — small under-eyebrow plate stays removed", () => {
  it("PageHero on /integrations ships no belowEyebrow plate", () => {
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

describe("§123.B — §122 editorial portrait is gone", () => {
  it("does not reference the §122 portrait webp", () => {
    expect(PAGE).not.toContain(
      "integrations-portrait-XH6BidmDFbRqVY2bnuYWAp.webp",
    );
  });
});

describe("§123.C — user's portrait infographic is mounted in the handshake section", () => {
  it("the handshake figure testid still anchors the section", () => {
    expect(PAGE).toContain('data-testid="integrations-handshake-figure"');
  });

  it("references the user-uploaded infographic at /manus-storage/", () => {
    expect(PAGE).toContain('src="/manus-storage/integrations-infographic_ad1c2dd4.png"');
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
    // honest portrait — no square clip, no hard scaling
    expect(figureSlice).not.toMatch(/aspect-square/);
    expect(figureSlice).toContain("h-auto w-full");
  });

  it("layout is 4-col copy + 8-col figure (the §121 split the user wants)", () => {
    expect(PAGE).toMatch(/lg:col-span-4 reveal-on-scroll[\s\S]*?eyebrow">04 — The handshake/);
    expect(PAGE).toMatch(/data-testid="integrations-handshake-figure"\s+className="col-span-12 lg:col-span-8/);
  });

  it("alt text is informative (mentions ATS/HRIS, the four checks, and security footer)", () => {
    const altMatch = PAGE.match(
      /integrations-infographic_ad1c2dd4\.png"[^>]*alt="([^"]+)"/s,
    );
    expect(altMatch, "could not find alt for the user infographic").not.toBeNull();
    const alt = (altMatch![1] ?? "").toLowerCase();
    expect(alt.length).toBeGreaterThanOrEqual(140);
    expect(alt).not.toMatch(/^image of/);
    expect(alt).toMatch(/ats|hris/);
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

describe("§123.D — page numbering is monotonic", () => {
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
