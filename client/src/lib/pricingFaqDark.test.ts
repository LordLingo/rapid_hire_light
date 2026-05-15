/*
  §54 — Pricing FAQ dark band restyle.

  The "08 — Pricing FAQ / The honest fine print." section on /pricing
  used to sit on plain white, breaking the dark-band rhythm the rest
  of the site already establishes (StopGambling on the homepage,
  CtaBanner on the homepage, services CTA band on /services). §54
  restyles it to share the StopGambling treatment exactly:

    • Mirrored 90deg gradient: footer-soft (lighter) on the left →
      footer (deep cobalt) on the right, with the deep stop running
      from 65% to 100% so the right edge stays anchored.
    • Top sky-halo hairline glow at 1px (color-mix in oklch with
      transparent so the alpha actually renders on a navy surface).
    • Sky-halo radial halo behind the headline column (520px circle,
      30% opacity, blur-3xl) — keyed by the marker class
      `pricing-faq-halo` so a future copy edit can't strip it
      silently.
    • Inverted text tokens across the whole section: eyebrow goes to
      footer-muted, the headline goes to footer-foreground (warm
      white), the italic accent on "fine print." flips from
      accent-ink (brand blue) to accent-halo (sky), each <dt>
      question goes to footer-foreground, each <dd> answer goes to
      footer-soft-text, the row dividers use a low-alpha sky-halo
      tint so they remain visible on the dark surface.

  This file mirrors the structure of stopGamblingDark.test.ts; we
  read the source string and assert against literal patterns instead
  of mounting, because the inline gradients live in `style={...}` and
  vitest's JSDOM doesn't evaluate computed style without a Tailwind
  build pipeline.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = readFileSync(
  resolve(process.cwd(), "client/src/pages/Pricing.tsx"),
  "utf8"
);

describe("§54 — Pricing FAQ dark band restyle (matches StopGambling)", () => {
  it("section uses the same mirrored 90deg gradient as StopGambling (light → deep)", () => {
    // The exact gradient string is the single source of truth that
    // makes the FAQ band feel like a continuation of StopGambling.
    expect(SRC).toMatch(
      /linear-gradient\(90deg, var\(--color-footer-soft\) 0%, var\(--color-footer\) 65%, var\(--color-footer\) 100%\)/
    );
  });

  it("section sets colorScheme: 'dark' so form controls and selection use dark UA defaults", () => {
    // Same belt-and-braces hint StopGambling carries.
    expect(SRC).toMatch(/colorScheme:\s*"dark"/);
  });

  it("section text base is the warm-white footer-foreground token", () => {
    // Match the section className that opens before the JSX eyebrow.
    // The first 'Pricing FAQ' is in the file comment header above the
    // section opening; we want to confirm the <section> wrapper after
    // it carries the inverted base color.
    expect(SRC).toMatch(
      /relative overflow-hidden text-\[color:var\(--color-footer-foreground\)\][\s\S]*?08 — Pricing FAQ/
    );
  });

  it("top sky-halo hairline glow runs across the section's top edge", () => {
    // Same gradient string as StopGambling's top hairline. Painted
    // via an absolute aria-hidden div with h-px.
    expect(SRC).toMatch(
      /absolute inset-x-0 top-0 h-px[\s\S]*?color-mix\(in oklch, var\(--color-accent-halo\) 55%, transparent\) 30%/
    );
  });

  it("renders a sky-halo radial halo behind the headline column with marker class pricing-faq-halo", () => {
    expect(SRC).toMatch(/pricing-faq-halo/);
    expect(SRC).toMatch(
      /pricing-faq-halo[^"]*pointer-events-none absolute -left-32 -top-24 h-\[520px\] w-\[520px\] rounded-full opacity-30 blur-3xl/
    );
    expect(SRC).toMatch(
      /pricing-faq-halo[\s\S]{0,400}?radial-gradient\(closest-side, var\(--color-accent-halo\), transparent 70%\)/
    );
  });

  it("eyebrow flips from default ink to footer-muted", () => {
    expect(SRC).toMatch(
      /<p className="eyebrow text-\[color:var\(--color-footer-muted\)\]">[\s\S]*?08 — Pricing FAQ/
    );
  });

  it("eyebrow's hairline divider uses the low-alpha sky-halo gradient (not the paper-surface .hairline token)", () => {
    // The default `.hairline` utility is tuned for paper surfaces and
    // would disappear into navy. Pin the inline sky-halo gradient
    // instead, and anti-regression that the old `.hairline` is gone
    // from the FAQ block.
    // "Pricing FAQ" appears twice in the file: once in the comment
    // header and once as the eyebrow text in JSX. Skip the first
    // occurrence and look at the second (the actual <p>).
    const first = SRC.indexOf("Pricing FAQ");
    const start = SRC.indexOf("Pricing FAQ", first + 1);
    expect(start).toBeGreaterThan(-1);
    // Take a window covering the eyebrow + its divider.
    const block = SRC.slice(start, start + 500);
    expect(block).toMatch(
      /linear-gradient\(90deg, color-mix\(in oklch, var\(--color-accent-halo\) 50%, transparent\), transparent\)/
    );
    expect(block).not.toMatch(/className="mt-3 hairline"/);
  });

  it('headline "The honest" + italic "fine print." uses footer-foreground + accent-halo (NOT accent-ink)', () => {
    // The italic accent in this section flips from the brand-blue
    // accent-ink (which would disappear on navy) to the sky accent-
    // halo so the emphasis reads against the dark surface.
    expect(SRC).toMatch(
      /text-\[color:var\(--color-footer-foreground\)\][^"]*"\s*>\s*The honest/
    );
    expect(SRC).toMatch(
      /italic font-light text-\[color:var\(--color-accent-halo\)\][\s\S]*?fine print\./
    );
  });

  it("anti-regression: italic accent on 'fine print.' is NOT accent-ink (brand blue) anymore", () => {
    // If a future copy edit reverts to brand blue here, this guard
    // fires — the italic would visually disappear into the navy.
    const start = SRC.indexOf("The honest");
    expect(start).toBeGreaterThan(-1);
    const block = SRC.slice(start, start + 400);
    expect(block).not.toMatch(
      /italic[^"]*text-\[color:var\(--color-accent-ink\)\][\s\S]*?fine print\./
    );
  });

  it("each FAQ <dt> question uses footer-foreground (warm white)", () => {
    expect(SRC).toMatch(
      /<dt className="font-display text-\[20px\] leading-snug text-\[color:var\(--color-footer-foreground\)\]">/
    );
  });

  it("each FAQ <dd> answer uses footer-soft-text body copy on dark", () => {
    expect(SRC).toMatch(
      /<dd className="mt-3 text-\[14\.5px\] leading-\[1\.75\] text-\[color:var\(--color-footer-soft-text\)\]">/
    );
  });

  it("FAQ row dividers use a low-alpha sky-halo border (visible on navy, unlike border-border)", () => {
    // The default `border-border` token is a paper-surface affordance
    // and is invisible on navy. Pin the inline color-mix sky-halo
    // border, and anti-regression the old border-border row class.
    expect(SRC).toMatch(
      /borderTop:\s*\n?\s*"1px solid color-mix\(in oklch, var\(--color-accent-halo\) 28%, transparent\)"/
    );
    // Confirm the FAQ row block does NOT carry the old `border-t border-border`.
    const dlStart = SRC.indexOf("PRICING_FAQ.map((row) =>");
    expect(dlStart).toBeGreaterThan(-1);
    const block = SRC.slice(dlStart, dlStart + 700);
    expect(block).not.toMatch(/border-t border-border/);
  });

  it("anti-regression: FAQ section no longer carries bg-white or border-y border-border on the wrapper", () => {
    // The old wrapper was `<section className="bg-white border-y border-border">`.
    // Pin that the section near the eyebrow's actual <p> does NOT carry
    // that class string. Skip the first occurrence (in the file comment)
    // and use the second one (the JSX eyebrow).
    const first = SRC.indexOf("Pricing FAQ");
    const idx = SRC.indexOf("Pricing FAQ", first + 1);
    expect(idx).toBeGreaterThan(-1);
    // Look back ~600 chars to capture the section opening tag.
    const sectionWindow = SRC.slice(Math.max(0, idx - 600), idx);
    expect(sectionWindow).not.toMatch(/className="bg-white border-y border-border"/);
  });
});
