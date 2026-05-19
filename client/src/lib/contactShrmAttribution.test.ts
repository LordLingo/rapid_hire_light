/*
  §140.4 — Contact-side SHRM attribution + UTM consumption contract.

  Two layers of testing:

    (a) Behavior — readShrmUtm() and formatUtmAttribution() are
        exported from Contact.tsx specifically so this spec can
        exercise them without rendering the full React tree (which
        would require jsdom + mocking wouter's useSearch). vitest
        runs in a node environment, so we explicitly mock window /
        sessionStorage where the helpers need it.

    (b) Static analysis — the spec also reads Contact.tsx as text and
        verifies the SHRM attribution surfaces are wired into the
        component (textarea defaultValue, Formspree _subject branch,
        utm payload field, contact-shrm-attribution-note).

  This avoids a heavy jsdom + wouter mock setup while still pinning
  every contract that matters.
*/
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  readShrmUtm,
  formatUtmAttribution,
} from "../pages/Contact";
import { SHRM_UTM_KEY } from "./shrm";

const CONTACT_SRC = readFileSync(
  resolve(__dirname, "..", "pages", "Contact.tsx"),
  "utf8",
);

// ----- (a) Behavior: helper functions ----------------------------------------

describe("§140.3 — readShrmUtm()", () => {
  // Provide a minimal sessionStorage shim on globalThis.window for the
  // duration of each test. We restore between tests to keep ordering
  // independent.
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const fakeStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        store = {};
      },
    };
    vi.stubGlobal("window", {
      sessionStorage: fakeStorage,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns {} when sessionStorage has no entry", () => {
    expect(readShrmUtm()).toEqual({});
  });

  it("hydrates a previously captured UTM map", () => {
    store[SHRM_UTM_KEY] = JSON.stringify({
      utm_source: "linkedin",
      utm_medium: "cpc",
      utm_campaign: "shrm-2026-pre-event",
    });
    expect(readShrmUtm()).toEqual({
      utm_source: "linkedin",
      utm_medium: "cpc",
      utm_campaign: "shrm-2026-pre-event",
    });
  });

  it("ignores non-string values silently", () => {
    store[SHRM_UTM_KEY] = JSON.stringify({
      utm_source: "linkedin",
      utm_medium: 42, // numeric — must be dropped, not coerced
      utm_campaign: null,
    });
    expect(readShrmUtm()).toEqual({ utm_source: "linkedin" });
  });

  it("returns {} when the entry is malformed JSON", () => {
    store[SHRM_UTM_KEY] = "not-json";
    expect(readShrmUtm()).toEqual({});
  });

  it("returns {} when the entry is JSON but not an object", () => {
    store[SHRM_UTM_KEY] = JSON.stringify(["a", "b", "c"]);
    expect(readShrmUtm()).toEqual({});
  });

  it("returns {} when the entry is null literal", () => {
    store[SHRM_UTM_KEY] = "null";
    expect(readShrmUtm()).toEqual({});
  });
});

describe("§140.3 — formatUtmAttribution()", () => {
  it("returns empty string for empty map", () => {
    expect(formatUtmAttribution({})).toBe("");
  });

  it("emits a single key as a one-liner", () => {
    expect(formatUtmAttribution({ utm_source: "linkedin" })).toBe(
      "\n\n— via utm_source=linkedin",
    );
  });

  it("emits multiple keys in canonical order", () => {
    // We pass them in a deliberately scrambled order to prove the
    // function imposes its own canonical ordering.
    expect(
      formatUtmAttribution({
        utm_term: "fcra",
        utm_source: "linkedin",
        utm_campaign: "shrm-2026-pre-event",
        utm_medium: "cpc",
      }),
    ).toBe(
      "\n\n— via utm_source=linkedin, utm_medium=cpc, utm_campaign=shrm-2026-pre-event, utm_term=fcra",
    );
  });

  it("ignores keys outside the canonical UTM list", () => {
    expect(
      formatUtmAttribution({
        utm_source: "linkedin",
        // not a UTM key — must be dropped
        random_key: "drop-me",
      } as Record<string, string>),
    ).toBe("\n\n— via utm_source=linkedin");
  });

  it("skips empty-string values", () => {
    expect(
      formatUtmAttribution({
        utm_source: "linkedin",
        utm_medium: "",
      }),
    ).toBe("\n\n— via utm_source=linkedin");
  });
});

// ----- (b) Static analysis: Contact.tsx wiring -------------------------------

describe("§140.2 — Contact.tsx wires SHRM source/subject params", () => {
  it("imports SHRM_UTM_KEY from @/lib/shrm", () => {
    expect(CONTACT_SRC).toMatch(
      /import\s+\{\s*SHRM_UTM_KEY\s*\}\s+from\s+["']@\/lib\/shrm["']/,
    );
  });

  it("reads the 'subject' query param", () => {
    expect(CONTACT_SRC).toMatch(/params\.get\("subject"\)/);
  });

  it("reads the 'source' query param and sets cameFromShrm flag", () => {
    expect(CONTACT_SRC).toMatch(/params\.get\("source"\)/);
    expect(CONTACT_SRC).toMatch(
      /cameFromShrm\s*=\s*prefillSource\s*===\s*"shrm-2026"/,
    );
  });

  it("renders the SHRM attribution note testid in the form", () => {
    expect(CONTACT_SRC).toMatch(
      /data-testid="contact-shrm-attribution-note"/,
    );
    // Conditional on cameFromShrm so it only appears for SHRM funnel
    // traffic, not on every page load.
    expect(CONTACT_SRC).toMatch(/\{cameFromShrm && \(/);
  });

  it("flips the Formspree _subject prefix when cameFromShrm is true", () => {
    expect(CONTACT_SRC).toMatch(/SHRM 2026 \u2014 meeting request/);
    expect(CONTACT_SRC).toMatch(
      /_subject:\s*cameFromShrm[\s\S]*?SHRM 2026[\s\S]*?:\s*`New contact request/,
    );
  });

  it("includes source/subject in the Formspree payload via spread", () => {
    expect(CONTACT_SRC).toMatch(
      /\.\.\.\(prefillSource\s*\?\s*\{\s*source:\s*prefillSource\s*\}\s*:\s*\{\}\)/,
    );
    expect(CONTACT_SRC).toMatch(
      /\.\.\.\(prefillSubject\s*\?\s*\{\s*subject:\s*prefillSubject\s*\}\s*:\s*\{\}\)/,
    );
  });
});

describe("§140.3 — Contact.tsx wires UTM hydration + payload", () => {
  it("calls readShrmUtm() to seed local state", () => {
    expect(CONTACT_SRC).toMatch(
      /useState<Record<string,\s*string>>\(\(\)\s*=>\s*readShrmUtm\(\)\)/,
    );
  });

  it("derives utmAttribution via formatUtmAttribution(shrmUtm)", () => {
    expect(CONTACT_SRC).toMatch(
      /formatUtmAttribution\(shrmUtm\)/,
    );
  });

  it("appends the attribution to the prefilled message", () => {
    // The prefillMessage useMemo must reference both prefillNote and
    // utmAttribution so the textarea defaultValue carries the footer
    // when UTMs are present.
    expect(CONTACT_SRC).toMatch(/const\s+prefillMessage\s*=\s*useMemo/);
    expect(CONTACT_SRC).toMatch(
      /base\s*\+\s*utmAttribution/,
    );
  });

  it("uses prefillMessage as the textarea defaultValue", () => {
    expect(CONTACT_SRC).toMatch(/defaultValue=\{prefillMessage\}/);
    // The old defaultValue must no longer be present.
    expect(CONTACT_SRC).not.toMatch(/defaultValue=\{prefillNote\}/);
  });

  it("includes UTM JSON in the Formspree payload only when present", () => {
    expect(CONTACT_SRC).toMatch(
      /\.\.\.\(Object\.keys\(shrmUtm\)\.length\s*>\s*0[\s\S]*?utm:\s*JSON\.stringify\(shrmUtm\)/,
    );
  });

  it("exports readShrmUtm and formatUtmAttribution for spec access", () => {
    expect(CONTACT_SRC).toMatch(/export function readShrmUtm/);
    expect(CONTACT_SRC).toMatch(/export function formatUtmAttribution/);
  });
});
