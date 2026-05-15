/*
  Hero "Start Screening" hover lift — invariants pin (§43).

  The homepage's primary CTA on the hero (Start Screening, brand-blue
  pill on warm paper) gets the same hover choreography as the Switch
  CTA's "See how it works" pill on the dark band: a single deliberate
  motion moment of 6px upward translate + a faint sky-halo box-shadow
  glow. This file pins both halves of the pattern:

    1. The Hero.tsx markup must attach the .hero-primary-cta utility
       to the Start Screening Link.
    2. client/src/index.css must declare the .hero-primary-cta utility
       with the same translate/glow values as .cta-banner-cta and gate
       the motion behind prefers-reduced-motion: no-preference.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HERO_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "Hero.tsx"
);
const HERO_SRC = readFileSync(HERO_PATH, "utf8");

const INDEX_CSS_PATH = resolve(__dirname, "..", "index.css");
const INDEX_CSS_SRC = readFileSync(INDEX_CSS_PATH, "utf8");

describe("Hero primary CTA — hover lift (§43)", () => {
  it("attaches .hero-primary-cta to the Start Screening Link", () => {
    // The class must appear on the same JSX element as Start Screening.
    expect(HERO_SRC).toMatch(/hero-primary-cta[^"]*"[\s\S]*?Start Screening/);
  });

  it("declares the .hero-primary-cta utility in index.css", () => {
    expect(INDEX_CSS_SRC).toMatch(/\.hero-primary-cta\s*\{/);
  });

  it("uses a 6px upward translate on hover, matching .cta-banner-cta", () => {
    // Pull the hover block specifically — anchor on .hero-primary-cta:hover
    // so a refactor that splits the rule into a different selector won't
    // pass the test by accident.
    expect(INDEX_CSS_SRC).toMatch(
      /\.hero-primary-cta:hover\s*\{[^}]*transform:\s*translateY\(-6px\)/
    );
  });

  it("uses the sky-halo accent for the glow, matching .cta-banner-cta", () => {
    expect(INDEX_CSS_SRC).toMatch(
      /\.hero-primary-cta:hover\s*\{[^}]*box-shadow:[^}]*var\(--color-accent-halo\)/
    );
  });

  it("gates the lift/glow behind prefers-reduced-motion: no-preference", () => {
    // The .hero-primary-cta:hover block must live inside a
    // @media (prefers-reduced-motion: no-preference) wrapper. Test by
    // asserting that an opening @media block with that query appears
    // before the hover declaration in the file.
    const mediaIdx = INDEX_CSS_SRC.indexOf(
      "@media (prefers-reduced-motion: no-preference)"
    );
    const hoverIdx = INDEX_CSS_SRC.indexOf(".hero-primary-cta:hover");
    expect(mediaIdx).toBeGreaterThan(-1);
    expect(hoverIdx).toBeGreaterThan(-1);
    expect(mediaIdx).toBeLessThan(hoverIdx);
  });

  it("uses the snappy ease-out cubic-bezier for the transform transition", () => {
    // Pin the easing token so a future tweak to the timing function on
    // .hero-primary-cta will fail loudly. cubic-bezier(0.23, 1, 0.32, 1)
    // is the project-wide --ease-out used by the dark-band CTA.
    expect(INDEX_CSS_SRC).toMatch(
      /\.hero-primary-cta\s*\{[\s\S]*?transform\s+180ms\s+cubic-bezier\(0\.23,\s*1,\s*0\.32,\s*1\)/
    );
  });
});
