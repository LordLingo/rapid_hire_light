/*
  §133 — Form field surface invariants.

  The user reported that all forms (Contact, Get a Quote, Compliance
  Audit) were "hard to see and you couldn't tell it was a form" because
  the field treatment was a single bottom-edge hairline at
  `border-b border-[color:var(--color-rule)]` against a near-identical
  warm-paper background. We replaced that pattern with a single shared
  `.form-field` utility (defined in client/src/index.css) that gives
  every <input>, <textarea>, and <select> a full bordered box, soft
  rounded corners, a paper interior, and a brand-accent focus ring.

  This test pins three things:

    1. The `.form-field` utility class is declared in index.css with
       the bordered-box rules (full border, rounded corners, focus ring).
    2. None of the three form pages still uses the old underline-only
       className (`border-0 border-b border-[color:var(--color-rule)]`).
    3. Each form page uses the new `form-field` class on at least one
       <input>, <textarea>, and <select> (where applicable).

  Source-string pins only — no DOM mount. The visual rendering is
  validated by the live preview after every change.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CLIENT_SRC = resolve(__dirname, "..");
const INDEX_CSS = readFileSync(resolve(CLIENT_SRC, "index.css"), "utf8");
const CONTACT = readFileSync(
  resolve(CLIENT_SRC, "pages", "Contact.tsx"),
  "utf8",
);
const GET_A_QUOTE = readFileSync(
  resolve(CLIENT_SRC, "pages", "GetAQuote.tsx"),
  "utf8",
);
const COMPLIANCE_AUDIT = readFileSync(
  resolve(CLIENT_SRC, "pages", "ComplianceAudit.tsx"),
  "utf8",
);

const FORM_PAGES: ReadonlyArray<{ name: string; src: string }> = [
  { name: "Contact.tsx", src: CONTACT },
  { name: "GetAQuote.tsx", src: GET_A_QUOTE },
  { name: "ComplianceAudit.tsx", src: COMPLIANCE_AUDIT },
];

describe("§133 — Form field surface", () => {
  describe("`.form-field` utility (index.css)", () => {
    it("declares the .form-field class inside an @layer components block", () => {
      // The utility lives in @layer components so its border/radius/etc.
      // sit at the same precedence as the other component utilities
      // (.hover-lift-card, .paper-shadow, .container, etc.) and can
      // still be overridden by Tailwind's utility layer if a one-off
      // page truly needs to.
      expect(INDEX_CSS).toMatch(/@layer\s+components\s*\{[\s\S]*?\.form-field\b/);
    });

    it("renders form fields as a bordered box, not a single bottom edge", () => {
      // The whole point of §133: replace the invisible underline-only
      // treatment with a full border. We look for the .form-field rule
      // block and assert it carries `border:` (full border), a
      // border-radius, and a non-transparent background.
      const block = INDEX_CSS.match(/\.form-field\s*\{[^}]*\}/);
      expect(block, "form-field rule block missing").toBeTruthy();
      const rule = block![0];
      expect(rule).toMatch(/\bborder:\s*1px\s+solid\b/);
      expect(rule).toMatch(/\bborder-radius:\s*[1-9][\d.]*px\b/);
      expect(rule).toMatch(/\bbackground-color:\s*var\(--color-paper\)/);
    });

    it("declares a brand-accent focus ring on .form-field:focus", () => {
      // On focus the field must visibly gain a ring + brand-blue
      // border so keyboard and pointer users both see exactly which
      // field is active. The previous treatment swapped the underline
      // color, which was easy to miss.
      const focusBlock = INDEX_CSS.match(
        /\.form-field:focus(?:[^{]*?)\{[^}]*\}/,
      );
      expect(focusBlock, "form-field:focus rule missing").toBeTruthy();
      const rule = focusBlock![0];
      expect(rule).toMatch(/border-color:\s*var\(--color-accent-ink\)/);
      expect(rule).toMatch(/box-shadow:[\s\S]*color-mix/);
    });

    it("declares a vertical resize affordance on textarea.form-field", () => {
      // Textareas should still be resizable (the prior pattern had
      // `resize-none`, but multi-line forms feel cramped without it).
      // Vertical-only so the form layout doesn't break sideways.
      expect(INDEX_CSS).toMatch(
        /textarea\.form-field\s*\{[^}]*\bresize:\s*vertical\b/,
      );
    });

    it("declares an :invalid hook (.form-field--invalid) for future validation", () => {
      // Belt-and-braces: keep the validation hook present so a future
      // client-side validation pass can light up the field without
      // re-introducing inline className soup.
      expect(INDEX_CSS).toMatch(/\.form-field--invalid\b/);
    });
  });

  describe("legacy underline-only treatment is gone from every form page", () => {
    for (const { name, src } of FORM_PAGES) {
      it(`${name} no longer ships the old border-0 + border-b underline pattern`, () => {
        // Anti-regression: the exact substring we replaced must not
        // reappear in any form page. If a copy-paste from a stale
        // gist reintroduces it, this guard fires.
        expect(src).not.toMatch(
          /border-0\s+border-b\s+border-\[color:var\(--color-rule\)\]/,
        );
      });

      it(`${name} no longer transparent-background fields with the old class soup`, () => {
        // Belt-and-braces: even if someone tweaks the rule color,
        // a `bg-transparent border-0 border-b` field on a paper-bg
        // section will be invisible. Block that combination outright.
        expect(src).not.toMatch(/bg-transparent\s+border-0\s+border-b/);
      });
    }
  });

  describe("every form page adopts the .form-field utility", () => {
    for (const { name, src } of FORM_PAGES) {
      it(`${name} applies className="form-field" to its inputs`, () => {
        // At minimum each form page must use the new utility on at
        // least one field. (Most pages use it on 3+ fields.)
        expect(
          (src.match(/className="form-field"/g) ?? []).length,
        ).toBeGreaterThan(0);
      });
    }

    it("Contact.tsx applies form-field to its <select>, <textarea>, AND <input>", () => {
      // The Contact form has all three field types — the regression
      // we're guarding against is "developer fixed only inputs and
      // forgot the textarea/select", since those were the visually
      // worst offenders before the swap.
      const slice = (start: string, end: string) => {
        const i = CONTACT.indexOf(start);
        const j = end ? CONTACT.indexOf(end, i) : CONTACT.length;
        expect(i, `marker "${start}" missing in Contact.tsx`).toBeGreaterThan(-1);
        return CONTACT.slice(i, j > i ? j : CONTACT.length);
      };
      // <select name="teamSize">
      const selectBlock = slice("<select", "</select>");
      expect(selectBlock).toMatch(/className="form-field"/);
      // <textarea name="message">
      const textareaBlock = slice("<textarea", "/>");
      expect(textareaBlock).toMatch(/className="form-field"/);
      // <input> via the Field helper component at the bottom of the file
      const inputBlock = slice("<input\n", "/>");
      expect(inputBlock).toMatch(/className="form-field"/);
    });

    it("GetAQuote.tsx applies form-field to its visible <textarea>", () => {
      // The Get-a-Quote form's "Anything else?" textarea was one of
      // the most-reported invisible fields before the swap.
      const i = GET_A_QUOTE.indexOf("name=\"message\"");
      expect(i).toBeGreaterThan(-1);
      // Slice a generous window around the textarea opening tag.
      const window = GET_A_QUOTE.slice(Math.max(0, i - 200), i + 400);
      expect(window).toMatch(/<textarea[\s\S]*?className="form-field"/);
    });

    it("ComplianceAudit.tsx applies form-field to its audit-notes <textarea>", () => {
      const i = COMPLIANCE_AUDIT.indexOf("id=\"audit-notes\"");
      expect(i).toBeGreaterThan(-1);
      const window = COMPLIANCE_AUDIT.slice(
        Math.max(0, i - 200),
        i + 400,
      );
      expect(window).toMatch(/<textarea[\s\S]*?className="form-field"/);
    });
  });
});
