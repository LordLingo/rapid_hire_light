/*
  §201 — Resources Case Studies pin spec.

  Locks the contract that the page exists, the registry holds the three
  customer-supplied studies, the route is registered in App.tsx, the
  page is reachable from the Resources hub PILLARS list and from the
  Header Resources dropdown, and the sitemap surfaces the URL.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  CASE_STUDY_RESOURCES,
} from "./caseStudyResources";

const ROOT = resolve(__dirname, "..", "..", "..");
function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

describe("§201 — caseStudyResources registry", () => {
  it("exports exactly three studies in the documented industry order", () => {
    expect(CASE_STUDY_RESOURCES).toHaveLength(3);
    expect(CASE_STUDY_RESOURCES.map((c) => c.slug)).toEqual([
      "high-volume-industrial-staffing",
      "nationwide-last-mile-delivery",
      "enterprise-healthcare-services",
    ]);
  });

  it("each study has all narrative slots, exactly 4 metrics, and a non-empty quote", () => {
    for (const c of CASE_STUDY_RESOURCES) {
      expect(c.industry.length).toBeGreaterThan(5);
      expect(c.headline.length).toBeGreaterThan(20);
      expect(c.problem.length).toBeGreaterThan(120);
      expect(c.whatWasBroken.length).toBeGreaterThan(120);
      expect(c.whySwitched.length).toBeGreaterThan(80);
      expect(c.resultsLede.length).toBeGreaterThan(40);
      expect(c.metrics).toHaveLength(4);
      for (const m of c.metrics) {
        expect(m.metric.length).toBeGreaterThan(3);
        expect(m.legacy.length).toBeGreaterThan(0);
        expect(m.rapid.length).toBeGreaterThan(0);
        expect(m.improvement.length).toBeGreaterThan(0);
      }
      expect(c.quote.length).toBeGreaterThan(40);
      expect(c.quoteAttribution).toMatch(/,/); // role + company
    }
  });

  it("metric values are not duplicated within a study (sanity check)", () => {
    for (const c of CASE_STUDY_RESOURCES) {
      const seen = new Set<string>();
      for (const m of c.metrics) {
        expect(seen.has(m.metric), `duplicate metric: ${m.metric}`).toBe(false);
        seen.add(m.metric);
      }
    }
  });
});

describe("§201 — ResourcesCaseStudies page wiring", () => {
  it("ResourcesCaseStudies.tsx exists and uses the SiteShell + PageHero rhythm", () => {
    const src = read("client/src/pages/ResourcesCaseStudies.tsx");
    expect(src).toMatch(/import SiteShell from "@\/components\/site\/SiteShell"/);
    expect(src).toMatch(/import PageHero from "@\/components\/site\/PageHero"/);
    expect(src).toMatch(/CASE_STUDY_RESOURCES/);
  });

  it("sets canonical SEO at /resources/case-studies", () => {
    const src = read("client/src/pages/ResourcesCaseStudies.tsx");
    expect(src).toContain(
      "https://www.rapidhiresolutions.com/resources/case-studies",
    );
  });

  it("renders one card per study with a stable data-testid", () => {
    const src = read("client/src/pages/ResourcesCaseStudies.tsx");
    expect(src).toMatch(/data-testid=\{?`case-study-/);
  });
});

describe("§201 — Routing + nav surface", () => {
  it("App.tsx imports ResourcesCaseStudies and registers /resources/case-studies", () => {
    const app = read("client/src/App.tsx");
    expect(app).toMatch(/from "\.\/pages\/ResourcesCaseStudies"/);
    expect(app).toMatch(
      /<Route path=\{"\/resources\/case-studies"\} component=\{ResourcesCaseStudies\} \/>/,
    );
  });

  it("Header.tsx Resources dropdown surfaces /resources/case-studies with a description", () => {
    const header = read("client/src/components/site/Header.tsx");
    expect(header).toMatch(/href:\s*"\/resources\/case-studies"/);
    // Description block immediately follows.
    expect(header).toMatch(
      /href:\s*"\/resources\/case-studies",\s*description:/,
    );
  });

  it("Resources.tsx PILLARS hub surfaces the case-studies pillar", () => {
    const hub = read("client/src/pages/Resources.tsx");
    expect(hub).toContain('href: "/resources/case-studies"');
  });

  it("vite.config.ts SITEMAP_PATHS surfaces /resources/case-studies", () => {
    const cfg = read("vite.config.ts");
    expect(cfg).toMatch(
      /path:\s*"\/resources\/case-studies"/,
    );
  });
});
