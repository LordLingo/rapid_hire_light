/*
  §102 — Hero copy length invariant.

  The in-Manus auditor reads raw HTML; the §101 #root SEO block already
  guarantees a baseline of crawlable text, but a redesigned homepage that
  ships an image-only hero with one-line copy still tanks user-perceived
  SEO quality (thin content, low engagement signals, weak surrounding
  context for the H1). This invariant guards the *visible* hero copy in
  the React component itself: the headline + subhead + trust-signal row
  must add up to at least 150 characters of human-readable text.

  We extract every JSX text node from `Hero.tsx` and concatenate them.
  This is intentionally simple-minded — it'll over-count slightly because
  it doesn't strip CTA labels or aria-hidden separators, but the floor is
  generous enough that even after stripping, real content will pass.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HERO_SRC = readFileSync(
  resolve(__dirname, "..", "components", "site", "Hero.tsx"),
  "utf8",
);

/** Pull every >text< node from a JSX source. Crude but adequate. */
function extractVisibleText(jsx: string): string {
  // Remove JS expression interpolations like {x}.
  const noExpr = jsx.replace(/\{[^{}]*\}/g, " ");
  // Pull text between > and <, but only inside the component body.
  // Anchor on the first `return (` to ignore the file's opening doc-comment.
  const bodyStart = noExpr.indexOf("return (");
  const body = bodyStart >= 0 ? noExpr.slice(bodyStart) : noExpr;
  const matches = [...body.matchAll(/>([^<>]+)</g)].map((m) => m[1]);
  return matches
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 0)
    .join(" ");
}

describe("§102 — homepage hero ships meaningful body copy", () => {
  it("renders at least 150 characters of visible hero text", () => {
    const text = extractVisibleText(HERO_SRC);
    // Sanity: the extractor must find at least the SPA-framed headline
    // (§138 reframed the hero around Speed · Price · Accuracy; the
    // previous "Trusted background checks" headline lives only in the
    // marketing photo's baked-in copy now).
    expect(text.toLowerCase()).toContain("speed");
    expect(text.toLowerCase()).toContain("accuracy");
    // The auditor floor.
    expect(
      text.length,
      `Hero visible copy is only ${text.length} chars; expected >=150. Extracted: ${text.slice(0, 200)}…`,
    ).toBeGreaterThanOrEqual(150);
  });

  it("includes the FCRA + U.S.-based proof-points in the hero body", () => {
    // §138: the previous "85%+ within 24 hours" micro-stat moved out of
    // the hero into the SpaPillars (rendered as "Median TAT 8 hours"
    // for the Speed pillar) and into the persistent certification strip.
    // FCRA + U.S.-based remain in the hero body copy as the trust line.
    const text = extractVisibleText(HERO_SRC).toLowerCase();
    expect(text).toContain("fcra");
    expect(text).toContain("u.s.");
  });

  it("ships exactly one <h1> in the hero component", () => {
    const matches = HERO_SRC.match(/<h1[\s>]/g) ?? [];
    expect(matches.length).toBe(1);
  });
});
