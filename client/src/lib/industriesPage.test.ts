/*
  §69 — /industries page pins.

  Asserts the dedicated Industries landing page exists, is registered on
  the wouter router at /industries, surfaces six fixed verticals, owns
  every section's deep-link anchor + matching grid card, and is reachable
  from the header NAV array (between Services and Integrations) and the
  global Footer COMPANY column.

  Anti-regression assertions guard:
    1) the page never references PreciseHire / Precise Hire (the upstream
       reference the page was modelled on),
    2) the U.S.-based hours line stays consistent with Support.tsx
       ("7am to 7pm Central"),
    3) the published "85%+ in 24h" + "800+ HR teams" + "99.4% on-time"
       proof points stay on the hero stat card.
*/
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");

const file = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

const industries = file("client/src/pages/Industries.tsx");
const app = file("client/src/App.tsx");
const header = file("client/src/components/site/Header.tsx");
const footer = file("client/src/components/site/Footer.tsx");

const SLUGS = [
  "healthcare",
  "transportation",
  "staffing",
  "finance",
  "retail",
  "nonprofit",
] as const;

describe("§69 — Industries page", () => {
  it("ships at client/src/pages/Industries.tsx with the SiteShell + PageHero contract", () => {
    expect(industries).toMatch(/import\s+SiteShell\s+from\s+"@\/components\/site\/SiteShell"/);
    expect(industries).toMatch(/import\s+PageHero\s+from\s+"@\/components\/site\/PageHero"/);
    expect(industries).toMatch(/import\s+\{\s*useSeo\s*\}\s+from\s+"@\/hooks\/useSeo"/);
    expect(industries).toMatch(/export\s+default\s+function\s+Industries\s*\(\s*\)/);
  });

  it("registers /industries on the wouter Router in App.tsx", () => {
    expect(app).toMatch(/import\s+Industries\s+from\s+"\.\/pages\/Industries"/);
    expect(app).toMatch(/<Route\s+path=\{"\/industries"\}\s+component=\{Industries\}\s*\/>/);
  });

  it("adds Industries to the header NAV array between Services and Integrations", () => {
    // anchor on the structural slice so the order assertion is robust
    const start = header.indexOf("const NAV: NavItem[] = [");
    const end = header.indexOf("];", start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const navBlock = header.slice(start, end);

    const servicesIx = navBlock.indexOf('"/services"');
    const industriesIx = navBlock.indexOf('"/industries"');
    const integrationsIx = navBlock.indexOf('"/integrations"');

    expect(servicesIx).toBeGreaterThan(-1);
    expect(industriesIx).toBeGreaterThan(-1);
    expect(integrationsIx).toBeGreaterThan(-1);
    expect(servicesIx).toBeLessThan(industriesIx);
    expect(industriesIx).toBeLessThan(integrationsIx);

    expect(navBlock).toMatch(/label:\s*"Industries",\s*href:\s*"\/industries"/);
  });

  it("surfaces /industries from the Footer COMPANY column", () => {
    expect(footer).toMatch(/label:\s*"Industries",\s*to:\s*"\/industries"/);
  });

  it("hero exposes the documented eyebrow, italic-accent headline, and stat-card proof points", () => {
    expect(industries).toMatch(/eyebrow="00 — Industries"/);
    // italic-accent inside the hero title
    expect(industries).toMatch(/italic font-light text-\[color:var\(--color-accent-ink\)\]/);
    // stat card pinned proof points
    expect(industries).toMatch(/data-testid="industries-stat-card"/);
    expect(industries).toMatch(/85%\+\s+of reports cleared inside 24 hours/);
    expect(industries).toMatch(/>\s*800\+\s*</);
    expect(industries).toMatch(/>\s*99\.4%\s*</);
    // §83: hero stat card now reads "9" verticals (added gig-1099, manufacturing, education).
    expect(industries).toMatch(/>\s*9\s*</);
  });

  it("hero CTA pair links to /get-a-quote (§111) and to the #sectors anchor on the same page", () => {
    // hero CTAs are written with literal data-testid + href attrs
    // §111: quote CTA repointed from /contact to the dedicated /get-a-quote page
    expect(industries).toMatch(
      /href="\/get-a-quote"\s+data-testid="industries-cta-quote"/,
    );
    expect(industries).toMatch(
      /href="#sectors"\s+data-testid="industries-cta-jump"/,
    );
  });

  it("declares all six verticals with stable slugs in the VERTICALS array", () => {
    for (const slug of SLUGS) {
      // every slug appears at least once as a typed entry
      expect(industries).toContain(`slug: "${slug}"`);
    }
    // §83: page now has 6 inline VERTICALS + 3 link-only new verticals.
    // Allow either 6 (just the inline VERTICALS array) or 9 (if the new
    // rail's literal slug strings are inlined). The new-rail slugs use
    // hyphens ("gig-1099") which the [a-z]+ regex does NOT capture, so
    // the slug count from the regex stays at 6 — keep that pin tight.
    const slugMatches = industries.match(/slug:\s*"([a-z]+)"/g) ?? [];
    expect(slugMatches.length).toBe(SLUGS.length);
  });

  it("renders one anchored Section per vertical with matching grid card + reg-box + stat row", () => {
    // these testids are JSX template literals so they appear as `${v.slug}`
    // / `${slug}` in the source string. Pin on the template form, plus an
    // independent assertion that the SLUGS array drives them.
    expect(industries).toMatch(/data-testid=\{`industries-section-\$\{v\.slug\}`\}/);
    expect(industries).toMatch(/data-testid=\{`industries-card-\$\{v\.slug\}`\}/);
    expect(industries).toMatch(/data-testid=\{`industries-regbox-\$\{v\.slug\}`\}/);
    expect(industries).toMatch(/data-testid=\{`industries-stats-\$\{v\.slug\}`\}/);
    // every slug is declared in the source and the .map iterations cover all 6
    for (const slug of SLUGS) {
      expect(industries).toContain(`slug: "${slug}"`);
    }
  });

  it("each vertical Section is anchored with id={v.slug} and scroll-mt-24 (matches /trust convention)", () => {
    expect(industries).toMatch(/<section\s+id=\{v\.slug\}/);
    expect(industries).toMatch(/scroll-mt-24/);
  });

  it("FAQ block carries exactly 3 entries with sequential testids", () => {
    // testid is a JSX template literal driven by the FAQ map index
    expect(industries).toMatch(/data-testid=\{`industries-faq-\$\{i \+ 1\}`\}/);

    // FAQ array literal length should be 3
    const faqArrayMatch = industries.match(
      /const FAQ:\s*ReadonlyArray<Faq>\s*=\s*\[([\s\S]*?)\];/,
    );
    expect(faqArrayMatch).not.toBeNull();
    if (faqArrayMatch) {
      const qCount = (faqArrayMatch[1].match(/^\s*\{\s*$/gm) ?? []).length;
      // 3 question objects in the array
      expect(qCount).toBe(3);
    }
  });

  it("closing dark CTA band links forward to /contact and back to /services", () => {
    // testids appear as literal strings; the href attribute precedes them
    expect(industries).toMatch(
      /href="\/contact"\s+data-testid="industries-cta-band-quote"/,
    );
    expect(industries).toMatch(
      /href="\/services"\s+data-testid="industries-cta-band-services"/,
    );
  });

  it("ANTI-REGRESSION — never references the upstream reference (PreciseHire) in the rendered page", () => {
    expect(industries.toLowerCase()).not.toMatch(/precisehire|precise\s+hire/);
  });

  it("ANTI-REGRESSION — keeps the hours-line consistent with Support.tsx (7am to 7pm Central)", () => {
    expect(industries).toMatch(/7am to 7pm Central/);
  });
});
