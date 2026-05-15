/*
  Spec: pin the live contact details across the site so a future copy edit
  cannot quietly regress them.

  Reads the actual source files for /support, /contact, the ContactCallCard
  hero card, and the candidate contact form, then asserts:

    - The real phone number `(888) 445-3047` and tel:+18884453047 are present
      on every page that surfaces a phone CTA.
    - `info@rapidhiresolutions.com` and `sales@rapidhiresolutions.com` are
      present on /contact and /support.
    - The retired placeholders are gone everywhere:
        * (888) 555-0142
        * +18885550142
        * candidates@rapidhiresolutions.com
        * support@rapidhiresolutions.com
        * hello@rapidhiresolutions.com
    - CandidateContactForm no longer takes a required `candidateEmail` prop
      (the candidates@ inbox was retired); the optional `fallbackEmail` prop
      replaces it.

  These are simple file-text reads, not a runtime DOM mount, because the
  values are static in source. Catching them in CI is the goal.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../../..");
function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const RETIRED = [
  "(888) 555-0142",
  "+18885550142",
  "candidates@rapidhiresolutions.com",
  "support@rapidhiresolutions.com",
  "hello@rapidhiresolutions.com",
];

const PHONE_DISPLAY = "(888) 445-3047";
const PHONE_TEL = "+18884453047";
const SUPPORT_EMAIL = "info@rapidhiresolutions.com";
const SALES_EMAIL = "sales@rapidhiresolutions.com";

describe("contact info — phone & email sweep", () => {
  const supportSrc = read("client/src/pages/Support.tsx");
  const contactSrc = read("client/src/pages/Contact.tsx");
  const heroCardsSrc = read("client/src/components/heroes/HeroCards.tsx");
  const candidateFormSrc = read(
    "client/src/components/site/CandidateContactForm.tsx",
  );

  it("places the real phone number on the Support page", () => {
    expect(supportSrc).toContain(PHONE_DISPLAY);
    expect(supportSrc).toContain(PHONE_TEL);
  });

  it("places the real phone number on the Contact page", () => {
    expect(contactSrc).toContain(PHONE_DISPLAY);
    expect(contactSrc).toContain(`tel:${PHONE_TEL}`);
  });

  it("places the real phone number on the inbound-call hero card", () => {
    expect(heroCardsSrc).toContain(PHONE_DISPLAY);
  });

  it("uses info@ for support inbox on /support and /contact", () => {
    expect(supportSrc).toContain(SUPPORT_EMAIL);
    expect(contactSrc).toContain(SUPPORT_EMAIL);
  });

  it("surfaces the sales inbox on /support and /contact", () => {
    expect(supportSrc).toContain(SALES_EMAIL);
    expect(contactSrc).toContain(SALES_EMAIL);
  });

  it("emits a sales ContactPoint in the Support JSON-LD block", () => {
    // The Support page builds an Organization JSON-LD with contactPoint[].
    // We just need to know the sales inbox is referenced near contactType: 'sales'.
    expect(supportSrc).toMatch(/contactType:\s*"sales"/);
    expect(supportSrc).toMatch(/email:\s*SALES_EMAIL/);
  });

  it("removes every retired placeholder from production source files", () => {
    const everywhere = [supportSrc, contactSrc, heroCardsSrc, candidateFormSrc];
    for (const src of everywhere) {
      for (const banned of RETIRED) {
        expect(src).not.toContain(banned);
      }
    }
  });

  it("CandidateContactForm dropped the required `candidateEmail` prop", () => {
    // The new shape uses an optional `fallbackEmail` instead. We assert the
    // type alias is gone and the new one is in place.
    expect(candidateFormSrc).not.toMatch(/candidateEmail:\s*string/);
    expect(candidateFormSrc).toMatch(/fallbackEmail\?:\s*string/);
  });
});
