import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  LEAD_FORM_IDS,
  LEAD_FORM_PAGE_PATHS,
  RHS_LEAD_SUBMIT_SUCCESS_EVENT,
  pushLeadSubmitSuccess,
} from "./leadAnalytics";

const ROOT = process.cwd();
const read = (relativePath: string) =>
  fs.readFileSync(path.resolve(ROOT, relativePath), "utf8");

const INDEX = read("client/index.html");
const GET_QUOTE = read("client/src/pages/GetAQuote.tsx");
const EMPLOYER_FORM = read(
  "client/src/components/lp/EmployerLeadForm.tsx",
);
const HIREQUEST_FORM = read(
  "client/src/components/partners/HireQuestRegistrationForm.tsx",
);
const ADDITIONAL_EMPLOYER_FORMS = [
  "client/src/pages/Contact.tsx",
  "client/src/pages/ComplianceAudit.tsx",
  "client/src/pages/StaffingLanding.tsx",
  "client/src/pages/Integrations.tsx",
  "client/src/pages/Referral.tsx",
].map(read);
const PRERENDER = read("scripts/prerender_top_posts.mjs");

function count(source: string, pattern: RegExp): number {
  return source.match(pattern)?.length ?? 0;
}

function expectConfirmedSuccessWiring(
  source: string,
  failedResponseGuard: string,
): void {
  const fetchIndex = source.indexOf("await fetch(");
  const failureIndex = source.indexOf(failedResponseGuard, fetchIndex);
  const eventIndex = source.indexOf("pushLeadSubmitSuccess(");
  const confirmedSuccessIndex = source.indexOf(
    "setSubmitted(true);",
    failureIndex,
  );

  expect(fetchIndex).toBeGreaterThan(-1);
  expect(failureIndex).toBeGreaterThan(fetchIndex);
  expect(eventIndex).toBeGreaterThan(failureIndex);
  expect(eventIndex).toBeLessThan(confirmedSuccessIndex);
  expect(count(source, /pushLeadSubmitSuccess\(/g)).toBe(1);
  expect(source).toContain("leadSuccessTrackedRef.current");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Google Tag Manager shell installation", () => {
  it("installs exactly one official head script and one body iframe", () => {
    const head = INDEX.slice(
      INDEX.indexOf("<head>"),
      INDEX.indexOf("</head>"),
    );
    const body = INDEX.slice(
      INDEX.indexOf("<body>"),
      INDEX.indexOf("</body>"),
    );

    expect(count(head, /GTM-WMQPS3T3/g)).toBe(1);
    expect(count(head, /googletagmanager\.com\/gtm\.js/g)).toBe(1);
    expect(count(head, /googletagmanager\.com\/ns\.html/g)).toBe(0);
    expect(head).toContain("j.async=true");

    expect(count(body, /GTM-WMQPS3T3/g)).toBe(1);
    expect(count(body, /googletagmanager\.com\/ns\.html/g)).toBe(1);
    expect(count(body, /googletagmanager\.com\/gtm\.js/g)).toBe(0);
    expect(body).toMatch(
      /<body>\s*<!-- Google Tag Manager \(noscript\) -->/,
    );
  });

  it("does not duplicate GTM in React or the prerender script", () => {
    expect(GET_QUOTE).not.toContain("GTM-WMQPS3T3");
    expect(EMPLOYER_FORM).not.toContain("GTM-WMQPS3T3");
    expect(HIREQUEST_FORM).not.toContain("GTM-WMQPS3T3");
    expect(PRERENDER).not.toContain("GTM-WMQPS3T3");
  });
});

describe("privacy-safe employer lead success event", () => {
  it("pins the six approved IDs and their exact public paths", () => {
    expect(RHS_LEAD_SUBMIT_SUCCESS_EVENT).toBe("rhs_lead_submit_success");
    expect(LEAD_FORM_IDS).toEqual({
      getAQuote: "get_a_quote",
      staffing: "staffing_background_checks",
      healthcare: "healthcare_employee_screening",
      criminal: "employer_criminal_background_checks",
      preEmployment: "pre_employment_screening",
      hireQuest: "hirequest_partner",
      contact: "contact",
      complianceAudit: "compliance_audit",
      integrations: "integrations_request",
      referral: "referral_partner",
      staffingLegacy: "staffing_legacy",
    });
    expect(LEAD_FORM_PAGE_PATHS).toEqual({
      get_a_quote: "/get-a-quote",
      staffing_background_checks: "/lp/staffing-background-checks",
      healthcare_employee_screening: "/lp/healthcare-employee-screening",
      employer_criminal_background_checks:
        "/lp/employer-criminal-background-checks",
      pre_employment_screening: "/lp/pre-employment-screening",
      hirequest_partner: "/hirequest-partner/",
      contact: "/contact",
      compliance_audit: "/compliance/audit",
      integrations_request: "/integrations",
      referral_partner: "/referral",
      staffing_legacy: "/lp/staffing",
    });
  });

  it("pushes the approved privacy-safe schema and deduplicates by submission ID", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", {
      dataLayer,
      location: { pathname: "/get-a-quote" },
    });

    expect(
      pushLeadSubmitSuccess(
        LEAD_FORM_IDS.getAQuote,
        "submission-1",
        "Google Ads",
      ),
    ).toBe(true);
    expect(
      pushLeadSubmitSuccess(
        LEAD_FORM_IDS.getAQuote,
        "submission-1",
        "Google Ads",
      ),
    ).toBe(false);
    expect(dataLayer).toEqual([
      {
        event: RHS_LEAD_SUBMIT_SUCCESS_EVENT,
        lead_id: "submission-1",
        lead_source: "Google Ads",
        form_id: "get_a_quote",
        page_path: "/get-a-quote",
      },
    ]);
    expect(Object.keys(dataLayer[0] as object).sort()).toEqual([
      "event",
      "form_id",
      "lead_id",
      "lead_source",
      "page_path",
    ]);
  });

  it("is a no-op outside the browser", () => {
    vi.stubGlobal("window", undefined);
    expect(
      pushLeadSubmitSuccess(
        LEAD_FORM_IDS.getAQuote,
        "server-submission",
        "Direct/Unknown",
      ),
    ).toBe(false);
  });

  it("is called once only after each listed endpoint confirms success", () => {
    expectConfirmedSuccessWiring(GET_QUOTE, "if (!resp.ok)");
    expectConfirmedSuccessWiring(EMPLOYER_FORM, "if (!response.ok)");
    expectConfirmedSuccessWiring(HIREQUEST_FORM, "if (!response.ok)");
  });

  it("wires additional employer forms once in the confirmed-success path", () => {
    for (const source of ADDITIONAL_EMPLOYER_FORMS) {
      const fetchIndex = source.indexOf("await fetch(");
      const failureIndex = source.indexOf("if (!resp.ok)", fetchIndex);
      const eventIndex = source.indexOf("pushLeadSubmitSuccess(", fetchIndex);
      const catchIndex = source.indexOf("} catch", fetchIndex);
      expect(fetchIndex).toBeGreaterThan(-1);
      expect(failureIndex).toBeGreaterThan(fetchIndex);
      expect(eventIndex).toBeGreaterThan(failureIndex);
      expect(eventIndex).toBeLessThan(catchIndex);
      expect(count(source, /pushLeadSubmitSuccess\(/g)).toBe(1);
      expect(source).toContain("...attribution.fields");
    }
  });

  it("does not run from validation, honeypot, failure, or page-load paths", () => {
    const forms = [
      { source: GET_QUOTE, honeypot: 'fd.get("_gotcha")' },
      { source: EMPLOYER_FORM, honeypot: 'data.get("_gotcha")' },
      { source: HIREQUEST_FORM, honeypot: 'data.get("_gotcha")' },
    ];

    for (const { source, honeypot } of forms) {
      const submitIndex = source.indexOf("async function onSubmit");
      const eventIndex = source.indexOf("pushLeadSubmitSuccess(");
      expect(submitIndex).toBeGreaterThan(-1);
      expect(eventIndex).toBeGreaterThan(source.indexOf("validateFields", submitIndex));
      expect(eventIndex).toBeGreaterThan(source.indexOf(honeypot, submitIndex));
      expect(eventIndex).toBeGreaterThan(source.indexOf("await fetch(", submitIndex));
      expect(source.slice(0, submitIndex)).not.toContain(
        "pushLeadSubmitSuccess(",
      );
    }
  });
});