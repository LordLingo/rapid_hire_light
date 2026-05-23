/*
  Vitest pins for the /compliance/audit booking page (§64).

  These pins protect the page's structure, form fields, and the integration
  with the shared Formspree endpoint (§159 — migrated from /api/contact).
  They also enforce that the Compliance hero CTA points at /compliance/audit
  (not /contact) and that the route is registered in App.tsx.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..", "..");
const auditFile = fs.readFileSync(
  path.join(ROOT, "client/src/pages/ComplianceAudit.tsx"),
  "utf-8",
);
const appFile = fs.readFileSync(
  path.join(ROOT, "client/src/App.tsx"),
  "utf-8",
);
const complianceFile = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Compliance.tsx"),
  "utf-8",
);

describe("/compliance/audit — page exists & is wired", () => {
  it("ComplianceAudit page file exists with default export", () => {
    expect(auditFile).toMatch(/export default function ComplianceAudit/);
  });

  it("App.tsx imports the page and registers /compliance/audit BEFORE /compliance", () => {
    expect(appFile).toMatch(
      /import ComplianceAudit from "\.\/pages\/ComplianceAudit"/,
    );
    const auditRouteIdx = appFile.indexOf(
      'path={"/compliance/audit"} component={ComplianceAudit}',
    );
    const baseRouteIdx = appFile.indexOf(
      'path={"/compliance"} component={Compliance}',
    );
    expect(auditRouteIdx).toBeGreaterThan(-1);
    expect(baseRouteIdx).toBeGreaterThan(-1);
    // wouter matches first hit, so the more specific /compliance/audit must come first.
    expect(auditRouteIdx).toBeLessThan(baseRouteIdx);
  });

  it("Compliance hero CTA is re-pointed to /compliance/audit (not /contact)", () => {
    // Anti-regression: the previous href was /contact?topic=compliance-audit.
    // After §64 it must be /compliance/audit.
    const ctaSlice = complianceFile.slice(
      complianceFile.indexOf('data-testid="compliance-cta-audit"') - 200,
      complianceFile.indexOf('data-testid="compliance-cta-audit"') + 400,
    );
    expect(ctaSlice).toMatch(/href="\/compliance\/audit"/);
    expect(complianceFile).not.toMatch(
      /href="\/contact\?topic=compliance-audit"/,
    );
  });
});

describe("/compliance/audit — hero", () => {
  it("uses the '00 — Free 15-minute audit' eyebrow", () => {
    expect(auditFile).toMatch(/eyebrow="00 — Free 15-minute audit"/);
  });

  it("headline carries the italic accent on 'adverse-action workflow.'", () => {
    expect(auditFile).toMatch(/A 15-minute audit of your/);
    expect(auditFile).toMatch(
      /italic font-light text-\[color:var\(--color-accent-ink\)\][^>]*>\s*adverse-action workflow\./,
    );
  });

  it("hero exposes a primary CTA jumping to #book and a phone fallback", () => {
    expect(auditFile).toMatch(/data-testid="audit-cta-primary"/);
    expect(auditFile).toMatch(/href="#book"/);
    expect(auditFile).toMatch(/data-testid="audit-cta-call"/);
    expect(auditFile).toMatch(/href="tel:\+18884453047"/);
  });

  it("hero trust strip lists the four headline promises in order", () => {
    const strip = auditFile.slice(
      auditFile.indexOf('data-testid="audit-trust-strip"'),
      auditFile.indexOf('data-testid="audit-trust-strip"') + 1200,
    );
    const promises = [
      "No PII required on the call",
      "Written summary within 3 business days",
      "Statute & case-law citations on every finding",
      "No sales follow-up unless you ask",
    ];
    let cursor = 0;
    for (const p of promises) {
      const idx = strip.indexOf(p, cursor);
      expect(idx, `trust strip line missing or out of order: ${p}`).toBeGreaterThan(-1);
      cursor = idx + p.length;
    }
  });
});

describe("/compliance/audit — six surfaces grid", () => {
  it("renders all 6 surface cards in fixed order via SURFACES[] array", () => {
    // The cards are rendered with `data-testid={\`audit-surface-${s.id}\`}`
    // which is a runtime template literal — it does NOT appear verbatim in
    // source. Instead we pin the SURFACES[] array literal so the order and
    // ids that drive those testids are stable.
    const arrIdx = auditFile.indexOf("const SURFACES");
    expect(arrIdx).toBeGreaterThan(-1);
    const arrSlice = auditFile.slice(arrIdx, arrIdx + 3000);
    const ids = [
      "disclosure",
      "pre-adverse",
      "waiting",
      "eeoc",
      "disputes",
      "monitoring",
    ];
    let cursor = 0;
    for (const id of ids) {
      const marker = `id: "${id}"`;
      const idx = arrSlice.indexOf(marker, cursor);
      expect(idx, `surface id missing or out of order: ${id}`).toBeGreaterThan(-1);
      cursor = idx + marker.length;
    }
  });

  it("renders 6 surface cards via .map() with the runtime testid template", () => {
    expect(auditFile).toMatch(/SURFACES\.map\(/);
    expect(auditFile).toMatch(/data-testid=\{`audit-surface-\$\{s\.id\}`\}/);
  });

  it("section heading uses the italic 'Every one of them litigated.' accent", () => {
    expect(auditFile).toMatch(/Six surfaces\./);
    expect(auditFile).toMatch(
      /italic font-light text-\[color:var\(--color-accent-ink\)\][^>]*>\s*Every one of them litigated\./,
    );
  });
});

describe("/compliance/audit — booking form", () => {
  it("form section is anchored at id='book' with scroll-mt-24 on the same element", () => {
    // The first occurrence of `id="book"` in the source is in the top-of-file
    // comment listing sections; the JSX one is later. Walk all occurrences
    // and require at least one to live on a <section> tag with scroll-mt-24.
    const matches = [...auditFile.matchAll(/id="book"/g)];
    expect(matches.length).toBeGreaterThanOrEqual(2);
    const lastIdx = matches[matches.length - 1].index!;
    const block = auditFile.slice(lastIdx - 400, lastIdx + 400);
    expect(block).toMatch(/scroll-mt-24/);
  });

  it("form posts to the shared Formspree endpoint with JSON body (§159)", () => {
    expect(auditFile).toMatch(/await fetch\(FORMSPREE_ENDPOINT/);
    expect(auditFile).toMatch(
      /import \{ FORMSPREE_ENDPOINT \} from "@\/lib\/formspree"/,
    );
    expect(auditFile).toMatch(/"Content-Type":\s*"application\/json"/);
    // Anti-regression: the legacy /api/contact endpoint must NOT be present.
    expect(auditFile).not.toMatch(/fetch\("\/api\/contact"/);
  });

  it("payload prefixes message with [Compliance Audit Request] so submissions are searchable", () => {
    expect(auditFile).toMatch(/\[Compliance Audit Request\]/);
  });

  it("form has all required text/email/tel fields with stable names", () => {
    const requiredNames: Array<[string, string]> = [
      ["firstName", "text"],
      ["lastName", "text"],
      ["email", "email"],
      ["phone", "tel"],
      ["company", "text"],
      ["role", "text"],
      ["currentVendor", "text"],
    ];
    for (const [name] of requiredNames) {
      expect(auditFile, `missing form field name="${name}"`).toMatch(
        new RegExp(`name="${name}"`),
      );
    }
    // email field must declare type="email"
    expect(auditFile).toMatch(/name="email"[\s\S]{0,400}type="email"|type="email"[\s\S]{0,400}name="email"/);
    // phone field must declare type="tel"
    expect(auditFile).toMatch(/name="phone"[\s\S]{0,400}type="tel"|type="tel"[\s\S]{0,400}name="phone"/);
  });

  it("form has 4 select fields with stable names: companySize, industry, timing, focus", () => {
    for (const name of ["companySize", "industry", "timing", "focus"]) {
      expect(auditFile, `missing select name="${name}"`).toMatch(
        new RegExp(`name="${name}"`),
      );
    }
  });

  it("notes textarea exists and is the only textarea on the page", () => {
    expect(auditFile).toMatch(/name="notes"/);
    const matches = auditFile.match(/<textarea/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("submit button shows a loading state with Loader2 spinner", () => {
    expect(auditFile).toMatch(/data-testid="audit-form-submit"/);
    expect(auditFile).toMatch(/Loader2[^/]*animate-spin/);
  });

  it("success state replaces the form with the audit-form-success card", () => {
    expect(auditFile).toMatch(/data-testid="audit-form-success"/);
    expect(auditFile).toMatch(/Audit request received\./);
    expect(auditFile).toMatch(/within one business day/);
  });

  it("error state surfaces inline with role='alert'", () => {
    expect(auditFile).toMatch(/data-testid="audit-form-error"/);
    expect(auditFile).toMatch(/role="alert"/);
  });
});

describe("/compliance/audit — three-step flow", () => {
  it("STEPS[] array contains the three numbered steps in fixed order", () => {
    const arrIdx = auditFile.indexOf("const STEPS");
    expect(arrIdx).toBeGreaterThan(-1);
    const arrSlice = auditFile.slice(arrIdx, arrIdx + 2000);
    let cursor = 0;
    for (const n of ["01", "02", "03"]) {
      const marker = `n: "${n}"`;
      const idx = arrSlice.indexOf(marker, cursor);
      expect(idx, `STEPS entry n="${n}" missing or out of order`).toBeGreaterThan(-1);
      cursor = idx + marker.length;
    }
  });

  it("renders steps via STEPS.map() with hover-lift cards and runtime testid", () => {
    expect(auditFile).toMatch(/STEPS\.map\(/);
    expect(auditFile).toMatch(/data-testid=\{`audit-step-\$\{step\.n\}`\}/);
    // Must use the same hover-lift treatment as the surfaces grid.
    const flowSlice = auditFile.slice(
      auditFile.indexOf('data-testid="audit-flow"'),
      auditFile.indexOf('data-testid="audit-flow"') + 2500,
    );
    expect(flowSlice).toMatch(/hover-lift-card/);
  });
});

describe("/compliance/audit — FAQ", () => {
  it("FAQS[] array contains exactly 5 entries and uses runtime testid map", () => {
    const arrIdx = auditFile.indexOf("const FAQS");
    expect(arrIdx).toBeGreaterThan(-1);
    const arrEnd = auditFile.indexOf("];", arrIdx);
    const arrSlice = auditFile.slice(arrIdx, arrEnd);
    // Each FAQ entry starts with a `q:` key — count them.
    const qCount = (arrSlice.match(/^\s*q:\s*"/gm) ?? []).length;
    expect(qCount).toBe(5);
    // Renderer uses the runtime template `audit-faq-${i + 1}` and native <details>.
    expect(auditFile).toMatch(/data-testid=\{`audit-faq-\$\{i \+ 1\}`\}/);
    expect(auditFile).toMatch(/<details/);
  });

  it("first and last FAQ questions are pinned verbatim", () => {
    expect(auditFile).toMatch(
      /Is this really free, or do I have to switch CRAs\?/,
    );
    expect(auditFile).toMatch(
      /Can my legal or HR partner sit in\?/,
    );
  });
});

describe("/compliance/audit — closing dark CTA band", () => {
  it("closing band uses --color-footer surface and anchors back to #book + /contact", () => {
    const slice = auditFile.slice(
      auditFile.indexOf('data-testid="audit-closing"'),
      auditFile.indexOf('data-testid="audit-closing"') + 1800,
    );
    expect(slice).toMatch(/bg-\[color:var\(--color-footer\)\]/);
    expect(slice).toMatch(/href="#book"/);
    expect(slice).toMatch(/href="\/contact"/);
  });
});

describe("/compliance/audit — SEO", () => {
  it("emits a Free 15-minute compliance audit title via useSeo", () => {
    expect(auditFile).toMatch(/useSeo\(/);
    expect(auditFile).toMatch(
      /Free 15-minute compliance audit — Rapid Hire Solutions/,
    );
  });
});
