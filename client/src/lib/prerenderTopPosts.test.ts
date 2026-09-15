import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// __dirname is client/src/lib/ — project root is 3 levels up (lib → src → client → root).
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

/**
 * The prerender script writes into <PROJECT_ROOT>/dist/public.
 * To keep tests hermetic we materialise a minimal SPA shell into dist/public,
 * run the script, and then clean up.
 */
const DIST = path.resolve(PROJECT_ROOT, "dist", "public");
const SHELL = path.join(DIST, "index.html");
const MANIFEST = path.join(DIST, "_prerender-manifest.json");
const INDEX_SOURCE = fs.readFileSync(
  path.join(PROJECT_ROOT, "client", "index.html"),
  "utf8",
);
const GTM_HEAD_BLOCK = INDEX_SOURCE.match(
  /<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/,
)?.[0];
const GTM_BODY_BLOCK = INDEX_SOURCE.match(
  /<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/,
)?.[0];
if (!GTM_HEAD_BLOCK || !GTM_BODY_BLOCK) {
  throw new Error("The shared shell is missing the required GTM blocks.");
}
// Mirror the real production shell shape: a non-empty #root with the §101
// homepage SEO block, so we can confirm the prerender script's div-walker
// correctly replaces a populated #root with the route-specific block.
const SHELL_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Default Title</title>
    <meta name="description" content="Default description." />
    ${GTM_HEAD_BLOCK}
  </head>
  <body>
    ${GTM_BODY_BLOCK}
    <!-- The client shell documents <div id="root"> before the real mount node. -->
    <div id="root">
      <main hidden aria-hidden="true" data-pre-hydration-seo="true">
        <h1>Homepage H1 placeholder</h1>
        <p>Homepage intro placeholder with FCRA and 24 hours.</p>
      </main>
    </div>
  </body>
</html>
`;

let preExisted = false;
let backedUp: string | null = null;

beforeAll(() => {
  preExisted = fs.existsSync(DIST);
  if (preExisted) {
    backedUp = fs.mkdtempSync(path.join(os.tmpdir(), "rhs-prerender-bak-"));
    fs.cpSync(DIST, backedUp, { recursive: true });
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(SHELL, SHELL_HTML, "utf-8");
  execFileSync("node", ["scripts/prerender_top_posts.mjs"], {
    cwd: PROJECT_ROOT,
    stdio: "pipe",
  });
});

afterAll(() => {
  fs.rmSync(DIST, { recursive: true, force: true });
  if (preExisted && backedUp) {
    fs.mkdirSync(DIST, { recursive: true });
    fs.cpSync(backedUp, DIST, { recursive: true });
    fs.rmSync(backedUp, { recursive: true, force: true });
  }
});

describe("prerender_top_posts.mjs", () => {
  it("writes a manifest with exactly 20 posts plus tag/year sections", () => {
    expect(fs.existsSync(MANIFEST)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
    expect(manifest.count).toBe(20);
    expect(Array.isArray(manifest.posts)).toBe(true);
    expect(manifest.posts).toHaveLength(20);
    expect(Array.isArray(manifest.tags)).toBe(true);
    expect(manifest.tags).toHaveLength(4);
    expect(Array.isArray(manifest.years)).toBe(true);
    expect(manifest.years.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(manifest.industryPages)).toBe(true);
    expect(manifest.industryPages).toHaveLength(2);
  });

  it("preserves one GTM head script and one noscript iframe in generated documents", () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
    const files = [
      SHELL,
      path.join(DIST, manifest.posts[0].file),
      path.join(DIST, manifest.landingPages[0].file),
      path.join(DIST, manifest.partnerPages[0].file),
      ...manifest.industryPages.map((entry: { file: string }) =>
        path.join(DIST, entry.file),
      ),
    ];

    for (const file of files) {
      const html = fs.readFileSync(file, "utf-8");
      expect(html.match(/GTM-WMQPS3T3/g) ?? [], file).toHaveLength(2);
      expect(
        html.match(/googletagmanager\.com\/gtm\.js/g) ?? [],
        file,
      ).toHaveLength(1);
      expect(
        html.match(/googletagmanager\.com\/ns\.html/g) ?? [],
        file,
      ).toHaveLength(1);
    }
  });

  it("emits route-specific initial HTML for both company industry pages", () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
    const expected = [
      {
        route: "/industries/cleaning-companies",
        title:
          "Background Checks for Cleaning Companies | Rapid Hire Solutions",
        description:
          "Build a faster, role-specific employee screening program for residential and commercial cleaning teams, including criminal checks, MVRs, employment verification and more.",
        canonical:
          "https://www.rapidhiresolutions.com/industries/cleaning-companies",
        marker: "prerendered:industries/cleaning-companies",
        jsonLdKey: "industry-company-cleaning-companies",
        h1: "Hire Cleaning Staff You Can Confidently Send Into a Customer’s Home.",
        links: [
          "/industries",
          "/services/criminal-records",
          "/get-a-quote?industry=cleaning-companies",
        ],
        faq: "Should a cleaning company background check every employee?",
      },
      {
        route: "/industries/moving-companies",
        title:
          "Background Checks for Moving Companies | Rapid Hire Solutions",
        description:
          "Screen movers, drivers, crew leaders and storage staff with role-specific background checks built for residential and commercial moving companies.",
        canonical:
          "https://www.rapidhiresolutions.com/industries/moving-companies",
        marker: "prerendered:industries/moving-companies",
        jsonLdKey: "industry-company-moving-companies",
        h1: "Screen the People Customers Trust With Everything They Own.",
        links: [
          "/industries",
          "/industries/transportation",
          "/get-a-quote?industry=moving-companies",
        ],
        faq: "Does every mover fall under DOT regulations?",
      },
    ];

    expect(
      manifest.industryPages.map((entry: { route: string }) => entry.route),
    ).toEqual(expected.map((entry) => entry.route));

    for (const page of expected) {
      const entry = manifest.industryPages.find(
        (item: { route: string }) => item.route === page.route,
      );
      const file = path.join(DIST, entry.file);
      expect(fs.existsSync(file), file).toBe(true);
      const html = fs.readFileSync(file, "utf-8");
      expect(html).toContain(`<title>${escapeHtml(page.title)}</title>`);
      expect(html).toContain(
        `<meta name="description" content="${escapeHtml(page.description)}"`,
      );
      expect(html.match(/<link rel="canonical"/g) ?? []).toHaveLength(1);
      expect(html).toContain(
        `<link rel="canonical" href="${page.canonical}"`,
      );
      for (const property of [
        "og:type",
        "og:title",
        "og:description",
        "og:url",
        "og:image",
      ]) {
        expect(
          html.match(new RegExp(`property="${property}"`, "g")) ?? [],
        ).toHaveLength(1);
      }
      expect(html).toContain(`<!-- ${page.marker} -->`);
      expect(html).toContain(`data-pre-hydration-seo="${page.marker}"`);
      expect(html).toContain(`<h1>${page.h1}</h1>`);
      expect(html).not.toContain("Homepage H1 placeholder");
      expect(html).toContain('"@type":"FAQPage"');
      expect(html).toContain(page.faq);
      const routeJsonLd = html.match(
        new RegExp(
          `<script type="application/ld\\+json" data-use-seo-key="${page.jsonLdKey}">[\\s\\S]*?<\\/script>`,
          "g",
        ),
      ) ?? [];
      expect(routeJsonLd).toHaveLength(1);
      expect(routeJsonLd[0]).toContain('"@type":"FAQPage"');
      expect(html.match(/<script type="application\/ld\+json"/g) ?? []).toHaveLength(1);
      for (const href of page.links) {
        expect(html).toContain(`href="${href}"`);
      }
      if (page.route === "/industries/moving-companies") {
        expect(html).toContain("last-mile household delivery operations");
      }
    }
  });

  it("emits a per-slug HTML stub for each manifest entry, with rewritten head", () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
    for (const entry of manifest.posts) {
      const file = path.join(DIST, "blog", entry.slug, "index.html");
      expect(fs.existsSync(file), file).toBe(true);
      const html = fs.readFileSync(file, "utf-8");
      // Title rewritten
      expect(html).toContain(`<title>${escapeHtml(entry.title)}</title>`);
      // Marker present so we can detect prerendered output
      expect(html).toContain(`<!-- prerendered:${entry.slug} -->`);
      // Canonical wired to /blog/<slug>
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*?/blog/${entry.slug}"`));
      // BlogPosting JSON-LD present
      expect(html).toContain(`"@type":"BlogPosting"`);
      // §102: pre-hydration SEO block carries a route-specific H1 +
      // crawlable links + breadcrumb, replacing the homepage placeholder.
      expect(html).not.toContain("Homepage H1 placeholder");
      expect(html).toContain(`data-pre-hydration-seo="prerendered:${entry.slug}"`);
      expect(html).toMatch(/<h1[^>]*>[^<]*<\/h1>/);
      expect(html).toContain('<a href="/services">');
      expect(html).toContain('<a href="/blog">');
    }
  });

  it("emits per-tag and per-year stubs with CollectionPage JSON-LD", () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
    for (const entry of manifest.tags) {
      const file = path.join(DIST, "blog", "tag", entry.tag, "index.html");
      expect(fs.existsSync(file), file).toBe(true);
      const html = fs.readFileSync(file, "utf-8");
      expect(html).toContain(`<!-- prerendered:tag/${entry.tag} -->`);
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*?/blog/tag/${entry.tag}"`));
      expect(html).toContain(`"@type":"CollectionPage"`);
      // §102: tag-specific SEO block.
      expect(html).toContain(`data-pre-hydration-seo="prerendered:tag/${entry.tag}"`);
      expect(html).toMatch(/<h1[^>]*>[^<]*<\/h1>/);
      expect(html).not.toContain("Homepage H1 placeholder");
    }
    for (const entry of manifest.years) {
      const file = path.join(DIST, "blog", "year", entry.year, "index.html");
      expect(fs.existsSync(file), file).toBe(true);
      const html = fs.readFileSync(file, "utf-8");
      expect(html).toContain(`<!-- prerendered:year/${entry.year} -->`);
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*?/blog/year/${entry.year}"`));
      expect(html).toContain(`"@type":"CollectionPage"`);
      // §102: year-specific SEO block.
      expect(html).toContain(`data-pre-hydration-seo="prerendered:year/${entry.year}"`);
      expect(html).toMatch(new RegExp(`<h1[^>]*>${entry.year} in review`));
    }
  });

  it("minifies emitted HTML by default (no leading-whitespace runs)", () => {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
    expect(manifest.minified).toBe(true);
    const sample = path.join(DIST, manifest.posts[0].file);
    const html = fs.readFileSync(sample, "utf-8");
    // No long runs of leading spaces, and no >\n+\s+< sequences.
    expect(html).not.toMatch(/>\s{2,}</);
  });

  it("dedup: re-running keeps the manifest stable for the same input", () => {
    const before = fs.readFileSync(MANIFEST, "utf-8");
    execFileSync("node", ["scripts/prerender_top_posts.mjs"], {
      cwd: PROJECT_ROOT,
      stdio: "pipe",
    });
    const after = fs.readFileSync(MANIFEST, "utf-8");
    // generatedAt differs; compare slug ordering instead
    const slugsBefore = JSON.parse(before).posts.map((p: { slug: string }) => p.slug);
    const slugsAfter = JSON.parse(after).posts.map((p: { slug: string }) => p.slug);
    expect(slugsAfter).toEqual(slugsBefore);
  });
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
