/*
  StopGambling dark gradient (mirrored) — invariants pin.

  Mirrors the file-string pattern used by `ctaBannerDark.test.ts`.
  We don't mount the component; we just assert the design tokens
  encoded in the source file haven't drifted.

  The two invariants that matter most here are:

    1. The gradient must run from --color-footer-soft (left, lighter)
       to --color-footer (right, deeper). That is what creates the
       "rhythm not redundancy" relationship with the Switch CTA
       block, which runs the opposite direction.

    2. Body / headline / accent text must use the footer-family
       tokens (warm-white foreground, sky-halo accent) — i.e. the
       same dark-surface tokens the Footer + CtaBanner already use.
       That is what keeps all three dark surfaces feeling like one
       continuous treatment.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const STOP_GAMBLING_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "StopGambling.tsx"
);
const SRC = readFileSync(STOP_GAMBLING_PATH, "utf8");

describe("StopGambling dark gradient (mirrored)", () => {
  it("uses a left-to-right gradient that STARTS at --color-footer-soft", () => {
    // Lighter on the LEFT — the deliberate mirror of CtaBanner's
    // gradient direction.
    expect(SRC).toMatch(
      /linear-gradient\(\s*90deg\s*,\s*var\(--color-footer-soft\)\s+0%/
    );
  });

  it("ends the gradient at --color-footer on the right (deeper ink)", () => {
    // Deeper on the RIGHT, the inverse of the Switch CTA block.
    expect(SRC).toMatch(/var\(--color-footer\)\s+100%/);
  });

  it("declares colorScheme: dark", () => {
    expect(SRC).toMatch(/colorScheme:\s*"dark"/);
  });

  it("inverts the headline + body to footer-family tokens", () => {
    expect(SRC).toMatch(/text-\[color:var\(--color-footer-foreground\)\]/);
    expect(SRC).toMatch(/text-\[color:var\(--color-footer-soft-text\)\]/);
    expect(SRC).toMatch(/text-\[color:var\(--color-footer-muted\)\]/);
  });

  it("uses the sky-halo accent (not the deep ink accent) for the italic emphasis", () => {
    // On dark surfaces --color-accent-ink reads muddy. The halo is
    // the correct counterpart, and matches the pattern used in
    // CtaBanner.tsx + Footer.tsx.
    expect(SRC).toMatch(/text-\[color:var\(--color-accent-halo\)\]/);
    expect(SRC).not.toMatch(/text-\[color:var\(--color-accent-ink\)\]/);
  });

  it("does NOT use the previous light-surface tokens for body type", () => {
    // Belt-and-braces: explicitly assert the previous light-paper
    // body tokens are gone, so a global find/replace can't silently
    // roll us back to the cream-paper version.
    expect(SRC).not.toMatch(/text-\[color:var\(--color-ink\)\]/);
    expect(SRC).not.toMatch(/text-\[color:var\(--color-ink-soft\)\]/);
    expect(SRC).not.toMatch(/text-\[color:var\(--color-ink-muted\)\]/);
    // And the surface itself must NOT be the warm paper anymore.
    expect(SRC).not.toMatch(/bg-\[color:var\(--color-paper\)\]/);
  });

  it("preserves the editorial copy intact", () => {
    expect(SRC).toMatch(/02\s*—\s*The problem/);
    expect(SRC).toMatch(/Stop gambling with/);
    expect(SRC).toMatch(/compliance\./);
    expect(SRC).toMatch(/There.{1,3}s got to be a better way/);
  });
});
