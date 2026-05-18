/**
 * §120 — Editorial illustration plates on /industries and /industries/:slug.
 *
 * The visual treatment mirrors the §117 service plates:
 *   - square 1:1 webp on a navy + cream + sage editorial palette,
 *   - rendered under the eyebrow + hairline + icon-circle in the left rail,
 *   - framed inside a white inner mat with paper-shadow,
 *   - wrapped in `.hover-zoom-image` so it gets the §118 hover gesture
 *     (1.04 scale, 350ms cubic-bezier, gated by prefers-reduced-motion).
 *
 * This invariant exists to prevent silent regressions: if a future edit
 * removes the framing classes, drops the hover-zoom wrapper, swaps a CDN
 * URL, or omits a per-industry `heroImage` for any of the six VerticalSection
 * entries on /industries, this spec will fail.
 *
 * Six "full" verticals on /industries get the inline-rendered plate
 * under the icon-circle: healthcare, transportation, staffing, finance,
 * retail, nonprofit.
 *
 * The three "newer specialty" verticals (gig-1099, manufacturing,
 * education) render as compact link-cards on /industries with no eyebrow,
 * so their plate only renders on the /industries/:slug detail page via
 * IndustryDetail.tsx.
 */
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

import { INDUSTRIES } from "./industryCatalog";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC = resolve(__dirname, "..");

const INDUSTRIES_PAGE = readFileSync(
  resolve(SRC, "pages/Industries.tsx"),
  "utf-8",
);
const INDUSTRY_DETAIL_PAGE = readFileSync(
  resolve(SRC, "pages/IndustryDetail.tsx"),
  "utf-8",
);

const ALL_NINE_SLUGS = [
  "healthcare",
  "transportation",
  "staffing",
  "finance",
  "retail",
  "nonprofit",
  "gig-1099",
  "manufacturing",
  "education",
] as const;

const SIX_FULL_SECTION_SLUGS = [
  "healthcare",
  "transportation",
  "staffing",
  "finance",
  "retail",
  "nonprofit",
] as const;

// Subject keywords that the alt text must mention for each industry, so
// alt-text drift doesn't silently make the illustration generic.
const ALT_KEYWORDS: Record<(typeof ALL_NINE_SLUGS)[number], readonly string[]> = {
  healthcare: ["clipboard", "stethoscope"],
  transportation: ["truck", "MVR"],
  staffing: ["résumé", "paperclip"],
  finance: ["bank", "columns"],
  retail: ["shopping bag", "receipt"],
  nonprofit: ["heart", "hands"],
  "gig-1099": ["smartphone", "contractor"],
  manufacturing: ["hard hat", "safety"],
  education: ["schoolhouse", "fingerprint"],
};

describe("§120 — every industry has a heroImage in the catalog", () => {
  for (const slug of ALL_NINE_SLUGS) {
    it(`industry "${slug}" exposes heroImage in INDUSTRIES catalog`, () => {
      const ind = INDUSTRIES.find((i) => i.slug === slug);
      expect(ind, `missing industry "${slug}"`).toBeDefined();
      expect(ind!.heroImage, `industry "${slug}" must define heroImage`).toBeDefined();
      expect(ind!.heroImage!.url).toMatch(
        /^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/.+\.webp$/,
        `industry "${slug}" heroImage.url must be a webdev CDN .webp asset`,
      );
      expect(ind!.heroImage!.alt.length).toBeGreaterThanOrEqual(40);
      // Alt text must not start with "image of" (anti-pattern filler).
      expect(ind!.heroImage!.alt.toLowerCase()).not.toMatch(/^image of/);
    });
  }
});

describe("§120 — alt text mentions the industry's distinguishing subject", () => {
  for (const slug of ALL_NINE_SLUGS) {
    const keywords = ALT_KEYWORDS[slug];
    it(`industry "${slug}" alt mentions one of: ${keywords.join(", ")}`, () => {
      const ind = INDUSTRIES.find((i) => i.slug === slug);
      const alt = ind!.heroImage!.alt.toLowerCase();
      const matched = keywords.some((kw) => alt.includes(kw.toLowerCase()));
      expect(matched, `alt text for "${slug}" should include one of ${keywords.join(", ")} but was: ${ind!.heroImage!.alt}`).toBe(true);
    });
  }
});

describe("§120 — every catalog illustration URL is unique", () => {
  it("no two industries share a heroImage.url", () => {
    const urls = INDUSTRIES.map((i) => i.heroImage?.url).filter(
      (u): u is string => Boolean(u),
    );
    const unique = new Set(urls);
    expect(unique.size).toBe(urls.length);
  });
});

describe("§120 — Industries.tsx VERTICALS expose heroImage for the six full sections", () => {
  for (const slug of SIX_FULL_SECTION_SLUGS) {
    it(`Industries.tsx VERTICALS entry for "${slug}" defines heroImage with the same CDN URL as the catalog`, () => {
      // The inline VERTICALS block in Industries.tsx (six full sections)
      // must carry the same heroImage URL as the catalog entry, so the
      // /industries hub and the /industries/:slug detail share one asset
      // and one alt text per industry.
      const ind = INDUSTRIES.find((i) => i.slug === slug);
      const url = ind!.heroImage!.url;
      expect(INDUSTRIES_PAGE).toContain(url);
    });
  }
});

describe("§120 — Industries.tsx renders the framed hover-zoom plate under the icon", () => {
  it("VerticalSection renders a heroImage block with the framing classes", () => {
    // White inner mat (bg-white + p-2), rounded-2xl, paper-shadow,
    // wrapped in .hover-zoom-image, with object-cover on the inner img.
    expect(INDUSTRIES_PAGE).toContain("industries-section-image-");
    expect(INDUSTRIES_PAGE).toMatch(/hover-zoom-image[^"]*aspect-square/);
    expect(INDUSTRIES_PAGE).toContain("bg-white p-2");
    expect(INDUSTRIES_PAGE).toContain("rounded-2xl");
    expect(INDUSTRIES_PAGE).toMatch(/shadow-\[0_1px_2px/);
    expect(INDUSTRIES_PAGE).toContain('object-cover');
    expect(INDUSTRIES_PAGE).toContain('loading="lazy"');
    expect(INDUSTRIES_PAGE).toContain('decoding="async"');
  });

  it("the framed plate is rendered after the icon-circle (left rail), not in the right column", () => {
    // The icon `<v.Icon` should appear before the heroImage wrapper.
    const iconIdx = INDUSTRIES_PAGE.indexOf("<v.Icon");
    const plateIdx = INDUSTRIES_PAGE.indexOf("industries-section-image-");
    expect(iconIdx).toBeGreaterThan(0);
    expect(plateIdx).toBeGreaterThan(iconIdx);
  });
});

describe("§120 — IndustryDetail.tsx renders the framed hover-zoom plate via PageHero belowEyebrow", () => {
  it("IndustryDetail wires industry.heroImage into PageHero's belowEyebrow slot", () => {
    expect(INDUSTRY_DETAIL_PAGE).toContain("belowEyebrow=");
    expect(INDUSTRY_DETAIL_PAGE).toContain("industry.heroImage");
    expect(INDUSTRY_DETAIL_PAGE).toContain("industry-detail-image-");
    expect(INDUSTRY_DETAIL_PAGE).toMatch(/hover-zoom-image[^"]*aspect-square/);
    expect(INDUSTRY_DETAIL_PAGE).toContain("bg-white p-2");
    expect(INDUSTRY_DETAIL_PAGE).toContain("rounded-2xl");
    expect(INDUSTRY_DETAIL_PAGE).toMatch(/shadow-\[0_1px_2px/);
    expect(INDUSTRY_DETAIL_PAGE).toContain("object-cover");
  });
});
