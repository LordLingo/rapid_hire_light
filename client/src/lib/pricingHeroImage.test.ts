import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// §125 — /pricing carries a 3:4 portrait editorial illustration under the
// "05 — Pricing" eyebrow, matching the under-eyebrow plate pattern that was
// established on /integrations in §124. This invariant pins the asset URL,
// the framing classes, the alt-text shape, and the lazy/async semantics so
// the plate can't silently drift out of sync.

const PRICING_PATH = resolve(__dirname, "..", "pages", "Pricing.tsx");
const PRICING = readFileSync(PRICING_PATH, "utf8");

describe("§125 /pricing under-eyebrow portrait plate", () => {
  it("renders a belowEyebrow slot wired to the pricing-hero-image testid", () => {
    expect(PRICING).toMatch(/belowEyebrow=\{/);
    expect(PRICING).toMatch(/data-testid="pricing-hero-image"/);
  });

  it("uses the §125 portrait asset URL on the cloudfront CDN", () => {
    expect(PRICING).toMatch(
      /https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/[^"']+pricing-portrait-[^"']+\.webp/,
    );
  });

  it("frames the plate with white inner mat + rounded-2xl + paper-shadow", () => {
    expect(PRICING).toMatch(/hover-zoom-image[^"']*aspect-\[3\/4\]/);
    expect(PRICING).toMatch(/rounded-2xl[^"']*border[^"']*border-border/);
    expect(PRICING).toMatch(/bg-white[^"']*p-2/);
    expect(PRICING).toMatch(/shadow-\[0_1px_2px_rgba\(16,42,75,0\.08\)/);
  });

  it("sits in the hero left rail at max-w-[260px] like the integrations plate", () => {
    expect(PRICING).toMatch(/max-w-\[260px\]/);
  });

  it("declares the 1056x1408 native dimensions to prevent CLS", () => {
    expect(PRICING).toMatch(/width=\{1056\}/);
    expect(PRICING).toMatch(/height=\{1408\}/);
  });

  it("uses lazy loading + async decoding", () => {
    expect(PRICING).toMatch(/loading="lazy"/);
    expect(PRICING).toMatch(/decoding="async"/);
  });

  it("alt text describes the savings/per-check vocabulary so it's not a stock label", () => {
    const altMatch = PRICING.match(/alt="([^"]+pricing-portrait[^"]*|[^"]+per-check[^"]*|[^"]+ledger[^"]*)"/i);
    // Soft fallback — pull any alt nearby the testid block
    const block = PRICING.match(/data-testid="pricing-hero-image"[\s\S]{0,1500}/);
    expect(block).not.toBeNull();
    const blockText = block![0];
    expect(blockText).toMatch(/alt="[^"]{120,}"/);
    expect(blockText.toLowerCase()).toMatch(/coin/);
    expect(blockText.toLowerCase()).toMatch(/ledger/);
    expect(blockText.toLowerCase()).toMatch(/per-check/);
    expect(blockText.toLowerCase()).toMatch(/sage|navy|cream/);
    // Don't fail on the unused match
    void altMatch;
  });
});
