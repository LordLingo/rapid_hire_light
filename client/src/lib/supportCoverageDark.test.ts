/*
  §58 — Support page "03 — Coverage" section dark gradient pass.

  Pins the conversion of the Coverage section on /support from the
  warm-paper-soft + bg-white card treatment to the footer-family dark
  navy gradient used on StopGambling, Pricing FAQ §54, and Support
  phone CTA §57. Mirrors the structure of `supportCtaDark.test.ts`.
*/
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const ROOT = path.resolve(__dirname, "../../..");
const supportSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Support.tsx"),
  "utf8",
);

// Slice the Coverage section (between the §58 marker and the next
// `</section>`) so individual pins can't accidentally match earlier
// or later sections that may also use the dark gradient.
function coverageSlice(src: string): string {
  const start = src.indexOf("Coverage — §58 dark gradient pass");
  if (start === -1) throw new Error("Coverage §58 marker missing");
  const end = src.indexOf("</section>", start);
  return src.slice(start, end);
}

describe("Support coverage section — dark gradient pass (§58)", () => {
  const band = coverageSlice(supportSrc);

  it("uses the footer-family gradient direction (light LEFT → deep RIGHT, mirrored on the other dark bands)", () => {
    expect(band).toMatch(
      /linear-gradient\(90deg,\s*var\(--color-footer-soft\)\s*0%,\s*var\(--color-footer\)\s*65%,\s*var\(--color-footer\)\s*100%\)/,
    );
  });

  it('declares colorScheme: "dark"', () => {
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

  it("paints a sky-halo radial halo behind the headline with marker class `support-coverage-halo`", () => {
    expect(band).toMatch(/support-coverage-halo/);
    expect(band).toMatch(
      /h-\[480px\]\s+w-\[480px\][\s\S]*?rounded-full[\s\S]*?opacity-30[\s\S]*?blur-3xl/,
    );
    expect(band).toMatch(
      /radial-gradient\(closest-side,\s*var\(--color-accent-halo\),\s*transparent 70%\)/,
    );
  });

  it("inverts the eyebrow `03 — Coverage` to footer-muted", () => {
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-muted\)\][\s\S]*?03 — Coverage/,
    );
  });

  it("replaces the default `.hairline` eyebrow rule with a sky-halo gradient (paper-surface utility would disappear into navy)", () => {
    // Anti-regression on the default hairline class right under the eyebrow.
    expect(band).not.toMatch(/03 — Coverage[\s\S]{0,300}className="mt-3 hairline"/);
    // The replacement is an inline-styled 1px sky-halo fade.
    expect(band).toMatch(
      /linear-gradient\(90deg,\s*color-mix\(in oklch,\s*var\(--color-accent-halo\)\s*50%,\s*transparent\),\s*transparent\)/,
    );
  });

  it("inverts the headline `When the team is on the desk.` to footer-foreground (warm white)", () => {
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-foreground\)\][\s\S]*?When the team is on the desk\./,
    );
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink\)\][\s\S]*?When the team is on the desk\./,
    );
  });

  it("inverts the body paragraph to footer-soft-text", () => {
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-soft-text\)\][\s\S]*?One Central-time desk/,
    );
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink-soft\)\][\s\S]*?One Central-time desk/,
    );
  });

  it("inverts each of the three coverage cards: low-alpha warm-white border + 4% surface tint, no `bg-white`", () => {
    // Cards must NOT carry `bg-white` anymore.
    expect(band).not.toMatch(/rounded-\[18px\]\s+border\s+border-border\s+bg-white\s+p-6/);
    // Cards must use the dark-band tint.
    expect(band).toMatch(
      /bg-\[color:color-mix\(in_oklch,var\(--color-footer-foreground\)_4%,transparent\)\]/,
    );
    // Border color is the low-alpha warm-white token.
    expect(band).toMatch(
      /color-mix\(in oklch,\s*var\(--color-footer-foreground\)\s*15%,\s*transparent\)/,
    );
  });

  it("inverts each card's interior text tokens: eyebrow + value + detail to footer family (no ink tokens)", () => {
    // Eyebrow inside each card uses footer-muted.
    expect(band).toMatch(
      /eyebrow\s+text-\[10\.5px\]\s+text-\[color:var\(--color-footer-muted\)\]/,
    );
    // The big value (e.g. "7:00 AM – 7:00 PM Central") uses footer-foreground.
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-foreground\)\][\s\S]*?\{row\.value\}/,
    );
    // The detail line uses footer-soft-text.
    expect(band).toMatch(
      /text-\[color:var\(--color-footer-soft-text\)\][\s\S]*?\{row\.detail\}/,
    );
    // Anti-regression on the previous ink tokens inside the card.
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink\)\][\s\S]*?\{row\.value\}/,
    );
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink-soft\)\][\s\S]*?\{row\.detail\}/,
    );
    expect(band).not.toMatch(
      /text-\[color:var\(--color-ink-muted\)\][\s\S]*?\{row\.label\}/,
    );
  });

  it("anti-regression: dropped the old paper-soft section wrapper", () => {
    expect(band).not.toMatch(/bg-\[color:var\(--color-paper-soft\)\]/);
  });

  it("keeps section padding at py-20 md:py-24 (no bottom wedge — next section pivots to warm paper)", () => {
    expect(band).toMatch(/container\s+py-20\s+md:py-24/);
    expect(band).not.toMatch(/support-coverage-wedge/);
    expect(band).not.toMatch(/md:pb-44/);
  });
});
