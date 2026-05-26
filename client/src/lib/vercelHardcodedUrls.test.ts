/*
 * §192 source-pin spec — Vercel deploy: ban hardcoded Manus URLs from
 * runtime client and server code.
 *
 * The site originally lived at rapidhire-8y99zzzx.manus.space. After
 * migrating production to Vercel + the canonical apex domain
 * (https://www.rapidhiresolutions.com), any leftover hardcoded
 * occurrences of the staging Manus host in *runtime* code (anything
 * shipped to the browser or executed by the Express server in
 * production) is a real bug — it ships customer-facing links that
 * point at a domain that may not exist.
 *
 * This spec scans the runtime tree (client/src/**, server/**, api/**,
 * shared/**) and asserts the literal string
 * "rapidhire-8y99zzzx.manus.space" does not appear, EXCEPT in:
 *   - Test files (they may include the legacy URL inside HTML
 *     fixtures used to exercise SEO/audit scripts).
 *   - Documentation comments that explicitly reference the legacy URL
 *     for historical context (none currently allowed).
 *
 * Build-time scripts under scripts/ and tooling under references/ /
 * reports/ are exempt from this check — they're either dev tools or
 * one-off audit artifacts that don't ship to production.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

const BANNED = "rapidhire-8y99zzzx.manus.space";

/**
 * Recursively walk a directory and return all source file paths
 * matching the given extensions.
 */
function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip nested test fixtures, build output, and node_modules.
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      out.push(...walk(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

describe("§192 — runtime code does not hardcode the Manus staging URL", () => {
  it("client/src runtime files are clean of the legacy host (test fixtures excluded)", () => {
    const files = walk(path.join(PROJECT_ROOT, "client/src"), [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
    ]).filter((f) => !f.endsWith(".test.ts") && !f.endsWith(".test.tsx"));

    const offenders: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, "utf-8");
      if (src.includes(BANNED)) {
        offenders.push(path.relative(PROJECT_ROOT, f));
      }
    }
    expect(
      offenders,
      `Files still hardcoding ${BANNED} in client/src runtime:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("server/ runtime files are clean of the legacy host (test fixtures excluded)", () => {
    const files = walk(path.join(PROJECT_ROOT, "server"), [
      ".ts",
      ".js",
    ]).filter((f) => !f.endsWith(".test.ts"));

    const offenders: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, "utf-8");
      if (src.includes(BANNED)) {
        offenders.push(path.relative(PROJECT_ROOT, f));
      }
    }
    expect(
      offenders,
      `Files still hardcoding ${BANNED} in server/:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("api/ Vercel adapter is clean of the legacy host", () => {
    const files = walk(path.join(PROJECT_ROOT, "api"), [".ts", ".js"]);
    const offenders: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, "utf-8");
      if (src.includes(BANNED)) {
        offenders.push(path.relative(PROJECT_ROOT, f));
      }
    }
    expect(
      offenders,
      `Files still hardcoding ${BANNED} in api/:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("shared/ runtime files are clean of the legacy host", () => {
    const files = walk(path.join(PROJECT_ROOT, "shared"), [
      ".ts",
      ".js",
      ".json",
    ]);
    const offenders: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, "utf-8");
      if (src.includes(BANNED)) {
        offenders.push(path.relative(PROJECT_ROOT, f));
      }
    }
    expect(
      offenders,
      `Files still hardcoding ${BANNED} in shared/:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("apiSnippets README points at production rapidhiresolutions.com (not Manus staging)", () => {
    // §192: pinning the specific fix so a future refactor doesn't silently
    // revert the hardcoded URL we just replaced.
    const src = fs.readFileSync(
      path.join(PROJECT_ROOT, "client/src/lib/apiSnippets.ts"),
      "utf-8",
    );
    expect(src).not.toContain(BANNED);
    expect(src).toMatch(
      /Request an integration at https:\/\/www\.rapidhiresolutions\.com\/integrations/,
    );
  });

  it("scripts/seo_audit.mjs default URL points at production rapidhiresolutions.com", () => {
    // §192: pinning the swapped DEFAULT_URL so the audit script doesn't
    // start auditing a dead Manus staging domain by accident.
    const src = fs.readFileSync(
      path.join(PROJECT_ROOT, "scripts/seo_audit.mjs"),
      "utf-8",
    );
    expect(src).toMatch(
      /const DEFAULT_URL\s*=\s*"https:\/\/www\.rapidhiresolutions\.com\/"/,
    );
  });
});

describe("§192 — Vercel deploy: SPA routing + auth contract", () => {
  it("client-side window.location.origin is used for canonical / OG fallbacks (not hardcoded)", () => {
    // §192: the Home/BlogPost/BlogTag/BlogYear/Privacy/Terms/Subscribe/
    // Support/Learn pages all use `window.location.origin` for canonical
    // URL composition under SSR-vs-CSR detection. Pin one representative
    // example so a future refactor doesn't reintroduce a hardcoded host.
    const home = fs.readFileSync(
      path.join(PROJECT_ROOT, "client/src/pages/Home.tsx"),
      "utf-8",
    );
    expect(home).toMatch(/window\.location\.origin/);
  });

  it("OAuth redirect URI uses window.location.origin (matches Manus OAuth Best Practices)", () => {
    // §192: the const.ts getLoginUrl() helper must continue to derive
    // the redirect URI from the live origin so it works both on the
    // Vercel domain and any future custom domain without code changes.
    const src = fs.readFileSync(
      path.join(PROJECT_ROOT, "client/src/const.ts"),
      "utf-8",
    );
    expect(src).toMatch(/\$\{window\.location\.origin\}\/api\/oauth\/callback/);
  });
});
