/*
  §159 — Formspree endpoint single-source-of-truth invariants.

  The whole point of @/lib/formspree is that exactly ONE module owns the
  endpoint literal and every consumer imports from it. If anyone hard-codes
  a Formspree URL into a page, points a form back at /api/contact, or
  fat-fingers the form id, these tests fail before deploy.

  We also pin the runtime values (form id + full URL) so a careless
  refactor of the module itself cannot silently move the destination
  inbox.
*/
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { FORMSPREE_ENDPOINT, FORMSPREE_FORM_ID } from "./formspree";

const ROOT = resolve(__dirname, "..", "..", "..");

const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

const CONTACT = read("client/src/pages/Contact.tsx");
const GET_A_QUOTE = read("client/src/pages/GetAQuote.tsx");
const COMPLIANCE_AUDIT = read("client/src/pages/ComplianceAudit.tsx");
const FORMSPREE_LIB = read("client/src/lib/formspree.ts");

describe("§159 — runtime constants", () => {
  it("FORMSPREE_FORM_ID is the live form id 'mvzyoyoz'", () => {
    expect(FORMSPREE_FORM_ID).toBe("mvzyoyoz");
  });

  it("FORMSPREE_ENDPOINT is the full https URL for that form id", () => {
    expect(FORMSPREE_ENDPOINT).toBe("https://formspree.io/f/mvzyoyoz");
  });

  it("FORMSPREE_ENDPOINT is built from FORMSPREE_FORM_ID — not a duplicate literal", () => {
    // Re-derive the URL from the form id and require equality. This prevents
    // someone from updating one constant and forgetting the other.
    expect(FORMSPREE_ENDPOINT).toBe(
      `https://formspree.io/f/${FORMSPREE_FORM_ID}`,
    );
  });

  it("the module exposes both named exports", () => {
    expect(FORMSPREE_LIB).toMatch(
      /export const FORMSPREE_FORM_ID\s*=\s*"mvzyoyoz"/,
    );
    expect(FORMSPREE_LIB).toMatch(/export const FORMSPREE_ENDPOINT/);
  });
});

describe("§159 — every quote/contact form imports the shared endpoint", () => {
  const CONSUMERS: Array<[string, string]> = [
    ["Contact.tsx", CONTACT],
    ["GetAQuote.tsx", GET_A_QUOTE],
    ["ComplianceAudit.tsx", COMPLIANCE_AUDIT],
  ];

  for (const [name, src] of CONSUMERS) {
    it(`${name} imports FORMSPREE_ENDPOINT from @/lib/formspree`, () => {
      expect(src).toMatch(
        /import \{ FORMSPREE_ENDPOINT \} from "@\/lib\/formspree"/,
      );
    });

    it(`${name} actually calls fetch() with FORMSPREE_ENDPOINT (directly or via re-export)`, () => {
      // Contact + ComplianceAudit fetch FORMSPREE_ENDPOINT directly.
      // GetAQuote keeps a local re-export name (QUOTE_FORMSPREE_ENDPOINT)
      // for back-compat with §111 tests; accept either form.
      expect(src).toMatch(/fetch\(\s*(FORMSPREE_ENDPOINT|QUOTE_FORMSPREE_ENDPOINT)\b/);
    });

    it(`${name} sends Accept: application/json so Formspree returns JSON, not a redirect`, () => {
      expect(src).toMatch(/Accept:\s*"application\/json"/);
    });
  }
});

describe("§159 — anti-regression: no stray Formspree URL literals", () => {
  /*
    Scan the entire client/src tree for hard-coded Formspree URLs. The only
    place a literal `formspree.io/f/...` URL may appear is inside
    @/lib/formspree itself (the source-of-truth) — and only the live form id.
    No other file may pin a different id, an old id, or a copy-pasted URL.
  */
  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) walk(full, out);
      else if (/\.(ts|tsx)$/.test(entry.name)) {
        // Exclude vitest spec files — those are *expected* to mention the
        // URL because they are the regressions guarding it.
        if (/\.test\.tsx?$/.test(entry.name)) continue;
        out.push(full);
      }
    }
    return out;
  }

  const SRC_FILES = walk(resolve(ROOT, "client/src"));
  const LIB_FILE = resolve(ROOT, "client/src/lib/formspree.ts");

  it("the live URL https://formspree.io/f/mvzyoyoz appears only in the shared module", () => {
    const offenders: Array<{ file: string; snippet: string }> = [];
    for (const file of SRC_FILES) {
      if (file === LIB_FILE) continue;
      const text = readFileSync(file, "utf8");
      // Strip comments first so explanatory notes can't false-positive.
      const stripped = text
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/.*$/gm, "$1");
      const re = /formspree\.io\/f\/[a-z0-9_-]+/gi;
      const hits = stripped.match(re);
      if (hits && hits.length > 0) {
        offenders.push({ file, snippet: hits.join(", ") });
      }
    }
    expect(
      offenders,
      `Found hard-coded Formspree URL(s) outside @/lib/formspree:\n${offenders
        .map((o) => `  ${o.file}: ${o.snippet}`)
        .join("\n")}`,
    ).toEqual([]);
  });

  it("no legacy Formspree form ids (xnjrqler) survive anywhere in client source", () => {
    const offenders: string[] = [];
    for (const file of SRC_FILES) {
      const text = readFileSync(file, "utf8");
      // Strip comments so the §159 audit-trail notes can't false-positive.
      const stripped = text
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/.*$/gm, "$1");
      if (/formspree\.io\/f\/xnjrqler/.test(stripped)) {
        offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("§159 — the GetAQuote back-compat re-export still resolves to mvzyoyoz", () => {
  it("QUOTE_FORMSPREE_ENDPOINT is sourced from the shared module, not a duplicate literal", () => {
    expect(GET_A_QUOTE).toMatch(
      /export const QUOTE_FORMSPREE_ENDPOINT\s*=\s*FORMSPREE_ENDPOINT/,
    );
    expect(GET_A_QUOTE).not.toMatch(
      /export const QUOTE_FORMSPREE_ENDPOINT\s*=\s*"https/,
    );
  });
});

describe("§159 — ComplianceAudit migration off /api/contact", () => {
  it("no longer fetches /api/contact", () => {
    // Strip comments so the §159 audit-trail notes don't false-positive.
    const stripped = COMPLIANCE_AUDIT
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");
    expect(stripped).not.toMatch(/fetch\(\s*"\/api\/contact"/);
  });

  it("packs audit-specific fields with a clear _subject so audit bookings stay identifiable", () => {
    expect(COMPLIANCE_AUDIT).toMatch(/\[Compliance Audit Request\]/);
    expect(COMPLIANCE_AUDIT).toMatch(/_subject:[\s\S]{0,200}Compliance audit request/);
  });
});
