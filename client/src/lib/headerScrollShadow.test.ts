/*
  Header scroll drop-shadow — invariants pin (§48).

  Pins:
    - The header has a `scrolled` state driven by window.scrollY.
    - Once scrolled, the header surface gains a soft downward
      box-shadow so the active-link underline reads against
      content underneath.
    - The shadow is absent at top of page (so the hero stays open).
    - The transition includes box-shadow so the shadow fades in
      smoothly, not pops.
    - Anti-regression: the shadow must NOT be applied
      unconditionally (i.e. there must still be a `scrolled` gate).
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HEADER_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "Header.tsx"
);
const HEADER_SRC = readFileSync(HEADER_PATH, "utf8");

describe("Header.tsx — §48 scroll drop-shadow", () => {
  it("keeps the scrolled state driven by window.scrollY", () => {
    // Anti-regression: don't lose the scroll listener.
    expect(HEADER_SRC).toMatch(/window\.scrollY/);
    expect(HEADER_SRC).toMatch(/setScrolled\(/);
  });

  it("applies a soft downward shadow class only when scrolled", () => {
    // The shadow token must appear in the source, and it must sit
    // inside the `scrolled ? ... : ...` ternary — not unconditionally.
    expect(HEADER_SRC).toMatch(
      /shadow-\[0_4px_18px_-8px_rgba\(15,23,42,0\.18\)\]/
    );
    // Anti-regression: the resting branch of the ternary should
    // explicitly clear the shadow with `shadow-none` so the header
    // reads "open" at top of page.
    expect(HEADER_SRC).toMatch(/shadow-none/);
  });

  it("transitions box-shadow alongside colors so the lift fades in smoothly", () => {
    // The transition utility must include box-shadow; the previous
    // version transitioned only colors which would cause a hard pop.
    expect(HEADER_SRC).toMatch(/transition-\[colors,box-shadow\]/);
    // Duration + ease must remain reasonable (≤ 300ms ease-out per
    // the editorial motion brief).
    expect(HEADER_SRC).toMatch(/duration-300/);
    expect(HEADER_SRC).toMatch(/ease-out/);
  });

  it("exposes the scrolled state on the header element via data-scrolled for downstream styling/QA", () => {
    expect(HEADER_SRC).toMatch(/data-scrolled=\{scrolled \? "true" : undefined\}/);
  });
});
