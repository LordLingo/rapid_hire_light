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
const INDEX_CSS_PATH = resolve(__dirname, "..", "index.css");
const SRC = readFileSync(CTA_BANNER_PATH, "utf8");
const CSS = readFileSync(INDEX_CSS_PATH, "utf8");

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

describe("CtaBanner top-edge hairline glow", () => {
  it("renders a hairline glow at the top edge of the dark card", () => {
    // Pinned via the inline gradient declaration: the soft sky-halo
    // hairline that bridges the warm paper above to the deep ink
    // gradient below. The class marker `cta-banner-dark` is what
    // identifies the card; the inline style on the absolute bar
    // carries the actual gradient.
    expect(SRC).toMatch(/cta-banner-dark/);
    // The hairline uses color-mix on --color-accent-halo so the
    // boundary glow stays low-alpha; pin both halves of that mix.
    expect(SRC).toMatch(
      /color-mix\(in oklch, var\(--color-accent-halo\) 60%, transparent\)/
    );
    expect(SRC).toMatch(/absolute left-6 right-6 top-0 h-px/);
  });
});

describe("CtaBanner button hover lift + glow", () => {
  it("tags the CTA link with the .cta-banner-cta marker so the hover styles attach", () => {
    expect(SRC).toMatch(/cta-banner-cta/);
  });

  it("defines a 6px upward translate on hover, gated behind prefers-reduced-motion", () => {
    // Single deliberate motion moment: 6px lift on hover, only when
    // the user has not requested reduced motion.
    expect(CSS).toMatch(/@media \(prefers-reduced-motion: no-preference\)/);
    expect(CSS).toMatch(/\.cta-banner-cta:hover[\s\S]*?translateY\(-6px\)/);
  });

  it("adds a sky-halo glow box-shadow on hover", () => {
    // Faint sky-halo glow encoded as a box-shadow that consumes the
    // same accent-halo token the hairline uses. We pin the substring
    // rather than the exact shadow so future tweaks to the offset/
    // blur aren't blocked, but the colour intent is locked.
    expect(CSS).toMatch(
      /\.cta-banner-cta:hover[\s\S]*?box-shadow[\s\S]*?var\(--color-accent-halo\)/
    );
  });

  it("uses a snappy ease-out (~180ms) for the hover transition", () => {
    // Cubic-bezier(0.23, 1, 0.32, 1) is the project's canonical snappy
    // ease-out curve; the duration sits in the 100–200ms band so the
    // surface still feels responsive on the dark band.
    expect(CSS).toMatch(/\.cta-banner-cta\b[\s\S]*?cubic-bezier\(0\.23, 1, 0\.32, 1\)/);
    expect(CSS).toMatch(/\.cta-banner-cta\b[\s\S]*?180ms/);
  });
});
