import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import {
  INDUSTRY_COMPANY_PAGES,
  INDUSTRY_COMPANY_SLUGS,
  buildIndustryCompanyStructuredData,
} from "@/content/industryCompanyPages";
import { FORMSPREE_ENDPOINT, FORMSPREE_FORM_ID } from "./formspree";
import {
  buildEmployerLandingHubspotBody,
  buildEmployerLandingPayload,
  type EmployerLandingFormValues,
} from "./employerLandingForms";
import { INDUSTRIES } from "./industryCatalog";
import { LEAD_FORM_IDS, LEAD_FORM_PAGE_PATHS } from "./leadAnalytics";
import { findServiceBySlug } from "./serviceCatalog";
import {
  reconcileSeoJsonLd,
  SEO_JSON_LD_KEY_ATTRIBUTE,
} from "@/hooks/useSeo";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const read = (relativePath: string) =>
  readFileSync(join(ROOT, relativePath), "utf8");

const APP = read("client/src/App.tsx");
const DETAIL = read("client/src/pages/IndustryDetail.tsx");
const HUB = read("client/src/pages/Industries.tsx");
const PAGE = read(
  "client/src/components/industries/IndustryCompanyPage.tsx",
);
const FORM = read("client/src/components/lp/EmployerLeadForm.tsx");
const CSS = read(
  "client/src/components/industries/industry-company-page.css",
);
const PRERENDER = read("scripts/prerender_top_posts.mjs");
const SITEMAP = read("vite.config.ts");

const FORM_VALUES: EmployerLandingFormValues = {
  name: "Test Employer",
  email: "employer@example.com",
  phone: "555-0100",
  company: "Example Operations",
  volume: "26–100 employees or hires",
  services: "County criminal searches, Motor Vehicle Records (MVR)",
  details: {},
};

type FakeJsonLdScript = {
  type: string;
  text: string;
  dataset: Record<string, string>;
  parentNode: FakeJsonLdHead | null;
  getAttribute: (name: string) => string | null;
  setAttribute: (name: string, value: string) => void;
};

type FakeJsonLdHead = {
  scripts: FakeJsonLdScript[];
  querySelectorAll: (selector: string) => FakeJsonLdScript[];
  appendChild: (script: FakeJsonLdScript) => FakeJsonLdScript;
  removeChild: (script: FakeJsonLdScript) => FakeJsonLdScript;
};

function fakeJsonLdScript(
  key?: string,
  text = "",
): FakeJsonLdScript {
  const attributes = new Map<string, string>();
  if (key) attributes.set(SEO_JSON_LD_KEY_ATTRIBUTE, key);
  return {
    type: "application/ld+json",
    text,
    dataset: {},
    parentNode: null,
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => {
      attributes.set(name, value);
    },
  };
}

function fakeJsonLdDocument(initialScripts: FakeJsonLdScript[]) {
  const head: FakeJsonLdHead = {
    scripts: [...initialScripts],
    querySelectorAll: vi.fn(() => head.scripts),
    appendChild: vi.fn((script: FakeJsonLdScript) => {
      if (!head.scripts.includes(script)) head.scripts.push(script);
      script.parentNode = head;
      return script;
    }),
    removeChild: vi.fn((script: FakeJsonLdScript) => {
      head.scripts = head.scripts.filter((candidate) => candidate !== script);
      script.parentNode = null;
      return script;
    }),
  };
  for (const script of head.scripts) script.parentNode = head;
  const createElement = vi.fn(() => fakeJsonLdScript());
  const doc = {
    head,
    createElement,
  } as unknown as Document;
  return { doc, head, createElement };
}

describe("cleaning and moving industry routes", () => {
  it("keeps the existing dynamic router and dispatches both rich slugs", () => {
    expect(APP).toContain('path={"/industries/:slug"}');
    expect(DETAIL).toContain("getIndustryCompanyPage(slug)");
    expect(DETAIL).toContain("<IndustryCompanyPage config={companyPage}");

    for (const slug of INDUSTRY_COMPANY_SLUGS) {
      expect(INDUSTRIES.some((industry) => industry.slug === slug)).toBe(
        true,
      );
      expect(HUB).toContain(`path: "${slug}"`);
      expect(SITEMAP).toContain(`"/industries/${slug}"`);
      expect(PRERENDER).toContain(`route: "/industries/${slug}"`);
    }
  });

  it("pins the approved hero and route-specific metadata", () => {
    const cleaning = INDUSTRY_COMPANY_PAGES["cleaning-companies"];
    const moving = INDUSTRY_COMPANY_PAGES["moving-companies"];

    expect(cleaning.h1).toBe(
      "Hire Cleaning Staff You Can Confidently Send Into a Customer’s Home.",
    );
    expect(cleaning.seo).toMatchObject({
      title:
        "Background Checks for Cleaning Companies | Rapid Hire Solutions",
      description:
        "Build a faster, role-specific employee screening program for residential and commercial cleaning teams, including criminal checks, MVRs, employment verification and more.",
      canonical:
        "https://www.rapidhiresolutions.com/industries/cleaning-companies",
    });

    expect(moving.h1).toBe(
      "Screen the People Customers Trust With Everything They Own.",
    );
    expect(moving.seo).toMatchObject({
      title:
        "Background Checks for Moving Companies | Rapid Hire Solutions",
      description:
        "Screen movers, drivers, crew leaders and storage staff with role-specific background checks built for residential and commercial moving companies.",
      canonical:
        "https://www.rapidhiresolutions.com/industries/moving-companies",
    });
  });

  it("renders the detailed industry-specific sections, role matrix, and FAQs", () => {
    for (const heading of [
      "Your employees are being trusted with more than a mop and a vacuum.",
      "Screening problems that slow down growing cleaning companies.",
      "Screening packages built around the work your team actually performs.",
      "Build the package around the role—not around a generic checklist.",
      "Residential cleaning",
      "Commercial cleaning",
      "A cleaning contract can start quickly. Your screening process should be ready.",
      "Different moving-company roles carry different responsibilities.",
      "When driving is part of the job, the screening package should reflect it.",
      "Customers are handing your crew access to their home and possessions.",
      "Peak moving season should not turn screening into the bottleneck.",
    ]) {
      expect(PAGE).toContain(heading);
    }

    expect(PAGE).toContain('data-testid="moving-role-matrix"');
    expect(PAGE).toContain("CDL / Regulated Driver");
    expect(PAGE).toContain("Regulated roles only");
    expect(INDUSTRY_COMPANY_PAGES["cleaning-companies"].faq).toHaveLength(7);
    expect(INDUSTRY_COMPANY_PAGES["moving-companies"].faq).toHaveLength(8);
  });

  it("renders every approved moving-company audience in the visible role section", () => {
    expect(PAGE).toContain('data-testid="moving-company-audiences"');
    expect(PAGE).toContain("MOVING_AUDIENCES.map");

    const audienceStart = PAGE.indexOf("const MOVING_AUDIENCES");
    const audienceEnd = PAGE.indexOf("] as const;", audienceStart);
    const audienceConfig = PAGE.slice(audienceStart, audienceEnd);

    for (const audience of [
      "Residential movers",
      "household-goods movers",
      "local moving companies",
      "Interstate moving companies",
      "interstate movers",
      "Storage and moving companies",
      "furniture/appliance delivery crews",
      "white-glove delivery businesses",
      "door-to-door moving companies",
      "last-mile household delivery operations",
    ]) {
      expect(audienceConfig).toContain(audience);
    }
  });

  it("uses only real service routes for contextual service links", () => {
    const servicePaths = [
      "/services/identity-verification",
      "/services/criminal-records",
      "/services/employment-verification",
      "/services/motor-vehicle-records",
      "/services/drug-screening",
      "/services/continuous-monitoring",
    ];
    for (const path of servicePaths) {
      expect(findServiceBySlug(path.replace("/services/", ""))).toBeDefined();
      expect(PAGE).toContain(`href: "${path}"`);
    }
    expect(PAGE).toContain('href="/industries/transportation"');
    expect(PAGE).toContain('href="/compliance"');
    expect(PAGE).toContain(
      'href="/resources/background-checks-by-state"',
    );
  });
});

describe("industry lead forms", () => {
  it("keeps the established Formspree endpoint and submits once", () => {
    expect(FORMSPREE_FORM_ID).toBe("mvzyoyoz");
    expect(FORMSPREE_ENDPOINT).toBe("https://formspree.io/f/mvzyoyoz");
    expect(FORM.match(/fetch\(FORMSPREE_ENDPOINT/g) ?? []).toHaveLength(1);
    expect(FORM).toContain("...attribution.fields");
    expect(FORM).toContain("if (!response.ok)");
    expect(FORM.indexOf("pushLeadSubmitSuccess(")).toBeGreaterThan(
      FORM.indexOf("if (!response.ok)"),
    );
  });

  it("maps each industry and its visible details into the same payload", () => {
    for (const slug of INDUSTRY_COMPANY_SLUGS) {
      const page = INDUSTRY_COMPANY_PAGES[slug];
      const values: EmployerLandingFormValues = {
        ...FORM_VALUES,
        details: Object.fromEntries(
          page.formConfig.form.details.map((field) => [
            field.id,
            field.id.includes("locations")
              ? "Dallas and Austin"
              : field.id.includes("roles")
                ? "Field technicians and drivers"
                : "Please tailor the package.",
          ]),
        ),
      };
      const payload = buildEmployerLandingPayload(
        page.formConfig,
        values,
        { utm_source: "google", gclid: "test-click-id" },
      );

      expect(payload.industry).toBe(
        slug === "cleaning-companies"
          ? "cleaning_companies"
          : "moving_companies",
      );
      expect(payload.source).toBe(`/industries/${slug}`);
      expect(payload.services).toBe(values.services);
      expect(payload.utm_source).toBe("google");
      expect(payload.gclid).toBe("test-click-id");
      expect(payload.message).toContain("Locations / branches: Dallas and Austin");
      expect(payload.message).toContain(
        "Primary roles being screened: Field technicians and drivers",
      );
    }
  });

  it("sends one clean Rapid Hire Solutions suffix in each HubSpot page name", () => {
    for (const slug of INDUSTRY_COMPANY_SLUGS) {
      const page = INDUSTRY_COMPANY_PAGES[slug];
      const body = buildEmployerLandingHubspotBody(
        page.formConfig,
        FORM_VALUES,
        {},
        page.seo.canonical,
      );
      const pageName = body.context.pageName;

      expect(pageName).toBe(page.seo.title);
      expect(pageName.match(/Rapid Hire Solutions/g) ?? []).toHaveLength(1);
    }
  });

  it("uses unique GTM IDs and keeps the privacy-safe success implementation", () => {
    expect(LEAD_FORM_IDS.cleaningCompanies).toBe("cleaning_companies");
    expect(LEAD_FORM_IDS.movingCompanies).toBe("moving_companies");
    expect(LEAD_FORM_IDS.cleaningCompanies).not.toBe(
      LEAD_FORM_IDS.movingCompanies,
    );
    expect(LEAD_FORM_PAGE_PATHS.cleaning_companies).toBe(
      "/industries/cleaning-companies",
    );
    expect(LEAD_FORM_PAGE_PATHS.moving_companies).toBe(
      "/industries/moving-companies",
    );
    expect(PAGE).toContain('anchorId="industry-lead-form"');
    expect(PAGE).toContain("formId={formId}");
  });
});

describe("industry SEO, artwork, motion, and accessibility contracts", () => {
  it("derives FAQ schema from the same visible FAQ arrays", () => {
    for (const slug of INDUSTRY_COMPANY_SLUGS) {
      const page = INDUSTRY_COMPANY_PAGES[slug];
      const structured = buildIndustryCompanyStructuredData(page);
      expect(structured.map((item) => item["@type"])).toEqual([
        "BreadcrumbList",
        "Service",
        "FAQPage",
      ]);
      const faq = structured[2] as { mainEntity: unknown[] };
      expect(faq.mainEntity).toHaveLength(page.faq.length);
    }
  });

  it("reuses each matching prerendered route schema during hydration", () => {
    expect(DETAIL).toContain(
      'jsonLdKey: `industry-company-${companyPage.slug}`',
    );
    expect(PRERENDER).toContain(
      'jsonLdKey: `industry-company-${page.slug}`',
    );

    for (const slug of INDUSTRY_COMPANY_SLUGS) {
      const page = INDUSTRY_COMPANY_PAGES[slug];
      const key = `industry-company-${slug}`;
      const prerendered = fakeJsonLdScript(key, '{"stale":true}');
      const unrelated = fakeJsonLdScript(
        "unrelated-route-schema",
        '{"keep":true}',
      );
      const { doc, head, createElement } = fakeJsonLdDocument([
        prerendered,
        unrelated,
      ]);

      const reconciled = reconcileSeoJsonLd(
        doc,
        buildIndustryCompanyStructuredData(page),
        key,
      );

      expect(reconciled).toBe(prerendered);
      expect(createElement).not.toHaveBeenCalled();
      expect(head.appendChild).not.toHaveBeenCalled();
      expect(
        head.scripts.filter(
          (script) =>
            script.getAttribute(SEO_JSON_LD_KEY_ATTRIBUTE) === key,
        ),
      ).toHaveLength(1);
      expect(prerendered.text).toBe(
        JSON.stringify(buildIndustryCompanyStructuredData(page)),
      );
      expect(unrelated.text).toBe('{"keep":true}');
    }
  });

  it("ships local responsive SVGs and reduced-motion behavior", () => {
    for (const slug of INDUSTRY_COMPANY_SLUGS) {
      const page = INDUSTRY_COMPANY_PAGES[slug];
      expect(page.illustration.src).toBe(
        `/static/industries/${slug}.svg`,
      );
      expect(page.illustration.alt.length).toBeGreaterThan(60);
      expect(
        read(`client/public/static/industries/${slug}.svg`),
      ).toContain("<svg");
    }
    expect(CSS).toContain("translate3d(0, 16px, 0)");
    expect(CSS).toContain("prefers-reduced-motion: reduce");
    expect(PAGE.match(/<h1/g) ?? []).toHaveLength(1);
    expect(PAGE).toContain('aria-label="Moving company role-based screening matrix"');
    expect(PAGE).toContain('aria-label="Breadcrumb"');
  });
});
