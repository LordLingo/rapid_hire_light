/*
  §174 — The Saturday on-call shift and the Sunday voicemail card were
  removed from /support per business decision. The user explicitly
  asked us to:
    1. Drop the two weekend cards from the coverage grid below "When
       the team is on the desk."
    2. Replace them with a single "Weekends" card directing visitors
       to email and promising a real-person reply by 8am Monday.
    3. Keep the rest of the page consistent: the FAQ answer about
       after-hours, the JSON-LD `OpeningHoursSpecification`, the
       intro paragraph, and the Saturday-on-call mention on the
       Industries page.

  These pins make sure the change holds across visual-editor edits,
  re-arranges, and future copy passes.
*/
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const ROOT = path.resolve(__dirname, "../../..");
const supportSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Support.tsx"),
  "utf8",
);
const industriesSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Industries.tsx"),
  "utf8",
);

describe("Weekend coverage removal (§174)", () => {
  it("Support coverage grid no longer renders Saturday or Sunday cards", () => {
    // The old card data literals must be gone.
    expect(supportSrc).not.toMatch(/label:\s*"Saturday"/);
    expect(supportSrc).not.toMatch(/label:\s*"Sunday"/);
    expect(supportSrc).not.toMatch(/value:\s*"9:00 AM \u2013 1:00 PM Central"/);
    expect(supportSrc).not.toMatch(/value:\s*"Voicemail"/);
    expect(supportSrc).not.toMatch(/On-call shift; reduced staff/);
    expect(supportSrc).not.toMatch(/Returned Monday by 8am Central/);
  });

  it("Support coverage grid renders a Weekends/email card with Monday-reply promise", () => {
    expect(supportSrc).toMatch(/label:\s*"Weekends"/);
    expect(supportSrc).toMatch(/value:\s*"Email anytime"/);
    expect(supportSrc).toMatch(
      /A real person replies by 8am Central, Monday/,
    );
  });

  it("coverage grid is now a 2-column layout (was sm:grid-cols-3)", () => {
    expect(supportSrc).toMatch(/grid-cols-1\s+sm:grid-cols-2/);
    expect(supportSrc).not.toMatch(/grid grid-cols-1 sm:grid-cols-3/);
  });

  it("intro paragraph above the grid no longer mentions voicemail", () => {
    // The old "If you leave a voicemail, you'll hear back from a
    // real person" line is gone.
    expect(supportSrc).not.toMatch(/leave a voicemail, you'll hear back/);
    // The new copy asks visitors to email and promises Monday 8am.
    expect(supportSrc).toMatch(
      /Email\s*\n?\s*us over the weekend and a real person/,
    );
    expect(supportSrc).toMatch(/replies first thing Monday morning by 8am Central/);
  });

  it("after-hours FAQ answer was rewritten to point at email + Monday reply", () => {
    // Old "Saturdays from 9am\u20131pm" answer is gone.
    expect(supportSrc).not.toMatch(/Saturdays from 9am\u20131pm Central we run/);
    // New answer name-checks Prosper, Texas and the 8am Monday SLA.
    expect(supportSrc).toMatch(/Prosper, Texas reads it first thing Monday/);
    expect(supportSrc).toMatch(/reply by 8am Central/);
  });

  it("JSON-LD OpeningHoursSpecification no longer publishes Saturday hours", () => {
    // The Saturday OpeningHoursSpecification block must be gone so
    // structured-data search results don't lie about weekend hours.
    expect(supportSrc).not.toMatch(/dayOfWeek:\s*\["Saturday"\]/);
    expect(supportSrc).not.toMatch(/opens:\s*"09:00",\s*\n\s*closes:\s*"13:00"/);
    // Only the Monday\u2013Friday spec should remain. The 07:00\u201319:00
    // window is the canonical desk window.
    expect(supportSrc).toMatch(/opens:\s*"07:00"/);
    expect(supportSrc).toMatch(/closes:\s*"19:00"/);
  });

  it("Support comparison row no longer claims Saturday on-call", () => {
    // The "Hours covered live" feature row in the Support comparison
    // table previously said `7am–7pm Central, M–F + Sat on-call`.
    // The user asked for the Sat on-call clause gone; the rapid cell
    // is now flat M–F.
    expect(supportSrc).not.toMatch(/M–F\s*\+\s*Sat on-call/);
    expect(supportSrc).toMatch(
      /question:\s*"Hours covered live",\s*\n\s*rapid:\s*"7am–7pm Central, M–F",/,
    );
  });

  it("Compliance page contact row no longer claims Saturday on-call", () => {
    const compliancePath = path.join(
      ROOT,
      "client/src/pages/Compliance.tsx",
    );
    const complianceSrc = fs.readFileSync(compliancePath, "utf8");
    // The U.S.-specialist contact row used to read `Mon–Fri 7am–7pm
    // CT · Sat on-call`. The Sat on-call half is gone.
    expect(complianceSrc).not.toMatch(/Sat on-call/);
    expect(complianceSrc).toMatch(/Mon–Fri 7am–7pm CT/);
  });

  it("Industries CTA paragraph no longer promises Saturday on-call", () => {
    expect(industriesSrc).not.toMatch(/with\s+\n?\s*Saturday on-call/);
    expect(industriesSrc).not.toMatch(/Saturday on-call/);
    // New copy preserves the M\u2013F desk hours and shifts the weekend
    // promise to email-with-Monday-reply.
    expect(industriesSrc).toMatch(/Monday through Friday, 7am to 7pm Central/);
    expect(industriesSrc).toMatch(
      /Email\s*\n?\s*us over the weekend and a real person replies by 8am Monday/,
    );
  });
});
