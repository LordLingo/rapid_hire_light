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
const SHELL_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Default Title</title>
    <meta name="description" content="Default description." />
  </head>
  <body><div id="root"></div></body>
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
    }
    for (const entry of manifest.years) {
      const file = path.join(DIST, "blog", "year", entry.year, "index.html");
      expect(fs.existsSync(file), file).toBe(true);
      const html = fs.readFileSync(file, "utf-8");
      expect(html).toContain(`<!-- prerendered:year/${entry.year} -->`);
      expect(html).toMatch(new RegExp(`<link rel="canonical" href="[^"]*?/blog/year/${entry.year}"`));
      expect(html).toContain(`"@type":"CollectionPage"`);
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
