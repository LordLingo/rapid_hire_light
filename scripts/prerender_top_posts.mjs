#!/usr/bin/env node
/*
 * Build-time prerender for high-traffic blog routes.
 *
 * Strategy (head-only prerender):
 *   - Reads the SPA shell at dist/public/index.html.
 *   - Emits per-slug HTML stubs at dist/public/blog/<slug>/index.html for the
 *     top 20 posts (ranked by lastmod desc, then publishedAt desc).
 *   - Emits per-tag HTML stubs at dist/public/blog/tag/<tag>/index.html for
 *     the top 4 tags (ranked by post count, then alpha).
 *   - Emits per-year hub stubs at dist/public/blog/year/<yyyy>/index.html for
 *     every year with at least one post.
 *   - Each stub preserves the SPA shell, replaces <title> + meta description,
 *     and injects canonical + OG meta + JSON-LD just before </head>.
 *   - Body remains the SPA mount (#root); React still hydrates client-side.
 *   - Same HTML is served to humans and crawlers — no UA-based cloaking.
 *   - When PRERENDER_MINIFY is enabled (default in production), HTML is
 *     collapsed (no comment markers stripped — they're useful for diagnostics).
 *
 * Manifest is written to dist/public/_prerender-manifest.json so vitest can
 * verify the output without re-deriving the rank.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DIST = path.resolve(PROJECT_ROOT, "dist", "public");
const META_FILE = path.resolve(PROJECT_ROOT, "shared", "blog-meta.json");
const OG_FILE = path.resolve(PROJECT_ROOT, "shared", "blog-og.json");
const SHELL = path.join(DIST, "index.html");

const TOP_POSTS = 20;
const TOP_TAGS = 4;
const SITE_BASE = (process.env.SITE_BASE_URL || "https://www.rapidhiresolutions.com").replace(/\/+$/, "");
const POST_OG = (slug) => `${SITE_BASE}/api/og/blog/${slug}.svg`;
const TAG_OG = (tag) => `${SITE_BASE}/api/og/blog/tag/${tag}.svg`;
// Default OG for year hubs falls back to the brand card.
const SITE_OG = `${SITE_BASE}/og.svg`;
const SHOULD_MINIFY = process.env.PRERENDER_MINIFY !== "0";

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(slug) {
  return slug
    .split("-")
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function loadInputs() {
  if (!fs.existsSync(META_FILE) || !fs.existsSync(OG_FILE)) {
    throw new Error(`prerender: missing inputs (${META_FILE} or ${OG_FILE})`);
  }
  const meta = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  const og = JSON.parse(fs.readFileSync(OG_FILE, "utf-8"));
  const titleBySlug = new Map();
  const tagBySlug = new Map();
  for (const p of og.posts ?? []) {
    if (typeof p.slug === "string") {
      if (typeof p.title === "string") titleBySlug.set(p.slug, p.title);
      if (typeof p.tag === "string") tagBySlug.set(p.slug, p.tag);
    }
  }

  const allPosts = (meta.posts ?? [])
    .filter((p) => typeof p.slug === "string" && titleBySlug.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      lastmod: typeof p.lastmod === "string" ? p.lastmod : "",
      publishedAt: typeof p.publishedAt === "string" ? p.publishedAt : "",
      title: titleBySlug.get(p.slug),
      tag: tagBySlug.get(p.slug) ?? "",
    }));

  const rankedPosts = [...allPosts].sort((a, b) => {
    if (b.lastmod !== a.lastmod) return b.lastmod.localeCompare(a.lastmod);
    if (b.publishedAt !== a.publishedAt) return b.publishedAt.localeCompare(a.publishedAt);
    return a.slug.localeCompare(b.slug);
  });

  // Tag counts come from primary tags in blog-og.json. Mirror what the OG endpoint uses.
  const tagCounts = new Map();
  for (const p of allPosts) {
    if (!p.tag) continue;
    tagCounts.set(p.tag, (tagCounts.get(p.tag) ?? 0) + 1);
  }
  const rankedTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag));

  // Active years come from publishedAt; lastmod is intentionally ignored
  // because backdating made lastmod cluster on the build day.
  const yearSet = new Set();
  for (const p of allPosts) {
    const src = p.publishedAt || p.lastmod;
    const m = /^(\d{4})/.exec(src);
    if (m) yearSet.add(m[1]);
  }
  const years = Array.from(yearSet).sort();

  return {
    posts: rankedPosts.slice(0, TOP_POSTS),
    tags: rankedTags.slice(0, TOP_TAGS),
    years,
  };
}

function buildPostHtml(post, shell) {
  const url = `${SITE_BASE}/blog/${post.slug}`;
  const og = POST_OG(post.slug);
  const title = post.title;
  const description = post.title;
  const datePublished = post.publishedAt || post.lastmod;
  const dateModified = post.lastmod || post.publishedAt;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    url,
    image: og,
    datePublished: datePublished ? `${datePublished}T00:00:00Z` : undefined,
    dateModified: dateModified ? `${dateModified}T00:00:00Z` : undefined,
    keywords: post.tag || undefined,
    author: { "@type": "Organization", name: "Rapid Hire Solutions" },
    publisher: { "@type": "Organization", name: "Rapid Hire Solutions" },
  };
  return injectHead(shell, {
    marker: `prerendered:${post.slug}`,
    title,
    description,
    canonical: url,
    ogType: "article",
    ogImage: og,
    jsonld,
    preHydrationBody: buildPostBody(post),
  });
}

function buildTagHtml(tagEntry, shell) {
  const url = `${SITE_BASE}/blog/tag/${tagEntry.tag}`;
  const og = TAG_OG(tagEntry.tag);
  const title = `${titleCase(tagEntry.tag)} — Rapid Hire Solutions Blog`;
  const description = `${tagEntry.count} article${tagEntry.count === 1 ? "" : "s"} on ${titleCase(tagEntry.tag)} from the Rapid Hire Solutions compliance team.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url,
    description,
  };
  return injectHead(shell, {
    marker: `prerendered:tag/${tagEntry.tag}`,
    title,
    description,
    canonical: url,
    ogType: "website",
    ogImage: og,
    jsonld,
    preHydrationBody: buildTagBody(tagEntry),
  });
}

function buildYearHtml(year, shell) {
  const url = `${SITE_BASE}/blog/year/${year}`;
  const title = `${year} in review — Rapid Hire Solutions Blog`;
  const description = `Every Rapid Hire Solutions blog post published in ${year}, grouped by quarter.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url,
    description,
  };
  return injectHead(shell, {
    marker: `prerendered:year/${year}`,
    title,
    description,
    canonical: url,
    ogType: "website",
    ogImage: SITE_OG,
    jsonld,
    preHydrationBody: buildYearBody(year),
  });
}

function injectHead(shell, opts) {
  // 1) Replace <title>.
  let html = shell.replace(/<title>[\s\S]*?<\/title>/i, `<title>${htmlEscape(opts.title)}</title>`);
  // 2) Replace meta description.
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${htmlEscape(opts.description)}" />`,
  );
  // 3) Inject canonical + OG meta + JSON-LD just before </head> (idempotent block).
  const inject =
    `\n    <!-- ${opts.marker} -->\n` +
    `    <link rel="canonical" href="${htmlEscape(opts.canonical)}" />\n` +
    `    <meta property="og:type" content="${htmlEscape(opts.ogType)}" />\n` +
    `    <meta property="og:title" content="${htmlEscape(opts.title)}" />\n` +
    `    <meta property="og:url" content="${htmlEscape(opts.canonical)}" />\n` +
    `    <meta property="og:image" content="${htmlEscape(opts.ogImage)}" />\n` +
    `    <meta name="twitter:card" content="summary_large_image" />\n` +
    `    <meta name="twitter:title" content="${htmlEscape(opts.title)}" />\n` +
    `    <meta name="twitter:image" content="${htmlEscape(opts.ogImage)}" />\n` +
    `    <script type="application/ld+json">${JSON.stringify(opts.jsonld)}</script>\n  `;
  html = html.replace(/<\/head>/i, `${inject}</head>`);
  // 4) Replace whatever's inside <div id="root">...</div> with a route-aware
  //    pre-hydration SEO block. Same crawler/auditor rationale as the homepage
  //    shell in client/index.html: bots that don't execute JS see a real H1,
  //    intro paragraph, and crawlable links instead of an empty div.
  if (opts.preHydrationBody) {
    // Find <div id="root"> ... </div> by walking the string and balancing
    // <div>/</div> pairs. Regex won't do this safely once the production
    // shell carries the §101 SEO block (potentially nested elements).
    const startIdx = html.indexOf('<div id="root">');
    if (startIdx >= 0) {
      const openLen = '<div id="root">'.length;
      let depth = 1;
      let i = startIdx + openLen;
      while (i < html.length && depth > 0) {
        const nextOpen = html.indexOf("<div", i);
        const nextClose = html.indexOf("</div>", i);
        if (nextClose === -1) break;
        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth += 1;
          i = nextOpen + 4;
        } else {
          depth -= 1;
          i = nextClose + "</div>".length;
        }
      }
      if (depth === 0) {
        const replacement =
          `<div id="root">\n      <main hidden aria-hidden="true" data-pre-hydration-seo="${htmlEscape(opts.marker)}">\n${opts.preHydrationBody}\n      </main>\n    </div>`;
        html = html.slice(0, startIdx) + replacement + html.slice(i);
      }
    }
  }
  return html;
}

function renderBreadcrumb() {
  return `        <nav aria-label="Breadcrumb">\n` +
    `          <a href="/">Home</a> &middot; <a href="/blog">Blog</a>\n` +
    `        </nav>`;
}

function renderSiteLinks() {
  return `        <h2>Explore Rapid Hire Solutions</h2>\n` +
    `        <ul>\n` +
    `          <li><a href="/services">Background screening services</a></li>\n` +
    `          <li><a href="/industries">Industries we serve</a></li>\n` +
    `          <li><a href="/integrations">ATS &amp; HRIS integrations</a></li>\n` +
    `          <li><a href="/pricing">Pricing</a></li>\n` +
    `          <li><a href="/compliance">Compliance &amp; FCRA resources</a></li>\n` +
    `          <li><a href="/about">About Rapid Hire Solutions</a></li>\n` +
    `          <li><a href="/blog">Background screening blog</a></li>\n` +
    `          <li><a href="/contact">Contact our team</a></li>\n` +
    `        </ul>`;
}

function buildPostBody(post) {
  const tagLabel = post.tag ? titleCase(post.tag) : "";
  const tagLine = post.tag
    ? `        <p>Filed under <a href="/blog/tag/${htmlEscape(post.tag)}">${htmlEscape(tagLabel)}</a> on the Rapid Hire Solutions blog. <a href="/blog">See all posts</a>.</p>`
    : `        <p>Published on the Rapid Hire Solutions blog. <a href="/blog">See all posts</a>.</p>`;
  return [
    renderBreadcrumb(),
    `        <h1>${htmlEscape(post.title)}</h1>`,
    tagLine,
    `        <p>This article from Rapid Hire Solutions — a U.S.-based, FCRA-certified consumer reporting agency that delivers employment background checks, pre-employment screening, criminal background checks, motor vehicle records, drug screening, and continuous monitoring with 85%+ of standard checks completing in under 24 hours — covers ${htmlEscape(tagLabel || "background screening")} for hiring and compliance teams.</p>`,
    renderSiteLinks(),
  ].join("\n");
}

function buildTagBody(tagEntry) {
  const label = titleCase(tagEntry.tag);
  return [
    renderBreadcrumb(),
    `        <h1>${htmlEscape(label)} — Rapid Hire Solutions Blog</h1>`,
    `        <p>${tagEntry.count} article${tagEntry.count === 1 ? "" : "s"} on ${htmlEscape(label)} from the Rapid Hire Solutions compliance team. We are an FCRA-certified, U.S.-based consumer reporting agency that delivers employment background checks, pre-employment screening, criminal background checks, motor vehicle records, drug screening, and continuous monitoring; 85%+ of standard checks complete in under 24 hours.</p>`,
    `        <p><a href="/blog/tag/${htmlEscape(tagEntry.tag)}">View every ${htmlEscape(label)} article</a> or <a href="/blog">browse the full Rapid Hire Solutions blog</a>.</p>`,
    renderSiteLinks(),
  ].join("\n");
}

function buildYearBody(year) {
  return [
    renderBreadcrumb(),
    `        <h1>${htmlEscape(year)} in review — Rapid Hire Solutions Blog</h1>`,
    `        <p>Every Rapid Hire Solutions blog post published in ${htmlEscape(year)}, grouped by quarter. Rapid Hire Solutions is an FCRA-certified, U.S.-based consumer reporting agency that delivers employment background checks, pre-employment screening, criminal background checks, motor vehicle records, drug screening, and continuous monitoring; 85%+ of standard checks complete in under 24 hours.</p>`,
    `        <p><a href="/blog/year/${htmlEscape(year)}">Open the ${htmlEscape(year)} archive</a> or <a href="/blog">browse the full Rapid Hire Solutions blog</a>.</p>`,
    renderSiteLinks(),
  ].join("\n");
}

/**
 * Conservative HTML minifier: collapses runs of inter-tag whitespace and
 * trims line-leading whitespace. Does not touch contents inside <pre>,
 * <textarea>, or <script> blocks.
 */
function minifyHtml(html) {
  if (!SHOULD_MINIFY) return html;
  // Protect <pre>, <script>, <style>, <textarea> blocks from collapsing.
  const placeholders = [];
  const protectedTags = /<(pre|script|style|textarea)[\s\S]*?<\/\1>/gi;
  const guarded = html.replace(protectedTags, (m) => {
    placeholders.push(m);
    return `__PRERENDER_PROTECTED_${placeholders.length - 1}__`;
  });
  let out = guarded
    // Collapse runs of whitespace between tags.
    .replace(/>\s+</g, "><")
    // Trim leading whitespace at the start of each line.
    .replace(/^\s+/gm, "")
    // Collapse remaining whitespace runs (keep at least one space).
    .replace(/[ \t]{2,}/g, " ")
    // Remove blank lines.
    .replace(/\n+/g, "\n")
    .trim();
  out = out.replace(/__PRERENDER_PROTECTED_(\d+)__/g, (_, i) => placeholders[Number(i)]);
  return out;
}

function main() {
  if (!fs.existsSync(SHELL)) {
    console.warn(`[prerender] no shell at ${SHELL}; skipping (likely a dev build)`);
    return;
  }
  const shell = fs.readFileSync(SHELL, "utf-8");
  const { posts, tags, years } = loadInputs();

  const writtenPosts = [];
  for (const post of posts) {
    const dir = path.join(DIST, "blog", post.slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildPostHtml(post, shell)), "utf-8");
    writtenPosts.push({ slug: post.slug, file: path.relative(DIST, out), title: post.title });
  }

  const writtenTags = [];
  for (const tag of tags) {
    const dir = path.join(DIST, "blog", "tag", tag.tag);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildTagHtml(tag, shell)), "utf-8");
    writtenTags.push({ tag: tag.tag, count: tag.count, file: path.relative(DIST, out) });
  }

  const writtenYears = [];
  for (const year of years) {
    const dir = path.join(DIST, "blog", "year", year);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildYearHtml(year, shell)), "utf-8");
    writtenYears.push({ year, file: path.relative(DIST, out) });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    siteBaseUrl: SITE_BASE,
    minified: SHOULD_MINIFY,
    count: writtenPosts.length,
    posts: writtenPosts,
    tags: writtenTags,
    years: writtenYears,
  };
  fs.writeFileSync(
    path.join(DIST, "_prerender-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8",
  );
  console.log(
    `[prerender] wrote ${writtenPosts.length} post stubs, ${writtenTags.length} tag stubs, ${writtenYears.length} year stubs (minified=${SHOULD_MINIFY})`,
  );
}

main();
