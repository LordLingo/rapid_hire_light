#!/usr/bin/env node
/**
 * scripts/submit-sitemap.mjs
 *
 * Notifies search engines about an updated sitemap.
 *
 *   - Google: legacy ping endpoint was retired by Google in June 2023, so we
 *     deliberately do NOT call it. Recommended path is Search Console.
 *     This script prints the exact "Submit sitemap" URL operators should open
 *     in Search Console after a deploy.
 *   - Bing: still supports IndexNow. We POST a small JSON payload listing all
 *     blog post URLs (the highest-velocity portion of the site) so freshly
 *     published / updated posts are crawled within minutes.
 *
 * Env:
 *   SITE_BASE_URL     (default: https://www.rapidhiresolutions.com)
 *   INDEXNOW_KEY      (default: read from public/indexnow.txt; falls back
 *                      to first 32 hex chars of a deterministic hash)
 *
 * Run:
 *   node scripts/submit-sitemap.mjs
 *   node scripts/submit-sitemap.mjs --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const BASE = (process.env.SITE_BASE_URL || "https://www.rapidhiresolutions.com").replace(/\/+$/, "");
const DRY = process.argv.includes("--dry-run");

function readBlogMeta() {
  const p = path.join(PROJECT_ROOT, "shared", "blog-meta.json");
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function readIndexNowKey() {
  const fromEnv = process.env.INDEXNOW_KEY?.trim();
  if (fromEnv && /^[a-f0-9]{8,128}$/i.test(fromEnv)) return fromEnv;
  const keyFile = path.join(PROJECT_ROOT, "client", "public", "indexnow.txt");
  if (fs.existsSync(keyFile)) {
    const k = fs.readFileSync(keyFile, "utf-8").trim();
    if (/^[a-f0-9]{8,128}$/i.test(k)) return k;
  }
  // Deterministic fallback derived from the host so re-runs use the same key
  // even before an operator commits public/indexnow.txt.
  const host = new URL(BASE).host;
  let h = 0xcbf29ce484222325n;
  for (const c of host) h = (h ^ BigInt(c.charCodeAt(0))) * 0x100000001b3n;
  return h.toString(16).padStart(32, "0").slice(0, 32);
}

async function postJson(url, body) {
  if (DRY) {
    console.log(`[dry-run] POST ${url}`);
    console.log(`[dry-run] body keys: ${Object.keys(body).join(", ")}`);
    console.log(`[dry-run] urlList count: ${body.urlList?.length ?? 0}`);
    return { status: 0, ok: true, dry: true };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  return { status: res.status, ok: res.ok, body: text.slice(0, 300) };
}

function buildBlogUrlList(meta) {
  const urls = [`${BASE}/blog`];
  for (const p of meta.posts) urls.push(`${BASE}/blog/${p.slug}`);
  for (const t of meta.tags || []) urls.push(`${BASE}/blog/tag/${t}`);
  return urls;
}

async function main() {
  const meta = readBlogMeta();
  const urls = buildBlogUrlList(meta);
  const host = new URL(BASE).host;
  const key = readIndexNowKey();
  const keyLocation = `${BASE}/indexnow.txt`;

  console.log(`[sitemap] base:        ${BASE}`);
  console.log(`[sitemap] urls:        ${urls.length} (1 index + ${meta.posts.length} posts + ${(meta.tags || []).length} tags)`);
  console.log(`[sitemap] indexnowKey: ${key.slice(0, 6)}…${key.slice(-4)}`);

  // 1) IndexNow (Bing, Yandex, Naver — single submission distributes)
  const indexNowBody = { host, key, keyLocation, urlList: urls };
  const r1 = await postJson("https://api.indexnow.org/IndexNow", indexNowBody);
  console.log(`[sitemap] indexnow  -> ${r1.status} ${r1.ok ? "ok" : "FAIL"}${r1.body ? "  " + r1.body : ""}`);

  // 2) Print the Google Search Console URL the operator should open.
  //    Google deprecated the unauthenticated /ping endpoint in 2023.
  console.log("[sitemap] Google: legacy ping endpoint was retired in 2023.");
  console.log(`[sitemap] Google: open Search Console and confirm ${BASE}/sitemap.xml is listed:`);
  console.log("  https://search.google.com/search-console/sitemaps");

  // 3) Print the Bing Webmaster Tools URL too, since some teams prefer the UI.
  console.log("[sitemap] Bing:   confirm sitemap is listed:");
  console.log("  https://www.bing.com/webmasters/sitemaps");

  if (!r1.ok && !DRY) process.exit(1);
}

main().catch((e) => {
  console.error("[sitemap] submission failed:", e);
  process.exit(1);
});
