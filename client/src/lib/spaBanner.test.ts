/*
  §140.4 — Pricing SPA banner contract.

  Locks the §138.4.2 banner inserted into Pricing.tsx between the
  PageHero and the tier cards. The auditor reads raw source, so the
  spec is intentionally a static analysis of Pricing.tsx — fast,
  deterministic, and immune to how vitest renders Tailwind classes.

  What this spec pins:
    - Pricing.tsx imports the canonical SPA tokens from @/lib/spa
      (so a future copy edit happens in exactly one place).
    - The banner section exists with the agreed testids and
      structural anchors (eyebrow, headline, tagline, link).
    - The banner sits *above* the tiers section in source order,
      not after it (controls reading order on the page).
    - The banner uses the paper-soft alternating-rhythm tint to
      keep the page's visual cadence intact.
    - The "Why we call it SPA" tertiary link routes to SPA_ROUTE
      (= /spa) — locked against a future rename.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SPA_COMPACT, SPA_ROUTE, SPA_TAGLINE } from "./spa";

const PRICING_SRC = readFileSync(
  resolve(__dirname, "..", "pages", "Pricing.tsx"),
  "utf8",
);

describe("§140.1 — Pricing.tsx imports the canonical SPA tokens", () => {
  it("imports SPA_COMPACT, SPA_ROUTE, and SPA_TAGLINE from @/lib/spa", () => {
    // Multi-line import is fine — we just need each token referenced
    // and the module path to be the canonical one.
    expect(PRICING_SRC).toContain('from "@/lib/spa"');
    expect(PRICING_SRC).toContain("SPA_COMPACT");
    expect(PRICING_SRC).toContain("SPA_ROUTE");
    expect(PRICING_SRC).toContain("SPA_TAGLINE");
  });

  it("does not hard-code SPA copy strings (avoid drift from lib/spa)", () => {
    // The literal SPA_TAGLINE string ("Relax — we've got it
    // handled.") must not appear as a string literal in Pricing.tsx;
    // it should be referenced via the imported constant only.
    expect(PRICING_SRC).not.toContain(`"${SPA_TAGLINE}"`);
    expect(PRICING_SRC).not.toContain(`'${SPA_TAGLINE}'`);
    // SPA_COMPACT likewise — Pricing.tsx must reference the constant
    // rather than typing out "Speed · Price · Accuracy."
    expect(PRICING_SRC).not.toContain(`"${SPA_COMPACT}"`);
    expect(PRICING_SRC).not.toContain(`'${SPA_COMPACT}'`);
  });
});

describe("§140.1 — Pricing SPA banner section", () => {
  it("renders a <section> with id and testid 'pricing-spa-banner'", () => {
    expect(PRICING_SRC).toMatch(/id="pricing-spa-banner"/);
    expect(PRICING_SRC).toMatch(/data-testid="pricing-spa-banner"/);
  });

  it("uses the paper-soft alternating-rhythm tint", () => {
    // Anchor on the section, then look forward a short way for the
    // expected utility — this proves the styling lives on the banner
    // section itself rather than on some unrelated paper-soft element.
    const idx = PRICING_SRC.indexOf('data-testid="pricing-spa-banner"');
    expect(idx).toBeGreaterThan(-1);
    const window = PRICING_SRC.slice(idx, idx + 400);
    expect(window).toContain("bg-[color:var(--color-paper-soft)]");
  });

  it("has a hairline top rule (border-t color-rule) to anchor the band", () => {
    const idx = PRICING_SRC.indexOf('data-testid="pricing-spa-banner"');
    expect(idx).toBeGreaterThan(-1);
    const window = PRICING_SRC.slice(idx, idx + 400);
    expect(window).toContain("border-t border-[color:var(--color-rule)]");
  });

  it("renders an eyebrow row that references SPA_COMPACT", () => {
    expect(PRICING_SRC).toMatch(
      /data-testid="pricing-spa-banner-eyebrow"/,
    );
    // The eyebrow must render the imported constant (not a string
    // literal) — we look for the JSX expression `{SPA_COMPACT}`.
    expect(PRICING_SRC).toMatch(/\{\s*SPA_COMPACT\s*\}/);
  });

  it("renders a headline row that includes the SPA framing", () => {
    expect(PRICING_SRC).toMatch(
      /data-testid="pricing-spa-banner-headline"/,
    );
    expect(PRICING_SRC).toMatch(/Pricing built around the SPA Standard/);
    expect(PRICING_SRC).toMatch(/Speed, Price, Accuracy/);
  });

  it("renders the SPA tagline through the imported constant", () => {
    expect(PRICING_SRC).toMatch(
      /data-testid="pricing-spa-banner-tagline"/,
    );
    expect(PRICING_SRC).toMatch(/\{\s*SPA_TAGLINE\s*\}/);
  });

  it("offers a tertiary 'Why we call it SPA' link to SPA_ROUTE", () => {
    expect(PRICING_SRC).toMatch(
      /data-testid="pricing-spa-banner-link"/,
    );
    // The href must reference the imported SPA_ROUTE constant, not a
    // hard-coded "/spa" path — this is what protects the route from
    // a future rename.
    expect(PRICING_SRC).toMatch(/href=\{SPA_ROUTE\}/);
    // Sanity: SPA_ROUTE itself is /spa today.
    expect(SPA_ROUTE).toBe("/spa");
  });

  it("includes the literal CTA copy 'Why we call it SPA'", () => {
    expect(PRICING_SRC).toMatch(/Why we call it SPA/);
  });
});

describe("§140.1 — Pricing SPA banner ordering", () => {
  it("sits below PageHero and above the Tiers section in source order", () => {
    const heroIdx = PRICING_SRC.indexOf("<PageHero");
    const bannerIdx = PRICING_SRC.indexOf(
      'data-testid="pricing-spa-banner"',
    );
    const tiersComment = PRICING_SRC.indexOf("{/* Tiers");
    expect(heroIdx).toBeGreaterThan(-1);
    expect(bannerIdx).toBeGreaterThan(-1);
    expect(tiersComment).toBeGreaterThan(-1);
    expect(bannerIdx).toBeGreaterThan(heroIdx);
    expect(bannerIdx).toBeLessThan(tiersComment);
  });

  it("renders exactly one SPA banner section (no duplicates)", () => {
    const matches = PRICING_SRC.match(
      /data-testid="pricing-spa-banner"/g,
    );
    expect(matches).not.toBeNull();
    expect((matches ?? []).length).toBe(1);
  });
});
