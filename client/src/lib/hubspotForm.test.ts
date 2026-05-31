/*
  §209 — Vitest invariants for the direct HubSpot Forms API submission
  helper used by /get-a-quote (and any future form that wants to
  bypass the Formspree → HubSpot integration mapping).

  Locks:
    A) Portal + form IDs match the values the site owner provided.
    B) Endpoint URL builder produces the documented HubSpot Forms API URL.
    C) buildHubspotFields drops empty / blank values so a stripped form
       can't overwrite an existing HubSpot contact property with empty data.
    D) buildHubspotFields preserves order so the wire payload is stable.
    E) readHubspotUtkCookie correctly parses the `hubspotutk` cookie.
    F) GetAQuote.tsx wires the helper into the onSubmit handler with a
       lead_source field, fire-and-forget semantics, and HubSpot's
       canonical contact-property internal names.
*/
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  HUBSPOT_PORTAL_ID,
  HUBSPOT_QUOTE_FORM_ID,
  hubspotFormsEndpoint,
  buildHubspotFields,
  formatQuoteRequestDetails,
  readHubspotUtkCookie,
  submitToHubspot,
} from "./hubspotForm";

const ROOT = resolve(__dirname, "../../..");
function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

// --- A) Portal + form IDs ---------------------------------------------------
describe("§209 — HubSpot portal + form IDs", () => {
  it("portal ID matches the value supplied by the site owner", () => {
    expect(HUBSPOT_PORTAL_ID).toBe("24249673");
  });

  it("quote form ID matches the value supplied by the site owner", () => {
    expect(HUBSPOT_QUOTE_FORM_ID).toBe("e0120c0d-1fad-4556-a0ee-bb0684797042");
  });
});

// --- B) Endpoint URL builder ------------------------------------------------
describe("§209 — hubspotFormsEndpoint URL builder", () => {
  it("produces the documented HubSpot Forms API submission URL", () => {
    const url = hubspotFormsEndpoint(HUBSPOT_PORTAL_ID, HUBSPOT_QUOTE_FORM_ID);
    expect(url).toBe(
      "https://api.hsforms.com/submissions/v3/integration/submit/24249673/e0120c0d-1fad-4556-a0ee-bb0684797042",
    );
  });

  it("uses the v3 integration endpoint (not the legacy v2 perform_submission)", () => {
    expect(hubspotFormsEndpoint("p", "f")).toMatch(
      /api\.hsforms\.com\/submissions\/v3\/integration\/submit\/p\/f/,
    );
  });
});

// --- C/D) buildHubspotFields ------------------------------------------------
describe("§209 — buildHubspotFields", () => {
  it("converts the flat record to HubSpot's array-of-objects shape", () => {
    const result = buildHubspotFields({
      email: "alice@example.com",
      firstname: "Alice",
    });
    expect(result).toEqual([
      { name: "email", value: "alice@example.com" },
      { name: "firstname", value: "Alice" },
    ]);
  });

  it("drops empty-string values so blanks can't overwrite existing HubSpot data", () => {
    const result = buildHubspotFields({
      email: "alice@example.com",
      phone: "",
      company: "   ",
      lead_source: "Get Started Form",
    });
    const names = result.map((f) => f.name);
    expect(names).toContain("email");
    expect(names).toContain("lead_source");
    expect(names).not.toContain("phone");
    expect(names).not.toContain("company");
  });

  it("preserves insertion order so the wire payload is stable", () => {
    const result = buildHubspotFields({
      a: "1",
      b: "2",
      c: "3",
    });
    expect(result.map((f) => f.name)).toEqual(["a", "b", "c"]);
  });

  it("trims whitespace from values", () => {
    const result = buildHubspotFields({ firstname: "  Alice  " });
    expect(result[0].value).toBe("Alice");
  });
});

// --- E) readHubspotUtkCookie ------------------------------------------------
describe("§209 — readHubspotUtkCookie", () => {
  const original = (() => {
    if (typeof document === "undefined") return undefined;
    return document.cookie;
  })();

  afterEach(() => {
    if (typeof document !== "undefined" && original !== undefined) {
      // jsdom: clear by setting empty
      document.cookie = "hubspotutk=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
  });

  it("returns undefined when the cookie is absent", () => {
    if (typeof document === "undefined") return; // node env, skip
    document.cookie = "hubspotutk=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    expect(readHubspotUtkCookie()).toBeUndefined();
  });

  it("returns the cookie value when present", () => {
    if (typeof document === "undefined") return; // node env, skip
    document.cookie = "hubspotutk=abc123token; path=/";
    expect(readHubspotUtkCookie()).toBe("abc123token");
  });
});

// --- E.5) §210 formatQuoteRequestDetails -----------------------------------
describe("§210 — formatQuoteRequestDetails", () => {
  it("renders the canonical multi-line summary when all fields are populated", () => {
    const out = formatQuoteRequestDetails({
      role: "HR Director",
      volume: "100–500 hires/yr",
      services: "County criminal, MVR, education verification",
      ats: "Greenhouse",
      timeline: "Ready to start within 30 days",
      message: "We need to switch fast.\nCurrent vendor is too slow.",
      submittedAtIso: "2026-05-31T16:42:00.000Z",
      sourcePageUri: "https://rapidhiresolutions.com/get-a-quote",
    });
    expect(out).toContain("Submitted: 2026-05-31 16:42:00 UTC");
    expect(out).toContain("Source: https://rapidhiresolutions.com/get-a-quote");
    expect(out).toContain("Role / Title: HR Director");
    expect(out).toContain("Hiring Volume: 100–500 hires/yr");
    expect(out).toContain("Services of Interest: County criminal, MVR, education verification");
    expect(out).toContain("ATS in Use: Greenhouse");
    expect(out).toContain("Timeline: Ready to start within 30 days");
    expect(out).toContain("Message:\nWe need to switch fast.");
  });

  it("silently omits empty fields so partial submissions stay clean", () => {
    const out = formatQuoteRequestDetails({
      role: "HR Director",
      volume: "",
      services: "  ", // whitespace-only counts as empty
      ats: undefined,
      timeline: "Q3",
      message: "",
      submittedAtIso: "2026-05-31T16:42:00.000Z",
      sourcePageUri: "https://rapidhiresolutions.com/get-a-quote",
    });
    expect(out).toContain("Role / Title: HR Director");
    expect(out).toContain("Timeline: Q3");
    expect(out).not.toContain("Hiring Volume:");
    expect(out).not.toContain("Services of Interest:");
    expect(out).not.toContain("ATS in Use:");
    expect(out).not.toContain("Message:");
  });

  it("renders just the metadata header when no body fields are populated", () => {
    const out = formatQuoteRequestDetails({
      submittedAtIso: "2026-05-31T16:42:00.000Z",
      sourcePageUri: "https://rapidhiresolutions.com/get-a-quote",
    });
    // The header should still ship even with no fields, so sales sees
    // "someone submitted at X but didn't fill anything optional in".
    expect(out).toContain("Submitted: 2026-05-31 16:42:00 UTC");
    expect(out).toContain("Source: https://rapidhiresolutions.com/get-a-quote");
  });

  it("falls back to current time when submittedAtIso is omitted", () => {
    const out = formatQuoteRequestDetails({ role: "x" });
    // We can't pin the exact timestamp, but it must follow the canonical
    // "YYYY-MM-DD HH:MM:SS UTC" shape.
    expect(out).toMatch(/^Submitted: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC/);
  });
});

// --- F) GetAQuote.tsx integration -------------------------------------------
describe("§209 — GetAQuote.tsx HubSpot wiring", () => {
  const src = read("client/src/pages/GetAQuote.tsx");

  it("imports submitToHubspot, buildHubspotFields, and readHubspotUtkCookie", () => {
    expect(src).toMatch(/from\s+["']@\/lib\/hubspotForm["']/);
    expect(src).toMatch(/buildHubspotFields/);
    expect(src).toMatch(/submitToHubspot/);
    expect(src).toMatch(/readHubspotUtkCookie/);
  });

  it("forwards lead_source into the HubSpot fields object", () => {
    expect(src).toMatch(/lead_source:\s*payload\.lead_source/);
  });

  it("uses HubSpot's canonical contact-property internal names (firstname/lastname, not firstName)", () => {
    // Look INSIDE the buildHubspotFields(...) call so we don't false-match
    // the Formspree payload's camelCase field names.
    const block = src.match(/buildHubspotFields\(\{[\s\S]*?\}\);?/);
    expect(block).not.toBeNull();
    if (!block) return;
    const fieldsBlock = block[0];
    expect(fieldsBlock).toMatch(/firstname:/);
    expect(fieldsBlock).toMatch(/lastname:/);
    expect(fieldsBlock).toMatch(/lead_source:/);
    // §210 — quote_request_details bundle replaces the five separate
    // custom-property submissions (jobtitle, hiring_volume,
    // services_of_interest, ats_in_use, timeline) with one summary.
    expect(fieldsBlock).toMatch(/quote_request_details:/);
    // The five would-be-separate fields must NOT be sent as standalone
    // HubSpot properties anymore — they're bundled inside the summary.
    expect(fieldsBlock).not.toMatch(/jobtitle:/);
    expect(fieldsBlock).not.toMatch(/hiring_volume:/);
    expect(fieldsBlock).not.toMatch(/services_of_interest:/);
    expect(fieldsBlock).not.toMatch(/ats_in_use:/);
    expect(fieldsBlock).not.toMatch(/^\s*timeline:/m);
  });

  it("fires the HubSpot submission as fire-and-forget (NOT awaited inline)", () => {
    // The user's success state must come from the Formspree POST, not from
    // HubSpot. Pin: there must be a `void hubspotPromise.catch(...)` so the
    // unhandled-rejection guard is in place but the await on the user-
    // facing success state is the FORMSPREE one.
    expect(src).toMatch(/void\s+hubspotPromise\.catch/);
    // The Formspree submission must still be the awaited one driving setSubmitted
    expect(src).toMatch(/await\s+fetch\(QUOTE_FORMSPREE_ENDPOINT/);
  });
});

// --- G) submitToHubspot wire shape ------------------------------------------
describe("§209 — submitToHubspot wire shape", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // mock fetch to capture the request
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("POSTs JSON with Content-Type and Accept set to application/json", async () => {
    const captured: { url?: string; init?: RequestInit } = {};
    globalThis.fetch = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      captured.url = String(url);
      captured.init = init;
      return new Response(JSON.stringify({ inlineMessage: "Thanks for submitting!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const result = await submitToHubspot({
      fields: [{ name: "email", value: "alice@example.com" }],
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(captured.url).toBe(
      "https://api.hsforms.com/submissions/v3/integration/submit/24249673/e0120c0d-1fad-4556-a0ee-bb0684797042",
    );
    expect(captured.init?.method).toBe("POST");
    const headers = captured.init?.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["Accept"]).toBe("application/json");
    const body = JSON.parse(String(captured.init?.body ?? "{}"));
    expect(body.fields).toEqual([{ name: "email", value: "alice@example.com" }]);
  });

  it("returns a structured failure object instead of throwing on network error", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error("network down");
    }) as typeof fetch;

    const result = await submitToHubspot({ fields: [] });
    expect(result.ok).toBe(false);
    expect(result.status).toBe(0);
  });
});
