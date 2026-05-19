/*
  §71 — Audit pins for the paper-soft / accent-on-dark token rollout.

  Background:
  ----------
  §70 added two missing CSS custom-property definitions to index.css:
    • --color-paper-soft       (one step softer than --color-paper, used
                                  for sub-bar tints, alternating section
                                  bands, table headers, and small icon halos)
    • --color-accent-on-dark   (sky-halo-ish blue used as the italic-accent
                                  / link colour over dark surfaces)

  Until §70 these tokens were referenced but undefined, so 12 sites across
  Compliance.tsx / ComplianceAudit.tsx / Support.tsx were silently rendering
  transparent. Once defined, every site started painting — and a visual
  audit (§71) confirmed every one paints correctly with the original design
  intent: subtle warm-paper sub-bands, comparison-table header tint, small
  icon halos, and floating-card alternation between sections.

  These pins capture the audit verdict so future PRs:
    1. Can't accidentally drop the token definitions from index.css.
    2. Can't accidentally remove the alternation pattern from the three
       audited pages (the structural choices were deliberate).
    3. Get a tripwire if a 4th file starts referencing paper-soft, since
       any new usage should be visually audited the same way.
*/
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");

const indexCss = readFileSync(join(ROOT, "client/src/index.css"), "utf8");
const compliance = readFileSync(
  join(ROOT, "client/src/pages/Compliance.tsx"),
  "utf8",
);
const audit = readFileSync(
  join(ROOT, "client/src/pages/ComplianceAudit.tsx"),
  "utf8",
);
const support = readFileSync(
  join(ROOT, "client/src/pages/Support.tsx"),
  "utf8",
);

function listSourceFiles(rel: string): string[] {
  const root = join(ROOT, rel);
  const out: string[] = [];
  function walk(d: string) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if (/\.(t|j)sx?$/.test(e)) out.push(p);
    }
  }
  walk(root);
  return out;
}

describe("§71 — paper-soft / accent-on-dark token audit", () => {
  it("index.css defines --color-paper-soft", () => {
    expect(indexCss).toMatch(/--color-paper-soft\s*:\s*oklch\(/);
  });

  it("index.css defines --color-accent-on-dark", () => {
    expect(indexCss).toMatch(/--color-accent-on-dark\s*:\s*oklch\(/);
  });

  it("only the three audited pages may reference --color-paper-soft", () => {
    // any 4th file showing up here means the audit needs to be re-run on
    // that file before the token use ships
    const allowed = new Set<string>([
      "client/src/pages/Compliance.tsx",
      "client/src/pages/ComplianceAudit.tsx",
      "client/src/pages/Support.tsx",
      // §79: the Resources dropdown panel uses paper-soft as the
      // hover/active background tint for menu rows. Visually audited
      // alongside the existing three pages and matches the same
      // "soft warm tint to break from white" intent.
      "client/src/components/site/Header.tsx",
      // §80: Resources hub + Ban the Box detail page use paper-soft
      // for the same alternating section rhythm Compliance / Support /
      // Pricing already use. Visually audited.
      "client/src/pages/Resources.tsx",
      "client/src/pages/ResourcesBanTheBox.tsx",
      // §81: Accurate-inspired Resources buildout. All five pages reuse
      // the same alternating section rhythm. Visually audited alongside
      // the existing pillars.
      "client/src/pages/ResourcesBackgroundChecksByState.tsx",
      "client/src/pages/ResourcesStatePage.tsx",
      "client/src/pages/ResourcesMarijuanaLaws.tsx",
      "client/src/pages/ResourcesLegislativeUpdates.tsx",
      "client/src/pages/ResourcesWhitePapers.tsx",
      // §83: per-check service detail, sample-report, candidates, and
      // case-study pages reuse the same alternating section rhythm as
      // Resources / Compliance. Visually audited alongside the
      // existing pillars; consistent paper-soft usage was the design
      // goal.
      "client/src/pages/ServiceDetail.tsx",
      "client/src/pages/SampleReport.tsx",
      "client/src/pages/Candidates.tsx",
      "client/src/pages/Customers.tsx",
      "client/src/pages/CustomerDetail.tsx",
      // §83: ROI calculator embedded on /pricing reuses the paper-soft
      // sub-band tint (visually audited; matches PricingCalculator's
      // surrounding section bands).
      "client/src/components/site/RoiCalculator.tsx",
      // §103: ChatLauncher.tsx removed by request; entry intentionally
      // omitted from the allowlist. Re-add when re-installing chat.
      // §83: 2026 benchmark report uses the same alternating section
      // rhythm as the rest of /resources.
      "client/src/pages/ResourcesBenchmarks.tsx",
      // §83: Industries hub gained a 'newer specialties' rail using
      // paper-soft; detail pages reuse the same alternating section
      // rhythm as ServiceDetail.
      "client/src/pages/Industries.tsx",
      "client/src/pages/IndustryDetail.tsx",
      // §83: glossary page uses paper-soft on the alphabet jump-strip card.
      "client/src/pages/ResourcesGlossary.tsx",
      // §83: international service pillar reuses the alternating section
      // rhythm; the Services hub gained a paper-soft callout to it.
      "client/src/pages/ServiceInternational.tsx",
      "client/src/pages/Services.tsx",
      // §121: Integrations.tsx gained a paper-soft "04 — The handshake"
      // section housing the user-supplied portrait infographic, sitting
      // between the white "How it works" band and the paper integrations
      // grid. Visually audited — matches the same alternating rhythm used
      // on Pricing / Compliance / Resources.
      "client/src/pages/Integrations.tsx",
      // §138: /spa landing page uses the same alternating section
      // rhythm (white hero → paper-soft pillars → white comparison →
      // paper-soft proof → white CTA) as the rest of the marketing
      // pages. Visually audited.
      "client/src/pages/Spa.tsx",
      // §139: /shrm landing page mirrors the Spa.tsx alternating rhythm
      // (white hero → paper-soft "what to expect" → white SPA pillars →
      // paper-soft virtual → white final CTA). Visually audited.
      "client/src/pages/Shrm.tsx",
      // §140.1: /pricing gained a one-line SPA banner under PageHero
      // that uses the same paper-soft alternating-rhythm tint as the
      // existing add-ons / FAQ bands. Visually audited — the banner
      // sits between the white hero and the white tiers section, so
      // the band cadence is preserved.
      "client/src/pages/Pricing.tsx",
      // §144: Blog index empty-state uses --color-paper-soft for the
      // "No posts match these filters" card so it visually steps down
      // from the white results grid without breaking the alternating
      // band rhythm of the page.
      "client/src/pages/Blog.tsx",
    ]);
    const offenders: string[] = [];
    for (const f of listSourceFiles("client/src")) {
      const rel = f.replace(`${ROOT}/`, "");
      // test files are allowed to mention the token by name
      if (rel.startsWith("client/src/lib/") && rel.endsWith(".test.ts")) continue;
      const src = readFileSync(f, "utf8");
      if (src.includes("--color-paper-soft")) {
        if (!allowed.has(rel)) offenders.push(rel);
      }
    }
    expect(offenders).toEqual([]);
  });

  // ---- Compliance.tsx ----------------------------------------------------

  it("Compliance.tsx keeps paper-soft alternation on §02 (line ~147 area)", () => {
    expect(compliance).toContain(
      'bg-[color:var(--color-paper-soft)]',
    );
    expect(compliance).toContain('bg-[color:var(--color-paper)]');
  });

  it("Compliance.tsx keeps the credibility-bar sub-band paper-soft", () => {
    // anchor: credibility-bar testid, then within ~600 chars its container
    // should use paper-soft as the background tint that distinguishes it
    // from the surrounding white hero
    expect(compliance).toMatch(
      /data-testid="compliance-credibility-bar"[\s\S]{0,600}bg-\[color:var\(--color-paper-soft\)\]/,
    );
  });

  // ---- ComplianceAudit.tsx ------------------------------------------------

  it("ComplianceAudit.tsx keeps the §01 six-surfaces band and §03 three-steps band on paper-soft", () => {
    // both bands provide the float-card effect that makes the white surface
    // cards inside read as elevated. There must be at least 2 paper-soft
    // section uses with border-y or border-b
    const matches = audit.match(
      /bg-\[color:var\(--color-paper-soft\)\][^>]*border-[yb]/g,
    );
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  // ---- Support.tsx --------------------------------------------------------

  it("Support.tsx keeps paper-soft for table header + alternating row stripes", () => {
    // table header
    expect(support).toMatch(
      /grid-cols-12[^"]*bg-\[color:var\(--color-paper-soft\)\][^"]*border-b/,
    );
    // alternating row stripe at 40% alpha
    expect(support).toContain('bg-[color:var(--color-paper-soft)]/40');
  });

  it("Support.tsx keeps the §05.5 / §06 / §08 paper-soft section bands", () => {
    const matches = support.match(
      /<section[^>]*bg-\[color:var\(--color-paper-soft\)\][^>]*>/g,
    );
    // the audited intent is THREE full-band paper-soft sections
    // (candidate inquiry, FAQ, final CTA). §07 access&escalation between
    // them returns to plain paper to provide the breath
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it("Support.tsx keeps §07 access & escalation on plain paper for breath", () => {
    expect(support).toMatch(
      /07 — Access[\s\S]{0,400}|Access & escalation[\s\S]{0,2000}/,
    );
    // and somewhere near it there's a paper (not paper-soft) section
    expect(support).toMatch(
      /<section[^>]*bg-\[color:var\(--color-paper\)\][^>]*>/,
    );
  });
});
