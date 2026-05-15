/*
  Header active-route indicator — invariants pin (§46).

  Two layers of coverage:
    1. Logic — the exported `isActivePath` helper from Header.tsx
       must match exact paths and deep children, but must NOT match
       sibling paths (e.g. /services should not match /services-foo).
    2. Markup — the desktop NavLink and the mobile drawer must both
       render an active marker (brand-blue underline / left rail)
       gated on `aria-current="page"` and the brand-blue accent-ink
       color token, and the helper must be wired into both render
       branches in Header.tsx.

  Pinning the markup keeps a future "simplification" pass from
  silently dropping the underline back to a color-only treatment.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isActivePath } from "../components/site/Header";

const HEADER_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "Header.tsx"
);
const HEADER_SRC = readFileSync(HEADER_PATH, "utf8");

describe("isActivePath — §46 helper logic", () => {
  it("matches exact paths", () => {
    expect(isActivePath("/services", "/services")).toBe(true);
    expect(isActivePath("/pricing", "/pricing")).toBe(true);
  });

  it("matches deep children of the nav target", () => {
    // Deep blog post should still highlight the Blog nav item.
    expect(isActivePath("/blog/some-post", "/blog")).toBe(true);
    // Nested service detail should still highlight Services.
    expect(isActivePath("/services/criminal", "/services")).toBe(true);
  });

  it("does not match sibling paths that share a prefix", () => {
    // /services should NOT light up when on /services-something-else.
    expect(isActivePath("/services-foo", "/services")).toBe(false);
    expect(isActivePath("/blog-archive", "/blog")).toBe(false);
  });

  it("treats / as exact-match only (so the home route doesn't claim every page)", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/services", "/")).toBe(false);
    expect(isActivePath("/blog/post", "/")).toBe(false);
  });

  it("does not match when the location is empty or shorter than href", () => {
    expect(isActivePath("", "/services")).toBe(false);
    expect(isActivePath("/serv", "/services")).toBe(false);
  });
});

describe("Header.tsx — §46 active-marker markup", () => {
  it("uses isActivePath in both desktop and mobile nav links (not the old exact-match)", () => {
    // Anti-regression: the old `location === href` should be gone in
    // favor of the prefix-aware helper. The helper definition itself
    // contains `location === href`, so look for the literal pattern
    // that was the bug — `const active = location === href`.
    expect(HEADER_SRC).not.toMatch(/const active = location === href/);
    // The helper must be called from at least two render branches
    // (desktop NavLink + mobile drawer link).
    const matches = HEADER_SRC.match(/isActivePath\(location, href\)/g);
    expect(matches).not.toBeNull();
    expect((matches ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it("sets aria-current='page' on the active link for screen-reader users", () => {
    // The matches array test above confirms two render sites; pin
    // that both attach the aria-current attribute.
    const ariaCurrentMatches = HEADER_SRC.match(
      /aria-current=\{active \? "page" : undefined\}/g
    );
    expect(ariaCurrentMatches).not.toBeNull();
    expect((ariaCurrentMatches ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it("renders the desktop active underline as a brand-blue 2px hairline below the baseline", () => {
    // Pin the exact marker token so a refactor can't silently swap
    // the brand-blue underline for a generic gray border.
    expect(HEADER_SRC).toMatch(
      /h-\[2px\][^"]*bg-\[color:var\(--color-accent-ink\)\]/
    );
    // Pin that the underline is below the baseline (negative bottom)
    // so the link doesn't shift when becoming active.
    expect(HEADER_SRC).toMatch(/-bottom-1\.5/);
  });

  it("renders the mobile active rail as a brand-blue 2px left-edge bar", () => {
    // Mobile drawer should use a vertical rail, not the underline.
    expect(HEADER_SRC).toMatch(
      /w-\[2px\][^"]*bg-\[color:var\(--color-accent-ink\)\]/
    );
  });

  it("bumps the active link to medium weight + ink color (not just ink-soft)", () => {
    // Visual-weight pin: active items must visibly differ from the
    // muted resting state, not just by color but by font-weight too.
    expect(HEADER_SRC).toMatch(
      /font-medium text-\[color:var\(--color-ink\)\]/
    );
  });

  it("keeps the resting (inactive) link state in ink-soft to preserve the editorial calm", () => {
    expect(HEADER_SRC).toMatch(
      /text-\[color:var\(--color-ink-soft\)\]/
    );
  });
});
