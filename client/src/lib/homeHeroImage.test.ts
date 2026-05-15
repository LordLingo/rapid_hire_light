/*
  Spec: pin the homepage hero key visual + the resurrected sample report
  section across pages.

  Hero key visual:
    - HOME_HERO_IMAGE_URL + HOME_HERO_IMAGE_URL_MOBILE both point at the
      webdev static host.
    - The desktop + mobile crops also have AVIF and WebP variants
      (HOME_HERO_IMAGE_URL_AVIF / _WEBP / _MOBILE_AVIF / _MOBILE_WEBP),
      uploaded by encode_hero_modern.py and named with the right extensions.
    - Hero.tsx imports all six constants from @shared/brand.
    - Hero.tsx's <picture> declares each format in the right order
      (AVIF -> WebP -> PNG) and at the right breakpoint (>= 640 / < 640).
    - The rendered <img> fallback uses the desktop PNG, has a real alt,
      and the competing eyebrow row stays removed.
    - The "View Sample Report" CTA is now an anchor link to #sample-report
      (no toast).

  Sample report card reuse:
    - The structured card lives in SampleReportCard.tsx and carries the
      canonical labels.
    - Home.tsx, Services.tsx, and Pricing.tsx all import + render
      SampleReportCard somewhere on the page.
    - Home.tsx mounts SampleReportSection between LogoStrip and StopGambling.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  HOME_HERO_IMAGE_URL,
  HOME_HERO_IMAGE_URL_AVIF,
  HOME_HERO_IMAGE_URL_WEBP,
  HOME_HERO_IMAGE_URL_MOBILE,
  HOME_HERO_IMAGE_URL_MOBILE_AVIF,
  HOME_HERO_IMAGE_URL_MOBILE_WEBP,
} from "@shared/brand";

const ROOT = path.resolve(__dirname, "../../..");

const heroSrc = fs.readFileSync(
  path.join(ROOT, "client/src/components/site/Hero.tsx"),
  "utf8",
);
const sampleCardSrc = fs.readFileSync(
  path.join(ROOT, "client/src/components/site/SampleReportCard.tsx"),
  "utf8",
);
const sampleSectionSrc = fs.readFileSync(
  path.join(ROOT, "client/src/components/site/SampleReportSection.tsx"),
  "utf8",
);
const homeSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Home.tsx"),
  "utf8",
);
const servicesSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Services.tsx"),
  "utf8",
);
const pricingSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Pricing.tsx"),
  "utf8",
);

describe("Home hero key visual — URL constants", () => {
  it("desktop + mobile PNG URLs both live on the webdev static host", () => {
    expect(HOME_HERO_IMAGE_URL).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.png$/,
    );
    expect(HOME_HERO_IMAGE_URL_MOBILE).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.png$/,
    );
  });

  it("desktop + mobile AVIF and WebP variants are present, distinct, and end with the right extension", () => {
    const all = [
      HOME_HERO_IMAGE_URL_AVIF,
      HOME_HERO_IMAGE_URL_WEBP,
      HOME_HERO_IMAGE_URL_MOBILE_AVIF,
      HOME_HERO_IMAGE_URL_MOBILE_WEBP,
    ];
    expect(HOME_HERO_IMAGE_URL_AVIF).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.avif$/,
    );
    expect(HOME_HERO_IMAGE_URL_WEBP).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.webp$/,
    );
    expect(HOME_HERO_IMAGE_URL_MOBILE_AVIF).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.avif$/,
    );
    expect(HOME_HERO_IMAGE_URL_MOBILE_WEBP).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.webp$/,
    );
    // Six unique URLs total — none of them collide.
    const set = new Set([HOME_HERO_IMAGE_URL, HOME_HERO_IMAGE_URL_MOBILE, ...all]);
    expect(set.size).toBe(6);
  });

  it("desktop and mobile PNG URLs are distinct (two real crops)", () => {
    expect(HOME_HERO_IMAGE_URL).not.toEqual(HOME_HERO_IMAGE_URL_MOBILE);
  });
});

describe("Hero.tsx <picture> wiring", () => {
  it("imports all six hero URL constants from @shared/brand", () => {
    for (const name of [
      "HOME_HERO_IMAGE_URL",
      "HOME_HERO_IMAGE_URL_AVIF",
      "HOME_HERO_IMAGE_URL_WEBP",
      "HOME_HERO_IMAGE_URL_MOBILE",
      "HOME_HERO_IMAGE_URL_MOBILE_AVIF",
      "HOME_HERO_IMAGE_URL_MOBILE_WEBP",
    ]) {
      expect(heroSrc).toContain(name);
    }
    expect(heroSrc).toMatch(/from\s*"@shared\/brand"/);
  });

  it("declares AVIF before WebP before PNG within the desktop breakpoint", () => {
    const desktopAvif = heroSrc.indexOf(
      'srcSet={HOME_HERO_IMAGE_URL_AVIF}',
    );
    const desktopWebp = heroSrc.indexOf(
      'srcSet={HOME_HERO_IMAGE_URL_WEBP}',
    );
    // Find the *desktop* PNG <source> (srcSet={HOME_HERO_IMAGE_URL} appears
    // a second time inside the <img>; we want the first occurrence).
    const desktopPng = heroSrc.indexOf('srcSet={HOME_HERO_IMAGE_URL}');
    expect(desktopAvif).toBeGreaterThan(-1);
    expect(desktopWebp).toBeGreaterThan(-1);
    expect(desktopPng).toBeGreaterThan(-1);
    expect(desktopAvif).toBeLessThan(desktopWebp);
    expect(desktopWebp).toBeLessThan(desktopPng);
  });

  it("declares AVIF before WebP before PNG within the mobile breakpoint", () => {
    const mobileAvif = heroSrc.indexOf(
      'srcSet={HOME_HERO_IMAGE_URL_MOBILE_AVIF}',
    );
    const mobileWebp = heroSrc.indexOf(
      'srcSet={HOME_HERO_IMAGE_URL_MOBILE_WEBP}',
    );
    const mobilePng = heroSrc.indexOf('srcSet={HOME_HERO_IMAGE_URL_MOBILE}');
    expect(mobileAvif).toBeGreaterThan(-1);
    expect(mobileWebp).toBeGreaterThan(-1);
    expect(mobilePng).toBeGreaterThan(-1);
    expect(mobileAvif).toBeLessThan(mobileWebp);
    expect(mobileWebp).toBeLessThan(mobilePng);
  });

  it("each <source> declares its image type so the browser can pick correctly", () => {
    expect(heroSrc).toMatch(/type="image\/avif"/);
    expect(heroSrc).toMatch(/type="image\/webp"/);
    expect(heroSrc).toMatch(/type="image\/png"/);
  });

  it("the rendered <img> uses the desktop PNG and has a non-trivial alt", () => {
    expect(heroSrc).toMatch(/<img[\s\S]*?src=\{HOME_HERO_IMAGE_URL\}/);
    const altMatch = heroSrc.match(
      /<img[\s\S]*?src=\{HOME_HERO_IMAGE_URL\}[\s\S]*?alt="([^"]+)"/,
    );
    expect(altMatch).not.toBeNull();
    const altText = altMatch![1];
    expect(altText.length).toBeGreaterThan(40);
    expect(altText.toLowerCase()).toContain("rapid hire");
  });

  it("the competing 'intelligent hiring platform' eyebrow is removed", () => {
    // Strip the file-header doc-comment before searching so the prose that
    // *describes* the change doesn't false-fail.
    const stripped = heroSrc.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(stripped.toLowerCase()).not.toContain(
      "the intelligent hiring platform",
    );
  });

  it("the inline ReportCard is gone from Hero.tsx", () => {
    expect(heroSrc).not.toMatch(/function\s+ReportCard\s*\(/);
    expect(heroSrc).not.toContain("Report · 24a-08821");
  });
});

describe("Hero CTA: View Sample Report deep-link", () => {
  it("uses an anchor element pointing at #sample-report (not the toast)", () => {
    // Strip block doc-comments so the explanatory prose doesn't satisfy the
    // 'no toast' assertion below.
    const code = heroSrc.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(code).toMatch(/href="#sample-report"[\s\S]*?View Sample Report/);
    expect(code).not.toMatch(/Sample report — preview/);
    expect(code).not.toMatch(/from\s+"sonner"/);
  });
});

describe("Sample report card reuse across pages", () => {
  it("SampleReportCard.tsx is the canonical home for the structured card", () => {
    expect(sampleCardSrc).toContain("Report · 24a-08821");
    expect(sampleCardSrc).toContain("Maya R. — Logistics Lead");
    for (const label of [
      "Identity",
      "Criminal — Federal & County",
      "Employment History",
      "MVR — Texas",
      "Drug — 5 Panel",
    ]) {
      expect(sampleCardSrc).toContain(label);
    }
  });

  it("SampleReportSection.tsx renders the SampleReportCard", () => {
    expect(sampleSectionSrc).toMatch(
      /import\s+SampleReportCard\s+from\s+"\.\/SampleReportCard"/,
    );
    expect(sampleSectionSrc).toMatch(/<SampleReportCard\s*\/>/);
  });

  it("Home.tsx mounts SampleReportSection between LogoStrip and StopGambling", () => {
    const logoIdx = homeSrc.indexOf("<LogoStrip");
    const sampleIdx = homeSrc.indexOf("<SampleReportSection");
    const stopIdx = homeSrc.indexOf("<StopGambling");
    expect(logoIdx).toBeGreaterThan(-1);
    expect(sampleIdx).toBeGreaterThan(-1);
    expect(stopIdx).toBeGreaterThan(-1);
    expect(logoIdx).toBeLessThan(sampleIdx);
    expect(sampleIdx).toBeLessThan(stopIdx);
  });

  it("Services.tsx imports + renders SampleReportCard", () => {
    expect(servicesSrc).toMatch(
      /import\s+SampleReportCard\s+from\s+"@\/components\/site\/SampleReportCard"/,
    );
    expect(servicesSrc).toMatch(/<SampleReportCard\s*\/>/);
    expect(servicesSrc).toMatch(/id="sample-report"/);
  });

  it("Pricing.tsx imports + renders SampleReportCard", () => {
    expect(pricingSrc).toMatch(
      /import\s+SampleReportCard\s+from\s+"@\/components\/site\/SampleReportCard"/,
    );
    expect(pricingSrc).toMatch(/<SampleReportCard\s*\/>/);
    expect(pricingSrc).toMatch(/id="sample-report"/);
  });
});
