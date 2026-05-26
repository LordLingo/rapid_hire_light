/*
 * §190 source-pin spec — Vercel SPA + serverless function deployment contract.
 *
 * The user reported a 404 on every non-root URL after deploying to Vercel
 * (e.g. `/blog?tag=candidate-experience`) because Vercel had no routing
 * config and only static `/` worked. The fix has three coupled parts:
 *
 *   1. `vercel.json` at the repo root with rewrites that send API + dynamic
 *      blog endpoints to the serverless function and every other route to
 *      `/index.html` so React Router can handle client-side routing.
 *   2. `api/index.ts` that exports the Express app via `createApp()` so
 *      Vercel's Node runtime can mount it as a function handler.
 *   3. `server/index.ts` exporting `createApp({ apiOnly })` instead of
 *      auto-starting a listener on import.
 *
 * This file pins all three so a future "clean-up" edit can't silently
 * regress Vercel routing.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// __dirname here = <repo>/client/src/lib at runtime; walk up 3 to reach
// the repo root (matches the pattern used by lighthouseSeoBudget.test.ts).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

const VERCEL_JSON = path.join(PROJECT_ROOT, "vercel.json");
const API_INDEX = path.join(PROJECT_ROOT, "api", "index.ts");
const SERVER_INDEX = path.join(PROJECT_ROOT, "server", "index.ts");

describe("§190 — vercel.json deployment config", () => {
  it("vercel.json exists at the project root", () => {
    expect(fs.existsSync(VERCEL_JSON)).toBe(true);
  });

  const cfg = JSON.parse(fs.readFileSync(VERCEL_JSON, "utf-8"));

  it("declares an explicit buildCommand and outputDirectory so Vercel does not auto-detect a stale framework", () => {
    expect(typeof cfg.buildCommand).toBe("string");
    expect(cfg.buildCommand).toMatch(/vite build/);
    // The prerender step has to run after vite build so the per-slug HTML
    // stubs land in dist/public/blog/<slug>/index.html (Vercel serves those
    // as static, bypassing the function).
    expect(cfg.buildCommand).toMatch(/prerender_top_posts/);
    expect(cfg.outputDirectory).toBe("dist/public");
  });

  it("rewrites API + dynamic blog endpoints to the serverless function", () => {
    const rewrites: Array<{ source: string; destination: string }> = cfg.rewrites ?? [];
    const sources = rewrites.map((r) => r.source);
    // Each of these must route through /api/index so the Express handlers
    // get a chance to respond. If any are missing, Vercel will hit the
    // catch-all SPA fallback and return HTML for what should be JSON/SVG.
    expect(sources).toContain("/api/contact");
    expect(sources).toContain("/api/candidate-contact");
    expect(sources).toContain("/api/og/blog/:slug.svg");
    expect(sources).toContain("/api/og/blog/tag/:tag.svg");
    expect(sources).toContain("/blog/feed.xml");
    expect(sources).toContain("/blog/index.json");
    for (const r of rewrites) {
      if (
        r.source === "/api/contact" ||
        r.source === "/api/candidate-contact" ||
        r.source === "/api/og/blog/:slug.svg" ||
        r.source === "/api/og/blog/tag/:tag.svg" ||
        r.source === "/blog/feed.xml" ||
        r.source === "/blog/index.json"
      ) {
        expect(r.destination).toBe("/api/index");
      }
    }
  });

  it("declares a catch-all SPA fallback to /index.html that excludes api/, assets/, static/, and files with extensions", () => {
    const rewrites: Array<{ source: string; destination: string }> = cfg.rewrites ?? [];
    const fallback = rewrites.find((r) => r.destination === "/index.html");
    expect(fallback).toBeDefined();
    // The negative-lookahead must mention api/, assets/, static/, and a
    // file-extension guard. Without these the SPA fallback would intercept
    // /assets/*.js and /static/*.png requests, breaking the whole site.
    expect(fallback!.source).toMatch(/api\//);
    expect(fallback!.source).toMatch(/assets\//);
    expect(fallback!.source).toMatch(/static\//);
    expect(fallback!.source).toMatch(/\\\./); // dot-file-extension guard
  });
});

describe("§190 — api/index.ts Vercel serverless adapter", () => {
  it("api/index.ts exists at the project root", () => {
    expect(fs.existsSync(API_INDEX)).toBe(true);
  });

  const src = fs.readFileSync(API_INDEX, "utf-8");

  it("imports createApp from server/index and re-exports it as the default export", () => {
    // Vercel's Node runtime mounts whatever the module's default export
    // resolves to. The adapter must wire that to the Express app instance,
    // not a function that returns one.
    expect(src).toMatch(/import\s*\{\s*createApp\s*\}\s*from\s*"\.\.\/server\/index/);
    expect(src).toMatch(/export\s+default\s+app/);
  });

  it("invokes createApp with apiOnly: true so the function does not mount the static middleware or the SPA fallback", () => {
    // The Vercel edge handles static + SPA fallback via vercel.json rewrites;
    // routing those through the function would inflate cold-start time and
    // bypass the prerendered /blog/<slug>/index.html stubs.
    expect(src).toMatch(/createApp\s*\(\s*\{\s*apiOnly:\s*true/);
  });
});

describe("§190 — server/index.ts factored out createApp() so api/index.ts can mount it", () => {
  const src = fs.readFileSync(SERVER_INDEX, "utf-8");

  it("exports a named createApp function that accepts an opts object", () => {
    expect(src).toMatch(/export\s+function\s+createApp\s*\(/);
    expect(src).toMatch(/apiOnly\?\s*:\s*boolean/);
  });

  it("only auto-starts the listener when invoked as the entrypoint or under RAPID_HIRE_FORCE_LISTEN", () => {
    // If startServer() were unconditionally called at module top level,
    // `import { createApp } from "../server/index"` from api/index.ts would
    // spin up an Express listener inside the Vercel function — wasted memory
    // and a guaranteed port collision under concurrent invocations. The
    // listener call must live inside the isEntrypoint || RAPID_HIRE_FORCE_LISTEN
    // guard. This pin works by counting `startServer()` invocations in the
    // source: there must be exactly one, and it must appear after the guard.
    const guardIndex = src.indexOf("isEntrypoint || process.env.RAPID_HIRE_FORCE_LISTEN");
    expect(guardIndex).toBeGreaterThan(-1);
    const callMatches = [...src.matchAll(/startServer\(\)\.catch/g)];
    expect(callMatches).toHaveLength(1);
    // The single call must appear inside (i.e. after) the guard block.
    expect(callMatches[0].index!).toBeGreaterThan(guardIndex);
  });

  it("contact + candidate-contact POST handlers always return 201 (best-effort persistence)", () => {
    // §190: Vercel's filesystem is read-only outside /tmp. The handlers must
    // not surface a 500 to the submitter when the audit-trail write fails.
    // We pin this by banning the "Could not persist submission" error string
    // anywhere in the file.
    expect(src).not.toMatch(/"Could not persist submission"/);
  });

  it("DATA_DIR uses /tmp on Vercel and the local data/ directory elsewhere", () => {
    // Pins the env-aware location so an editor can't accidentally hard-code
    // one path and lose either local audit trails or Vercel best-effort.
    expect(src).toMatch(/process\.env\.VERCEL\s*===\s*"1"/);
    expect(src).toMatch(/\/tmp/);
  });
});
