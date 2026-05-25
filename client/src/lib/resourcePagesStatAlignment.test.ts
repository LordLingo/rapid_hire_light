/*
  §187 — Source-pin: Resource-pages hero-stat baseline alignment.

  After §176/§180 fixed the by-state hub and §177 fixed the marijuana-
  laws hub, the user asked for the same uniform alignment treatment
  across every resource page. The audit found five more pages whose
  hero-stat strips suffered eyebrow→number→body baseline drift:

    - ResourcesK12ComplianceGuide          (local Stat component)
    - ResourcesLegislativeUpdates          (local Stat component)
    - ResourcesWhitePapers                 (local Stat component)
    - ResourcesBenchmarks                  (3 inline cards)
    - ResourcesStatePage                   (mapped inline cards)

  All five now share the canonical pattern:
    flex h-full flex-col              ← grid cells stretch to row height
    eyebrow:  leading-[1.3] min-h-[3.9em]    ← reserves 3 lines
    value:    leading-[1]                    ← stable line box
    body:     mt-auto pt-2                   ← anchored to card bottom

  This spec locks the pattern at every callsite so future copy edits
  don't reintroduce drift.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PAGES_TO_CHECK = [
  "ResourcesK12ComplianceGuide.tsx",
  "ResourcesLegislativeUpdates.tsx",
  "ResourcesWhitePapers.tsx",
  "ResourcesBenchmarks.tsx",
  "ResourcesStatePage.tsx",
];

const REQUIRED_PATTERNS = {
  "flex-col cell": /flex h-full flex-col/,
  "eyebrow 3-line slot": /min-h-\[3\.9em\]/,
  "eyebrow 1.3 leading": /leading-\[1\.3\][^"]*min-h-\[3\.9em\]|min-h-\[3\.9em\][^"]*leading-\[1\.3\]/,
  "value stable line box": /font-display text-\[(?:28px|32px|36px|40px|48px)\][^"]*leading-\[1\]/,
  "body anchored to bottom": /mt-auto[^"]*pt-2|mt-auto[^"]*text-\[12px\]/,
};

describe("§187 — Resource-pages hero-stat baseline alignment", () => {
  for (const page of PAGES_TO_CHECK) {
    describe(page, () => {
      const src = readFileSync(
        resolve(__dirname, `../pages/${page}`),
        "utf8",
      );

      for (const [name, pattern] of Object.entries(REQUIRED_PATTERNS)) {
        it(`uses canonical ${name} pattern`, () => {
          expect(src, `${page} should match: ${pattern}`).toMatch(pattern);
        });
      }

      it("does NOT use the legacy `leading-tight` on the value (which causes the drift)", () => {
        // We only ban leading-tight on font-display value paragraphs,
        // not anywhere else in the file (it's still fine on h2s etc.).
        expect(src).not.toMatch(
          /font-display text-\[(?:28px|32px|36px|40px|48px)\] leading-tight/,
        );
      });

      it("does NOT use legacy `min-h-[2.6em]` (the §176 stale 2-line slot)", () => {
        expect(src).not.toMatch(/min-h-\[2\.6em\]/);
      });
    });
  }

  it("§187 banner: the §176/§180 pages still match too (regression check)", () => {
    const byState = readFileSync(
      resolve(__dirname, "../pages/ResourcesBackgroundChecksByState.tsx"),
      "utf8",
    );
    const marijuana = readFileSync(
      resolve(__dirname, "../pages/ResourcesMarijuanaLaws.tsx"),
      "utf8",
    );
    expect(byState).toMatch(/min-h-\[3\.9em\]/);
    expect(byState).toMatch(/flex h-full flex-col/);
    expect(marijuana).toMatch(/flex h-full flex-col/);
  });
});
