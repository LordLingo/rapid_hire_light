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

  it("carries the new editorial copy: TAT + U.S.-based support", () => {
    // Eyebrow flipped from "The problem" to "How we're different"
    // when the section was repurposed from a problem-statement to a
    // differentiator. The italic accent moved to "done right." so
    // the sky-halo italic still anchors the dark surface.
    expect(SRC).toMatch(/02\s*—\s*How we&apos;re different/);
    expect(SRC).toMatch(/Turnaround time &amp; customer support,/);
    expect(SRC).toMatch(/done right\./);
    // Closing italic pull-quote replaces "There's got to be a better way…"
    expect(SRC).toMatch(/…it should be this simple\./);
    // Belt-and-braces: explicitly assert the previous topic strings
    // are gone, so a global find/replace can't silently roll us back.
    expect(SRC).not.toMatch(/Stop gambling with/);
    expect(SRC).not.toMatch(/There.{1,3}s got to be a better way/);
    expect(SRC).not.toMatch(/02\s*—\s*The problem/);
  });

  it("makes a concrete TAT claim (24-hour median, 85%+) instead of a vague superlative", () => {
    // The differentiator only earns its real estate if it commits to
    // a number. Pin both halves of the claim so a future copy edit
    // doesn't soften them into marketing fluff.
    expect(SRC).toMatch(/24[-\s]hour/);
    expect(SRC).toMatch(/85%/);
    expect(SRC).toMatch(/fastest,\s+most accurate/);
  });

  it("explicitly disclaims offshore support / chatbots / scripts", () => {
    // The U.S.-based-support claim is the second leg. Pin the three
    // disqualifiers so the line stays unambiguous.
    expect(SRC).toMatch(/U\.S\.[-\s]based/);
    expect(SRC).toMatch(/no offshore/);
    expect(SRC).toMatch(/no chatbots/);
    expect(SRC).toMatch(/no scripts/);
  });

  it("renders a sky-halo radial halo behind the headline column (§43)", () => {
    // Section 43 follow-up. Matches the halo treatment on CtaBanner so
    // the homepage's two dark surfaces read as one continuous family.
    // Marker class `stop-gambling-halo` is the test pin.
    expect(SRC).toMatch(/stop-gambling-halo/);
    // The halo must use the sky-halo accent token, not a hardcoded
    // hex or a different accent.
    expect(SRC).toMatch(
      /radial-gradient\(closest-side,\s*var\(--color-accent-halo\)/
    );
  });

  it("renders a bottom wedge transitioning into the warm WhyUs paper (§43)", () => {
    // Section 43 follow-up. SVG wedge with the section's deepest
    // gradient stop as fill, painted into the bottom of the section.
    // Marker class `stop-gambling-wedge` is the test pin.
    expect(SRC).toMatch(/stop-gambling-wedge/);
    // The wedge must be filled with --color-footer (the deeper-ink
    // endpoint of the gradient) so it blends into the section's
    // right-edge color, not a hardcoded hex.
    expect(SRC).toMatch(/fill="var\(--color-footer\)"/);
    // Anti-regression: the section's container must keep the bumped
    // bottom padding so the wedge can't overlap the closing italic
    // pull-quote.
    expect(SRC).toMatch(/md:pb-44/);
  });
});
