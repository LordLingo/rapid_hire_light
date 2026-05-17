/*
  §83 — Tier 3 anti-regression spec.
  -----------------------------------
  Pins:
    - industryCatalog has all 9 verticals (6 existing + 3 new) with required
      fields populated; the 3 new slugs (gig-1099, manufacturing, education)
      are registered in App.tsx routing and the sitemap.
    - glossary has at least 30 entries; key FCRA terms are present;
      /resources/glossary route is wired and listed in sitemap.
    - Resources hub exposes the new "Browse by type" filter strip with
      glossary + benchmarks pills.
*/
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { INDUSTRIES, getIndustryBySlug } from "./industryCatalog";
import { GLOSSARY } from "./glossary";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const file = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

const app = file("client/src/App.tsx");
const sitemap = file("vite.config.ts");
const resourcesPage = file("client/src/pages/Resources.tsx");
const industriesPage = file("client/src/pages/Industries.tsx");

describe("§83 — industry catalog (9 verticals)", () => {
  it("declares all six original verticals + three new ones", () => {
    const slugs = INDUSTRIES.map((i) => i.slug);
    expect(slugs).toEqual([
      "healthcare",
      "transportation",
      "staffing",
      "finance",
      "retail",
      "nonprofit",
      "gig-1099",
      "manufacturing",
      "education",
    ]);
  });

  it("every entry has required long-form copy on the detail page", () => {
    for (const i of INDUSTRIES) {
      expect(i.intro.length).toBeGreaterThan(120);
      expect(i.posture.length).toBeGreaterThan(80);
      expect(i.whenToUse.length).toBeGreaterThan(80);
      expect(i.defaults.length).toBeGreaterThanOrEqual(4);
      expect(i.relatedChecks.length).toBeGreaterThanOrEqual(3);
      expect(i.stats.length).toBe(3);
    }
  });

  it("getIndustryBySlug resolves and returns undefined on miss", () => {
    expect(getIndustryBySlug("healthcare")?.name).toBe("Healthcare");
    expect(getIndustryBySlug("gig-1099")?.name).toBe("Gig & 1099 Platforms");
    expect(getIndustryBySlug("does-not-exist")).toBeUndefined();
  });

  it("App.tsx wires /industries/:slug route via IndustryDetail", () => {
    expect(app).toMatch(/import\s+IndustryDetail\s+from\s+"\.\/pages\/IndustryDetail"/);
    expect(app).toMatch(
      /<Route\s+path=\{"\/industries\/:slug"\}\s+component=\{IndustryDetail\}\s*\/>/,
    );
  });

  it("sitemap includes all 9 industry detail routes", () => {
    for (const i of INDUSTRIES) {
      expect(sitemap).toContain(`"/industries/${i.slug}"`);
    }
  });

  it("Industries hub surfaces the 3 new vertical cards in a 'newer specialties' rail", () => {
    expect(industriesPage).toMatch(/data-testid="industries-new-rail"/);
    for (const slug of ["gig-1099", "manufacturing", "education"]) {
      // The new-rail uses a literal `path:` field interpolated into
      // `/industries/${v.path}`, so the slug appears as a quoted literal.
      expect(industriesPage).toContain(`"${slug}"`);
    }
  });
});

describe("§83 — glossary", () => {
  it("ships at least 30 entries with stable kebab-case ids", () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(30);
    for (const e of GLOSSARY) {
      expect(e.id).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(e.term.length).toBeGreaterThan(0);
      expect(e.definition.length).toBeGreaterThan(40);
    }
  });

  it("includes the canonical FCRA + DOT + healthcare terms", () => {
    const ids = new Set(GLOSSARY.map((e) => e.id));
    for (const expected of [
      "adverse-action",
      "fcra",
      "consumer-report",
      "permissible-purpose",
      "dispute",
      "summary-of-rights",
      "mvr",
      "cdlis",
      "fmcsa-clearinghouse",
      "oig-leie",
      "primary-source",
      "tat",
    ]) {
      expect(ids.has(expected)).toBe(true);
    }
  });

  it("ids are unique across entries", () => {
    const ids = GLOSSARY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("App.tsx wires /resources/glossary and sitemap registers it", () => {
    expect(app).toMatch(/import\s+ResourcesGlossary\s+from\s+"\.\/pages\/ResourcesGlossary"/);
    expect(app).toMatch(/<Route\s+path=\{"\/resources\/glossary"\}\s+component=\{ResourcesGlossary\}\s*\/>/);
    expect(sitemap).toContain('"/resources/glossary"');
  });
});

describe("§83 — Resources hub type-filter strip", () => {
  it("renders the type filter section with a stable testid and the canonical type-pill ids", () => {
    expect(resourcesPage).toMatch(/data-testid="resources-type-filter"/);
    // testid on each pill is a JSX template literal `resources-type-${t.id}`
    expect(resourcesPage).toMatch(/data-testid=\{`resources-type-\$\{t\.id\}`\}/);
    // The RESOURCE_TYPES array literally contains every canonical id.
    for (const id of ["all", "matrix", "papers", "benchmarks", "glossary", "checklist", "updates", "blog"]) {
      expect(resourcesPage).toContain(`id: "${id}"`);
    }
  });

  it("lists glossary + benchmarks as PILLAR cards on the hub", () => {
    expect(resourcesPage).toContain('href: "/resources/glossary"');
    expect(resourcesPage).toContain('href: "/resources/benchmarks"');
  });
});
