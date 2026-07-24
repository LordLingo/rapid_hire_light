import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  EMPLOYER_LANDING_PAGE_KEYS,
  EMPLOYER_SCREENING_LANDING_PAGES,
  REQUIRED_TIMING_QUALIFICATION,
} from "@/content/employerScreeningLandingPages";

const ROOT = process.cwd();
const APP_SOURCE = fs.readFileSync(
  path.join(ROOT, "client/src/App.tsx"),
  "utf8",
);
const SCOPED_IMPLEMENTATION_FILES = [
  "client/src/App.tsx",
  "client/src/pages/EmployerScreeningLanding.tsx",
  "client/src/components/lp/EmployerScreeningLandingLayout.tsx",
  "client/src/components/lp/EmployerLeadForm.tsx",
  "client/src/content/employerScreeningLandingPages.ts",
  "client/src/lib/employerLandingForms.ts",
  "client/src/lib/employerLandingPages.test.ts",
  "client/src/lib/employerLandingForms.test.ts",
] as const;

const EXPECTED = {
  staffing: {
    route: "/lp/staffing-background-checks",
    h1: "Background Checks for Staffing & Recruiting Firms",
    subhead:
      "Move candidates to placement with flexible employer screening, transparent per-check pricing, and U.S.-based support.",
    cta: "Get Staffing Pricing",
    sections: [
      "placement-bottleneck",
      "role-packages",
      "workflow-integrations",
      "turnaround",
      "pricing",
      "sample",
      "compliance-workflow",
    ],
  },
  healthcare: {
    route: "/lp/healthcare-employee-screening",
    h1: "Healthcare Employee Background Screening",
    subhead:
      "Build role-specific screening for hospitals, clinics, home health, and care teams with a package matched to your hiring workflow.",
    cta: "Build a Healthcare Package",
    sections: [
      "employer-types",
      "service-matrix",
      "role-packages",
      "exclusion-license-workflow",
      "turnaround",
      "pricing",
      "trust-compliance",
      "sample",
    ],
  },
  criminal: {
    route: "/lp/employer-criminal-background-checks",
    h1: "Criminal Background Checks for Employers",
    subhead:
      "Order federal, state, and county criminal searches through an employer-focused workflow with transparent per-check pricing.",
    cta: "Get Employer Pricing",
    sections: [
      "search-coverage",
      "database-only",
      "package-pricing",
      "ordering-workflow",
      "sample",
      "fcra-workflow",
      "turnaround",
    ],
  },
  preEmployment: {
    route: "/lp/pre-employment-screening",
    h1: "Pre-Employment Screening & Employment Verification",
    subhead:
      "Screen new hires and verify work history with flexible employer packages and transparent per-check pricing.",
    cta: "Build Your Screening Package",
    sections: [
      "screening-verification-selector",
      "verified-fields",
      "package-builder",
      "candidate-workflow",
      "turnaround",
      "pricing",
      "integrations",
      "sample",
    ],
  },
} as const;

describe("employer screening landing-page configuration", () => {
  it("defines only the four approved route configurations", () => {
    expect(EMPLOYER_LANDING_PAGE_KEYS).toEqual([
      "staffing",
      "healthcare",
      "criminal",
      "preEmployment",
    ]);
    expect(Object.keys(EMPLOYER_SCREENING_LANDING_PAGES)).toEqual(
      EMPLOYER_LANDING_PAGE_KEYS,
    );
  });

  for (const key of EMPLOYER_LANDING_PAGE_KEYS) {
    it(`${key} pins its route, hero, CTA, section order, and timing qualification`, () => {
      const page = EMPLOYER_SCREENING_LANDING_PAGES[key];
      const expected = EXPECTED[key];
      expect(page.route).toBe(expected.route);
      expect(page.h1).toBe(expected.h1);
      expect(page.subhead).toBe(expected.subhead);
      expect(page.cta).toBe(expected.cta);
      expect(page.sections.map((section) => section.id)).toEqual(
        expected.sections,
      );
      expect(`${page.caveat} ${page.sections.map((section) => section.body ?? "").join(" ")}`)
        .toContain(REQUIRED_TIMING_QUALIFICATION);
      expect(page.seo.canonical).toBe(
        `https://www.rapidhiresolutions.com${page.route}`,
      );
      expect(page.seo.image).toBe(
        "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
      );
      const sample = page.sections.find(
        (section) => section.kind === "sample",
      );
      expect(sample?.heading).toBe("Request a Redacted Sample");
      expect(sample?.cta).toEqual({
        label: "Request a Redacted Sample",
        href: "#lead-form",
      });
    });
  }

  it("registers every approved route before the final fallback", () => {
    const fallbackIndex = APP_SOURCE.indexOf(
      "<Route component={NotFound} />",
    );
    expect(fallbackIndex).toBeGreaterThan(0);
    for (const page of Object.values(EMPLOYER_SCREENING_LANDING_PAGES)) {
      const routeIndex = APP_SOURCE.indexOf(`path={"${page.route}"}`);
      expect(routeIndex, page.route).toBeGreaterThan(0);
      expect(routeIndex, page.route).toBeLessThan(fallbackIndex);
    }
  });

  it("contains no excluded commercial or credential wording", () => {
    const copy = JSON.stringify(EMPLOYER_SCREENING_LANDING_PAGES);
    for (const excluded of [
      "$24.95",
      "85%",
      "pay-per-report",
      "no contracts",
      "without a long-term contract",
      "PBSA Accredited",
      "FCRA Certified",
      "FCRA-accredited",
      "SOC 2 compliant",
      "HIPAA",
    ]) {
      expect(copy).not.toContain(excluded);
    }
    expect(copy).not.toContain("/sample-report");
    expect(copy).not.toContain("samplereport.webp");
  });

  it("uses only registered internal links", () => {
    const allowed = new Set([
      "#lead-form",
      "/integrations",
      "/candidates",
      "/compliance",
      "/services/healthcare-sanctions",
      "/trust",
      "/industries/healthcare",
      "/services/criminal-records",
      "/services/employment-verification",
    ]);
    for (const page of Object.values(EMPLOYER_SCREENING_LANDING_PAGES)) {
      for (const section of page.sections) {
        for (const link of section.links ?? []) {
          expect(allowed.has(link.href), link.href).toBe(true);
        }
        if (section.cta) {
          expect(allowed.has(section.cta.href), section.cta.href).toBe(true);
        }
      }
    }
  });

  it("names only integrations marked Live in the canonical registry", () => {
    const registry = JSON.parse(
      fs.readFileSync(path.join(ROOT, "shared/integrations.json"), "utf8"),
    ) as { items: Array<{ name: string; status: string }> };
    const liveNames = new Set(
      registry.items
        .filter((item) => item.status === "Live")
        .map((item) => item.name),
    );
    for (const name of [
      "CATS",
      "Erecruit",
      "iCIMS",
      "Greenhouse",
      "JazzHR",
      "Jobvite",
      "Lever",
      "Workable",
      "Workday",
    ]) {
      expect(liveNames.has(name), name).toBe(true);
    }
  });

  it("keeps the exact eight-path implementation free of a disallowed route prefix", () => {
    const disallowedPrefix = ["/google", "-ads/"].join("");
    for (const relativePath of SCOPED_IMPLEMENTATION_FILES) {
      const source = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
      expect(source, relativePath).not.toContain(disallowedPrefix);
    }
  });
});
