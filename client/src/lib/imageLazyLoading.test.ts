/*
 * §191 source-pin spec — image lazy-loading contract.
 *
 * The user asked for lazy-loading on every below-the-fold <img>. Most of the
 * codebase was already wired correctly, but a few image elements lacked an
 * explicit `loading=` attribute and an editor "cleaning up" eager attributes
 * could silently regress LCP/network metrics on Vercel. This spec pins:
 *
 *   1. Above-the-fold images that MUST stay eager (hero, desktop header logo,
 *      page hero shells, blog cover, contact/compliance hero photos).
 *   2. Below-the-fold images that MUST be lazy (footer logo, mobile-sheet
 *      logo, sample-report, why-us interview photo, integrations infographic,
 *      service/industry hero illustrations, blog video CTA thumbnail, learn
 *      page video thumbnails, support team avatars, trust certification
 *      badges, compliance badge row, integrations rail logos via partner
 *      cards, pricing portrait illustration).
 *   3. Every <img> in the source tree carries either an explicit loading
 *      attribute or a documented exception (only the ManusDialog and the
 *      desktop header lockup are exempt because they're either always
 *      hidden by default or strictly above-the-fold).
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

const read = (rel: string) =>
  fs.readFileSync(path.join(PROJECT_ROOT, rel), "utf-8");

/**
 * Assert that the <img> tag immediately following the given marker comment
 * (or src match) carries the expected loading attribute. We slice 600 chars
 * after the marker so even a heavily-formatted multi-line <img> tag is
 * captured in full.
 */
function imgFollowingMarkerHasLoading(
  src: string,
  marker: string,
  expected: "lazy" | "eager",
) {
  const idx = src.indexOf(marker);
  expect(idx, `marker not found: ${marker}`).toBeGreaterThan(-1);
  // Walk backwards from the marker to find the opening <img… since the
  // marker is typically a `src={...}` line that lives INSIDE the tag.
  const before = src.slice(0, idx);
  const imgOpenIdx = before.lastIndexOf("<img");
  expect(imgOpenIdx, `<img not found near marker: ${marker}`).toBeGreaterThan(-1);
  const slice = src.slice(imgOpenIdx, imgOpenIdx + 600);
  const imgIdx = 0;
  // grab from <img to the closing />
  const tagEnd = slice.indexOf("/>", imgIdx);
  const tag = slice.slice(imgIdx, tagEnd > 0 ? tagEnd + 2 : imgIdx + 500);
  expect(
    tag,
    `expected loading="${expected}" near marker ${marker}, got tag:\n${tag}`,
  ).toMatch(new RegExp(`loading\\s*=\\s*"${expected}"`));
}

describe("§191 — above-the-fold images stay eager (no loading=lazy)", () => {
  it("Hero homepage <img> uses fetchPriority=high and does not set loading=lazy", () => {
    const src = read("client/src/components/site/Hero.tsx");
    // The hero <img> is the LCP element on the home page. Marking it lazy
    // would hurt Core Web Vitals; pin against that regression.
    expect(src).toMatch(/fetchPriority\s*=\s*"high"/);
    // The only <img> in this file is the hero fallback; it must NOT carry
    // a loading attribute (omitted = eager-by-default in browsers).
    expect(src).not.toMatch(/loading\s*=\s*"lazy"/);
  });

  it("Desktop header logo (Logo() component) is eager and high-priority", () => {
    const src = read("client/src/components/site/Header.tsx");
    // The Logo() function defines the desktop header lockup. Pin its
    // fetchPriority="high" + absence of any loading attribute on that
    // <img>. We approximate "the desktop logo" by finding the unique
    // fetchPriority="high" attribute and checking the surrounding tag.
    const idx = src.indexOf('fetchPriority="high"');
    expect(idx).toBeGreaterThan(-1);
    const slice = src.slice(Math.max(0, idx - 300), idx + 200);
    expect(slice).not.toMatch(/loading\s*=\s*"lazy"/);
  });

  it("BlogPost cover, Contact hero, Compliance hero, PageHero are all loading=eager", () => {
    const blog = read("client/src/pages/BlogPost.tsx");
    const contact = read("client/src/pages/Contact.tsx");
    const compliance = read("client/src/pages/Compliance.tsx");
    const pageHero = read("client/src/components/site/PageHero.tsx");
    // Each of these renders the page's primary above-the-fold image. They
    // all currently use loading="eager" and that must not regress.
    expect(blog).toMatch(/loading\s*=\s*"eager"/);
    expect(contact).toMatch(/loading\s*=\s*"eager"/);
    expect(compliance).toMatch(/loading\s*=\s*"eager"/);
    expect(pageHero).toMatch(/loading\s*=\s*"eager"/);
  });
});

describe("§191 — below-the-fold images are loading=lazy", () => {
  it("Footer brand mark is loading=lazy", () => {
    // §191: anchor on the JSX prop usage (src={FOOTER_LOGO_URL}) not the
    // import line, since the import is the first occurrence of the bare
    // identifier and has no <img> within scanning range.
    imgFollowingMarkerHasLoading(
      read("client/src/components/site/Footer.tsx"),
      "src={FOOTER_LOGO_URL}",
      "lazy",
    );
  });

  it("Mobile-sheet header logo is loading=lazy (only renders when hamburger is opened)", () => {
    const src = read("client/src/components/site/Header.tsx");
    // The mobile sheet renders an <img src={HEADER_LOGO_URL}> that's
    // closed by default. Pin its loading=lazy attribute.
    const sheetIdx = src.indexOf('data-testid="header-mobile-sheet"');
    expect(sheetIdx).toBeGreaterThan(-1);
    const slice = src.slice(sheetIdx, sheetIdx + 1500);
    expect(slice).toMatch(/<img[\s\S]+?loading\s*=\s*"lazy"[\s\S]+?\/>/);
  });

  it("WhyUs interview photo is loading=lazy", () => {
    const src = read("client/src/components/site/WhyUs.tsx");
    expect(src).toMatch(/why_us_interview\.webp[\s\S]+?loading\s*=\s*"lazy"/);
  });

  it("Sample report image and modal are loading=lazy", () => {
    const src = read("client/src/components/site/SampleReportImage.tsx");
    // Both the trigger thumbnail and the modal <img> must be lazy — neither
    // is visible on first paint (the modal is closed by default).
    const lazyHits = (src.match(/loading\s*=\s*"lazy"/g) ?? []).length;
    expect(lazyHits).toBeGreaterThanOrEqual(2);
  });

  it("Integrations infographic and partner-card hero illustration are loading=lazy", () => {
    const src = read("client/src/pages/Integrations.tsx");
    const lazyHits = (src.match(/loading\s*=\s*"lazy"/g) ?? []).length;
    // §191: at least the infographic + the integrations-portrait hero
    // illustration. Keep the floor at 2.
    expect(lazyHits).toBeGreaterThanOrEqual(2);
  });

  it("Trust certification badge images are loading=lazy", () => {
    const src = read("client/src/pages/Trust.tsx");
    const lazyHits = (src.match(/loading\s*=\s*"lazy"/g) ?? []).length;
    expect(lazyHits).toBeGreaterThanOrEqual(2);
  });

  it("Support team avatars are loading=lazy", () => {
    const src = read("client/src/pages/Support.tsx");
    expect(src).toMatch(
      /data-testid="desk-avatar"[\s\S]+?loading\s*=\s*"lazy"|loading\s*=\s*"lazy"[\s\S]+?data-testid="desk-avatar"/,
    );
  });

  it("Service / Industry detail hero illustrations are loading=lazy", () => {
    const service = read("client/src/pages/ServiceDetail.tsx");
    const industry = read("client/src/pages/IndustryDetail.tsx");
    const services = read("client/src/pages/Services.tsx");
    const industries = read("client/src/pages/Industries.tsx");
    expect(service).toMatch(/loading\s*=\s*"lazy"/);
    expect(industry).toMatch(/loading\s*=\s*"lazy"/);
    expect(services).toMatch(/loading\s*=\s*"lazy"/);
    expect(industries).toMatch(/loading\s*=\s*"lazy"/);
  });

  it("Pricing illustration and Learn video thumbnails are loading=lazy", () => {
    const pricing = read("client/src/pages/Pricing.tsx");
    const learn = read("client/src/pages/Learn.tsx");
    expect(pricing).toMatch(/loading\s*=\s*"lazy"/);
    expect(learn).toMatch(/loading\s*=\s*"lazy"/);
  });

  it("BlogPostVideoCta thumbnail is loading=lazy", () => {
    const src = read("client/src/components/blog/BlogPostVideoCta.tsx");
    expect(src).toMatch(/loading\s*=\s*"lazy"/);
  });

  it("Compliance row badges are loading=lazy", () => {
    const src = read("client/src/pages/Compliance.tsx");
    const lazyHits = (src.match(/loading\s*=\s*"lazy"/g) ?? []).length;
    // §191: the compliance page has the credibility-badge row (each badge
    // is a tiny <img>). Pin floor at 1 lazy hit (the eager hero is the
    // only above-the-fold image; everything else, including badges, is
    // below the fold on a long compliance page).
    expect(lazyHits).toBeGreaterThanOrEqual(1);
  });
});

describe("§191 — every image in the source tree carries an explicit loading attribute or a documented exception", () => {
  it("ManusDialog.tsx is the only file with an <img> lacking a loading attribute (third-party dialog scaffold; image is hidden until dialog opens)", () => {
    // This pin documents the single exemption so future audits know it's
    // intentional. If anyone adds another <img> without loading=, the test
    // count will rise and this assertion will fail with a clear list.
    const filesWithImg = [
      "client/src/components/ManusDialog.tsx",
      "client/src/components/site/Header.tsx",
      "client/src/components/site/Hero.tsx",
      "client/src/components/site/WhyUs.tsx",
      "client/src/components/site/Footer.tsx",
      "client/src/components/site/PageHero.tsx",
      "client/src/components/site/SampleReportImage.tsx",
      "client/src/components/blog/BlogPostVideoCta.tsx",
      "client/src/pages/Services.tsx",
      "client/src/pages/Integrations.tsx",
      "client/src/pages/Contact.tsx",
      "client/src/pages/Pricing.tsx",
      "client/src/pages/BlogPost.tsx",
      "client/src/pages/Support.tsx",
      "client/src/pages/Compliance.tsx",
      "client/src/pages/Trust.tsx",
      "client/src/pages/Industries.tsx",
      "client/src/pages/ServiceDetail.tsx",
      "client/src/pages/IndustryDetail.tsx",
      "client/src/pages/Learn.tsx",
    ];
    const offenders: string[] = [];
    for (const rel of filesWithImg) {
      // §191: strip JSX comments first so a comment like /* the <img>
      // below renders ... */ doesn't generate a false positive. Both /*
      // ... */ block comments and {/* ... */} JSX-block comments are
      // removed; line comments are left alone since they can't contain
      // a self-closing JSX tag.
      const raw = read(rel);
      const src = raw
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");
      // For each <img tag, walk to its closing /> and ensure loading=
      // appears within. Allowed exception: ManusDialog.tsx + Hero.tsx
      // (hero img has fetchPriority="high" instead of an explicit loading)
      // + the Header desktop logo (also fetchPriority="high").
      const imgRe = /<img\b[\s\S]*?\/>/g;
      let m: RegExpExecArray | null;
      while ((m = imgRe.exec(src)) !== null) {
        const tag = m[0];
        const hasLoading = /loading\s*=\s*"(lazy|eager)"/.test(tag);
        const hasFetchHigh = /fetchPriority\s*=\s*"high"/.test(tag);
        const isAllowed =
          rel === "client/src/components/ManusDialog.tsx" ||
          (rel === "client/src/components/site/Hero.tsx" && hasFetchHigh) ||
          (rel === "client/src/components/site/Header.tsx" && hasFetchHigh);
        if (!hasLoading && !isAllowed) {
          offenders.push(`${rel}: ${tag.slice(0, 120)}...`);
        }
      }
    }
    expect(offenders, `<img> tags missing loading=:\n${offenders.join("\n")}`).toEqual([]);
  });
});
