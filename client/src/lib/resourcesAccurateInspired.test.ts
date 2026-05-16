/**
 * §81 — Anti-regression pins for the Accurate-inspired Resources buildout.
 *
 * Locks: route registration, sitemap registration, dataset existence,
 * dataset shape, and structural section markers on each of the four
 * new hub/feed pages plus the dynamic state detail page.
 *
 * Source-only (file-text) checks; no DOM rendering.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..", "..", "..");

function read(rel: string) {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

const APP_SRC = read("client/src/App.tsx");
const VITE_SRC = read("vite.config.ts");

describe("§81 — App.tsx route registration", () => {
  const expectedRoutes = [
    "/resources/marijuana-laws",
    "/resources/legislative-updates",
    "/resources/white-papers",
    "/resources/background-checks-by-state",
    "/resources/background-checks-by-state/:slug",
  ];
  for (const r of expectedRoutes) {
    it(`registers ${r}`, () => {
      const escaped = r.replace(/\//g, "\\/").replace(/:/g, ":");
      const re = new RegExp(`<Route\\s+path=\\{"${escaped}"\\}`);
      expect(APP_SRC).toMatch(re);
    });
  }
});

describe("§81 — sitemap STATIC_ROUTES registration", () => {
  const expectedHubs = [
    "/resources/marijuana-laws",
    "/resources/legislative-updates",
    "/resources/white-papers",
    "/resources/background-checks-by-state",
  ];
  for (const r of expectedHubs) {
    it(`includes ${r}`, () => {
      expect(VITE_SRC).toMatch(new RegExp(`path:\\s*"${r}"`));
    });
  }

  const PILLAR_STATES = [
    "california",
    "texas",
    "new-york",
    "florida",
    "illinois",
    "pennsylvania",
    "ohio",
    "georgia",
    "north-carolina",
    "michigan",
    "new-jersey",
    "virginia",
    "washington",
  ];
  for (const slug of PILLAR_STATES) {
    it(`registers /resources/background-checks-by-state/${slug}`, () => {
      expect(VITE_SRC).toMatch(
        new RegExp(`path:\\s*"\\/resources\\/background-checks-by-state\\/${slug}"`),
      );
    });
  }
});

describe("§81 — datasets exist and export canonical names", () => {
  it("stateBackgroundCheckMatrix exports the matrix", () => {
    const src = read("client/src/lib/stateBackgroundCheckMatrix.ts");
    expect(src).toMatch(/export const STATE_MATRIX/);
  });

  it("cannabisLawsMatrix exports the matrix", () => {
    const src = read("client/src/lib/cannabisLawsMatrix.ts");
    expect(src).toMatch(/export const CANNABIS_MATRIX/);
  });

  it("legislativeUpdates exports the feed", () => {
    const src = read("client/src/lib/legislativeUpdates.ts");
    expect(src).toMatch(/export const LEGISLATIVE_UPDATES/);
    expect(src).toMatch(/export function legislativeUpdateCounts/);
  });

  it("whitePapers exports the library", () => {
    const src = read("client/src/lib/whitePapers.ts");
    expect(src).toMatch(/export const WHITE_PAPERS/);
    expect(src).toMatch(/export function whitePaperCounts/);
  });

  it("statePageContent exports per-state copy for all 13 pillar states", () => {
    const src = read("client/src/lib/statePageContent.ts");
    expect(src).toMatch(/export const STATE_PAGE_CONTENT/);
    const slugs = [...src.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(slugs).toContain("california");
    expect(slugs).toContain("texas");
    expect(slugs).toContain("new-york");
    expect(slugs.length).toBe(13);
  });
});

describe("§81 — structural section markers on each new page", () => {
  it("ResourcesBackgroundChecksByState has hero + state directory", () => {
    const src = read("client/src/pages/ResourcesBackgroundChecksByState.tsx");
    expect(src).toMatch(/Background checks by state/i);
    expect(src).toMatch(/STATE_MATRIX/);
    expect(src).toMatch(/<PageHero/);
    expect(src).toMatch(/<CtaBanner/);
  });

  it("ResourcesStatePage uses dynamic slug + reads from STATE_PAGE_CONTENT", () => {
    const src = read("client/src/pages/ResourcesStatePage.tsx");
    expect(src).toMatch(/STATE_PAGE_CONTENT/);
    expect(src).toMatch(/useRoute/);
    expect(src).toMatch(/<PageHero/);
  });

  it("ResourcesMarijuanaLaws renders the cannabis matrix", () => {
    const src = read("client/src/pages/ResourcesMarijuanaLaws.tsx");
    expect(src).toMatch(/CANNABIS_MATRIX/);
    expect(src).toMatch(/<PageHero/);
    expect(src).toMatch(/<CtaBanner/);
  });

  it("ResourcesLegislativeUpdates renders the updates feed with filters", () => {
    const src = read("client/src/pages/ResourcesLegislativeUpdates.tsx");
    expect(src).toMatch(/LEGISLATIVE_UPDATES/);
    expect(src).toMatch(/scopeFilter/);
    expect(src).toMatch(/categoryFilter/);
    expect(src).toMatch(/<PageHero/);
  });

  it("ResourcesWhitePapers renders the library with topic filter", () => {
    const src = read("client/src/pages/ResourcesWhitePapers.tsx");
    expect(src).toMatch(/WHITE_PAPERS/);
    expect(src).toMatch(/topicFilter/);
    expect(src).toMatch(/<PageHero/);
  });
});

describe("§81 — /resources hub surfaces every new pillar", () => {
  const src = read("client/src/pages/Resources.tsx");
  const expected = [
    "/resources/background-checks-by-state",
    "/resources/ban-the-box",
    "/resources/marijuana-laws",
    "/resources/legislative-updates",
    "/resources/white-papers",
  ];
  for (const href of expected) {
    it(`PILLARS array links to ${href}`, () => {
      expect(src).toContain(`href: "${href}"`);
    });
  }
});
