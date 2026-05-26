#!/usr/bin/env node
/*
 * SEO audit script — grades a single URL on the heuristics that match
 * the in-Manus SEO auditor's signal set. This is a *raw HTML* audit:
 * it does NOT execute JavaScript (deliberately — that's the same blind
 * spot the in-Manus auditor has, and the reason §101 added a pre-hydration
 * SEO block to the SPA shell).
 *
 * Checks (each weighted in `WEIGHTS`):
 *   1. <title> exists, 30-60 chars, contains brand
 *   2. <meta name="description"> exists, 120-160 chars
 *   3. <meta name="keywords"> exists, 3-8 entries
 *   4. exactly one <h1> in the raw HTML
 *   5. <link rel="canonical"> exists with an absolute https URL
 *   6. og:title parity with <title> (within 5 chars)
 *   7. og:image + twitter:card present
 *   8. robots meta does not contain noindex
 *   9. at least 5 internal <a href> links visible in raw HTML
 *  10. lang attribute on <html> set to a 2-letter code
 *
 * Exit codes:
 *   0 — score >= 90
 *   1 — score < 90 (caller can wire this into pre-publish CI later)
 *
 * Usage:
 *   node scripts/seo_audit.mjs https://www.rapidhiresolutions.com/
 *   node scripts/seo_audit.mjs            # defaults to the prod domain
 *
 * §192: previously defaulted to the Manus staging URL; updated to point
 * at the production marketing domain since that's the canonical surface
 * we audit pre-publish.
 */
import process from "node:process";

const DEFAULT_URL = "https://www.rapidhiresolutions.com/";
const BRAND = "Rapid Hire Solutions";
const WEIGHTS = {
  title: 12,
  titleLength: 8,
  titleBrand: 4,
  description: 10,
  descriptionLength: 8,
  keywords: 6,
  keywordsCount: 6,
  singleH1: 12,
  canonical: 8,
  ogParity: 6,
  ogImage: 4,
  twitterCard: 4,
  robots: 4,
  internalLinks: 4,
  htmlLang: 4,
};

function summarize(html) {
  const findOne = (re) => {
    const m = html.match(re);
    return m ? m[1] : null;
  };
  const findAll = (re) => {
    const out = [];
    let m;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while ((m = r.exec(html))) out.push(m[1]);
    return out;
  };

  const title = findOne(/<title[^>]*>([\s\S]*?)<\/title>/i)?.trim();
  const description =
    findOne(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ?? null;
  const keywordsRaw =
    findOne(/<meta\s+name=["']keywords["']\s+content=["']([^"']*)["']/i) ?? null;
  const keywords = keywordsRaw
    ? keywordsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  const canonical =
    findOne(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) ?? null;
  const ogTitle =
    findOne(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i) ?? null;
  const ogImage =
    findOne(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) ?? null;
  const twitterCard =
    findOne(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i) ?? null;
  const robots =
    findOne(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) ?? null;
  const htmlLang = findOne(/<html\s+[^>]*\blang=["']([a-zA-Z-]+)["']/i) ?? null;
  // Internal links: anchors whose href starts with "/" but not "//", excluding
  // "#" and "mailto:" / "tel:".
  const internalHrefs = findAll(/<a\s+[^>]*href=["'](\/[^"'#][^"']*)["']/gi);

  return {
    title,
    description,
    keywords,
    h1Count,
    canonical,
    ogTitle,
    ogImage,
    twitterCard,
    robots,
    htmlLang,
    internalLinkCount: new Set(internalHrefs).size,
  };
}

function grade(s) {
  const findings = [];
  let earned = 0;
  let possible = 0;
  const pass = (key, msg) => {
    earned += WEIGHTS[key];
    possible += WEIGHTS[key];
    findings.push({ check: key, ok: true, msg });
  };
  const fail = (key, msg) => {
    possible += WEIGHTS[key];
    findings.push({ check: key, ok: false, msg });
  };

  // 1) title
  if (s.title && s.title.length > 0) pass("title", `<title> = "${s.title}"`);
  else fail("title", "missing <title>");
  if (s.title && s.title.length >= 30 && s.title.length <= 60)
    pass("titleLength", `title length ${s.title.length} chars (target 30-60)`);
  else
    fail(
      "titleLength",
      `title length ${s.title?.length ?? 0} chars (need 30-60)`,
    );
  if (s.title && s.title.toLowerCase().includes(BRAND.toLowerCase()))
    pass("titleBrand", "title contains brand");
  else fail("titleBrand", `title should contain "${BRAND}"`);

  // 2) description
  if (s.description) pass("description", `description = "${s.description.slice(0, 60)}..."`);
  else fail("description", "missing <meta name=description>");
  if (s.description && s.description.length >= 120 && s.description.length <= 160)
    pass("descriptionLength", `description length ${s.description.length} chars (target 120-160)`);
  else
    fail(
      "descriptionLength",
      `description length ${s.description?.length ?? 0} chars (need 120-160)`,
    );

  // 3) keywords
  if (s.keywords.length > 0) pass("keywords", `${s.keywords.length} keyword entries`);
  else fail("keywords", "missing <meta name=keywords>");
  if (s.keywords.length >= 3 && s.keywords.length <= 8)
    pass("keywordsCount", `${s.keywords.length} keywords (target 3-8)`);
  else fail("keywordsCount", `${s.keywords.length} keywords (need 3-8)`);

  // 4) single H1
  if (s.h1Count === 1) pass("singleH1", "exactly one <h1>");
  else
    fail(
      "singleH1",
      s.h1Count === 0 ? "no <h1> in raw HTML" : `${s.h1Count} <h1> tags found (need exactly 1)`,
    );

  // 5) canonical
  if (s.canonical && /^https:\/\//i.test(s.canonical))
    pass("canonical", `canonical = ${s.canonical}`);
  else fail("canonical", `canonical missing or not absolute https (${s.canonical ?? "null"})`);

  // 6) OG / title parity
  if (s.ogTitle && s.title && Math.abs(s.ogTitle.length - s.title.length) <= 5)
    pass("ogParity", "og:title length within 5 chars of <title>");
  else
    fail(
      "ogParity",
      `og:title (${s.ogTitle?.length ?? 0}) vs title (${s.title?.length ?? 0}) drift > 5 chars`,
    );

  // 7) og:image + twitter:card
  if (s.ogImage) pass("ogImage", `og:image = ${s.ogImage}`);
  else fail("ogImage", "missing og:image");
  if (s.twitterCard) pass("twitterCard", `twitter:card = ${s.twitterCard}`);
  else fail("twitterCard", "missing twitter:card");

  // 8) robots: must not contain noindex
  if (!s.robots || !/noindex/i.test(s.robots)) pass("robots", `robots = "${s.robots ?? "(default)"}"`);
  else fail("robots", `robots contains noindex: "${s.robots}"`);

  // 9) internal links
  if (s.internalLinkCount >= 5) pass("internalLinks", `${s.internalLinkCount} internal links in raw HTML`);
  else fail("internalLinks", `only ${s.internalLinkCount} internal links in raw HTML (need >= 5)`);

  // 10) html lang
  if (s.htmlLang) pass("htmlLang", `<html lang="${s.htmlLang}">`);
  else fail("htmlLang", "<html> missing lang attribute");

  return {
    earned,
    possible,
    score: Math.round((earned / possible) * 100),
    findings,
  };
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "rapid-hire-light-seo-audit/1.0" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return await res.text();
}

async function main() {
  const url = process.argv[2] || DEFAULT_URL;
  const html = await fetchHtml(url);
  const summary = summarize(html);
  const result = grade(summary);

  // Pretty print
  console.log(`\nSEO audit: ${url}`);
  console.log(`Score: ${result.score}/100  (earned ${result.earned}/${result.possible})\n`);
  for (const f of result.findings) {
    const tag = f.ok ? "PASS" : "FAIL";
    console.log(`  [${tag}] ${f.check.padEnd(18)} ${f.msg}`);
  }
  console.log("");
  process.exit(result.score >= 90 ? 0 : 1);
}

// Allow `import { grade, summarize } from "./seo_audit.mjs"` from tests.
export { summarize, grade, WEIGHTS };

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(`[seo:audit] ${err.message}`);
    process.exit(2);
  });
}
