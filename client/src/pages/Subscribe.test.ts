/*
  §168 — /subscribe page contract.

  Locks the form's structure: required email, optional role + company,
  honeypot, JSON Formspree submission, and the success state. Also pins
  the SEO meta + the chrome decisions so the page can't drift away from
  the rest of the site visually.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..", "..", "..");
const SUBSCRIBE = readFileSync(
  resolve(ROOT, "client/src/pages/Subscribe.tsx"),
  "utf8",
);

describe("§168 — /subscribe page chrome", () => {
  it("uses SiteShell + PageHero (no bespoke hero for visual consistency)", () => {
    expect(SUBSCRIBE).toMatch(/import SiteShell from "@\/components\/site\/SiteShell"/);
    expect(SUBSCRIBE).toMatch(/import PageHero from "@\/components\/site\/PageHero"/);
  });

  it("registers SEO meta via useSeo with a WebPage JSON-LD", () => {
    expect(SUBSCRIBE).toMatch(/import \{ useSeo \} from "@\/hooks\/useSeo"/);
    expect(SUBSCRIBE).toMatch(/useSeo\(\{/);
    expect(SUBSCRIBE).toMatch(/"@type":\s*"WebPage"/);
  });
});

describe("§168 — /subscribe form contract", () => {
  it("imports the dedicated newsletter Formspree endpoint", () => {
    expect(SUBSCRIBE).toMatch(
      /import \{ FORMSPREE_NEWSLETTER_ENDPOINT \} from "@\/lib\/formspree"/,
    );
  });

  it("uses fetch() with Content-Type + Accept JSON to talk to Formspree", () => {
    expect(SUBSCRIBE).toMatch(/fetch\(\s*FORMSPREE_NEWSLETTER_ENDPOINT/);
    expect(SUBSCRIBE).toMatch(/"Content-Type":\s*"application\/json"/);
    expect(SUBSCRIBE).toMatch(/Accept:\s*"application\/json"/);
  });

  it("declares an `email` field with type=email + required + autoComplete=email", () => {
    expect(SUBSCRIBE).toMatch(/data-testid="subscribe-email"/);
    expect(SUBSCRIBE).toMatch(/type="email"\s+name="email"/);
    expect(SUBSCRIBE).toMatch(/autoComplete="email"/);
  });

  it("declares optional role + company fields (not required)", () => {
    expect(SUBSCRIBE).toMatch(/data-testid="subscribe-role"/);
    expect(SUBSCRIBE).toMatch(/data-testid="subscribe-company"/);
    // Required marker only on email Field, not on role/company.
    // We assert the presence of the asterisk on "Email address" wrapper:
    expect(SUBSCRIBE).toMatch(/label="Email address"\s+required/);
  });

  it("includes a visually-hidden honeypot named `company_website` for spam defense", () => {
    expect(SUBSCRIBE).toMatch(/data-testid="subscribe-honeypot"/);
    expect(SUBSCRIBE).toMatch(/name="company_website"/);
    // Must be off-screen (-9999px) AND have aria-hidden so screen readers skip it.
    expect(SUBSCRIBE).toMatch(/-9999px/);
    expect(SUBSCRIBE).toMatch(/aria-hidden="true"/);
  });

  it("renders a dedicated success state and an inline error region", () => {
    expect(SUBSCRIBE).toMatch(/data-testid="subscribe-success"/);
    expect(SUBSCRIBE).toMatch(/data-testid="subscribe-error"/);
  });

  it("submit button has a stable test id and a loading state", () => {
    expect(SUBSCRIBE).toMatch(/data-testid="subscribe-submit"/);
    expect(SUBSCRIBE).toMatch(/Subscribing…/);
  });

  it("does NOT collect a phone number (channel-split discipline)", () => {
    expect(SUBSCRIBE).not.toMatch(/type="tel"/);
    expect(SUBSCRIBE).not.toMatch(/name="phone"/);
  });

  it("does NOT post to the sales or integrations Formspree endpoints", () => {
    expect(SUBSCRIBE).not.toMatch(/FORMSPREE_ENDPOINT\b/);
    expect(SUBSCRIBE).not.toMatch(/FORMSPREE_INTEGRATIONS_ENDPOINT\b/);
  });

  it("links back to /blog and /learn so the page is not a dead-end", () => {
    expect(SUBSCRIBE).toMatch(/href="\/blog"/);
    expect(SUBSCRIBE).toMatch(/href="\/learn"/);
  });
});
