/*
  §134 — vitest pin: inline field-level error styling across the three
  user-facing forms (Contact, GetAQuote, ComplianceAudit).

  This test enforces the *contract* the user requested: when a form
  submission fails client-side validation, each invalid field shows a
  red-bordered box (`.form-field--invalid`) and a short helper message
  beneath it — instead of relying solely on a single page-level toast
  for "missing data".

  Because the three forms vary substantially in field set, primitives
  (Field/SelectField helpers vs raw <input>), and submit handlers, the
  pin is source-level: every form must reach for the shared
  formValidation helper, must store per-field errors in state, must
  pass that state through to the field primitives, and must render the
  invalid class + a short helper-text paragraph.

  This is a regression-only spec — it does NOT replace the rendering
  tests in formField.test.ts (those lock the underlying `.form-field`
  utility). It DOES guarantee that the next time someone touches one
  of these three pages, they cannot quietly delete the validation
  layer or fall back to a single toast.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const PAGES_DIR = path.resolve(__dirname, "..", "pages");

function read(file: string): string {
  return fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
}

const FORMS = [
  { file: "Contact.tsx", label: "Contact" },
  { file: "GetAQuote.tsx", label: "GetAQuote" },
  { file: "ComplianceAudit.tsx", label: "ComplianceAudit" },
] as const;

describe("§134 — inline field-level errors across all forms", () => {
  describe.each(FORMS)("$label form", ({ file }) => {
    const src = read(file);

    it("imports the shared formValidation helpers", () => {
      // Each form must reach for validateFields + hasErrors so we know
      // they're sharing a single validation contract instead of each
      // page implementing its own bespoke check (which would drift).
      expect(src).toMatch(/from ["']@\/lib\/formValidation["']/);
      expect(src).toMatch(/\bvalidateFields\b/);
      expect(src).toMatch(/\bhasErrors\b/);
    });

    it("declares per-field error state (FieldErrors)", () => {
      // Pin the state hook — the keyed-by-name map is what makes the
      // markup binding trivial; if someone replaces this with a single
      // string error we want the test to fail loudly.
      expect(src).toMatch(/useState<FieldErrors>/);
      expect(src).toMatch(/setFieldErrors/);
    });

    it("validates client-side BEFORE the network call", () => {
      /*
        The validation block must precede the network round-trip so we
        don't burn a request on data the client could have caught.
        Different forms post to different endpoints (Formspree for
        Contact + GetAQuote, /api/contact for ComplianceAudit), so we
        anchor the locator on the generic `fetch(` token rather than a
        specific URL prefix.
      */
      const validateIdx = src.indexOf("validateFields");
      const fetchIdx = src.indexOf("await fetch(");
      expect(validateIdx).toBeGreaterThan(-1);
      expect(fetchIdx).toBeGreaterThan(-1);
      expect(validateIdx).toBeLessThan(fetchIdx);
    });

    it("aborts submit + sets fieldErrors when validation fails", () => {
      // The hasErrors -> setFieldErrors -> early-return pattern is the
      // contract that gives the user a chance to fix things in place.
      expect(src).toMatch(/if \(hasErrors\(errs\)\)/);
      expect(src).toMatch(/setFieldErrors\(errs\)/);
    });

    it("focuses the first invalid field after a failed submit", () => {
      // Accessibility + UX: keyboard-only users would be lost without
      // a focus jump to the first error.
      expect(src).toMatch(/firstEl\?\.focus\(\)/);
    });

    it("opts the form out of native validation (noValidate)", () => {
      // We provide our own validation messages, so suppressing the
      // browser's :invalid bubble keeps the inline experience consistent
      // across Chrome/Firefox/Safari.
      expect(src).toMatch(/noValidate/);
    });

    it("clears a field's error as soon as the user edits it (form onChange)", () => {
      // `clearFieldError` runs from the form-level onChange so any field
      // that mutates clears its own error — no need to wire each Field
      // individually.
      expect(src).toMatch(/clearFieldError\(/);
      expect(src).toMatch(/onChange=/);
    });

    it("forwards the error to its field primitive (error={fieldErrors.X})", () => {
      // At least one Field/SelectField/textarea in each form must
      // receive `error={fieldErrors.<something>}`. We don't pin the
      // specific field name because the three forms have different
      // field sets — we just enforce the prop is wired through at all.
      expect(src).toMatch(/error=\{fieldErrors\.[a-zA-Z]+\}/);
    });

    it("renders .form-field--invalid on flagged inputs (red border) + a role=alert helper paragraph", () => {
      // The visual + a11y contract: invalid class + role=alert helper
      // text. role=alert ensures screen readers announce the error
      // without a focus shift.
      expect(src).toMatch(/form-field--invalid/);
      expect(src).toMatch(/role="alert"/);
    });
  });
});
