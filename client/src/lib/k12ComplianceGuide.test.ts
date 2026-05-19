/*
  §152 — K-12 Compliance Guide page contract
  ------------------------------------------
  Source-pin tests for client/src/pages/ResourcesK12ComplianceGuide.tsx
  and the supporting k12ComplianceMatrix data module. Mirrors the
  source-pin style used across the rest of the Resources inner-page
  family (Marijuana, Ban the Box, Background Checks by State).

  We assert:
    1. Matrix data integrity (10 rows, federal layers count, required
       fields populated for every row).
    2. k12MatrixCounts() derivations stay consistent with the matrix.
    3. Page is registered on the /resources/k12-compliance-guide route
       in App.tsx and the K12 archetype secondary link in blogCta.ts
       still points to this same path (so a future rename to the
       archetype href won't silently 404).
    4. Resources.tsx PILLARS array surfaces a K-12 entry pointing at
       this page (so it's reachable from the hub index, not only via
       blog CTAs).
    5. Page uses the canonical PageHero contract — `afterLede` slot
       for CTAs and `visual` slot for the stat band — and NOT the
       non-existent `ctas` / `breadcrumb` props.
    6. useSeo canonical is a full URL (not a path).
    7. Workflow checklist has exactly 5 numbered moves and the
       companion-reading rail has exactly 3 links.
    8. Stable testids exist for all the structural slots the design
       relies on.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  K12_COMPLIANCE_MATRIX,
  K12_FEDERAL_LAYERS,
  k12MatrixCounts,
} from "@/lib/k12ComplianceMatrix";
import {
  BLOG_CTA_ARCHETYPES_BY_ID,
  CTA_ARCHETYPES,
  matchArchetype,
} from "@/lib/blogCta";

const ROOT = resolve(__dirname, "../../..");
const PAGE_PATH = resolve(
  ROOT,
  "client/src/pages/ResourcesK12ComplianceGuide.tsx",
);
const APP_PATH = resolve(ROOT, "client/src/App.tsx");
const RESOURCES_PATH = resolve(ROOT, "client/src/pages/Resources.tsx");
const PAGE_SRC = readFileSync(PAGE_PATH, "utf8");
const APP_SRC = readFileSync(APP_PATH, "utf8");
const RESOURCES_SRC = readFileSync(RESOURCES_PATH, "utf8");

const GUIDE_PATH = "/resources/k12-compliance-guide";

describe("§152 — K-12 compliance matrix data", () => {
  it("matrix has exactly 10 state rows", () => {
    expect(K12_COMPLIANCE_MATRIX).toHaveLength(10);
  });

  it("every row has all six required fields populated", () => {
    for (const row of K12_COMPLIANCE_MATRIX) {
      expect(row.code).toMatch(/^[A-Z]{2}$/);
      expect(row.state.length).toBeGreaterThan(2);
      expect(row.fingerprintRequired.length).toBeGreaterThan(0);
      expect(row.reFingerprintCadence.length).toBeGreaterThan(0);
      expect(row.volunteerCoverage.length).toBeGreaterThan(0);
      expect(row.statute.length).toBeGreaterThan(0);
      expect(row.notes.length).toBeGreaterThan(0);
    }
  });

  it("state codes are unique", () => {
    const codes = K12_COMPLIANCE_MATRIX.map((r) => r.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("covers the 10 largest K-12 employment states", () => {
    const codes = K12_COMPLIANCE_MATRIX.map((r) => r.code).sort();
    expect(codes).toEqual(
      ["CA", "FL", "GA", "IL", "MI", "NC", "NY", "OH", "PA", "TX"].sort(),
    );
  });

  it("federal layers cover the four required citations", () => {
    expect(K12_FEDERAL_LAYERS).toHaveLength(4);
    const ids = K12_FEDERAL_LAYERS.map((l) => l.id);
    expect(ids).toContain("adam-walsh");
    expect(ids).toContain("essa-8546");
    expect(ids).toContain("fcra");
    expect(ids).toContain("title-vii");
  });

  it("k12MatrixCounts is internally consistent with the matrix", () => {
    const c = k12MatrixCounts();
    expect(c.states).toBe(K12_COMPLIANCE_MATRIX.length);
    expect(c.fingerprintRequiredStates).toBe(
      K12_COMPLIANCE_MATRIX.filter((r) => r.fingerprintRequired === "Required")
        .length,
    );
    expect(c.rapBackStates).toBe(
      K12_COMPLIANCE_MATRIX.filter((r) =>
        /rap-back|continuous/i.test(r.reFingerprintCadence),
      ).length,
    );
    expect(c.tieredBarStates).toBe(
      K12_COMPLIANCE_MATRIX.filter((r) => r.tieredOffenseHandling === "Yes")
        .length,
    );
  });

  it("at least one state runs continuous rap-back (TX, MI)", () => {
    expect(k12MatrixCounts().rapBackStates).toBeGreaterThanOrEqual(2);
  });
});

describe("§152 — route + hub wiring", () => {
  it("/resources/k12-compliance-guide is registered in App.tsx", () => {
    expect(APP_SRC).toContain(`path={"${GUIDE_PATH}"}`);
    expect(APP_SRC).toContain("ResourcesK12ComplianceGuide");
  });

  it("App.tsx imports the page component", () => {
    expect(APP_SRC).toMatch(
      /import\s+ResourcesK12ComplianceGuide\s+from\s+"\.\/pages\/ResourcesK12ComplianceGuide";/,
    );
  });

  it("Resources.tsx PILLARS list includes a K-12 entry pointing at the guide", () => {
    expect(RESOURCES_SRC).toContain(`href: "${GUIDE_PATH}"`);
    expect(RESOURCES_SRC).toMatch(/title:\s*"K-12 compliance guide"/);
  });
});

describe("§152 — blog CTA archetype alignment", () => {
  it("K-12 archetype secondary link points at the new resource page", () => {
    const k12 = BLOG_CTA_ARCHETYPES_BY_ID.k12;
    expect(k12).toBeDefined();
    // also reachable via the array export
    expect(CTA_ARCHETYPES.some((a) => a.id === "k12")).toBe(true);
    expect(k12.secondary).toBeDefined();
    // narrow to the static-href branch (BlogCtaStaticAction)
    const secondary = k12.secondary as { href?: string };
    expect(secondary.href).toBe(GUIDE_PATH);
  });

  it("K-12 archetype still matches a representative K-12 post", () => {
    const archetype = matchArchetype({
      slug: "k12-school-employee-background-check-requirements",
      title: "K-12 school employee background-check requirements",
      tags: ["k12-education", "fingerprint-checks"],
      excerpt: "",
      publishedAt: "2026-05-19",
      readMinutes: 5,
    });
    expect(archetype.id).toBe("k12");
  });
});

describe("§152 — page uses canonical PageHero + SEO contract", () => {
  it("uses afterLede slot for CTAs (NOT the unsupported ctas prop)", () => {
    expect(PAGE_SRC).toContain("afterLede={");
    expect(PAGE_SRC).not.toMatch(/<PageHero[\s\S]{0,2000}?\bctas=\{/);
  });

  it("does NOT use the unsupported breadcrumb prop on PageHero", () => {
    expect(PAGE_SRC).not.toMatch(/<PageHero[\s\S]{0,2000}?\bbreadcrumb=\{/);
  });

  it("uses visual slot for the 4-stat band", () => {
    expect(PAGE_SRC).toMatch(/visual=\{[\s\S]{0,400}data-testid="k12-guide-stats"/);
  });

  it("useSeo canonical is a full https URL, not a path", () => {
    const m = PAGE_SRC.match(/canonical:\s*\n?\s*"([^"]+)"/);
    expect(m).not.toBeNull();
    expect(m![1]).toMatch(/^https:\/\/[^/]+\/resources\/k12-compliance-guide$/);
  });

  it("uses the standard ShieldCheck / lucide-react import without dead-letter unused-import workarounds", () => {
    expect(PAGE_SRC).not.toMatch(/void\s+CheckCircle2\s*;/);
    expect(PAGE_SRC).not.toMatch(/void\s+ArrowRight\s*;/);
    expect(PAGE_SRC).not.toMatch(/void\s+ShieldCheck\s*;/);
  });
});

describe("§152 — content scaffold", () => {
  it("workflow checklist exposes exactly 5 numbered moves", () => {
    const moves = PAGE_SRC.match(/data-testid=`k12-workflow-\$\{step\.n\}`/g);
    // Source uses a template literal — verify the WORKFLOW array length instead.
    const arrayMatch = PAGE_SRC.match(
      /const WORKFLOW:[\s\S]*?=\s*\[([\s\S]*?)\];/,
    );
    expect(arrayMatch).not.toBeNull();
    const nKeys = (arrayMatch![1].match(/\n\s*\{\s*\n\s*n:\s*"\d{2}"/g) || []).length;
    expect(nKeys).toBe(5);
    // sanity: the testid template is present in the JSX
    expect(moves === null ? PAGE_SRC : moves.join("")).toContain(
      "k12-workflow-",
    );
  });

  it("companion-reading rail has exactly 3 entries", () => {
    const arrayMatch = PAGE_SRC.match(
      /const COMPANION_POSTS:[\s\S]*?=\s*\[([\s\S]*?)\];/,
    );
    expect(arrayMatch).not.toBeNull();
    const entryCount = (arrayMatch![1].match(/\n\s*\{\s*\n\s*eyebrow:/g) || [])
      .length;
    expect(entryCount).toBe(3);
  });

  it("exposes the structural testids the design relies on", () => {
    const required = [
      "k12-guide-stats",
      "k12-guide-cta-primary",
      "k12-guide-cta-secondary",
      "k12-guide-why",
      "k12-guide-matrix",
      "k12-guide-matrix-table",
      "k12-guide-federal",
      "k12-guide-workflow",
      "k12-guide-companion",
    ];
    for (const id of required) {
      expect(PAGE_SRC).toContain(`data-testid="${id}"`);
    }
  });

  it("renders one row per matrix state via data-testid template", () => {
    expect(PAGE_SRC).toContain("data-testid={`k12-state-row-${row.code}`}");
  });

  it("renders one card per federal layer via data-testid template", () => {
    expect(PAGE_SRC).toContain("data-testid={`k12-federal-${layer.id}`}");
  });

  it("includes a reference-not-legal-advice disclaimer", () => {
    expect(PAGE_SRC.toLowerCase()).toContain("not legal advice");
  });

  it("exports the canonical path constant for one-source-of-truth pinning", () => {
    expect(PAGE_SRC).toContain(
      'export const K12_COMPLIANCE_GUIDE_PATH = "/resources/k12-compliance-guide";',
    );
  });
});
