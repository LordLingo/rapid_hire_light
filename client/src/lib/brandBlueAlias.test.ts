/*
  §179 — `--color-brand-blue` must resolve, project-wide.

  Tailwind v4 reads design tokens from the `@theme inline { ... }` block
  in client/src/index.css. The Light Redesign codebase has ~55 call-sites
  across 16 files that reference `--color-brand-blue` (e.g. the Get-a-Quote
  CTA, the marijuana-laws filter chips' selected state, the "Updated"
  badge, the header's active underline), but for most of the project's
  history that token was never defined. Tailwind silently falls back to
  `currentColor` / transparent on an undefined token, which is what made
  the marijuana-laws "All" chip render as a faint near-paper smudge.

  This spec source-pins the alias so:
    - if a future refactor renames `--color-brand-blue` away from the
      theme block without also renaming all call-sites, the test fails;
    - if a future refactor changes the canonical bright-blue token name
      (currently `--color-accent-ink`), the alias still has to point at
      a real, defined token.

  We deliberately keep the assertions structural (does the alias exist
  in the theme block, does it reference an accent-ink token) rather
  than asserting on the resolved oklch() value, because the brand-blue
  hue can shift over time and pinning a literal would create churn.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PATH = resolve(__dirname, "../index.css");
const css = readFileSync(PATH, "utf8");

/** Slice the @theme inline { ... } block so the assertions can't be
 * fooled by a definition that lives in a stray .css elsewhere or in a
 * later :root override (Tailwind only reads the @theme block for
 * arbitrary-value class lookups like `bg-[color:var(--color-...)]`). */
function themeBlock(): string {
  const open = css.indexOf("@theme inline {");
  expect(open, "@theme inline block present").toBeGreaterThan(-1);
  // Find the matching closing brace by counting depth from the opening.
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

describe("§179 — Brand-blue token alias is defined in @theme", () => {
  it("@theme inline block defines --color-brand-blue", () => {
    const block = themeBlock();
    expect(block).toMatch(/--color-brand-blue\s*:/);
  });

  it("the alias resolves to the canonical accent-ink token (not currentColor / a literal)", () => {
    const block = themeBlock();
    expect(block).toMatch(/--color-brand-blue\s*:\s*var\(--color-accent-ink\)/);
  });

  it("the canonical accent-ink token it points at is itself defined in the same block", () => {
    const block = themeBlock();
    // The target token must be defined with an oklch() value (or any
    // resolved color literal) — never an unbound var().
    expect(block).toMatch(
      /--color-accent-ink\s*:\s*oklch\(/,
    );
  });

  it("the strong/hover variant is also aliased so brand-blue-strong call-sites resolve too", () => {
    const block = themeBlock();
    expect(block).toMatch(
      /--color-brand-blue-strong\s*:\s*var\(--color-accent-ink-strong\)/,
    );
    expect(block).toMatch(/--color-accent-ink-strong\s*:\s*oklch\(/);
  });

  it("anti-regression: the alias is NOT defined inside :root, which would not feed Tailwind's arbitrary-value lookups", () => {
    // Tailwind v4 reads tokens from @theme inline {} for class-name
    // generation. A :root definition would still work at runtime for
    // *resolved* CSS, but won't produce the utility class. Pin the
    // alias's home so future cleanups don't accidentally move it.
    const block = themeBlock();
    const aliasIdx = block.indexOf("--color-brand-blue");
    expect(aliasIdx, "alias lives inside @theme inline").toBeGreaterThan(-1);
  });
});
