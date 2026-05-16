/*
  §83 — Case studies anti-regression spec
  ----------------------------------------
  Pins the inventory and shape of the customer-stories registry so the
  /customers index, the per-study detail pages, the footer link, and
  the sitemap stay consistent.
*/
import { describe, it, expect } from "vitest";
import { CASE_STUDIES, findCaseStudyBySlug } from "@/lib/caseStudies";
import { findServiceBySlug } from "@/lib/serviceCatalog";

const REQUIRED_SLUGS = [
  "frito-lay-fleet-mvr",
  "hr-block-tax-season-scaling",
  "taylormade-rd-credentials",
] as const;

describe("§83 case studies", () => {
  it("publishes the three first-batch stories", () => {
    expect(CASE_STUDIES.length).toBeGreaterThanOrEqual(3);
    for (const slug of REQUIRED_SLUGS) {
      expect(findCaseStudyBySlug(slug), `missing: ${slug}`).toBeDefined();
    }
  });

  it("each study has 3 stat tiles, a quote, a timeline, and >=2 services deployed", () => {
    for (const c of CASE_STUDIES) {
      expect(c.stats, `${c.slug} stats`).toHaveLength(3);
      expect(c.quote.text.length).toBeGreaterThan(40);
      expect(c.timeline.length).toBeGreaterThanOrEqual(2);
      expect(c.servicesDeployed.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("every servicesDeployed slug resolves to a real catalog entry", () => {
    for (const c of CASE_STUDIES) {
      for (const svc of c.servicesDeployed) {
        expect(
          findServiceBySlug(svc),
          `${c.slug} references missing service: ${svc}`,
        ).toBeDefined();
      }
    }
  });
});
