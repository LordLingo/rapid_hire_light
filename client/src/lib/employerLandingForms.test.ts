import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  EMPLOYER_LANDING_CONSENT,
  EMPLOYER_SCREENING_LANDING_PAGES,
} from "@/content/employerScreeningLandingPages";
import {
  buildEmployerLandingHubspotBody,
  buildEmployerLandingMessage,
  buildEmployerLandingPayload,
  EMPLOYER_LANDING_LEAD_SOURCE,
  type EmployerLandingFormValues,
} from "@/lib/employerLandingForms";
import {
  STAFFING_LP_TRACKING_KEY,
  TRACKING_PARAM_KEYS,
  type TrackingParams,
} from "@/lib/staffingLp";

const ROOT = process.cwd();
const FORM_SOURCE = fs.readFileSync(
  path.join(ROOT, "client/src/components/lp/EmployerLeadForm.tsx"),
  "utf8",
);

function values(
  overrides: Partial<EmployerLandingFormValues> = {},
): EmployerLandingFormValues {
  return {
    name: "Morgan Rivera",
    email: "morgan@example.com",
    phone: "555-0100",
    company: "Example Employer",
    volume: "26–100 checks / month",
    services: "",
    details: {},
    ...overrides,
  };
}

const tracking: TrackingParams = {
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "employer-screening",
  utm_content: "variant-a",
  utm_term: "background checks",
  gclid: "GCLID-123",
};

describe("employer landing form payloads", () => {
  it("pins the existing lead source, consent, and attribution contract", () => {
    expect(EMPLOYER_LANDING_LEAD_SOURCE).toBe("Get Started Form");
    expect(EMPLOYER_LANDING_CONSENT).toBe(
      "By submitting, you agree to be contacted about Rapid Hire Solutions services. We never share your details. No sales auto-sequences — one real specialist emails you back.",
    );
    expect(STAFFING_LP_TRACKING_KEY).toBe("rh:lp:staffing:tracking");
    expect(TRACKING_PARAM_KEYS).toEqual([
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "gbraid",
      "wbraid",
      "fbclid",
      "msclkid",
    ]);
  });

  it("maps the staffing provider answer into the established message field", () => {
    const config = EMPLOYER_SCREENING_LANDING_PAGES.staffing;
    const input = values({
      details: {
        "staffing-ats-provider": "Greenhouse",
      },
    });
    const payload = buildEmployerLandingPayload(config, input, tracking);
    expect(payload).toMatchObject({
      name: "Morgan Rivera",
      email: "morgan@example.com",
      phone: "555-0100",
      company: "Example Employer",
      volume: "26–100 checks / month",
      industry: "Staffing & Light Industrial",
      source: "/lp/staffing-background-checks",
      lead_source: "Get Started Form",
      _subject: "Landing page lead — /lp/staffing-background-checks",
      utm_source: "google",
      gclid: "GCLID-123",
    });
    expect(payload.message).toContain(
      "Current ATS or screening provider: Greenhouse",
    );
    expect(payload.message).toContain('"utm_campaign":"employer-screening"');
  });

  it("maps healthcare facility and services without creating CRM properties", () => {
    const config = EMPLOYER_SCREENING_LANDING_PAGES.healthcare;
    const input = values({
      company: "Example Health",
      services: "OIG LEIE, Professional license verification",
      details: {
        "healthcare-facility-type": "Hospital or health system",
      },
    });
    const payload = buildEmployerLandingPayload(config, input, {});
    expect(payload.industry).toBe("Healthcare");
    expect(payload.services).toBe(
      "OIG LEIE, Professional license verification",
    );
    expect(payload.message).toBe(
      "Facility type: Hospital or health system",
    );
    expect(payload).not.toHaveProperty("facility_type");
  });

  it("keeps the healthcare service options in an accessible multi-select", () => {
    expect(
      EMPLOYER_SCREENING_LANDING_PAGES.healthcare.form.services?.options,
    ).toEqual([
      "Criminal checks",
      "OIG LEIE",
      "SAM",
      "State Medicaid exclusions",
      "Professional license verification",
      "Drug testing",
      "Employment verification",
      "Education verification",
      "Continuous monitoring",
    ]);
    expect(FORM_SOURCE).toContain("function ServicesMultiSelect");
    expect(FORM_SOURCE).toContain("Select services...");
    expect(FORM_SOURCE).toContain('role="listbox"');
    expect(FORM_SOURCE).toContain('aria-multiselectable="true"');
    expect(FORM_SOURCE).toContain('event.key === "Escape"');
    expect(FORM_SOURCE).toContain(
      'document.addEventListener("pointerdown", onPointerDown)',
    );
    expect(FORM_SOURCE).toContain('name="services"');
    expect(FORM_SOURCE).not.toContain('name="services-checkbox"');
  });

  it("preserves both criminal-page detail answers in message", () => {
    const config = EMPLOYER_SCREENING_LANDING_PAGES.criminal;
    const input = values({
      details: {
        "criminal-jurisdictions-roles":
          "Texas counties; warehouse and finance roles",
        "criminal-current-provider": "Current Provider",
      },
    });
    const message = buildEmployerLandingMessage(config, input, {});
    expect(message).toBe(
      "Jurisdictions or roles: Texas counties; warehouse and finance roles\nCurrent screening provider: Current Provider",
    );
  });

  it("maps the pre-employment need into services and ATS/provider into message", () => {
    const config = EMPLOYER_SCREENING_LANDING_PAGES.preEmployment;
    const input = values({
      services: "Both",
      details: {
        "pre-employment-ats-provider": "iCIMS",
      },
    });
    const payload = buildEmployerLandingPayload(config, input, {});
    expect(payload.services).toBe("Both");
    expect(payload.message).toBe(
      "Current ATS or screening provider: iCIMS",
    );
  });

  it("sends only established Formspree payload properties", () => {
    const payload = buildEmployerLandingPayload(
      EMPLOYER_SCREENING_LANDING_PAGES.healthcare,
      values({
        services: "Criminal checks",
        details: {
          "healthcare-facility-type": "Clinic or physician group",
        },
      }),
      tracking,
    );
    const allowed = new Set([
      "name",
      "email",
      "phone",
      "company",
      "industry",
      "volume",
      "services",
      "message",
      "lead_source",
      "source",
      "_subject",
      ...TRACKING_PARAM_KEYS,
    ]);
    for (const key of Object.keys(payload)) {
      expect(allowed.has(key), key).toBe(true);
    }
    expect(payload).not.toHaveProperty("_cc");
    expect(payload).not.toHaveProperty("_gotcha");
  });

  it("builds the established HubSpot contact and details fields", () => {
    const config = EMPLOYER_SCREENING_LANDING_PAGES.healthcare;
    const body = buildEmployerLandingHubspotBody(
      config,
      values({
        services: "OIG LEIE",
        details: {
          "healthcare-facility-type": "Healthcare staffing",
        },
      }),
      tracking,
      config.seo.canonical,
      "hubspot-cookie",
    );
    const fields = Object.fromEntries(
      body.fields.map((field) => [field.name, field.value]),
    );
    expect(fields.firstname).toBe("Morgan Rivera");
    expect(fields).not.toHaveProperty("lastname");
    expect(fields.email).toBe("morgan@example.com");
    expect(fields.company).toBe("Example Employer");
    expect(fields.industry).toBe("Healthcare");
    expect(fields.lead_source).toBe("Get Started Form");
    expect(fields.quote_request_details).toContain(
      `Source: ${config.seo.canonical}`,
    );
    expect(fields.quote_request_details).toContain(
      "Hiring Volume: 26–100 checks / month",
    );
    expect(fields.quote_request_details).toContain(
      "Services of Interest: OIG LEIE",
    );
    expect(fields.quote_request_details).toContain(
      "Facility type: Healthcare staffing",
    );
    expect(body.context).toEqual({
      pageUri: config.seo.canonical,
      pageName:
        "Healthcare Employee Background Screening | Rapid Hire Solutions",
      hutk: "hubspot-cookie",
    });
  });

  it("reuses the endpoint, honeypot, validation, and nonblocking HubSpot flow", () => {
    expect(FORM_SOURCE).toContain(
      'import { FORMSPREE_ENDPOINT } from "@/lib/formspree"',
    );
    expect(FORM_SOURCE).toContain('name="_gotcha"');
    expect(FORM_SOURCE).toContain("validateFields");
    expect(FORM_SOURCE).toContain("submitToHubspot");
    expect(FORM_SOURCE).toContain("void submitToHubspot");
    expect(FORM_SOURCE).not.toContain("fireLeadConversion");
    expect(FORM_SOURCE).not.toContain('name="_cc"');
  });
});
