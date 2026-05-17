#!/usr/bin/env node
/*
 * Build-time prerender for the top N blog posts.
 *
 * Strategy (head-only prerender):
 *   - Reads the SPA shell at dist/public/index.html.
 *   - For the top 20 posts (ranked by lastmod desc, then publishedAt desc), it
 *     writes dist/public/blog/<slug>/index.html with:
 *        - the SPA shell preserved verbatim,
 *        - <title> set to the post title,
 *        - <meta name="description"> set to the post title (best effort),
 *        - <meta property="og:title|og:url|og:image|og:type"> set per post,
 *        - <link rel="canonical"> set to the post URL,
 *        - a <script type="application/ld+json"> block with BlogPosting schema.
 *   - Body remains the SPA mount (#root); React still hydrates client-side.
 *   - Same HTML is served to humans and crawlers — no UA-based cloaking.
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

const TOP_N = 20;
const SITE_BASE = (process.env.SITE_BASE_URL || "https://www.rapidhiresolutions.com").replace(/\/+$/, "");
const OG_PATH = (slug) => `${SITE_BASE}/api/og/blog/${slug}.svg`;

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  // meta.posts: { slug, lastmod, publishedAt? }
  const ranked = (meta.posts ?? [])
    .filter((p) => typeof p.slug === "string" && titleBySlug.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      lastmod: typeof p.lastmod === "string" ? p.lastmod : "",
      publishedAt: typeof p.publishedAt === "string" ? p.publishedAt : "",
      title: titleBySlug.get(p.slug),
      tag: tagBySlug.get(p.slug) ?? "",
    }))
    .sort((a, b) => {
      if (b.lastmod !== a.lastmod) return b.lastmod.localeCompare(a.lastmod);
      if (b.publishedAt !== a.publishedAt) return b.publishedAt.localeCompare(a.publishedAt);
      return a.slug.localeCompare(b.slug);
    });
  return ranked.slice(0, TOP_N);
}

function buildHeadFor(post, shell) {
  const url = `${SITE_BASE}/blog/${post.slug}`;
  const og = OG_PATH(post.slug);
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
  // 1) Replace <title>
  let html = shell.replace(/<title>[\s\S]*?<\/title>/i, `<title>${htmlEscape(title)}</title>`);
  // 2) Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${htmlEscape(description)}" />`,
  );
  // 3) Inject canonical + OG meta + JSON-LD just before </head> (idempotent block).
  const inject = `\n    <!-- prerendered:${htmlEscape(post.slug)} -->\n    <link rel="canonical" href="${htmlEscape(url)}" />\n    <meta property="og:type" content="article" />\n    <meta property="og:title" content="${htmlEscape(title)}" />\n    <meta property="og:url" content="${htmlEscape(url)}" />\n    <meta property="og:image" content="${htmlEscape(og)}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${htmlEscape(title)}" />\n    <meta name="twitter:image" content="${htmlEscape(og)}" />\n    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n  `;
  html = html.replace(/<\/head>/i, `${inject}</head>`);
  return html;
}

function main() {
  if (!fs.existsSync(SHELL)) {
    console.warn(`[prerender] no shell at ${SHELL}; skipping (likely a dev build)`);
    return;
  }
  const shell = fs.readFileSync(SHELL, "utf-8");
  const top = loadInputs();
  const written = [];
  for (const post of top) {
    const dir = path.join(DIST, "blog", post.slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    const html = buildHeadFor(post, shell);
    fs.writeFileSync(out, html, "utf-8");
    written.push({ slug: post.slug, file: path.relative(DIST, out), title: post.title });
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    siteBaseUrl: SITE_BASE,
    count: written.length,
    posts: written,
  };
  fs.writeFileSync(
    path.join(DIST, "_prerender-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8",
  );
  console.log(`[prerender] wrote ${written.length} per-slug HTML stubs + manifest`);
}

main();
