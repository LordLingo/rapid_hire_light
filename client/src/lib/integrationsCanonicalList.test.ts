/*
  §188 — Source pin for the canonical /integrations partner list.

  The /integrations page surface is fed by `shared/integrations.json` AND the
  IntegrationsGrid hero card on the same page. The customer provided three
  screenshots enumerating the 33 partners that Rapid Hire Solutions is
  authorized to display, so this spec locks that list verbatim and bans the
  legacy placeholder partners from the §83 build (BambooHR, Bullhorn, Gusto,
  Rippling, Personio, HiBob, Namely, Salesforce, Recruitee, Zoho Recruit,
  Paylocity, Paychex Flex, ADP Workforce Now) so a future visual edit cannot
  silently re-introduce them.

  In the same change the CATS filter on Integrations.tsx was narrowed from
  ["All", "ATS", "HRIS", "Payroll", "CRM"] to ["All", "ATS", "HRIS", "Payroll"]
  because the canonical 33-partner list contains zero CRM entries — leaving
  CRM in the filter would render a chip with zero matches. We pin the new
  array shape here too.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import integrationsData from "../../../shared/integrations.json";

type Integration = {
  name: string;
  mark: string;
  category: "ATS" | "HRIS" | "Payroll" | "CRM";
  status: "Live" | "Beta" | "Request";
  body: string;
};
type IntegrationsFile = { items: Integration[] };

const file = integrationsData as unknown as IntegrationsFile;

/** The 33 canonical partner names extracted verbatim from the screenshots. */
const CANONICAL_NAMES = [
  "CATS",
  "Essium Labs",
  "iCIMS",
  "Paycor",
  "ADP RM",
  "Tenstreet",
  "CareerBuilder",
  "IBM Kenexa BrassRing",
  "myStaffingPro (Paychex)",
  "RecruiterBox",
  "SilkRoad",
  "SuccessFactors",
  "Taleo Enterprise Edition",
  "Workday",
  "Cadient Talent",
  "ClearCompany",
  "Cornerstone",
  "Dayforce",
  "Erecruit",
  "Greenhouse",
  "Hirebridge",
  "JazzHR",
  "Jobvite",
  "Lever",
  "PageUp",
  "Rival",
  "SmartRecruiters",
  "talentReef",
  "Taleo Business Edition",
  "UKG Pro",
  "UKG Ready",
  "Workable",
  "Oracle",
] as const;

/** Names that were on the §83 placeholder list but are NOT on the screenshots
 *  — banning them keeps a future visual edit from quietly re-adding them. */
const BANNED_LEGACY_NAMES = [
  "BambooHR",
  "Bullhorn",
  "Recruitee",
  "Zoho Recruit",
  "ADP Workforce Now",
  "Paylocity",
  "Paychex Flex",
  "Gusto",
  "Ceridian Dayforce",
  "SAP SuccessFactors",
  "Oracle HCM Cloud",
  "UKG Pro / Ready",
  "Rippling",
  "HiBob",
  "Personio",
  "Namely",
  "Salesforce",
] as const;

describe("§188 canonical integrations list (shared/integrations.json)", () => {
  it("contains exactly the 33 partner names from the customer screenshots", () => {
    const names = file.items.map((i) => i.name);
    expect(names.length).toBe(33);
    // Order doesn't matter for the page (it's filtered), but every canonical
    // name must be present and nothing else may be present.
    expect([...names].sort()).toEqual([...CANONICAL_NAMES].sort());
  });

  it("does not contain any of the §83 placeholder partner names", () => {
    const names = new Set(file.items.map((i) => i.name));
    for (const banned of BANNED_LEGACY_NAMES) {
      expect(names.has(banned), `legacy partner re-introduced: ${banned}`).toBe(
        false,
      );
    }
  });

  it("has every entry tagged as ATS, HRIS, or Payroll (CRM bucket is empty by design)", () => {
    const allowed = new Set(["ATS", "HRIS", "Payroll"]);
    for (const item of file.items) {
      expect(allowed.has(item.category), `${item.name} has ${item.category}`).toBe(
        true,
      );
    }
    const crm = file.items.filter((i) => i.category === "CRM");
    expect(crm.length).toBe(0);
  });

  it("provides at least 6 Live items so IntegrationsGrid never short-circuits", () => {
    const live = file.items.filter((i) => i.status === "Live");
    expect(live.length).toBeGreaterThanOrEqual(6);
  });

  it("every entry passes the field shape pinned in heroData.test.ts", () => {
    for (const item of file.items) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.mark.length).toBeGreaterThan(0);
      expect(item.mark.length).toBeLessThanOrEqual(4);
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate partner names", () => {
    const names = file.items.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("§188 CATS filter on Integrations.tsx", () => {
  const src = readFileSync(
    join(__dirname, "..", "pages", "Integrations.tsx"),
    "utf8",
  );

  it("declares the narrowed 4-chip filter without CRM", () => {
    expect(src).toContain(
      'const CATS = ["All", "ATS", "HRIS", "Payroll"] as const;',
    );
  });

  it("does not declare the legacy 5-chip filter with CRM", () => {
    expect(src).not.toContain(
      'const CATS = ["All", "ATS", "HRIS", "Payroll", "CRM"] as const;',
    );
  });
});

describe("§188 anti-regression: legacy placeholder names removed from public copy", () => {
  it("Faq.tsx no longer claims integration with BambooHR or Bullhorn", () => {
    const faqSrc = readFileSync(
      join(__dirname, "..", "components", "site", "Faq.tsx"),
      "utf8",
    );
    // The old answer string was: "we integrate with Greenhouse, Bullhorn, Workable, BambooHR, and JazzHR."
    expect(faqSrc).not.toContain("Greenhouse, Bullhorn, Workable, BambooHR");
  });

  it("Support.tsx no longer claims native integration with BambooHR", () => {
    const supportSrc = readFileSync(
      join(__dirname, "..", "pages", "Support.tsx"),
      "utf8",
    );
    expect(supportSrc).not.toContain(
      "Workable, Greenhouse, Lever, BambooHR",
    );
  });
});
