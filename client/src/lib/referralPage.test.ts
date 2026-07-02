/*
  §221 — Referral Partner Program page regression tests.

  These are source-string pins (not React renders) that lock the two
  structural guarantees the sales team depends on:

    1. The /referral route is registered in App.tsx and points at the
       Referral page component.
    2. The page is INTENTIONALLY NOT linked from the Header or Footer nav
       (it's a private, shareable-only URL), and it is NOT added to the
       sitemap's STATIC_ROUTES (which likewise excludes the other private
       LPs /lp/staffing and /spa).

  If a future refactor accidentally surfaces /referral in the global nav or
  the sitemap, these tests fail loudly.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_SRC = resolve(__dirname, "..");
const REPO_ROOT = resolve(CLIENT_SRC, "..", "..");

function read(relFromClientSrc: string): string {
  return readFileSync(resolve(CLIENT_SRC, relFromClientSrc), "utf-8");
}

describe("§221 referral route wiring", () => {
  const app = read("App.tsx");

  it("imports the Referral page component", () => {
    expect(app).toMatch(/import\s+Referral\s+from\s+["']\.\/pages\/Referral["']/);
  });

  it("registers the /referral route pointing at Referral", () => {
    expect(app).toMatch(/path=\{?["']\/referral["']\}?\s+component=\{Referral\}/);
  });
});

describe("§221 referral page is private (not in global nav)", () => {
  it("Header does not link to /referral", () => {
    const header = read("components/site/Header.tsx");
    expect(header).not.toMatch(/\/referral/);
  });

  it("Footer does not link to /referral", () => {
    const footer = read("components/site/Footer.tsx");
    expect(footer).not.toMatch(/\/referral/);
  });

  it("is excluded from the sitemap STATIC_ROUTES (like /lp/staffing and /spa)", () => {
    const vite = readFileSync(resolve(REPO_ROOT, "vite.config.ts"), "utf-8");
    // Grab the STATIC_ROUTES array block and assert /referral is absent.
    const start = vite.indexOf("STATIC_ROUTES");
    expect(start).toBeGreaterThan(-1);
    const slice = vite.slice(start, start + 6000);
    expect(slice).not.toMatch(/path:\s*["']\/referral["']/);
    // Sanity: the other private LPs are also excluded, confirming the convention.
    expect(slice).not.toMatch(/path:\s*["']\/lp\/staffing["']/);
  });
});
