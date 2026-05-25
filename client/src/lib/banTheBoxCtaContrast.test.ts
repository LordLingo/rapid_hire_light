/*
  §184 — Site-wide audit: text-contrast / legibility issues.

  After the §181 / §182 / §183 fixes, this audit found two CTAs on
  /resources/ban-the-box that still relied on the broken
  `bg-[color:var(--color-accent)]` token (the same shadcn pale-tint
  hue that produced near-white-on-near-white in §181):

    - "Get a fair-chance ready quote" — top of page, hero afterLede CTA
    - "Get started"                    — bottom CTA in the practitioner
                                         workflow section

  Both have been switched to the canonical brand-blue / white treatment
  used by the homepage Start Screening + Switch CTAs:

    bg-[color:var(--color-brand-blue)]
    hover:bg-[color:var(--color-brand-blue-strong)]
    text-white
    .hero-primary-cta   (lift + sky-halo glow gated by reduced-motion)
    .btn-press          (active-state press affordance)

  This spec source-pins the swap *and* projects a site-wide
  anti-regression guarantee: no .tsx file may use
  `bg-[color:var(--color-accent)]` as a button surface again, since
  that's the token that produced the original legibility regression.
*/
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const PAGES_DIR = resolve(__dirname, "../pages");
const COMPONENTS_DIR = resolve(__dirname, "../components");

/** Recursively list every .tsx file under a directory. */
function listTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...listTsx(full));
    else if (entry.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const BTB_PATH = resolve(__dirname, "../pages/ResourcesBanTheBox.tsx");
const BTB = readFileSync(BTB_PATH, "utf8");

describe("§184 — Site-wide CTA contrast audit", () => {
  it("ban-the-box hero CTA paints brand-blue, not the broken --color-accent surface", () => {
    // Extract the slice from the hero CTA testid through the next testid
    // so the assertion is anchored to the right element.
    const idx = BTB.indexOf("ban-the-box-cta-quote");
    expect(idx, "hero CTA testid present").toBeGreaterThan(-1);
    const slice = BTB.slice(idx, idx + 600);
    expect(slice).toMatch(/bg-\[color:var\(--color-brand-blue\)\]/);
    expect(slice).toMatch(/hover:bg-\[color:var\(--color-brand-blue-strong\)\]/);
    expect(slice).toMatch(/text-white/);
    expect(slice).toMatch(/hero-primary-cta/);
    expect(slice).toMatch(/btn-press/);
    // Anti-regression: the old broken surface must not return.
    expect(slice).not.toMatch(/bg-\[color:var\(--color-accent\)\]/);
  });

  it("ban-the-box bottom 'Get started' CTA paints brand-blue, not the broken --color-accent surface", () => {
    const idx = BTB.indexOf("ban-the-box-cta-get-started");
    expect(idx, "bottom CTA testid present").toBeGreaterThan(-1);
    const slice = BTB.slice(idx, idx + 600);
    expect(slice).toMatch(/bg-\[color:var\(--color-brand-blue\)\]/);
    expect(slice).toMatch(/hover:bg-\[color:var\(--color-brand-blue-strong\)\]/);
    expect(slice).toMatch(/text-white/);
    expect(slice).toMatch(/hero-primary-cta/);
    expect(slice).toMatch(/btn-press/);
    expect(slice).not.toMatch(/bg-\[color:var\(--color-accent\)\]/);
  });

  it("anti-regression: NO .tsx file under client/src/pages or client/src/components uses bg-[color:var(--color-accent)] as a button/CTA surface", () => {
    // The shadcn `--color-accent` token resolves to a near-white pastel
    // tint. Pairing it with `text-white` produces the legibility
    // regression that §181 first surfaced and §184 swept the site for.
    // We allow `border-` and `text-` references (used elsewhere as
    // accent borders/text colors), but ban the `bg-` form site-wide.
    const offenders: string[] = [];
    for (const file of [...listTsx(PAGES_DIR), ...listTsx(COMPONENTS_DIR)]) {
      const src = readFileSync(file, "utf8");
      if (/bg-\[color:var\(--color-accent\)\]/.test(src)) {
        offenders.push(file);
      }
    }
    expect(
      offenders,
      `Files using the banned --color-accent button surface:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("anti-regression: no button surface paints `text-white` on a pale tint/paper variant (the original §181 regression mode)", () => {
    // Catch the *general* pattern where a future class sneaks in:
    // bg-(tint|paper|paper-soft|paper-strong) and text-white in the
    // same className. None should exist on the site.
    const offenders: string[] = [];
    const re =
      /class(Name)?\s*=\s*["'`][^"'`]*\bbg-\[color:var\(--color-(tint|paper|paper-soft|paper-strong)\)\][^"'`]*\btext-white\b[^"'`]*["'`]/;
    const reReverse =
      /class(Name)?\s*=\s*["'`][^"'`]*\btext-white\b[^"'`]*\bbg-\[color:var\(--color-(tint|paper|paper-soft|paper-strong)\)\][^"'`]*["'`]/;
    for (const file of [...listTsx(PAGES_DIR), ...listTsx(COMPONENTS_DIR)]) {
      const src = readFileSync(file, "utf8");
      if (re.test(src) || reReverse.test(src)) offenders.push(file);
    }
    expect(
      offenders,
      `Files pairing pastel-bg with text-white:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
