/*
  §83 — Service catalog anti-regression spec
  -------------------------------------------
  Pins the shape and inventory of /services/<slug> detail pages so the
  hub, footer, sitemap, and blog cross-links cannot drift apart silently.

  Pinned invariants:
   - Exactly 9 published services in the catalog.
   - Every required slug exists (the footer + sitemap reference these
     literal slugs; renaming requires a deliberate, multi-file change).
   - Each entry has the long-form fields a detail page renders:
     hero, includes (>=4), catches (>=3), doesNotCatch (>=2),
     compliance (>=2), industries (>=2), faqs (>=1).
   - relatedServiceSlugs and relatedBlogSlugs (when present) resolve to
     real entries; otherwise the detail page would render dead links.
   - Slugs are unique and lower-kebab-case.
*/

import { describe, it, expect } from "vitest";
import {
  SERVICE_CATALOG,
  findServiceBySlug,
} from "@/lib/serviceCatalog";
import { getPostBySlug } from "@/lib/blog";

const REQUIRED_SLUGS = [
  "criminal-records",
  "employment-verification",
  "education-verification",
  "drug-screening",
  "motor-vehicle-records",
  "social-media-screening",
  "identity-verification",
  "healthcare-sanctions",
  "continuous-monitoring",
] as const;

describe("§83 service catalog", () => {
  it("publishes exactly 9 services", () => {
    expect(SERVICE_CATALOG).toHaveLength(9);
  });

  it("contains every required slug", () => {
    for (const slug of REQUIRED_SLUGS) {
      expect(findServiceBySlug(slug), `missing slug: ${slug}`).toBeDefined();
    }
  });

  it("uses unique lower-kebab-case slugs", () => {
    const slugs = SERVICE_CATALOG.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) {
      expect(s).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/);
    }
  });

  it("populates the long-form detail-page fields on every service", () => {
    for (const s of SERVICE_CATALOG) {
      expect(s.hero.length, `${s.slug} hero too short`).toBeGreaterThan(120);
      expect(s.includes.length, `${s.slug} includes`).toBeGreaterThanOrEqual(4);
      expect(s.catches.length, `${s.slug} catches`).toBeGreaterThanOrEqual(3);
      expect(s.doesNotCatch.length, `${s.slug} doesNotCatch`).toBeGreaterThanOrEqual(2);
      expect(s.compliance.length, `${s.slug} compliance`).toBeGreaterThanOrEqual(2);
      expect(s.industries.length, `${s.slug} industries`).toBeGreaterThanOrEqual(2);
      expect(s.faqs.length, `${s.slug} faqs`).toBeGreaterThanOrEqual(1);
    }
  });

  it("resolves all relatedServiceSlugs to real catalog entries", () => {
    for (const s of SERVICE_CATALOG) {
      for (const ref of s.relatedServiceSlugs) {
        expect(
          findServiceBySlug(ref),
          `${s.slug} cross-links to missing service: ${ref}`,
        ).toBeDefined();
      }
    }
  });

  it("resolves all relatedBlogSlugs to real published posts", () => {
    for (const s of SERVICE_CATALOG) {
      for (const ref of s.relatedBlogSlugs) {
        expect(
          getPostBySlug(ref),
          `${s.slug} cross-links to missing blog post: ${ref}`,
        ).toBeDefined();
      }
    }
  });
});
