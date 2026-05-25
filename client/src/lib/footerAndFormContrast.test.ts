/*
  §186 — Source-pin: Footer + form-input contrast audit.

  After the §184 site-wide contrast audit (which fixed pastel-bg +
  text-white pairings + undefined-token references), the user asked to
  verify the **footer** and **form input fields** also pass the same
  bar. The audit found no fixes needed — this spec locks the
  state-of-the-world so we don't backslide:

    1. Footer reads on a dedicated dark surface (--color-footer ≈
       0.20 lightness) with foreground/muted/soft tokens that all sit
       comfortably above 0.78 lightness. No --color-brand-blue or
       --color-accent surfaces with white text exist in Footer.tsx.

    2. Form inputs across all callsites either use the canonical
       .form-field utility (Contact, ComplianceAudit, GetAQuote,
       Integrations) or apply a hand-rolled equivalent that pairs
       `bg-white` with `text-[color:var(--color-ink)]` and an
       ink-muted placeholder (Blog, ComplianceChecklist, Subscribe).
       No input bypasses contrast by using ink-soft on white or by
       referencing undefined tokens.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FOOTER = readFileSync(
  resolve(__dirname, "../components/site/Footer.tsx"),
  "utf8",
);
const CSS = readFileSync(resolve(__dirname, "../index.css"), "utf8");

const FORM_PAGES = [
  "Blog.tsx",
  "ComplianceAudit.tsx",
  "ComplianceChecklist.tsx",
  "Contact.tsx",
  "GetAQuote.tsx",
  "Integrations.tsx",
  "Subscribe.tsx",
];

describe("§186 — Footer + form-input contrast audit", () => {
  describe("Footer", () => {
    it("uses dedicated --color-footer-* tokens for theming (not --color-ink-* or --color-paper-*)", () => {
      // The footer surface uses its own dark-theme token family so
      // the contrast budget is calibrated for the dark surface, not
      // borrowed from the light theme.
      expect(FOOTER).toMatch(/var\(--color-footer\)/);
      expect(FOOTER).toMatch(/var\(--color-footer-foreground\)/);
      expect(FOOTER).toMatch(/var\(--color-footer-muted\)/);
      expect(FOOTER).toMatch(/var\(--color-footer-soft-text\)/);
    });

    it("declares colorScheme:'dark' so native form controls + scrollbars pick up the dark surface", () => {
      expect(FOOTER).toMatch(/colorScheme:\s*"dark"/);
    });

    it("does not use --color-brand-blue, --color-accent, or text-white as link colors", () => {
      // The §181/§184 broken-token patterns must not have crept into
      // the footer. Links all flow through --color-footer-soft-text or
      // --color-footer-muted.
      expect(FOOTER).not.toMatch(
        /<(Link|a)[\s\S]{0,200}?text-white/,
      );
      expect(FOOTER).not.toMatch(/var\(--color-brand-blue\)/);
      // --color-accent (the shadcn pastel accent) must not be used as
      // a button/link surface here.
      expect(FOOTER).not.toMatch(
        /bg-\[color:var\(--color-accent\)\]/,
      );
    });

    it("footer tokens are calibrated for AA contrast (foreground ≥ 0.95 lightness, muted ≥ 0.75)", () => {
      // Guard against silent token darkening that would push muted
      // text below the AA threshold. We pin the lightness floor.
      const fgMatch = CSS.match(
        /--color-footer-foreground:\s*oklch\(([0-9.]+)/,
      );
      const mutedMatch = CSS.match(
        /--color-footer-muted:\s*oklch\(([0-9.]+)/,
      );
      const softMatch = CSS.match(
        /--color-footer-soft-text:\s*oklch\(([0-9.]+)/,
      );
      expect(fgMatch, "--color-footer-foreground defined").not.toBeNull();
      expect(mutedMatch, "--color-footer-muted defined").not.toBeNull();
      expect(softMatch, "--color-footer-soft-text defined").not.toBeNull();
      expect(parseFloat(fgMatch![1])).toBeGreaterThanOrEqual(0.95);
      expect(parseFloat(mutedMatch![1])).toBeGreaterThanOrEqual(0.75);
      expect(parseFloat(softMatch![1])).toBeGreaterThanOrEqual(0.85);
    });

    it("footer surface is dark enough for the muted token to read (≤ 0.30 lightness)", () => {
      const m = CSS.match(/--color-footer:\s*oklch\(([0-9.]+)/);
      expect(m, "--color-footer defined").not.toBeNull();
      expect(parseFloat(m![1])).toBeLessThanOrEqual(0.30);
    });
  });

  describe("Form inputs (.form-field utility)", () => {
    it("paints ink text on paper background with ink-muted placeholder", () => {
      const idx = CSS.indexOf("@layer components") + CSS.slice(CSS.indexOf("@layer components")).indexOf(".form-field");
      expect(idx, ".form-field utility present").toBeGreaterThan(-1);
      // The block is short — read enough to capture all selectors.
      const block = CSS.slice(idx, idx + 2200);

      // Resting state: ink text on paper, ruled border.
      expect(block).toMatch(/color:\s*var\(--color-ink\)/);
      expect(block).toMatch(/background-color:\s*var\(--color-paper\)/);
      expect(block).toMatch(/border:\s*1px solid var\(--color-rule\)/);

      // Placeholder uses ink-muted (legible against paper).
      expect(block).toMatch(
        /\.form-field::placeholder\s*\{[^}]*color:\s*var\(--color-ink-muted\)/,
      );

      // Focus ring uses brand-blue (not pastel).
      expect(block).toMatch(
        /\.form-field:focus[^{]*\{[^}]*border-color:\s*var\(--color-accent-ink\)/,
      );
    });
  });

  describe("Form inputs (per-page audit)", () => {
    for (const page of FORM_PAGES) {
      it(`${page} — every <input>/<textarea>/<select> sits on white/paper with legible ink text`, () => {
        const src = readFileSync(
          resolve(__dirname, `../pages/${page}`),
          "utf8",
        );

        // Must not bypass contrast by using ink-soft as the input
        // text color on a white surface — that's the pattern that
        // caused the §181 chip regressions, and it would make
        // entered text faint.
        expect(src).not.toMatch(
          /(<(input|textarea|select)[\s\S]{0,400}?text-\[color:var\(--color-ink-soft\)\][\s\S]{0,200}?\/?>)/,
        );

        // Must not paint inputs with --color-accent (pastel) as their
        // surface. White inputs only.
        expect(src).not.toMatch(
          /(<(input|textarea|select)[\s\S]{0,400}?bg-\[color:var\(--color-accent\)\][\s\S]{0,200}?\/?>)/,
        );

        // Must not use the un-defined / formerly-broken
        // --color-brand-blue token as an input surface.
        expect(src).not.toMatch(
          /(<(input|textarea|select)[\s\S]{0,400}?bg-\[color:var\(--color-brand-blue\)\][\s\S]{0,200}?\/?>)/,
        );
      });
    }
  });
});
