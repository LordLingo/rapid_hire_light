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
// §55 — The synthetic SampleReportCard mockup has been replaced by
// SampleReportImage, which renders the real Rapid Hire sample report
// PNG with a click-to-enlarge lightbox. The old card file still
// exists in the repo (kept as a reference / fallback for now) but
// it's no longer mounted on any page. The pins below assert the
// new SampleReportImage component is the canonical sample-report
// surface across Home / Services / Pricing.
const sampleImageSrc = fs.readFileSync(
  path.join(ROOT, "client/src/components/site/SampleReportImage.tsx"),
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

// §142 — the homepage hero artwork was swapped from the original
// "rhs-home-hero-*" photograph to the new SPA brand artwork uploaded
// as "spa-hero-{desktop,mobile}.{png,avif,webp}". The asset prefix
// pattern below allows either historical filename so a future re-upload
// of either generation continues to satisfy the spec.
const HERO_ASSET_PREFIX = /^\/manus-storage\/(?:rhs-home-hero|spa-hero)[a-z0-9-]*_[a-z0-9]+/;

describe("Home hero key visual — URL constants", () => {
  it("desktop + mobile PNG URLs both live on the webdev static host", () => {
    expect(HOME_HERO_IMAGE_URL).toMatch(
      new RegExp(HERO_ASSET_PREFIX.source + "\\.png$"),
    );
    expect(HOME_HERO_IMAGE_URL_MOBILE).toMatch(
      new RegExp(HERO_ASSET_PREFIX.source + "\\.png$"),
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
      new RegExp(HERO_ASSET_PREFIX.source + "\\.avif$"),
    );
    expect(HOME_HERO_IMAGE_URL_WEBP).toMatch(
      new RegExp(HERO_ASSET_PREFIX.source + "\\.webp$"),
    );
    expect(HOME_HERO_IMAGE_URL_MOBILE_AVIF).toMatch(
      new RegExp(HERO_ASSET_PREFIX.source + "\\.avif$"),
    );
    expect(HOME_HERO_IMAGE_URL_MOBILE_WEBP).toMatch(
      new RegExp(HERO_ASSET_PREFIX.source + "\\.webp$"),
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

describe("Sample report image reuse across pages (§55)", () => {
  it("SampleReportImage.tsx exposes the canonical asset URL constant", () => {
    // Single source of truth for the asset URL. Pinned so a future
    // re-upload only has to change the SAMPLE_REPORT_IMAGE_URL
    // constant; every consumer reads it from there.
    expect(sampleImageSrc).toMatch(
      /export const SAMPLE_REPORT_IMAGE_URL = "\/manus-storage\/samplereport_08051bd9\.png"/,
    );
  });

  it("SampleReportImage renders the real PNG (not the old synthetic mockup)", () => {
    // The image is rendered twice: once as the resting card, once
    // inside the lightbox at full size. Both reference the same
    // SAMPLE_REPORT_IMAGE_URL constant so they cannot drift.
    const refs = sampleImageSrc.match(/src=\{SAMPLE_REPORT_IMAGE_URL\}/g) ?? [];
    expect(refs.length).toBeGreaterThanOrEqual(2);
    // Anti-regression: the file does NOT contain the old synthetic
    // labels from SampleReportCard. If a copy edit reverts to that
    // mockup, this guard fires.
    expect(sampleImageSrc).not.toContain("Report · 24a-08821");
    expect(sampleImageSrc).not.toContain("Maya R. — Logistics Lead");
  });

  it("SampleReportImage is a real <button> with a Radix Dialog lightbox", () => {
    // The trigger MUST be a native <button> (not a role-button div)
    // so it picks up native Enter/Space activation + focus ring.
    expect(sampleImageSrc).toMatch(
      /<button\s+type="button"\s+onClick=\{\(\) => setOpen\(true\)\}/,
    );
    // Dialog import + open state are the two halves of the lightbox.
    expect(sampleImageSrc).toMatch(
      /from\s+"@\/components\/ui\/dialog"/,
    );
    expect(sampleImageSrc).toMatch(/<Dialog\s+open=\{open\}\s+onOpenChange=\{setOpen\}>/);
    expect(sampleImageSrc).toMatch(/data-testid="sample-report-image-trigger"/);
    expect(sampleImageSrc).toMatch(/data-testid="sample-report-image-dialog"/);
  });

  it("SampleReportImage exposes a Download CTA inside the lightbox footer", () => {
    // The lightbox footer carries a download anchor so users can
    // keep a copy of the report. The href is the canonical asset URL.
    expect(sampleImageSrc).toMatch(
      /href=\{SAMPLE_REPORT_IMAGE_URL\}\s+download="rapid-hire-sample-report\.png"/,
    );
  });

  it("SampleReportSection.tsx renders SampleReportImage (not the old card)", () => {
    expect(sampleSectionSrc).toMatch(
      /import\s+SampleReportImage\s+from\s+"\.\/SampleReportImage"/,
    );
    expect(sampleSectionSrc).toMatch(/<SampleReportImage\s*\/>/);
    // Anti-regression: the section no longer imports the old card.
    expect(sampleSectionSrc).not.toMatch(/from\s+"\.\/SampleReportCard"/);
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

  it("Services.tsx imports + renders SampleReportImage on the #sample-report block", () => {
    expect(servicesSrc).toMatch(
      /import\s+SampleReportImage\s+from\s+"@\/components\/site\/SampleReportImage"/,
    );
    expect(servicesSrc).toMatch(/<SampleReportImage\s*\/>/);
    expect(servicesSrc).toMatch(/id="sample-report"/);
    // Anti-regression: no leftover SampleReportCard usage.
    expect(servicesSrc).not.toMatch(/<SampleReportCard\s*\/>/);
  });

  it("Pricing.tsx imports + renders SampleReportImage on the #sample-report block", () => {
    expect(pricingSrc).toMatch(
      /import\s+SampleReportImage\s+from\s+"@\/components\/site\/SampleReportImage"/,
    );
    expect(pricingSrc).toMatch(/<SampleReportImage\s*\/>/);
    expect(pricingSrc).toMatch(/id="sample-report"/);
    expect(pricingSrc).not.toMatch(/<SampleReportCard\s*\/>/);
  });
});
