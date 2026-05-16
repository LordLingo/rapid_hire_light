/*
  §79 — Header Resources dropdown invariants pin.

  After the §79 pass, the standalone "Blog" slot in the primary nav
  has been promoted to a "Resources" dropdown that groups four
  buyer-facing resource pages. These pins guarantee:

    1. The NAV array no longer contains a top-level Blog route.
    2. The NAV array carries a single Resources group with four
       canonical children: /blog, /compliance/checklist,
       /compliance/audit, /trust.
    3. The trigger lights up as active whenever any child path
       matches (so /blog/<slug> still highlights Resources).
    4. The desktop and mobile render branches both expose the
       Resources surface (via stable test IDs).
    5. The exported `isActiveGroup` helper resolves an active
       state from any child path under prefix-aware semantics.

  These pins keep a future "simplify the header" pass from silently
  dropping the dropdown back to a flat link, and keep a future
  "remove a resource" pass from quietly losing one of the four
  child pages.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isActiveGroup, isActivePath } from "../components/site/Header";

const HEADER_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "Header.tsx",
);
const HEADER_SRC = readFileSync(HEADER_PATH, "utf8");

describe("§79 — NAV no longer carries a top-level Blog route", () => {
  it("does not contain a route-typed Blog NAV entry", () => {
    expect(HEADER_SRC).not.toMatch(
      /\{\s*kind:\s*"route"\s*,\s*label:\s*"Blog"\s*,\s*href:\s*"\/blog"\s*\}/,
    );
  });

  it("does not contain the legacy `type: \"route\"` Blog NAV entry either", () => {
    // Anti-regression for the pre-§79 NAV shape.
    expect(HEADER_SRC).not.toMatch(
      /\{\s*label:\s*"Blog"\s*,\s*href:\s*"\/blog"\s*,\s*type:\s*"route"\s*\}/,
    );
  });
});

describe("§79 — NAV carries a single Resources group", () => {
  it("declares a `kind: \"group\"` NAV item labeled Resources", () => {
    expect(HEADER_SRC).toMatch(
      /\{\s*kind:\s*"group"\s*,\s*label:\s*"Resources"\s*,/,
    );
  });

  it("the RESOURCES_CHILDREN array is the single source of truth and contains all six canonical children", () => {
    expect(HEADER_SRC).toMatch(/const RESOURCES_CHILDREN: ResourceChild\[\]/);
    // §80 additions
    expect(HEADER_SRC).toMatch(/href:\s*"\/resources"/);
    expect(HEADER_SRC).toMatch(/href:\s*"\/resources\/ban-the-box"/);
    // §79 originals
    expect(HEADER_SRC).toMatch(/href:\s*"\/blog"/);
    expect(HEADER_SRC).toMatch(/href:\s*"\/compliance\/checklist"/);
    expect(HEADER_SRC).toMatch(/href:\s*"\/compliance\/audit"/);
    expect(HEADER_SRC).toMatch(/href:\s*"\/trust"/);
  });

  it("each child entry carries a non-empty description string", () => {
    // Pull the RESOURCES_CHILDREN array body and count description
    // entries — must be exactly six (§79 four + §80 two).
    const block = HEADER_SRC.match(
      /const RESOURCES_CHILDREN:[^\[]*\[([\s\S]*?)\];/,
    );
    expect(block, "RESOURCES_CHILDREN array must exist").not.toBeNull();
    const descriptions = (block?.[1].match(/description:\s*"/g) ?? []);
    expect(descriptions.length).toBe(6);
  });
});

describe("§79 — desktop + mobile render branches both expose Resources", () => {
  it("desktop ResourcesMenu component is defined and rendered", () => {
    expect(HEADER_SRC).toMatch(/function ResourcesMenu\(/);
    expect(HEADER_SRC).toMatch(/data-testid="header-resources-trigger"/);
  });

  it("mobile MobileResourcesGroup component is defined and rendered", () => {
    expect(HEADER_SRC).toMatch(/function MobileResourcesGroup\(/);
    expect(HEADER_SRC).toMatch(
      /data-testid="header-resources-mobile-trigger"/,
    );
  });

  it("the desktop panel uses an aria-haspopup menu trigger so screen readers announce it", () => {
    expect(HEADER_SRC).toMatch(/aria-haspopup="menu"/);
    expect(HEADER_SRC).toMatch(/role="menu"/);
  });
});

describe("§79 — isActiveGroup helper", () => {
  it("returns true when the current path matches any child exactly", () => {
    expect(
      isActiveGroup("/blog", [{ href: "/blog" }, { href: "/trust" }]),
    ).toBe(true);
  });

  it("returns true for deep children of any child path", () => {
    // /blog/some-slug must still light up the Resources trigger,
    // mirroring the prefix-aware semantics of isActivePath.
    expect(
      isActiveGroup("/blog/nyc-fair-chance-act-background-checks", [
        { href: "/blog" },
        { href: "/trust" },
      ]),
    ).toBe(true);
  });

  it("returns false when no child matches", () => {
    expect(
      isActiveGroup("/services", [
        { href: "/blog" },
        { href: "/compliance/checklist" },
      ]),
    ).toBe(false);
  });

  it("does NOT match a sibling path (e.g. /blog-archive should not match /blog)", () => {
    expect(
      isActiveGroup("/blog-archive", [{ href: "/blog" }]),
    ).toBe(false);
  });

  it("piggy-backs on isActivePath, so the existing prefix-match invariant carries forward", () => {
    // Sanity check that isActivePath itself still does what we need;
    // duplicates the §46 pin intentionally so this file is
    // self-contained against future header refactors.
    expect(isActivePath("/blog/x", "/blog")).toBe(true);
    expect(isActivePath("/blog-archive", "/blog")).toBe(false);
  });
});
