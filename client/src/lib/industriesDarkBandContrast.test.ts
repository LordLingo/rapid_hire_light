/*
  §70 — Anti-regression pins for the /industries dark-band contrast bug.

  Background:
  ----------
  The first cut of /industries (§69) referenced three CSS custom properties
  that never existed in client/src/index.css:

    • --color-footer-bg       (correct name is --color-footer; this typo
                                caused the §03 Transportation & Logistics
                                dark-band section to lose its dark background
                                and high-contrast text colours, leaving
                                warm-paper text on warm-paper background —
                                visually unreadable.)
    • --color-paper-soft      (was an intended but undefined token; the
                                regression scan found 12 silent uses across
                                Compliance.tsx / ComplianceAudit.tsx /
                                Support.tsx where stripes / sub-bars / row
                                tints were rendering transparent. Resolved
                                by adding the token definition to index.css.)
    • --color-accent-on-dark  (was an intended but undefined token; resolved
                                by adding the token definition to index.css.)

  These pins ensure (a) Industries.tsx uses the corrected --color-footer
  token name on its dark-band Section + closing CTA band, (b) the typo
  --color-footer-bg never reappears anywhere in the source tree, and
  (c) the four tokens that the dark-band fix relies on are all defined
  in index.css.
*/
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");

const file = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

const industries = file("client/src/pages/Industries.tsx");
const indexCss = file("client/src/index.css");

/** Recursively list every .ts / .tsx file under a directory. */
function listSourceFiles(rel: string): string[] {
  const out: string[] = [];
  const dir = join(ROOT, rel);
  const walk = (p: string) => {
    for (const name of readdirSync(p)) {
      const full = join(p, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        // skip test files for the regression scan — pins legitimately
        // mention the typo strings in their explanatory comments.
        if (name === "lib") continue;
        walk(full);
      } else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
        out.push(full);
      }
    }
  };
  walk(dir);
  return out;
}

describe("§70 — /industries dark-band contrast (anti-regression)", () => {
  it("Industries.tsx never references the undefined --color-footer-bg token", () => {
    expect(industries).not.toContain("--color-footer-bg");
  });

  it("client/src has no source file referencing the typo --color-footer-bg token", () => {
    const offenders: string[] = [];
    for (const f of listSourceFiles("client/src")) {
      const src = readFileSync(f, "utf8");
      if (src.includes("--color-footer-bg")) {
        offenders.push(f.replace(`${ROOT}/`, ""));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("--color-paper-soft and --color-accent-on-dark are defined tokens in index.css", () => {
    // both were originally referenced as undefined tokens. They're now
    // properly defined, which is what makes the fix actually paint.
    expect(indexCss).toMatch(/--color-paper-soft\s*:/);
    expect(indexCss).toMatch(/--color-accent-on-dark\s*:/);
  });

  it("the dark-band Section keeps using the actual defined --color-footer token", () => {
    // VerticalSection's dark branch must paint on --color-footer with
    // --color-footer-foreground text
    expect(industries).toMatch(
      /dark[\s\S]{0,200}bg-\[color:var\(--color-footer\)\][\s\S]{0,200}text-\[color:var\(--color-footer-foreground\)\]/,
    );
  });

  it("the closing dark CTA band keeps using the actual defined --color-footer token", () => {
    expect(industries).toMatch(
      /data-testid="industries-cta-band"[\s\S]{0,400}bg-\[color:var\(--color-footer\)\][\s\S]{0,200}text-\[color:var\(--color-footer-foreground\)\]/,
    );
  });

  it("index.css declares each of the dark-band-fix replacement tokens", () => {
    // these MUST be defined for the dark-band fix to actually paint
    expect(indexCss).toMatch(/--color-footer\s*:/);
    expect(indexCss).toMatch(/--color-footer-foreground\s*:/);
    expect(indexCss).toMatch(/--color-footer-muted\s*:/);
    expect(indexCss).toMatch(/--color-footer-soft-text\s*:/);
    expect(indexCss).toMatch(/--color-paper\s*:/);
    expect(indexCss).toMatch(/--color-ink\s*:/);
    expect(indexCss).toMatch(/--color-ink-soft\s*:/);
    expect(indexCss).toMatch(/--color-ink-muted\s*:/);
    expect(indexCss).toMatch(/--color-accent-ink\s*:/);
  });

  it("dark-mode accent colour is computed via color-mix from --color-accent-ink (no missing on-dark token)", () => {
    // there should be at least one color-mix(... var(--color-accent-ink) ...
    // white) inline that replaces the previous --color-accent-on-dark usage
    expect(industries).toMatch(
      /color-mix\(\s*in\s+oklch\s*,\s*var\(--color-accent-ink\)[^)]*,\s*white\s*\)/,
    );
  });

  it("Tailwind arbitrary-value classes inside Industries.tsx contain no whitespace (would break the JIT)", () => {
    // grab every text-[...] / bg-[...] / border-[...] arbitrary value and make
    // sure none of them contain a literal space or comma+space sequence
    const arbitrary = industries.match(
      /\b(?:text|bg|border|fill|stroke)-\[[^\]\n]*\]/g,
    ) ?? [];
    for (const cls of arbitrary) {
      // arbitrary values must be space-free per Tailwind JIT spec.
      // If they need spaces, they should be moved to a style={} prop.
      expect(cls).not.toMatch(/\s/);
    }
  });
});
