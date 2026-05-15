/*
  §57 — Support page "Call us right now." dark gradient pass.

  Pins the conversion of the Phone CTA band on /support from the
  warm-paper-soft + white-card treatment to the footer-family dark
  navy gradient used on StopGambling, Pricing FAQ §54, Services CTA,
  and CtaBanner. Mirrors the structure of `pricingFaqDark.test.ts`.
*/
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const ROOT = path.resolve(__dirname, "../../..");
const supportSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Support.tsx"),
  "utf8",
);

// The Phone CTA band starts after "{/* Phone CTA band — §57 dark
// gradient pass. */}" and runs through the next "</section>". Slice
// the file down to just that block so individual pins can't
// accidentally match earlier sections.
function ctaBandSlice(src: string): string {
  const start = src.indexOf("Phone CTA band — §57 dark gradient pass");
  if (start === -1) throw new Error("Phone CTA band §57 marker missing");
  // Walk forward to the next `</section>` after that marker.
  const end = src.indexOf("</section>", start);
  return src.slice(start, end);
}

describe("Support phone CTA band — dark gradient pass (§57)", () => {
  const band = ctaBandSlice(supportSrc);

  it("uses the footer-family gradient direction (light LEFT → deep RIGHT, mirrored on the other dark bands)", () => {
    expect(band).toMatch(
      /linear-gradient\(90deg,\s*var\(--color-footer-soft\)\s*0%,\s*var\(--color-footer\)\s*65%,\s*var\(--color-footer\)\s*100%\)/,
    );
  });

  it('declares colorScheme: "dark" so native form controls + scrollbars adapt', () => {
    expect(band).toMatch(/colorScheme:\s*"dark"/);
  });

  it("inverts the section base text token to footer-foreground (warm white)", () => {
    expect(band).toMatch(
      /<section[\s\S]*?text-\[color:var\(--color-footer-foreground\)\]/,
    );
  });

  it("paints the same top sky-halo hairline glow used by StopGambling", () => {
    expect(band).toMatch(
      /linear-gradient\(90deg,\s*transparent,\s*color-mix\(in oklch,\s*var\(--color-accent-halo\)\s*55%,\s*transparent\)\s*30%,\s*color-mix\(in oklch,\s*var\(--color-accent-halo\)\s*55%,\s*transparent\)\s*70%,\s*transparent\)/,
    );
  });

  it("paints a sky-halo radial halo behind the headline with marker class `support-cta-halo`", () => {
    expect(band).toMatch(/support-cta-halo/);
    // Halo geometry + radial gradient string.
    expect(band).toMatch(/h-\[420px\]\s+w-\[420px\][\s\S]*?rounded-full[\s\S]*?opacity-30[\s\S]*?blur-3xl/);
    expect(band).toMatch(
      /radial-gradient\(closest-side,\s*var\(--color-accent-halo\),\s*transparent 70%\)/,
    );
  });

  it("flips the eyebrow `Try it.` to sky-halo (was accent-ink brand-blue, which would disappear into navy)", () => {
    // The eyebrow line carrying "Try it." must use accent-halo, not accent-ink.
    expect(band).toMatch(
      /eyebrow\s+text-\[color:var\(--color-accent-halo\)\][\s\S]*?Try it\./,
    );
    // Anti-regression on the previous brand-blue eyebrow.
    expect(band).not.toMatch(
      /eyebrow\s+text-\[color:var\(--color-accent-ink\)\][\s\S]*?Try it\./,
    );
  });

  it("inverts the headline `Call us right now.` to footer-foreground (warm white)", () => {
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-foreground\)\][\s\S]*?Call us right now\./,
    );
    // Anti-regression on the old `text-[color:var(--color-ink)]` headline.
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink\)\][\s\S]*?Call us right now\./,
    );
  });

  it("inverts the body paragraph to footer-soft-text (body copy on dark)", () => {
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-soft-text\)\][\s\S]*?The fastest way to see the difference/,
    );
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink-soft\)\][\s\S]*?The fastest way to see the difference/,
    );
  });

  it("inverts the small-print `Avg. answer` line to footer-muted", () => {
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-muted\)\][\s\S]*?Avg\. answer/,
    );
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink-muted\)\][\s\S]*?Avg\. answer/,
    );
  });

  it("keeps the primary phone CTA brand-blue (works on dark, matches CtaBanner primary)", () => {
    expect(band).toMatch(
      /bg-\[color:var\(--color-accent-ink\)\][\s\S]*?text-white[\s\S]*?\{PHONE_DISPLAY\}/,
    );
  });

  it("lifts the secondary `Talk to an expert` CTA to the dark variant (warm-white text on transparent, low-alpha warm-white border)", () => {
    // Must NOT use the previous white-card secondary pattern.
    expect(band).not.toMatch(
      /bg-white[\s\S]*?text-\[color:var\(--color-ink\)\][\s\S]*?Talk to an expert/,
    );
    // Must use the dark-band secondary pattern.
    expect(band).toMatch(
      /bg-transparent[\s\S]*?text-\[color:var\(--color-footer-foreground\)\][\s\S]*?Talk to an expert/,
    );
    // Border color is the low-alpha warm-white from CtaBanner.
    expect(band).toMatch(
      /color-mix\(in oklch,\s*var\(--color-footer-foreground\)\s*30%,\s*transparent\)/,
    );
  });

  it("anti-regression: dropped the old paper-soft section wrapper + inner white card", () => {
    expect(band).not.toMatch(/bg-\[color:var\(--color-paper-soft\)\]/);
    expect(band).not.toMatch(
      /rounded-\[24px\]\s+border\s+border-border\s+bg-white\s+p-8\s+sm:p-12/,
    );
  });

  it("keeps section padding at py-20 md:py-24 (no bottom wedge — next section is a hard surface change)", () => {
    expect(band).toMatch(/container\s+py-20\s+md:py-24/);
    // No StopGambling-style bottom wedge in this band.
    expect(band).not.toMatch(/support-cta-wedge/);
    expect(band).not.toMatch(/md:pb-44/);
  });
});
