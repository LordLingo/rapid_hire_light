/*
  CtaBanner dark-gradient redesign — invariants pin.

  This test does NOT mount the component. Mounting would require a
  browser/jsdom env + a Wouter route context for the inner <Link>,
  which is heavier than this surface needs. Instead we read the
  source file as a string and assert the design tokens we care
  about are still present, in the right shape. This mirrors the
  pattern used by `homeHeroImage.test.ts` and friends.

  Why the file-string approach is safe here
    - The CTA's design intent (dark on the left, lighter on the
      right; warm-white type; sky-blue accent on the headline; pill
      button that reads on dark) is encoded entirely in CSS class
      names + a small `style.backgroundImage` declaration. There is
      no runtime branching to test.
    - Pinning specific tokens stops "pretty fix-it" refactors from
      silently flattening the gradient back to the old white card.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CTA_BANNER_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "CtaBanner.tsx"
);
const SRC = readFileSync(CTA_BANNER_PATH, "utf8");

describe("CtaBanner dark gradient redesign", () => {
  it("uses a left-to-right gradient that starts at --color-footer", () => {
    // The starting stop must be the footer ink; that is what
    // anchors the visual rhyme with the actual <Footer/> below.
    expect(SRC).toMatch(
      /linear-gradient\(\s*90deg\s*,\s*var\(--color-footer\)\s+0%/
    );
  });

  it("ends the gradient at --color-footer-soft on the right", () => {
    // The "lightens to the right" intent is encoded by ending at
    // --color-footer-soft (one step lighter, same hue family).
    expect(SRC).toMatch(/var\(--color-footer-soft\)\s+100%/);
  });

  it("declares colorScheme: dark so form controls/icons render correctly on the dark surface", () => {
    expect(SRC).toMatch(/colorScheme:\s*"dark"/);
  });

  it("inverts the body text to use --color-footer-foreground", () => {
    // The container sets the inverted foreground color so children
    // inherit it; we pin the literal class so a copy-edit can't
    // forget the inversion.
    expect(SRC).toMatch(/text-\[color:var\(--color-footer-foreground\)\]/);
  });

  it("paints the italic accent in the sky halo, not the deep accent ink", () => {
    // On the dark surface --color-accent-ink (deep blue) reads
    // muddy. The halo (lighter sky blue) is the correct pair.
    expect(SRC).toMatch(/text-\[color:var\(--color-accent-halo\)\]/);
  });

  it("renders the button as a white pill with the deep ink as text color", () => {
    // White-on-dark pill, matches the high-contrast button pattern
    // we use elsewhere on dark surfaces.
    expect(SRC).toMatch(/bg-\[color:var\(--color-footer-foreground\)\]/);
    expect(SRC).toMatch(/text-\[color:var\(--color-footer\)\]/);
  });

  it("does NOT use the old white-card background or the deep accent ink for body type", () => {
    // Belt-and-braces: explicitly assert the previous design tokens
    // are gone, so a global find/replace can't silently roll us back.
    expect(SRC).not.toMatch(/\bbg-white\b/);
    // The previous version used --color-ink for the headline.
    // The new dark surface uses --color-footer-foreground instead.
    expect(SRC).not.toMatch(/text-\[color:var\(--color-ink\)\]/);
    expect(SRC).not.toMatch(/text-\[color:var\(--color-ink-soft\)\]/);
  });

  it("keeps the editorial structure intact (eyebrow + headline + sub + CTA link)", () => {
    expect(SRC).toMatch(/05\s*—\s*Switch/);
    expect(SRC).toMatch(/Ready to switch to/);
    expect(SRC).toMatch(/Rapid Hire Solutions\?/);
    expect(SRC).toMatch(/See how it works/);
    // CTA still routes to /integrations.
    expect(SRC).toMatch(/href="\/integrations"/);
  });
});
