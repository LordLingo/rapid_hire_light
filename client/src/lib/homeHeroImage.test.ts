/*
  Spec: pin the homepage hero key visual. The right column of Hero.tsx used
  to render a structured "Report 24A-08821" card in code; the brand owner
  supplied a marketing photograph (HOME_HERO_IMAGE_URL) that replaces it.

  Assertions:
    - HOME_HERO_IMAGE_URL points at the webdev static host (/manus-storage/...).
    - Hero.tsx imports the constant from @shared/brand.
    - Hero.tsx renders an <img> sourced from the constant with a real,
      descriptive alt attribute (not just the brand name).
    - The old structured ReportCard is gone (no "Report · 24a-08821",
      no "Maya R. — Logistics Lead").
    - The "THE INTELLIGENT HIRING PLATFORM" eyebrow row that would compete
      with the photograph's baked-in headline has been removed.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { HOME_HERO_IMAGE_URL } from "@shared/brand";

const ROOT = path.resolve(__dirname, "../../..");
const src = fs.readFileSync(
  path.join(ROOT, "client/src/components/site/Hero.tsx"),
  "utf8",
);

describe("Home hero key visual", () => {
  it("HOME_HERO_IMAGE_URL points at the webdev static host", () => {
    expect(HOME_HERO_IMAGE_URL).toMatch(
      /^\/manus-storage\/rhs-home-hero_[a-z0-9]+\.png$/,
    );
  });

  it("Hero.tsx imports HOME_HERO_IMAGE_URL from @shared/brand", () => {
    expect(src).toMatch(
      /import\s*\{[^}]*HOME_HERO_IMAGE_URL[^}]*\}\s*from\s*"@shared\/brand"/,
    );
  });

  it("Hero.tsx renders an <img> sourced from HOME_HERO_IMAGE_URL", () => {
    expect(src).toMatch(/src=\{HOME_HERO_IMAGE_URL\}/);
  });

  it("the rendered <img> has a non-trivial alt attribute", () => {
    // Match the alt prop on the hero image and assert it's reasonably long
    // (> 40 chars) so a future copy-edit doesn't reduce it to "image".
    const altMatch = src.match(/src=\{HOME_HERO_IMAGE_URL\}[\s\S]*?alt="([^"]+)"/);
    expect(altMatch).not.toBeNull();
    const altText = altMatch![1];
    expect(altText.length).toBeGreaterThan(40);
    expect(altText.toLowerCase()).toContain("rapid hire");
  });

  it("the old structured ReportCard component is gone", () => {
    expect(src).not.toContain("Report · 24a-08821");
    expect(src).not.toContain("Maya R. — Logistics Lead");
    expect(src).not.toMatch(/function\s+ReportCard\s*\(/);
  });

  it("the competing 'intelligent hiring platform' eyebrow is removed", () => {
    // Strip the file-header doc-comment before searching so the prose that
    // *describes* the change ("...drop the eyebrow ...") doesn't false-fail.
    const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(stripped.toLowerCase()).not.toContain(
      "the intelligent hiring platform",
    );
  });
});
