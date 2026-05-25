/*
  §182 — Brand-blue token darkened site-wide.

  The Light Redesign theme block in client/src/index.css originally
  defined the brand-blue color tokens at:

    --color-accent-ink:        oklch(0.62 0.205 256)
    --color-accent-ink-strong: oklch(0.55 0.225 258)

  Visually, lightness 0.62 lands close to a sky-pastel rather than a
  confident cobalt. Combined with white text (the canonical brand-blue
  treatment for CTAs and selected filter chips), this produced
  near-pastel buttons across the site — the "Get a fair-chance ready
  quote" CTA, the marijuana-laws / ban-the-box filter chips' selected
  state, the homepage Switch CTA, etc.

  §182 darkens the resting state to oklch(0.50) and the strong/hover
  state to oklch(0.42), keeping chroma high so the hue stays in the
  cobalt family (blueprint-ink, not navy). White text on the resulting
  surface comfortably exceeds 4.5:1 contrast.

  This source-pin spec locks the new lightness so a future creative
  edit doesn't quietly slide back into pastel territory and reintroduce
  the legibility regression the user explicitly flagged.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PATH = resolve(__dirname, "../index.css");
const css = readFileSync(PATH, "utf8");

/** Slice the @theme inline { ... } block so the assertions can't be
 * fooled by a definition that lives outside Tailwind's token registry. */
function themeBlock(): string {
  const open = css.indexOf("@theme inline {");
  expect(open, "@theme inline block present").toBeGreaterThan(-1);
  let depth = 0;
  let i = open;
  for (; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  expect(i, "@theme inline block closes").toBeGreaterThan(open);
  return css.slice(open, i + 1);
}

/** Extract the lightness number from an oklch() literal. Returns NaN
 * on malformed input so the assertions surface meaningfully. */
function oklchLightness(oklch: string): number {
  const m = oklch.match(/oklch\(\s*([\d.]+)\s+/);
  if (!m) return Number.NaN;
  return parseFloat(m[1]);
}

describe("§182 — Brand-blue darkened site-wide", () => {
  it("--color-accent-ink resting lightness is at most 0.52 (anti-pastel ceiling)", () => {
    const block = themeBlock();
    const m = block.match(/--color-accent-ink\s*:\s*(oklch\([^)]+\))/);
    expect(m, "--color-accent-ink defined with oklch()").toBeTruthy();
    const L = oklchLightness(m![1]);
    expect(Number.isFinite(L)).toBe(true);
    // 0.52 is the upper bound — a future tweak can go darker (0.48,
    // 0.45, etc.) but must not regress to the original 0.62 pastel.
    expect(L, `--color-accent-ink lightness ${L} must be ≤ 0.52`).toBeLessThanOrEqual(0.52);
    // Floor: don't accidentally invert into navy/black territory.
    expect(L, `--color-accent-ink lightness ${L} must be ≥ 0.40`).toBeGreaterThanOrEqual(0.40);
  });

  it("--color-accent-ink-strong is darker than the resting state", () => {
    const block = themeBlock();
    const rest = block.match(/--color-accent-ink\s*:\s*(oklch\([^)]+\))/);
    const strong = block.match(/--color-accent-ink-strong\s*:\s*(oklch\([^)]+\))/);
    expect(rest && strong, "both tokens defined").toBeTruthy();
    const Lrest = oklchLightness(rest![1]);
    const Lstrong = oklchLightness(strong![1]);
    expect(Lstrong, `strong (${Lstrong}) must be darker than rest (${Lrest})`).toBeLessThan(Lrest);
  });

  it("chroma stays in the cobalt family — high enough to feel like brand blue, not muted navy", () => {
    const block = themeBlock();
    const m = block.match(/--color-accent-ink\s*:\s*oklch\(\s*[\d.]+\s+([\d.]+)\s+/);
    expect(m, "chroma extractable").toBeTruthy();
    const C = parseFloat(m![1]);
    // 0.18 is the floor — below that the hue starts feeling washed out
    // even at low lightness. Original was 0.205, the §182 value is in
    // the same family.
    expect(C, `chroma ${C} must be ≥ 0.18`).toBeGreaterThanOrEqual(0.18);
  });

  it("hue stays in the cobalt-blue band (~250–265 in oklch)", () => {
    const block = themeBlock();
    const rest = block.match(
      /--color-accent-ink\s*:\s*oklch\(\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s*\)/,
    );
    const strong = block.match(
      /--color-accent-ink-strong\s*:\s*oklch\(\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s*\)/,
    );
    expect(rest && strong, "hue extractable from both").toBeTruthy();
    const H1 = parseFloat(rest![1]);
    const H2 = parseFloat(strong![1]);
    for (const H of [H1, H2]) {
      expect(H, `hue ${H} in cobalt band`).toBeGreaterThanOrEqual(250);
      expect(H, `hue ${H} in cobalt band`).toBeLessThanOrEqual(265);
    }
  });

  it("anti-regression: the original 0.62 pastel lightness is explicitly banned", () => {
    const block = themeBlock();
    expect(block).not.toMatch(/--color-accent-ink\s*:\s*oklch\(\s*0\.62\b/);
    expect(block).not.toMatch(/--color-accent-ink-strong\s*:\s*oklch\(\s*0\.55\b/);
  });

  it("anti-regression: alias still points at accent-ink so the §179 alias keeps cascading the new value", () => {
    const block = themeBlock();
    expect(block).toMatch(/--color-brand-blue\s*:\s*var\(--color-accent-ink\)/);
    expect(block).toMatch(
      /--color-brand-blue-strong\s*:\s*var\(--color-accent-ink-strong\)/,
    );
  });
});
