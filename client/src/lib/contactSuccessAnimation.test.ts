/*
  §141.6 — Contact form success animation + SHRM-aware confirmation
  contract.

  Like the §140 SHRM attribution spec, this is a static-analysis spec
  that reads Contact.tsx and index.css as text. We avoid jsdom +
  wouter mocking by checking that the wiring exists in source — the
  React render itself is exercised by the live preview.

  Coverage:

    (a) ContactSuccess component shape
        - All stable testids present: contact-success, -icon, -check,
          -title, -message, -timeline, -timeline-item, -actions,
          -cta-home, plus -cta-calendar (SHRM-only) and -cta-sample
          (default branch).
        - role="status" and aria-live="polite" on the root so screen
          readers announce the change.
        - Three timeline items in each branch.

    (b) SHRM branch copy
        - Headline becomes "Booth queue confirmed." when fromShrm.
        - Lede mentions SHRM 2026 + 15-minute SPA Treatment.
        - "Add SHRM 2026 to calendar" link points at /shrm-2026.ics.
        - Static .ics asset exists in client/public.

    (c) Default branch copy
        - Headline is "Request received."
        - "View sample report" link is rendered instead of calendar.

    (d) Personalization
        - When `company` is non-empty, the lede includes the company
          name. When empty, falls back to the neutral phrasing (no
          stray "for ." in the rendered string).

    (e) Submission wiring
        - submittedCompany state is set on success.
        - toast message branches on cameFromShrm.

    (f) CSS animation contract (index.css)
        - All four keyframes present: contact-success-pop,
          contact-success-halo, contact-success-check-draw,
          contact-success-fade-up.
        - All gated behind `prefers-reduced-motion: no-preference`.
        - All transitions/animations under 500ms (per the animation
          guide's "UI animation under 300ms" rule + reasonable buffer
          for the halo's 440ms one-shot).
        - --ease-out cubic-bezier(0.23, 1, 0.32, 1) reused (no new
          easing introduced).
*/
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..", "..", "..");
const CONTACT_SRC = readFileSync(
  resolve(__dirname, "..", "pages", "Contact.tsx"),
  "utf8",
);
const INDEX_CSS = readFileSync(
  resolve(__dirname, "..", "index.css"),
  "utf8",
);

// ----- (a) ContactSuccess component shape ----------------------------------

describe("§141.2 — ContactSuccess: structural testids", () => {
  const TESTIDS = [
    "contact-success",
    "contact-success-icon",
    "contact-success-icon-halo",
    "contact-success-check",
    "contact-success-title",
    "contact-success-message",
    "contact-success-timeline",
    "contact-success-timeline-item",
    "contact-success-actions",
    "contact-success-cta-home",
  ];
  it.each(TESTIDS)("renders testid %s", (id) => {
    expect(CONTACT_SRC).toContain(`data-testid="${id}"`);
  });

  it("declares role='status' and aria-live='polite' on the root", () => {
    // We anchor on the testid then look back+forward for the
    // accessibility attributes in the same JSX element.
    const idx = CONTACT_SRC.indexOf('data-testid="contact-success"');
    expect(idx).toBeGreaterThan(-1);
    const window = CONTACT_SRC.slice(Math.max(0, idx - 200), idx + 200);
    expect(window).toContain('role="status"');
    expect(window).toContain('aria-live="polite"');
  });

  it("data-from-shrm reflects the prop value", () => {
    expect(CONTACT_SRC).toMatch(
      /data-from-shrm=\{fromShrm \? "true" : "false"\}/,
    );
  });
});

// ----- (b) SHRM branch copy ------------------------------------------------

describe("§141.3 — ContactSuccess: SHRM branch", () => {
  it("uses 'Booth queue confirmed.' as the SHRM headline", () => {
    expect(CONTACT_SRC).toContain('"Booth queue confirmed."');
  });

  it("references SHRM 2026 + 15-minute SPA Treatment in the SHRM lede", () => {
    expect(CONTACT_SRC).toMatch(/SHRM 2026 booth queue/);
    expect(CONTACT_SRC).toMatch(/15-minute SPA Treatment slot/);
  });

  it("renders Add-to-Calendar link only when fromShrm is true", () => {
    // The CTA testid must appear inside a `fromShrm ? (...) : (...)`
    // branch so it never leaks onto non-SHRM submissions.
    expect(CONTACT_SRC).toMatch(
      /fromShrm \? \([\s\S]*?contact-success-cta-calendar[\s\S]*?\) : \(/,
    );
  });

  it("Add-to-Calendar href is the static /shrm-2026.ics asset", () => {
    expect(CONTACT_SRC).toMatch(/href="\/shrm-2026\.ics"/);
  });

  it("ships the static .ics asset under client/public", () => {
    const ics = resolve(ROOT, "client", "public", "shrm-2026.ics");
    expect(existsSync(ics)).toBe(true);
    const text = readFileSync(ics, "utf8");
    expect(text).toContain("BEGIN:VCALENDAR");
    expect(text).toContain("END:VCALENDAR");
    expect(text).toContain("SHRM 2026");
    expect(text).toContain("Rapid Hire Solutions");
  });
});

// ----- (c) Default (non-SHRM) branch ---------------------------------------

describe("§141.3 — ContactSuccess: default branch", () => {
  it("uses 'Request received.' as the default headline", () => {
    expect(CONTACT_SRC).toContain('"Request received."');
  });

  it("renders 'View sample report' link only when fromShrm is false", () => {
    // The else-branch of the same ternary should contain the sample
    // CTA testid. Looking for `: (` followed by the testid is enough
    // because the ternary structure is unique.
    expect(CONTACT_SRC).toMatch(
      /\)\s*:\s*\([\s\S]*?contact-success-cta-sample/,
    );
  });
});

// ----- (d) Personalization -------------------------------------------------

describe("§141.4 — ContactSuccess: company personalization", () => {
  it("trims the company prop and gates personalized copy on non-empty", () => {
    expect(CONTACT_SRC).toMatch(
      /const trimmedCompany = company\.trim\(\)/,
    );
    expect(CONTACT_SRC).toMatch(
      /const personalized = trimmedCompany\.length\s*>\s*0/,
    );
  });

  it("uses ${trimmedCompany} (not ${company}) inside the personalized lede", () => {
    // Catches a regression where the trimmed value is computed but
    // the raw `company` prop is still interpolated.
    expect(CONTACT_SRC).toMatch(
      /\$\{trimmedCompany\}.*SHRM 2026 booth queue/s,
    );
    expect(CONTACT_SRC).toMatch(
      /tailored screening package for \$\{trimmedCompany\}/,
    );
  });
});

// ----- (e) Submission wiring ----------------------------------------------

describe("§141.4 — Contact.tsx wires ContactSuccess into the submitted state", () => {
  it("declares submittedCompany state initialized to empty string", () => {
    expect(CONTACT_SRC).toMatch(
      /useState\(\s*""\s*\);[\s\S]{0,200}submitting/,
    );
    expect(CONTACT_SRC).toMatch(/submittedCompany/);
  });

  it("captures the submitted company before flipping submitted=true", () => {
    expect(CONTACT_SRC).toMatch(
      /setSubmittedCompany\(values\.company\);\s*\n\s*setSubmitted\(true\)/,
    );
  });

  it("renders <ContactSuccess /> when submitted is true (replacing the static block)", () => {
    expect(CONTACT_SRC).toMatch(
      /\{submitted \? \(\s*<ContactSuccess[\s\S]*?company=\{submittedCompany\}/,
    );
    expect(CONTACT_SRC).toMatch(/fromShrm=\{cameFromShrm\}/);
  });

  it("toast.success() branches on cameFromShrm", () => {
    expect(CONTACT_SRC).toMatch(
      /toast\.success\(\s*\n?\s*cameFromShrm[\s\S]{0,400}Booth queue confirmed/,
    );
  });
});

// ----- (f) CSS animation contract ------------------------------------------

describe("§141.1 — Contact success animation CSS", () => {
  const KEYFRAMES = [
    "contact-success-pop",
    "contact-success-halo",
    "contact-success-check-draw",
    "contact-success-fade-up",
  ];
  it.each(KEYFRAMES)("defines @keyframes %s", (name) => {
    expect(INDEX_CSS).toContain(`@keyframes ${name}`);
  });

  it("gates the animations behind prefers-reduced-motion: no-preference", () => {
    // Anchor on the §141 comment block, then look forward for the
    // media query. This proves the gate is co-located with the
    // animation declarations rather than added elsewhere.
    const idx = INDEX_CSS.indexOf("§141 — Contact form success state animation");
    expect(idx).toBeGreaterThan(-1);
    const window = INDEX_CSS.slice(idx, idx + 4000);
    expect(window).toContain("@media (prefers-reduced-motion: no-preference)");
  });

  it("uses the canonical --ease-out cubic-bezier (no new easing introduced)", () => {
    const idx = INDEX_CSS.indexOf("§141 — Contact form success state animation");
    expect(idx).toBeGreaterThan(-1);
    const window = INDEX_CSS.slice(idx, idx + 4000);
    // The site-wide --ease-out token is cubic-bezier(0.23, 1, 0.32, 1).
    expect(window).toMatch(/cubic-bezier\(0\.23,\s*1,\s*0\.32,\s*1\)/);
    // No `ease-in` should appear in the §141 block — animation guide
    // explicitly forbids `ease-in` for UI animations.
    expect(window).not.toMatch(/\beasing-in\b|\bease-in\b\s*[;)\s]/);
  });

  it("keeps individual animation durations under 500ms (animation-guide compliant)", () => {
    const idx = INDEX_CSS.indexOf("§141 — Contact form success state animation");
    expect(idx).toBeGreaterThan(-1);
    const window = INDEX_CSS.slice(idx, idx + 4000);
    // Pull every `XXXms` duration we declared in this block and
    // assert the max is at or below 500ms. Halo at 440ms is the
    // largest by design.
    const durations = Array.from(
      window.matchAll(/(\d+)ms\b/g),
      (m) => Number(m[1]),
    );
    expect(durations.length).toBeGreaterThan(0);
    expect(Math.max(...durations)).toBeLessThanOrEqual(500);
  });

  it("declares the .contact-success-icon halo via ::after pseudo-element", () => {
    const idx = INDEX_CSS.indexOf("§141 — Contact form success state animation");
    expect(idx).toBeGreaterThan(-1);
    const window = INDEX_CSS.slice(idx, idx + 4000);
    expect(window).toContain(".contact-success-icon::after");
  });

  it("animates only opacity / transform / box-shadow / stroke-dashoffset", () => {
    // Animation guide: only animate transform + opacity for motion.
    // We allow box-shadow (for the halo) and stroke-dashoffset (for
    // the check draw) because both run on the compositor without
    // triggering layout. Any other property here is suspect.
    const idx = INDEX_CSS.indexOf("§141 — Contact form success state animation");
    expect(idx).toBeGreaterThan(-1);
    const window = INDEX_CSS.slice(idx, idx + 4000);
    // Anti-patterns: animating width/height/margin/padding/top/left
    // would each show up as a `from`/`to` declaration of that
    // property inside a @keyframes block. Look for lines that sit
    // inside the §141 block and assign one of those banned props.
    const banned = ["width:", "height:", "margin:", "padding:", "top:", "left:"];
    const keyframesBlock = window.match(/@keyframes contact-success[\s\S]*$/);
    expect(keyframesBlock).not.toBeNull();
    const keyframesText = keyframesBlock![0];
    for (const b of banned) {
      expect(keyframesText).not.toContain(b);
    }
  });
});

// ----- Sanity: timeline structure ------------------------------------------

describe("§141.5 — ContactSuccess: 'what's next' timeline", () => {
  it("renders three timeline items per branch", () => {
    // Each branch defines a literal array of three step objects.
    // Counting `id:` occurrences inside the timeline declaration is
    // the cleanest static-analysis signal.
    const idx = CONTACT_SRC.indexOf("const timeline:");
    expect(idx).toBeGreaterThan(-1);
    const window = CONTACT_SRC.slice(idx, idx + 2000);
    // Six total — three for SHRM, three for default.
    const ids = window.match(/\bid:\s*"/g) ?? [];
    expect(ids.length).toBe(6);
  });

  it("includes the canonical SHRM step labels", () => {
    expect(CONTACT_SRC).toContain('"Same-day reply"');
    expect(CONTACT_SRC).toContain('"15-min SPA Treatment"');
    expect(CONTACT_SRC).toContain('"Sample report"');
  });

  it("includes the canonical default-branch step labels", () => {
    expect(CONTACT_SRC).toContain('"15-min intro call"');
    expect(CONTACT_SRC).toContain('"Sample report + quote"');
  });
});
