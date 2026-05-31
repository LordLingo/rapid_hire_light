/*
  §111 — Vitest invariants for the dedicated /get-a-quote page and the
  site-wide CTA repoints.

  Lock-in surface:
    A) GetAQuote page module exposes the right Formspree endpoint and
       option lists, and submits via JSON fetch with Accept: application/json.
    B) /get-a-quote route is registered in App.tsx.
    C) Every "quote-intent" CTA across the site points at /get-a-quote
       (not /contact). Generic /contact CTAs (Talk to compliance/support,
       Reference an existing customer, ROI's "Get a tailored estimate")
       are deliberately ignored — they are NOT quote requests.
    D) Pricing tier ctaHrefs carry tier+note prefill on the new route.
    E) PricingCalculator + StickyEstimateBar build pre-filled URLs against
       the new route.

  Strips JSX comments before scanning the JSX so historical breadcrumb
  comments don't false-positive against the regex.
*/
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import {
  QUOTE_FORMSPREE_ENDPOINT,
  QUOTE_SERVICES,
  QUOTE_INDUSTRIES,
  QUOTE_VOLUMES,
  QUOTE_ATS_OPTIONS,
  QUOTE_TIMELINES,
  QUOTE_SERVICE_ALIASES,
} from "@/pages/GetAQuote";

const ROOT = resolve(__dirname, "../../..");
function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

/**
 * Strip /* ... *\/ block comments and // line comments so explanatory
 * breadcrumbs (like "// §111: dedicated quote page") don't false-match
 * against URL regexes that look for /contact or /get-a-quote.
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    // also strip JSX comments {/* ... */}
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "");
}

// --- A) GetAQuote page wiring -----------------------------------------------
describe("§111 — GetAQuote page wiring", () => {
  it("exports the Formspree mvzyoyoz endpoint", () => {
    expect(QUOTE_FORMSPREE_ENDPOINT).toBe("https://formspree.io/f/mvzyoyoz");
  });

  it("exports a non-empty service / industry / volume / ATS / timeline option set", () => {
    expect(QUOTE_SERVICES.length).toBeGreaterThanOrEqual(8);
    expect(QUOTE_INDUSTRIES.length).toBeGreaterThanOrEqual(5);
    expect(QUOTE_VOLUMES.length).toBeGreaterThanOrEqual(4);
    expect(QUOTE_ATS_OPTIONS.length).toBeGreaterThanOrEqual(5);
    expect(QUOTE_TIMELINES.length).toBeGreaterThanOrEqual(3);
  });

  it("aliases calculator addon ids to QUOTE_SERVICES ids so calculator deep links round-trip", () => {
    // Pick a few canonical aliases and confirm they map to a known service id.
    const ids = new Set(QUOTE_SERVICES.map((s) => s.id));
    for (const target of [
      QUOTE_SERVICE_ALIASES.county,
      QUOTE_SERVICE_ALIASES.employment,
      QUOTE_SERVICE_ALIASES.mvr,
      QUOTE_SERVICE_ALIASES.education,
    ]) {
      expect(ids.has(target)).toBe(true);
    }
  });

  it("submits via JSON fetch with Accept: application/json (Formspree honored)", () => {
    const src = read("client/src/pages/GetAQuote.tsx");
    expect(src).toMatch(/QUOTE_FORMSPREE_ENDPOINT/);
    // Submission must POST as JSON with Accept: application/json
    expect(src).toMatch(/Accept[\"']?\s*:\s*[\"']application\/json[\"']/);
    expect(src).toMatch(/method[\"']?\s*:\s*[\"']POST[\"']/);
    // Honeypot _gotcha field must exist (anti-bot)
    expect(src).toMatch(/_gotcha/);
  });

  it("file exists at client/src/pages/GetAQuote.tsx (not Contact)", () => {
    expect(existsSync(resolve(ROOT, "client/src/pages/GetAQuote.tsx"))).toBe(true);
  });

  // §208 — HubSpot lead-source attribution: the form must POST a hidden
  // `lead_source` field with the literal value "Get Started Form" so the
  // HubSpot workflow trigger "Lead Source is any of Get Started Form"
  // enrolls the contact, rotates ownership, and sets Lead Status: HOT.
  // Pinning all three independently so a refactor can't silently break
  // the HubSpot automation by renaming/dropping any one of them.
  it("§208 — ships a hidden lead_source field defaulted to 'Get Started Form' for HubSpot enrollment", () => {
    const src = read("client/src/pages/GetAQuote.tsx");
    expect(src).toMatch(/type="hidden"/);
    expect(src).toMatch(/name="lead_source"/);
    expect(src).toMatch(/value="Get Started Form"/);
    expect(src).toMatch(/data-testid="quote-lead-source"/);
    // The hidden input must be a single tag with all three attributes on it
    // — not three independent inputs that happen to live on the same page.
    expect(src).toMatch(/<input[\s\S]*?type="hidden"[\s\S]*?name="lead_source"[\s\S]*?value="Get Started Form"[\s\S]*?\/>/);
  });
});

// --- B) /get-a-quote route is registered ------------------------------------
describe("§111 — App route registration", () => {
  it("App.tsx imports GetAQuote and registers /get-a-quote", () => {
    const app = read("client/src/App.tsx");
    expect(app).toMatch(/import\s+GetAQuote\s+from\s+["']\.\/pages\/GetAQuote["']/);
    expect(app).toMatch(/path=\{?["']\/get-a-quote["']\}?\s+component=\{?GetAQuote\}?/);
  });
});

// --- C) Site-wide CTA repoints ----------------------------------------------
describe("§111 — Quote-intent CTAs all point at /get-a-quote", () => {
  it("Header desktop + mobile Get a Quote pills target /get-a-quote", () => {
    const src = stripComments(read("client/src/components/site/Header.tsx"));
    // Must contain at least 2 references to /get-a-quote (desktop + mobile)
    const matches = src.match(/\/get-a-quote/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("Footer 'Get A Quote' Portals entry routes to /get-a-quote", () => {
    const src = stripComments(read("client/src/components/site/Footer.tsx"));
    // Find the line that defines the Get A Quote portal item, must be /get-a-quote
    expect(src).toMatch(/label:\s*["']Get A Quote["'][^}]*to:\s*["']\/get-a-quote["']/);
    // And NOT to /contact anymore
    expect(src).not.toMatch(/label:\s*["']Get A Quote["'][^}]*to:\s*["']\/contact["']/);
  });

  it("Services page CTA banner Get a quote button targets /get-a-quote", () => {
    const src = stripComments(read("client/src/pages/Services.tsx"));
    // The CTA banner is the only "Get a quote" CTA on the Services page
    const idx = src.indexOf("services-cta-banner-quote");
    expect(idx).toBeGreaterThan(-1);
    // The href on the same Link must be /get-a-quote (search ±400 chars)
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toMatch(/href=["']\/get-a-quote["']/);
  });

  it("Industries page hero Get a quote CTA targets /get-a-quote", () => {
    const src = stripComments(read("client/src/pages/Industries.tsx"));
    const idx = src.indexOf("industries-cta-quote");
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toMatch(/href=["']\/get-a-quote["']/);
  });

  it("Pricing page closing CTA targets /get-a-quote", () => {
    const src = stripComments(read("client/src/pages/Pricing.tsx"));
    const idx = src.indexOf("pricing-closing-cta-quote");
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toMatch(/href=["']\/get-a-quote["']/);
  });
});

// --- D) Pricing tier ctaHrefs carry prefill to /get-a-quote -----------------
describe("§111 — Pricing tier ctaHrefs", () => {
  const src = stripComments(read("client/src/pages/Pricing.tsx"));

  it("Essential tier ctaHref points at /get-a-quote with tier=essential", () => {
    expect(src).toMatch(/ctaHref:\s*["']\/get-a-quote\?tier=essential[^"']*["']/);
  });
  it("Professional tier ctaHref points at /get-a-quote with tier=professional", () => {
    expect(src).toMatch(/ctaHref:\s*["']\/get-a-quote\?tier=professional[^"']*["']/);
  });
  it("Comprehensive tier ctaHref points at /get-a-quote with tier=comprehensive", () => {
    expect(src).toMatch(/ctaHref:\s*["']\/get-a-quote\?tier=comprehensive[^"']*["']/);
  });
  it("no surviving /contact?tier= prefill anywhere in Pricing.tsx", () => {
    expect(src).not.toMatch(/\/contact\?tier=/);
  });
});

// --- E) Calculator + sticky bar deep-link prefill --------------------------
describe("§111 — Calculator + sticky-bar deep-link prefill targets /get-a-quote", () => {
  it("PricingCalculator quote CTA builds /get-a-quote?... not /contact?...", () => {
    const src = stripComments(read("client/src/components/site/PricingCalculator.tsx"));
    // Quote CTA href must use /get-a-quote
    expect(src).toMatch(/href=\{?`\/get-a-quote\?\$\{quoteQuery\}`/);
    // No surviving /contact?\\${quoteQuery} anywhere
    expect(src).not.toMatch(/href=\{?`\/contact\?\$\{quoteQuery\}/);
  });

  it("StickyEstimateBar quote CTAs build /get-a-quote?... (both desktop + mobile)", () => {
    const src = stripComments(read("client/src/components/site/StickyEstimateBar.tsx"));
    const matches = src.match(/\/get-a-quote\?\$\{buildQuery/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
    // No surviving /contact? prefill
    expect(src).not.toMatch(/href=\{?`\/contact\?\$\{buildQuery/);
  });
});
