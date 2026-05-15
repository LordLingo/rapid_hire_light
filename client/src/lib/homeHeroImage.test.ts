/*
  Spec: pin the homepage hero key visual + the resurrected sample report
  section. The right column of Hero.tsx used to render a structured "Report
  24A-08821" card in code; the brand owner supplied a marketing photograph
  (HOME_HERO_IMAGE_URL) that replaced it. As a follow-up we (a) added a
  mobile-cropped variant served via <picture>, and (b) re-introduced the
  retired structured card mid-page on the homepage as a "What a report
  looks like" proof section, lifted into its own SampleReportCard
  component.

  Assertions:
    - HOME_HERO_IMAGE_URL + HOME_HERO_IMAGE_URL_MOBILE both point at the
      webdev static host (/manus-storage/...).
    - The two URLs are not identical (we actually have two crops).
    - Hero.tsx imports both constants from @shared/brand.
    - Hero.tsx renders a <picture> element with two <source>s and a
      fallback <img> using the desktop URL.
    - The fallback <img> has a real, descriptive alt attribute.
    - The competing on-page eyebrow row remains removed.
    - The structured card is now sourced from SampleReportCard.tsx.
    - SampleReportCard.tsx still contains the canonical labels.
    - SampleReportSection.tsx is rendered inside Home.tsx between
      LogoStrip and StopGambling.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  HOME_HERO_IMAGE_URL,
  HOME_HERO_IMAGE_URL_MOBILE,
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

describe("Home hero key visual", () => {
  it("desktop + mobile URLs both live on the webdev static host", () => {
    expect(HOME_HERO_IMAGE_URL).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.png$/,
    );
    expect(HOME_HERO_IMAGE_URL_MOBILE).toMatch(
      /^\/manus-storage\/rhs-home-hero[a-z0-9-]*_[a-z0-9]+\.png$/,
    );
  });

  it("desktop and mobile URLs are distinct (two real crops)", () => {
    expect(HOME_HERO_IMAGE_URL).not.toEqual(HOME_HERO_IMAGE_URL_MOBILE);
  });

  it("Hero.tsx imports both URL constants from @shared/brand", () => {
    expect(heroSrc).toMatch(
      /import\s*\{[\s\S]*?HOME_HERO_IMAGE_URL[\s\S]*?HOME_HERO_IMAGE_URL_MOBILE[\s\S]*?\}\s*from\s*"@shared\/brand"/,
    );
  });

  it("Hero.tsx renders a <picture> with desktop + mobile <source>s and an <img> fallback", () => {
    expect(heroSrc).toMatch(/<picture>/);
    expect(heroSrc).toMatch(
      /<source[\s\S]*?media="\(min-width: 640px\)"[\s\S]*?srcSet=\{HOME_HERO_IMAGE_URL\}/,
    );
    expect(heroSrc).toMatch(
      /<source[\s\S]*?media="\(max-width: 639px\)"[\s\S]*?srcSet=\{HOME_HERO_IMAGE_URL_MOBILE\}/,
    );
    expect(heroSrc).toMatch(/<img[\s\S]*?src=\{HOME_HERO_IMAGE_URL\}/);
  });

  it("the rendered <img> has a non-trivial alt attribute", () => {
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
    // *describes* the change ("...drop the eyebrow ...") doesn't false-fail.
    const stripped = heroSrc.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(stripped.toLowerCase()).not.toContain(
      "the intelligent hiring platform",
    );
  });

  it("Hero.tsx no longer hosts an inline ReportCard component", () => {
    expect(heroSrc).not.toMatch(/function\s+ReportCard\s*\(/);
    // The card's signature label should no longer live in Hero.tsx.
    expect(heroSrc).not.toContain("Report · 24a-08821");
  });
});

describe("Sample report card (resurrected)", () => {
  it("SampleReportCard.tsx is the canonical home for the structured card", () => {
    expect(sampleCardSrc).toContain("Report · 24a-08821");
    expect(sampleCardSrc).toContain("Maya R. — Logistics Lead");
    // All five canonical row labels survive intact.
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
});
