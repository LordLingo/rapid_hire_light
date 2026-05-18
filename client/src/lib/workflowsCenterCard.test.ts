/*
  Workflows center card — invariants pin (§44).

  The center "02 · Layer / Rapid Hire Solutions Platform" card was
  redesigned because its previous version (eight pill-shaped chips
  inside a white DiagramCard) read like clickable buttons even though
  the chips were static descriptors. The new card:

    1. Uses the deep --color-footer navy as its surface so it visually
       links to the footer band and anchors the three-card workflow
       stack against the two flanking white cards. (Originally used
       --color-accent-ink, swapped per user request §132.)
    2. Renders the eight tokens (Speed, Comprehensive, Compliant,
       Accurate, Scalable, Integrated, Trusted, Efficient) as a 2×4
       grid of STATIC <li> badges with icon + label — no <button>,
       no <a>, no cursor-pointer, no hover state.
    3. Keeps the labels in the same order so the visual rhythm is
       stable.

  This file pins the source-string invariants. It does not mount.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const WORKFLOWS_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "Workflows.tsx"
);
const SRC = readFileSync(WORKFLOWS_PATH, "utf8");

describe("Workflows center card — §44 redesign", () => {
  it("declares a dedicated PlatformCenterCard component", () => {
    // The redesign deliberately splits the center card off from the
    // shared DiagramCard shell so the deep-navy surface and badge
    // grid don't poison its flanking siblings.
    expect(SRC).toMatch(/function\s+PlatformCenterCard\s*\(/);
  });

  it("uses the footer-navy token as the card surface", () => {
    // Per user request §132: the center card adopts the same deep
    // navy as the page footer so the workflow stack visually rhymes
    // with the band below it. (Originally used --color-accent-ink.)
    expect(SRC).toMatch(
      /bg-\[color:var\(--color-footer\)\][\s\S]*?text-white/
    );
  });

  it("inverts the headline + body to white on the navy surface", () => {
    // Belt-and-braces: the headline must explicitly carry text-white,
    // not inherit a light-paper ink token.
    expect(SRC).toMatch(/Rapid Hire Solutions Platform/);
    expect(SRC).toMatch(/text-white\/80[\s\S]*?Orchestrates background checks/);
  });

  it("declares all eight platform descriptors in the locked order", () => {
    // The badge order is a design decision (positive verbs first,
    // operational verbs last). Pin it so a future copy edit can't
    // silently reshuffle them.
    const labels = [
      "Speed",
      "Comprehensive",
      "Compliant",
      "Accurate",
      "Scalable",
      "Integrated",
      "Trusted",
      "Efficient",
    ];
    const labelsPattern = labels
      .map((l) => `label:\\s*"${l}"`)
      .join("[\\s\\S]*?");
    expect(SRC).toMatch(new RegExp(labelsPattern));
  });

  it("pairs each badge with a specific lucide icon, in order", () => {
    // The icon mapping is part of the design. Pin it so a future
    // refactor can't silently swap (e.g.) Compliant's shield for a
    // different glyph.
    const pairs: Array<[string, string]> = [
      ["Speed", "Rocket"],
      ["Comprehensive", "ClipboardCheck"],
      ["Compliant", "ShieldCheck"],
      ["Accurate", "Target"],
      ["Scalable", "TrendingUp"],
      ["Integrated", "Puzzle"],
      ["Trusted", "Handshake"],
      ["Efficient", "RefreshCw"],
    ];
    for (const [label, icon] of pairs) {
      // Each tuple must appear with this exact label/icon binding.
      expect(SRC).toMatch(
        new RegExp(`label:\\s*"${label}",\\s*icon:\\s*${icon}`)
      );
    }
  });

  it("renders the badges as a 2-column grid (not a flex-wrap pill row)", () => {
    expect(SRC).toMatch(/grid-cols-2/);
    // Belt-and-braces: the previous flex-wrap pill row is gone.
    expect(SRC).not.toMatch(/PLATFORM_CHIPS/);
  });

  it("renders badges as static <li>s — NOT <button> or <a>", () => {
    // The user's core complaint: chips that read like clickable
    // buttons. Slice the PlatformCenterCard function body out of the
    // file and assert the badge grid contains no interactive elements.
    const start = SRC.indexOf("function PlatformCenterCard");
    expect(start).toBeGreaterThan(-1);
    // Find the matching closing `}` by tracking brace depth from the
    // function's opening `{`. Simpler heuristic: grab everything from
    // the function start up to "function Connector" (the next sibling
    // function in the file).
    const end = SRC.indexOf("function Connector", start);
    expect(end).toBeGreaterThan(start);
    const body = SRC.slice(start, end);

    // No interactive elements inside the center card.
    expect(body).not.toMatch(/<button[\s>]/);
    expect(body).not.toMatch(/<a\s/);
    expect(body).not.toMatch(/cursor-pointer/);
    expect(body).not.toMatch(/hover:/);
    // Each badge MUST be a <li> (presentational list semantics).
    expect(body).toMatch(/<li/);
  });

  it("does not regress to the old pill-chip markup", () => {
    // Anti-regression: the previous implementation used a flat
    // PLATFORM_CHIPS string array with rounded-full pill spans. Both
    // tokens must be gone so a global revert can't silently restore
    // the fake-button look.
    expect(SRC).not.toMatch(/PLATFORM_CHIPS/);
    // §44 anti-regression: a rounded-full pill that fills with tint
    // background in its RESTING state is the old fake-button chip
    // pattern. The negative lookbehind ignores `group-hover:bg-[...tint]`
    // (the new §52 DiagramCard icon-well wash, which is a HOVER state
    // on a non-chip surface, not a resting fill on a pill). If a future
    // refactor reintroduces a literal resting `bg-[color:var(--color-tint)]`
    // on a `rounded-full` element, this guard will fire.
    expect(SRC).not.toMatch(
      /rounded-full[^"]*(?<!group-hover:)bg-\[color:var\(--color-tint\)\]/
    );
  });

  it("keeps the test-id hooks for downstream visual or e2e tests", () => {
    // Pin the data-testid hooks so a future visual-regression or
    // Playwright suite has stable selectors.
    expect(SRC).toMatch(/data-testid="platform-center-card"/);
    expect(SRC).toMatch(/data-testid="platform-badge-grid"/);
  });
});
