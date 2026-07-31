import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ATTRIBUTION_STORAGE_KEY,
  ATTRIBUTION_TTL_MS,
  buildAttributionSubmission,
  captureAttribution,
  classifyLeadSource,
  resetAttributionForTests,
} from "./leadAttribution";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.stubGlobal("localStorage", createStorage());
  vi.stubGlobal("window", {
    location: {
      href: "https://rapidhiresolutions.com/",
      origin: "https://rapidhiresolutions.com",
      pathname: "/",
      search: "",
    },
  });
  vi.stubGlobal("document", { referrer: "" });
  resetAttributionForTests();
});

describe("first-party lead attribution", () => {
  it("captures first touch without overwriting it and updates meaningful last touch", () => {
    const first = captureAttribution(
      "https://rapidhiresolutions.com/?gclid=click-1&utm_source=google&utm_medium=cpc&utm_campaign=first",
      "https://www.google.com/search?q=screening",
      new Date("2026-01-01T00:00:00.000Z"),
    );
    const navigated = captureAttribution(
      "https://rapidhiresolutions.com/services",
      "",
      new Date("2026-01-02T00:00:00.000Z"),
    );
    const last = captureAttribution(
      "https://rapidhiresolutions.com/contact?utm_source=linkedin&utm_medium=referral&partner_id=p-7&ref=rep-2",
      "https://www.linkedin.com/feed/",
      new Date("2026-01-03T00:00:00.000Z"),
    );

    expect(first?.original_landing_page).toContain("gclid=click-1");
    expect(navigated?.first_touch).toEqual(first?.first_touch);
    expect(navigated?.last_touch_timestamp).toBe(first?.last_touch_timestamp);
    expect(last?.first_touch.gclid).toBe("click-1");
    expect(last?.first_touch.utm_campaign).toBe("first");
    expect(last?.last_touch.utm_source).toBe("linkedin");
    expect(last?.last_touch.partner_id).toBe("p-7");
    expect(last?.last_touch.ref).toBe("rep-2");
    expect(last?.last_touch_timestamp).toBe("2026-01-03T00:00:00.000Z");
    expect(localStorage.getItem(ATTRIBUTION_STORAGE_KEY)).toContain("click-1");
  });

  it("persists click IDs across navigation and resets expired attribution", () => {
    const started = new Date("2026-01-01T00:00:00.000Z");
    captureAttribution(
      "https://rapidhiresolutions.com/lp?gclid=g-1&gbraid=gb-1&wbraid=wb-1",
      "",
      started,
    );
    const persisted = captureAttribution(
      "https://rapidhiresolutions.com/get-a-quote",
      "",
      new Date(started.getTime() + 24 * 60 * 60 * 1000),
    );
    expect(persisted?.first_touch).toMatchObject({
      gclid: "g-1",
      gbraid: "gb-1",
      wbraid: "wb-1",
    });

    const reset = captureAttribution(
      "https://rapidhiresolutions.com/contact?utm_source=new",
      "",
      new Date(started.getTime() + ATTRIBUTION_TTL_MS + 1),
    );
    expect(reset?.original_landing_page).toBe("/contact?utm_source=new");
    expect(reset?.first_touch.gclid).toBeUndefined();
    expect(reset?.first_touch.utm_source).toBe("new");
  });

  it("classifies sources in the approved priority order", () => {
    const google = captureAttribution(
      "https://rapidhiresolutions.com/?gclid=paid&partner_id=partner",
      "",
    );
    expect(classifyLeadSource(google)).toBe("Google Ads");

    resetAttributionForTests();
    const referral = captureAttribution(
      "https://rapidhiresolutions.com/?partner_id=partner&ref=rep",
      "",
    );
    expect(classifyLeadSource(referral)).toBe("Sales Referral");

    resetAttributionForTests();
    const organic = captureAttribution(
      "https://rapidhiresolutions.com/",
      "https://www.bing.com/search?q=background+checks",
    );
    expect(classifyLeadSource(organic)).toBe("Organic Search");

    resetAttributionForTests();
    expect(classifyLeadSource(captureAttribution("https://rapidhiresolutions.com/", ""))).toBe(
      "Direct/Unknown",
    );
  });

  it("builds a non-PII Formspree attribution payload with one submission ID", () => {
    captureAttribution(
      "https://rapidhiresolutions.com/lp?gclid=g-1&utm_source=google&utm_medium=cpc&utm_campaign=summer&partner_id=p-1&ref=r-1",
      "https://www.google.com/",
    );
    const submission = buildAttributionSubmission();

    expect(submission.clientSubmissionId).toBeTruthy();
    expect(submission.fields.client_submission_id).toBe(
      submission.clientSubmissionId,
    );
    expect(submission.fields).toMatchObject({
      lead_source: "Google Ads",
      gclid: "g-1",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "summer",
      partner_id: "p-1",
      ref: "r-1",
      original_landing_page:
        "/lp?gclid=g-1&utm_source=google&utm_medium=cpc&utm_campaign=summer&partner_id=p-1&ref=r-1",
    });
    expect(Object.keys(submission.fields)).not.toEqual(
      expect.arrayContaining(["name", "email", "phone", "company", "notes"]),
    );
  });
});
