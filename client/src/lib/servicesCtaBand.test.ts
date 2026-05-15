/*
  Services bottom CTA band — invariants pin (§45).

  The Services page bottom CTA strip ("Ready when you are / Build a
  package that fits the role — in minutes.") was restyled from a thin
  white card on warm paper into a dark footer-family gradient surface,
  matching the homepage Switch CTA band (`CtaBanner`). This file pins
  the design tokens so a future refactor can't silently revert it.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SERVICES_PATH = resolve(
  __dirname,
  "..",
  "pages",
  "Services.tsx"
);
const SRC = readFileSync(SERVICES_PATH, "utf8");

// Slice out the §45 CTA band from the file so assertions only fire
// against the band's markup, not other Services-page sections.
const BAND_START = SRC.indexOf("data-testid=\"services-cta-band\"");
const BAND_END = SRC.indexOf("</section>", BAND_START);
const BAND = SRC.slice(BAND_START, BAND_END);

describe("Services bottom CTA band — §45 dark gradient restyle", () => {
  it("declares the test-id hook", () => {
    expect(BAND_START).toBeGreaterThan(-1);
    expect(BAND_END).toBeGreaterThan(BAND_START);
  });

  it("uses the cta-banner-dark marker class (shared with the homepage Switch CTA)", () => {
    // The marker class is what `index.css` keys its `.cta-banner-dark`
    // hover/halo treatments off of. Pin its presence.
    expect(BAND).toMatch(/cta-banner-dark/);
  });

  it("paints the footer-family 90deg gradient surface", () => {
    expect(BAND).toMatch(
      /linear-gradient\(90deg, var\(--color-footer\) 0%, var\(--color-footer\) 35%, var\(--color-footer-soft\) 100%\)/
    );
  });

  it("inverts the eyebrow + headline text to footer-foreground tokens", () => {
    expect(BAND).toMatch(
      /text-\[color:var\(--color-footer-muted\)\][\s\S]*?Ready when you are/
    );
    expect(BAND).toMatch(
      /text-\[color:var\(--color-footer-foreground\)\][\s\S]*?Build a package that fits the role/
    );
  });

  it("renders the italic accent in the sky-halo color, not the brand-blue accent-ink", () => {
    // The italic accent must read as the on-dark accent (sky halo),
    // because brand-blue accent-ink would disappear into the gradient.
    expect(BAND).toMatch(
      /italic[\s\S]*?text-\[color:var\(--color-accent-halo\)\][\s\S]*?in minutes\./
    );
    expect(BAND).not.toMatch(
      /italic[\s\S]*?text-\[color:var\(--color-accent-ink\)\][\s\S]*?in minutes\./
    );
  });

  it("keeps the brand-blue Get a quote pill but attaches the .cta-banner-cta hover utility", () => {
    // Per user request: keep the brand-blue CTA color (so it still
    // matches the header Get a Quote and the rest of the site), but
    // pick up the lift+glow hover gesture from .cta-banner-cta.
    expect(BAND).toMatch(/cta-banner-cta/);
    expect(BAND).toMatch(
      /bg-\[color:var\(--color-accent-ink\)\][\s\S]*?Get a quote/
    );
  });

  it("renders the top-edge sky-halo hairline glow", () => {
    // Same pattern as CtaBanner: an absolute h-px bar with a
    // sky-halo gradient at low alpha across the top edge.
    expect(BAND).toMatch(/top-0 h-px/);
    expect(BAND).toMatch(
      /color-mix\(in oklch, var\(--color-accent-halo\) 60%, transparent\)/
    );
  });

  it("renders the soft halo behind the headline column", () => {
    // Anti-cold treatment: a blurred radial halo in the same accent
    // halo color so the dark surface doesn't sit cold against the
    // warm paper above. Soft alpha so it doesn't compete with the CTA.
    expect(BAND).toMatch(/blur-3xl/);
    expect(BAND).toMatch(
      /radial-gradient\(closest-side, var\(--color-accent-halo\), transparent 70%\)/
    );
  });

  it("does not regress to the old white-card surface", () => {
    // Anti-regression. The previous version was `bg-white` with
    // `border-border` and an ink-colored headline — none of those
    // tokens should survive on the band.
    expect(BAND).not.toMatch(/\bbg-white\b/);
    expect(BAND).not.toMatch(/text-\[color:var\(--color-ink\)\]/);
  });
});
