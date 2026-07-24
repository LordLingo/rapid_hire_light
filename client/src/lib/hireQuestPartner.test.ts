import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildHireQuestHubspotBody,
  buildHireQuestPayload,
  HIREQUEST_PACKAGES,
  HIREQUEST_SOURCE,
  type HireQuestRegistrationValues,
} from "./hireQuestPartnerForm";

const ROOT = process.cwd();
const read = (relativePath: string) =>
  fs.readFileSync(path.resolve(ROOT, relativePath), "utf8");

const APP = read("client/src/App.tsx");
const PAGE = read("client/src/pages/HireQuestPartner.tsx");
const FORM = read(
  "client/src/components/partners/HireQuestRegistrationForm.tsx",
);
const CSS = read(
  "client/src/components/partners/hirequest-partner.css",
);
const PRERENDER = read("scripts/prerender_top_posts.mjs");

const values: HireQuestRegistrationValues = {
  fullName: "Morgan Recruiter",
  workEmail: "morgan@example.com",
  phone: "555-0100",
  officeName: "HireQuest Central",
  officeCity: "Tampa",
  state: "FL",
  officeId: "HQ-22",
  jobTitle: "Branch Manager",
  monthlyHires: "75",
  packageSelection: "Staffing Package — $23",
  additionalNotes: "Please call in the afternoon.",
};

describe("HireQuest partner page", () => {
  it("registers both URL forms before the final fallback", () => {
    expect(APP).toContain(
      '<Route path={"/hirequest-partner"} component={HireQuestPartner} />',
    );
    expect(APP).toContain(
      '<Route path={"/hirequest-partner/"} component={HireQuestPartner} />',
    );
    expect(APP.indexOf('path={"/hirequest-partner"}')).toBeLessThan(
      APP.indexOf("{/* Final fallback route */}"),
    );
  });

  it("uses the approved partner assets from repository paths", () => {
    const assets = [
      "client/public/static/partners/hirequest/hirequest-logo.webp",
      "client/public/static/partners/hirequest/mri-network-logo.svg",
      "client/public/static/partners/hirequest/snelling-logo.svg",
    ];
    for (const asset of assets) {
      expect(fs.existsSync(path.resolve(ROOT, asset))).toBe(true);
    }
    expect(PAGE).toContain("/static/partners/hirequest/hirequest-logo.webp");
    expect(PAGE).toContain("/static/partners/hirequest/mri-network-logo.svg");
    expect(PAGE).toContain("/static/partners/hirequest/snelling-logo.svg");
    expect(PAGE).not.toContain("Downloads");
  });

  it("pins the approved headline, timing qualification, and CTAs", () => {
    expect(PAGE).toContain("Rapid Hire Solutions + HireQuest");
    expect(PAGE).toContain(
      "Fast, Reliable Background Checks — Now Available to HireQuest",
    );
    expect(PAGE).toContain(
      "Average turnaround is based on standard checks and varies by service, jurisdiction, court access, source availability, and third-party response.",
    );
    expect(PAGE).toContain(
      "https://meetings.hubspot.com/david-keller/hirequest-rhs-meeting",
    );
    expect(PAGE).toContain('target="_blank"');
    expect(PAGE).toContain('rel="noopener noreferrer"');
    expect(PAGE).toContain('href="#account-registration"');
    expect(PAGE).toContain('id="account-registration"');
  });

  it("pins all three approved packages and their exact services", () => {
    expect(HIREQUEST_PACKAGES.map(({ name, price, value }) => ({
      name,
      price,
      value,
    }))).toEqual([
      {
        name: "Standard Package",
        price: "$17",
        value: "Standard Package — $17",
      },
      {
        name: "Staffing Package",
        price: "$23",
        value: "Staffing Package — $23",
      },
      {
        name: "Driver Package",
        price: "$20",
        value: "Driver Package — $20",
      },
    ]);
    expect(HIREQUEST_PACKAGES[1].services).toContain(
      "Employment Verification",
    );
    expect(HIREQUEST_PACKAGES[2].services).toContain(
      "Driving History (MVR)",
    );
  });

  it("keeps package selection keyboard-operable and wired to the form", () => {
    expect(PAGE).toContain('type="button"');
    expect(PAGE).toContain("aria-pressed={selected}");
    expect(PAGE).toContain("choosePackage(packageOption.value)");
    expect(FORM).toContain('name="packageSelection"');
    expect(FORM).toContain("value={selectedPackage}");
    expect(FORM).toContain("Select a package...");
  });

  it("includes every approved registration field, validation, consent, and honeypot", () => {
    for (const name of [
      "fullName",
      "workEmail",
      "phone",
      "officeName",
      "officeCity",
      "state",
      "officeId",
      "jobTitle",
      "monthlyHires",
      "packageSelection",
      "additionalNotes",
    ]) {
      expect(FORM).toContain(`name="${name}"`);
    }
    expect(FORM).toContain('name="_gotcha"');
    expect(FORM).toContain("validateFields");
    expect(FORM).toContain("EMPLOYER_LANDING_CONSENT");
    expect(FORM).toContain("Submit Account Request");
    expect(FORM).toContain('role="status"');
  });

  it("uses the existing secure sales form and parallel HubSpot flow", () => {
    expect(FORM).toContain(
      'import { FORMSPREE_ENDPOINT } from "@/lib/formspree"',
    );
    expect(FORM).toContain("fetch(FORMSPREE_ENDPOINT");
    expect(FORM).toContain("void submitToHubspot");
    expect(FORM).not.toMatch(/mailto:|smtp/i);
  });

  it("builds a complete payload with package and attribution preserved", () => {
    const payload = buildHireQuestPayload(values, {
      utm_source: "google",
      utm_campaign: "hirequest",
      gclid: "CLICK-123",
    });
    expect(payload).toMatchObject({
      name: "Morgan Recruiter",
      email: "morgan@example.com",
      phone: "555-0100",
      company: "HireQuest Central",
      volume: "75",
      services: "Staffing Package — $23",
      source: HIREQUEST_SOURCE,
      lead_source: "Get Started Form",
      utm_source: "google",
      utm_campaign: "hirequest",
      gclid: "CLICK-123",
    });
    expect(payload.message).toContain("Office City: Tampa");
    expect(payload.message).toContain("State: FL");
    expect(payload.message).toContain(
      "Package Selection: Staffing Package — $23",
    );
  });

  it("maps the request to the established HubSpot contact fields", () => {
    const body = buildHireQuestHubspotBody(
      values,
      { gclid: "CLICK-123" },
      "https://www.rapidhiresolutions.com/hirequest-partner/",
      "hubspot-cookie",
    );
    const fields = Object.fromEntries(
      body.fields.map((field) => [field.name, field.value]),
    );
    expect(fields).toMatchObject({
      firstname: "Morgan Recruiter",
      email: "morgan@example.com",
      phone: "555-0100",
      company: "HireQuest Central",
      lead_source: "Get Started Form",
    });
    expect(fields.quote_request_details).toContain(
      "Services of Interest: Staffing Package — $23",
    );
    expect(body.context?.hutk).toBe("hubspot-cookie");
  });

  it("adds route-specific prerender metadata with no homepage fallback", () => {
    expect(PRERENDER).toContain('route: "/hirequest-partner/"');
    expect(PRERENDER).toContain('slug: "hirequest-partner"');
    expect(PRERENDER).toContain(
      'title: "HireQuest Background Checks | Rapid Hire Solutions"',
    );
    expect(PRERENDER).toContain(
      '"https://www.rapidhiresolutions.com/hirequest-partner/"',
    );
    expect(PRERENDER).toContain("partnerPages: writtenPartnerPages");
  });

  it("scopes finite motion and provides a reduced-motion fallback", () => {
    expect(CSS).toContain("@media (prefers-reduced-motion: reduce)");
    expect(CSS).toContain("520ms");
    expect(CSS).toContain("translateY(14px)");
    expect(CSS).not.toMatch(/animation[^;]*infinite/i);
    expect(CSS).toContain(".hq-package-card:hover");
    expect(PAGE).toContain("IntersectionObserver");
  });
});
