/*
  §105 / §159 — Contact form invariants

  Two things must hold on the Contact page:

    1. The form submits to the shared Formspree endpoint imported from
       @/lib/formspree (mvzyoyoz). If anyone swaps the endpoint, points it
       back at /api/contact, or fat-fingers the form id, this test fails
       before deploy.

    2. The Employment-Verifications option is the only employment-themed
       service chip — the legacy "Employment Screening" label must not
       reappear in the rendered form (it is allowed only inside the
       header comment that records the rename).

  We assert against the source of Contact.tsx because the chips are a
  static const array; running it through React would just exercise jsdom
  for no extra confidence.
*/

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CONTACT = readFileSync(
  resolve(__dirname, "..", "pages", "Contact.tsx"),
  "utf8",
);

describe("§105 / §159 Contact form Formspree wiring", () => {
  it("imports the shared FORMSPREE_ENDPOINT from @/lib/formspree", () => {
    expect(CONTACT).toMatch(
      /import \{ FORMSPREE_ENDPOINT \} from "@\/lib\/formspree"/,
    );
    // The fetch call must actually use the endpoint constant
    expect(CONTACT).toMatch(/fetch\(\s*FORMSPREE_ENDPOINT\b/);
  });

  it("the shared endpoint resolves to https://formspree.io/f/mvzyoyoz", () => {
    const FORMSPREE_LIB = readFileSync(
      resolve(__dirname, "formspree.ts"),
      "utf8",
    );
    expect(FORMSPREE_LIB).toMatch(
      /FORMSPREE_FORM_ID\s*=\s*"mvzyoyoz"/,
    );
    expect(FORMSPREE_LIB).toMatch(
      /FORMSPREE_ENDPOINT\s*=\s*[\s\S]*?formspree\.io\/f\/\$\{FORMSPREE_FORM_ID\}/,
    );
  });

  it("no longer hard-codes a local Formspree literal (legacy xnjrqler removed)", () => {
    expect(CONTACT).not.toMatch(/formspree\.io\/f\/xnjrqler/);
  });

  it("does not submit to the legacy /api/contact endpoint", () => {
    // Strip JSX comments and JS comments before scanning so the §105
    // explanatory note can't false-positive.
    const stripped = CONTACT
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");
    expect(stripped).not.toContain('"/api/contact"');
    expect(stripped).not.toContain("'/api/contact'");
  });

  it("sends Accept: application/json so Formspree returns JSON, not a redirect", () => {
    expect(CONTACT).toMatch(/Accept:\s*"application\/json"/);
  });
});

describe("§105 Contact service-option labels", () => {
  it("includes 'Employment Verifications' as a chip in SERVICES", () => {
    expect(CONTACT).toMatch(
      /const\s+SERVICES\s*=\s*\[[\s\S]*?"Employment Verifications"/,
    );
  });

  it("maps the calculator 'employment' addon to 'Employment Verifications'", () => {
    expect(CONTACT).toMatch(
      /employment:\s*"Employment Verifications"/,
    );
  });

  it("never renders the legacy 'Employment Screening' label outside the rename note", () => {
    // Strip comments — both /* ... */ and JSX {/* ... */} — then ensure
    // the legacy label is gone.
    const stripped = CONTACT
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");
    expect(stripped).not.toContain("Employment Screening");
  });
});
