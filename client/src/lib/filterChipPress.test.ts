/*
  §183 — `.filter-chip-press` chip-tier hover choreography.

  The Resources filter chips on /resources/ban-the-box (stage + scope)
  and /resources/marijuana-laws (recreational + protection) carry the
  same brand-blue selected surface as the site-wide CTAs. After §181
  unified them on `bg-[color:var(--color-brand-blue)] text-white`, the
  user asked for matching hover/transition polish so the chips feel
  alive when they're interacted with — not the sudden bg/border swap
  that `transition-colors` alone gave us.

  This spec source-pins:
    1. The utility itself in client/src/index.css under @layer
       components, with its prefers-reduced-motion gate, hover lift,
       active press, and focus-visible ring.
    2. That all four chip groups (ban-the-box stage + scope,
       marijuana-laws rec + protection) actually receive the utility
       class, so a future class-string refactor can't quietly drop it.
    3. That the older naked `transition-colors`-only chip class is
       gone from those slices — the utility supersedes it.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CSS = readFileSync(resolve(__dirname, "../index.css"), "utf8");
const BTB = readFileSync(
  resolve(__dirname, "../pages/ResourcesBanTheBox.tsx"),
  "utf8",
);
const MJ = readFileSync(
  resolve(__dirname, "../pages/ResourcesMarijuanaLaws.tsx"),
  "utf8",
);

/** Slice the §183 utility block from index.css. The block opens with a
 * §183 marker comment and runs through the `.filter-chip-press:focus-visible`
 * rule, before the §50 hover utility block. */
function utilityBlock(): string {
  const open = CSS.indexOf("§183 — Filter-chip hover choreography");
  expect(open, "§183 marker comment present in index.css").toBeGreaterThan(-1);
  const end = CSS.indexOf("§50 — Hover polish utilities", open);
  expect(end, "§50 marker (next block) follows the §183 block").toBeGreaterThan(
    open,
  );
  return CSS.slice(open, end);
}

describe("§183 — Filter chip hover choreography", () => {
  it("`.filter-chip-press` is defined inside @layer components in index.css", () => {
    const block = utilityBlock();
    expect(block).toMatch(/@layer\s+components\s*\{[\s\S]*?\.filter-chip-press\s*\{/);
  });

  it("base `.filter-chip-press` rule transitions background/border/color/box-shadow with the canonical CTA easing", () => {
    const block = utilityBlock();
    // First (un-gated) rule body
    const m = block.match(
      /\.filter-chip-press\s*\{\s*transition:\s*([^}]+?)\s*will-change:/,
    );
    expect(m, "base .filter-chip-press rule present").toBeTruthy();
    const transition = m![1];
    expect(transition).toMatch(/background-color\s+180ms/);
    expect(transition).toMatch(/border-color\s+180ms/);
    expect(transition).toMatch(/color\s+180ms/);
    expect(transition).toMatch(/box-shadow\s+200ms/);
    expect(transition).toMatch(/cubic-bezier\(0\.23,\s*1,\s*0\.32,\s*1\)/);
  });

  it("transform-based motion is gated behind `prefers-reduced-motion: no-preference` (matches the CTA gate)", () => {
    const block = utilityBlock();
    expect(block).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{[\s\S]*?\.filter-chip-press:hover\s*\{[\s\S]*?transform:\s*translateY\(-2px\)/,
    );
    expect(block).toMatch(
      /\.filter-chip-press:active\s*\{[\s\S]*?scale\(0\.97\)/,
    );
  });

  it("hover state paints a soft sky-halo glow using --color-accent-halo", () => {
    const block = utilityBlock();
    const hover = block.match(
      /\.filter-chip-press:hover\s*\{([\s\S]*?)\}/,
    );
    expect(hover, "hover rule present").toBeTruthy();
    const body = hover![1];
    expect(body).toMatch(/box-shadow:/);
    expect(body).toMatch(/var\(--color-accent-halo\)/);
  });

  it("focus-visible ring is keyboard-friendly even when the lift is suppressed", () => {
    const block = utilityBlock();
    expect(block).toMatch(
      /\.filter-chip-press:focus-visible\s*\{[\s\S]*?outline:\s*none[\s\S]*?box-shadow:[\s\S]*?var\(--color-accent-halo\)/,
    );
  });

  it("ban-the-box stage filter chips apply the utility", () => {
    // The chip group is identified by its testid template literal that
    // §181 added; immediately above it the className includes the
    // utility class.
    const stageSlice = BTB.slice(
      BTB.indexOf("ban-the-box-stage-filter-"),
      BTB.indexOf("ban-the-box-scope-filter-"),
    );
    expect(stageSlice).toMatch(/filter-chip-press/);
    // Anti-regression: the older naked `transition-colors` should be gone
    // from this slice (the utility provides the transition now).
    expect(stageSlice).not.toMatch(/transition-colors/);
  });

  it("ban-the-box scope filter chips apply the utility", () => {
    const scopeIdx = BTB.indexOf("ban-the-box-scope-filter-");
    expect(scopeIdx).toBeGreaterThan(-1);
    const scopeSlice = BTB.slice(scopeIdx, scopeIdx + 800);
    expect(scopeSlice).toMatch(/filter-chip-press/);
    expect(scopeSlice).not.toMatch(/transition-colors/);
  });

  it("marijuana-laws recreational + protection filter chips apply the utility", () => {
    // Both chip groups exist on this page; pin both.
    const recIdx = MJ.indexOf("marijuana-laws-rec-filter-");
    const protIdx = MJ.indexOf("marijuana-laws-protection-filter-");
    expect(recIdx, "rec testid present").toBeGreaterThan(-1);
    expect(protIdx, "protection testid present").toBeGreaterThan(recIdx);

    const recSlice = MJ.slice(recIdx, protIdx);
    const protSlice = MJ.slice(protIdx, protIdx + 800);

    expect(recSlice).toMatch(/filter-chip-press/);
    expect(protSlice).toMatch(/filter-chip-press/);

    // Neither slice should still use the bare `transition` className that
    // was there before — the utility owns the timing now.
    expect(recSlice).not.toMatch(/text-\[12px\] transition\s/);
    expect(protSlice).not.toMatch(/text-\[12px\] transition\s/);
  });

  it("anti-regression: utility lift is exactly translateY(-2px) (chip-tier, not CTA-tier)", () => {
    const block = utilityBlock();
    // CTAs use translateY(-6px); chips must stay at -2px so the gesture
    // feels distinct from the larger CTA lift.
    expect(block).toMatch(/\.filter-chip-press:hover\s*\{[\s\S]*?translateY\(-2px\)/);
    expect(block).not.toMatch(/\.filter-chip-press:hover\s*\{[\s\S]*?translateY\(-6px\)/);
  });
});
