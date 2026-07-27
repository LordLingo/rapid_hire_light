import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../../..");
const read = (relativePath: string) =>
  fs.readFileSync(path.resolve(ROOT, relativePath), "utf8");

const HOME = read("client/src/pages/Home.tsx");
const QUOTE = read("client/src/pages/GetAQuote.tsx");
const HEADER = read("client/src/components/site/Header.tsx");
const STYLES = read(
  "client/src/components/site/homepage-quote-redesign.css",
);
const SHELL = read("client/index.html");
const PRERENDER = read("scripts/prerender_top_posts.mjs");

const DEMO_URL =
  "https://meetings.hubspot.com/david-keller/hirequest-rhs-meeting";

describe("outcome-focused homepage", () => {
  it("uses the approved problem-to-outcome conversion flow", () => {
    for (const copy of [
      "Background screening built for faster hiring",
      "Stop Losing Great Candidates While Waiting on Background Checks.",
      "The real cost of slow screening",
      "Is your screening process slowing down hiring?",
      "What changes after you switch",
      "The screening tools behind a faster hiring process.",
      "A simpler way to keep hiring moving",
      "You should never have to chase your screening provider.",
      "Screening built around the way your industry hires.",
      "Ready to make screening the easiest part of hiring?",
    ]) {
      expect(HOME).toContain(copy);
    }
  });

  it("pins all six concise employer outcomes", () => {
    for (const outcome of [
      "Fill positions faster",
      "Reduce recruiter workload",
      "Improve candidate experience",
      "Control screening costs",
      "Support confident decisions",
      "Get help quickly",
    ]) {
      expect(HOME).toContain(outcome);
    }
  });

  it("uses only the supported turnaround claim with its qualification", () => {
    expect(HOME).toContain(
      "85% of standard checks completed within 24 hours",
    );
    expect(HOME).toContain(
      "Timing varies by service, jurisdiction, court access, source availability, and third-party response.",
    );
    expect(HOME).not.toMatch(/6\.5\s*(hour|hr)|8\s*(hour|hr)|guaranteed same-day/i);
  });

  it("removes futuristic and unsupported marketing language", () => {
    expect(HOME).not.toMatch(
      /Neural Nodes|Velocity Engine|Silicon Valley quality|AI-powered hiring infrastructure|save up to 40%|reduce hiring time by three days/i,
    );
    expect(HOME).not.toMatch(/testimonial|customer quote/i);
  });

  it("reuses the approved quote route and meeting destination safely", () => {
    expect(HOME).toContain('href="/get-a-quote"');
    expect(HOME).toContain(DEMO_URL);
    expect(HOME).toContain('target="_blank"');
    expect(HOME).toContain('rel="noopener noreferrer"');
  });
});

describe("Get a Quote conversion page", () => {
  it("uses the approved headline, value promise, and submit label", () => {
    expect(QUOTE).toContain("Custom screening quote");
    expect(QUOTE).toContain(
      "Get a screening plan built around how you hire.",
    );
    expect(QUOTE).toContain("A quote you can actually evaluate.");
    expect(QUOTE).toContain("A real quote in one business day.");
    expect(QUOTE).toContain("Tell us about your hiring needs.");
    expect(QUOTE).toContain("Get My Custom Quote");
  });

  it("groups the unchanged sales fields into three accessible fieldsets", () => {
    for (const group of [
      "Contact information",
      "Hiring profile",
      "Screening needs",
    ]) {
      expect(QUOTE).toContain(`<legend>${group}</legend>`);
    }
    for (const name of [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "role",
      "industry",
      "volume",
      "services-checkbox",
      "ats",
      "timeline",
      "message",
    ]) {
      expect(QUOTE).toContain(`name="${name}"`);
    }
  });

  it("preserves validation, consent, honeypot, secure endpoints, and success handling", () => {
    expect(QUOTE).toContain("validateFields");
    expect(QUOTE).toContain('name="_gotcha"');
    expect(QUOTE).toContain('name="lead_source"');
    expect(QUOTE).toContain("fetch(QUOTE_FORMSPREE_ENDPOINT");
    expect(QUOTE).toContain("submitToHubspot");
    expect(QUOTE).toContain('data-testid="quote-success"');
    expect(QUOTE).toContain("By submitting, you agree to be contacted");
    expect(QUOTE).not.toMatch(/mailto:|smtp/i);
  });

  it("preserves UTM and GCLID attribution in hidden fields and payload construction", () => {
    expect(QUOTE).toContain("initTracking(search)");
    expect(QUOTE).toContain("loadTrackingParams()");
    expect(QUOTE).toContain("...effectiveTracking");
    expect(QUOTE).toContain("data-tracking-field={name}");
  });

  it("keeps the FAQ to the three supported questions", () => {
    expect(QUOTE).toContain("How quickly will I receive my quote?");
    expect(QUOTE).toContain("Can Rapid Hire work with our ATS?");
    expect(QUOTE).toContain("Can packages be customized by role?");
    expect((QUOTE.match(/<article className="reveal-on-scroll">/g) ?? []).length).toBe(3);
  });
});

describe("CTA, metadata, and responsive contracts", () => {
  it("updates only the two header quote CTA labels", () => {
    expect((HEADER.match(/Get a Custom Quote/g) ?? []).length).toBe(2);
    expect((HEADER.match(/href="\/get-a-quote"/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it("uses the existing compact navigation before the full row can overflow", () => {
    expect(HEADER).toContain("hidden min-[1360px]:flex");
    expect((HEADER.match(/min-\[1360px\]:hidden/g) ?? []).length).toBe(2);
    expect(HEADER).toContain("aria-expanded={open}");
    expect(HEADER).toContain('aria-controls="header-compact-navigation"');
    expect(HEADER).toContain('event.key !== "Escape"');
    expect(HEADER).toContain("menuButtonRef.current?.focus()");
    expect(HEADER).toContain("focus-visible:ring-2");
  });

  it("uses only the trust labels documented by the repository trust page", () => {
    expect(HEADER).toContain("FCRA-aligned");
    expect(HEADER).toContain("SOC 2 Type II");
    expect(HEADER).toContain("PBSA Member");
    expect(HEADER).not.toContain("FCRA Certified");
    expect(HEADER).not.toContain("HIPAA Compliant");
    expect(HEADER).not.toContain("PBSA Accredited");
  });

  it("balances the hero at laptop widths without splitting U.S.-based support", () => {
    expect(STYLES).toContain(
      "@media (min-width: 901px) and (max-width: 1280px)",
    );
    expect(STYLES).toContain("font-size: clamp(58px, 6.2vw, 70px)");
    expect(HOME).toContain(
      '<span className="whitespace-nowrap">U.S.-based support.</span>',
    );
  });

  it("updates homepage initial and client metadata", () => {
    expect(SHELL).toContain(
      "<title>Faster Hiring Background Checks | Rapid Hire Solutions</title>",
    );
    expect(SHELL).toContain(
      "Keep hiring moving with fast, transparent background screening, clear pricing, and responsive support for employers and staffing teams.",
    );
    expect(HOME).toContain(
      'title: "Faster Hiring Background Checks | Rapid Hire Solutions"',
    );
  });

  it("prerenders route-specific Get-a-Quote metadata and body copy", () => {
    expect(PRERENDER).toContain('route: "/get-a-quote"');
    expect(PRERENDER).toContain('marker: "prerendered:get-a-quote"');
    expect(PRERENDER).toContain(
      'title: "Get a Background Check Quote | Rapid Hire Solutions"',
    );
    expect(PRERENDER).toContain("marketingPages: writtenMarketingPages");
    expect(PRERENDER).toContain(
      "Get a screening plan built around how you hire.",
    );
  });

  it("provides desktop, tablet, mobile, and reduced-motion layouts", () => {
    expect(STYLES).toContain("@media (max-width: 1120px)");
    expect(STYLES).toContain("@media (max-width: 900px)");
    expect(STYLES).toContain("@media (max-width: 720px)");
    expect(STYLES).toContain("@media (max-width: 420px)");
    expect(STYLES).toContain("@media (prefers-reduced-motion: reduce)");
    expect(STYLES).toContain("translateY(14px)");
    expect(STYLES).not.toMatch(/animation[^;]*infinite/i);
  });
});