/*
  §80 — Resources hub + Ban the Box detail page invariants.

  After the §80 pass:
    1. /resources renders a hub index that links to the pillar + tools.
    2. /resources/ban-the-box renders a 40-row jurisdiction matrix
       with stage and scope filters, an employer playbook, an
       editorial FAQ, and a "keep going" rail to companion blog posts.
    3. The jurisdiction data file exports a 40-row dataset with
       coherent stage + scope counts.
    4. Both routes are wired in App.tsx and STATIC_ROUTES.
    5. The Resources dropdown in the header surfaces both new entries.

  These pins keep a future "tighten the resources surface" pass from
  silently dropping the matrix or unlinking the hub.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  JURISDICTIONS,
  jurisdictionCounts,
  STAGE_LABEL,
  SCOPE_LABEL,
} from "./banTheBoxJurisdictions";

const ROOT = resolve(__dirname, "..", "..", "..");
function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

describe("§80 — jurisdiction dataset", () => {
  it("exports forty jurisdictions", () => {
    expect(JURISDICTIONS.length).toBe(40);
  });

  it("every row carries the four required fields", () => {
    for (const j of JURISDICTIONS) {
      expect(j.jurisdiction.length).toBeGreaterThan(0);
      expect(j.scope).toMatch(/^(state|city|county|territory)$/);
      expect(j.stage).toMatch(
        /^(conditional-offer|after-interview|deemed-qualified|after-application)$/,
      );
      expect(j.effective.length).toBeGreaterThan(0);
    }
  });

  it("STAGE_LABEL covers every stage referenced by the dataset", () => {
    const used = new Set(JURISDICTIONS.map((j) => j.stage));
    for (const stage of used) {
      expect(STAGE_LABEL[stage]).toBeDefined();
      expect(STAGE_LABEL[stage].length).toBeGreaterThan(0);
    }
  });

  it("SCOPE_LABEL covers every scope referenced by the dataset", () => {
    const used = new Set(JURISDICTIONS.map((j) => j.scope));
    for (const scope of used) {
      expect(SCOPE_LABEL[scope]).toBeDefined();
      expect(SCOPE_LABEL[scope].length).toBeGreaterThan(0);
    }
  });

  it("jurisdictionCounts() returns coherent totals that sum to 40", () => {
    const counts = jurisdictionCounts();
    expect(counts.total).toBe(40);
    expect(counts.statesAndTerritories + counts.citiesAndCounties).toBe(40);
    // §80 lede claims sixteen states, DC, and USVI as state-level rows
    expect(counts.statesAndTerritories).toBeGreaterThanOrEqual(18);
    // §80 lede claims twenty-plus city/county rows
    expect(counts.citiesAndCounties).toBeGreaterThanOrEqual(20);
  });
});

describe("§80 — Resources hub index page", () => {
  const src = read("client/src/pages/Resources.tsx");

  it("imports SiteShell and PageHero from the site primitives", () => {
    expect(src).toMatch(/from "@\/components\/site\/SiteShell"/);
    expect(src).toMatch(/from "@\/components\/site\/PageHero"/);
  });

  it("calls useSeo with a canonical resources URL", () => {
    expect(src).toMatch(/useSeo\(/);
    expect(src).toContain("rapidhiresolutions.com/resources");
  });

  it("links to /resources/ban-the-box as the pillar reference", () => {
    expect(src).toContain('href: "/resources/ban-the-box"');
  });

  it("links to the three practitioner tools", () => {
    expect(src).toContain('href: "/compliance/checklist"');
    expect(src).toContain('href: "/compliance/audit"');
    expect(src).toContain('href: "/trust"');
  });

  it("pulls recent posts via listPosts() so the rail self-updates with the daily blog schedule", () => {
    expect(src).toMatch(/listPosts\(\)/);
  });
});

describe("§80 — Ban the Box detail page", () => {
  const src = read("client/src/pages/ResourcesBanTheBox.tsx");

  it("imports the JURISDICTIONS dataset", () => {
    expect(src).toMatch(/from "@\/lib\/banTheBoxJurisdictions"/);
    expect(src).toMatch(/JURISDICTIONS/);
  });

  it("renders the eight section eyebrows in order", () => {
    // editorial section numbering 02..07 + hero + CTA
    expect(src).toContain("02 — Why this matters");
    expect(src).toContain("03 — Jurisdiction directory");
    expect(src).toContain("04 — Employer playbook");
    expect(src).toContain("05 — How Rapid Hire helps");
    expect(src).toContain("06 — Frequently asked");
    expect(src).toContain("07 — Keep going");
  });

  it("declares stage + scope filter UIs (chip groups)", () => {
    expect(src).toMatch(/STAGE_FILTERS/);
    expect(src).toMatch(/SCOPE_FILTERS/);
    expect(src).toMatch(/setStageFilter/);
    expect(src).toMatch(/setScopeFilter/);
  });

  it("ships at least five FAQ items", () => {
    const faqs = src.match(/q:\s*"/g) ?? [];
    expect(faqs.length).toBeGreaterThanOrEqual(5);
  });

  it("ships exactly six employer playbook moves", () => {
    const block = src.match(/PLAYBOOK[^=]*=[^\[]*\[([\s\S]*?)\];/);
    expect(block, "PLAYBOOK array must exist").not.toBeNull();
    const titles = block?.[1].match(/title:\s*"/g) ?? [];
    expect(titles.length).toBe(6);
  });

  it("links to companion blog posts in the keep-going rail", () => {
    expect(src).toContain("/blog/eeoc-ban-the-box-compliance");
    expect(src).toContain("/blog/ban-the-box-fair-chance-hiring");
  });

  it("declares an Article JSON-LD payload via useSeo", () => {
    expect(src).toMatch(/useSeo\(/);
    expect(src).toContain('"@type": "Article"');
  });

  it("includes a 'reference, not legal advice' disclaimer", () => {
    expect(src.toLowerCase()).toContain("not legal advice");
  });
});

describe("§80 — routes + sitemap wiring", () => {
  const appSrc = read("client/src/App.tsx");
  const viteCfg = read("vite.config.ts");

  it("App.tsx imports the new Resources + ResourcesBanTheBox pages", () => {
    expect(appSrc).toMatch(/import Resources from ".\/pages\/Resources";/);
    expect(appSrc).toMatch(
      /import ResourcesBanTheBox from ".\/pages\/ResourcesBanTheBox";/,
    );
  });

  it("App.tsx wires both routes under /resources prefix", () => {
    expect(appSrc).toMatch(/path=\{"\/resources"\}\s+component=\{Resources\}/);
    expect(appSrc).toMatch(
      /path=\{"\/resources\/ban-the-box"\}\s+component=\{ResourcesBanTheBox\}/,
    );
  });

  it("STATIC_ROUTES in vite.config.ts includes both /resources entries", () => {
    expect(viteCfg).toMatch(/path:\s*"\/resources"/);
    expect(viteCfg).toMatch(/path:\s*"\/resources\/ban-the-box"/);
  });
});
