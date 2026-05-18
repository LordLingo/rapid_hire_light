/*
  §106 — Header "Sign in" routes to the client portal

  The desktop pill (`data-testid="header-signin"`) and the mobile-drawer
  pill (`data-testid="header-signin-mobile"`) must both be real anchors
  pointing at https://clients.rapidhiresolutions.com/, opening in a new
  tab with rel="noopener noreferrer" so we don't expose the marketing
  site to tab-nabbing.

  We assert against Header.tsx source because the pills are static JSX
  (no props, no theming) and the source-level invariant is the cheapest
  guard against accidental rewires.
*/

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HEADER = readFileSync(
  resolve(__dirname, "..", "components", "site", "Header.tsx"),
  "utf8",
);

const PORTAL_URL = "https://clients.rapidhiresolutions.com/";

/**
 * Extract the JSX block whose data-testid attribute matches the given
 * id. Returns the substring from the opening `<` of the element to its
 * closing `</a>` (since both pills are <a>). Used so that downstream
 * assertions (target, rel, href) can scope to the right pill and not
 * leak across to a sibling.
 */
function extractAnchor(testid: string): string {
  const re = new RegExp(
    `<a[^>]*data-testid=\\\"${testid}\\\"[\\s\\S]*?</a>`,
  );
  const m = HEADER.match(re);
  if (!m) {
    throw new Error(`Could not find <a data-testid="${testid}"> in Header.tsx`);
  }
  return m[0];
}

describe("§106 header Sign-in pill (desktop)", () => {
  it("is an anchor element, not a placeholder <button>", () => {
    expect(HEADER).toMatch(
      /<a[^>]*data-testid="header-signin"[^>]*href=/,
    );
    // Old placeholder behavior (toast) must be gone for this pill
    expect(HEADER).not.toMatch(
      /data-testid="header-signin"[\s\S]{0,200}notImplemented/,
    );
  });

  it("points at the client portal URL", () => {
    const anchor = extractAnchor("header-signin");
    expect(anchor).toContain(`href="${PORTAL_URL}"`);
  });

  it("opens in a new tab with safe rel attributes", () => {
    const anchor = extractAnchor("header-signin");
    expect(anchor).toContain('target="_blank"');
    expect(anchor).toContain('rel="noopener noreferrer"');
  });
});

describe("§106 header Sign-in pill (mobile drawer)", () => {
  it("is an anchor pointing at the client portal", () => {
    const anchor = extractAnchor("header-signin-mobile");
    expect(anchor).toContain(`href="${PORTAL_URL}"`);
    expect(anchor).toContain('target="_blank"');
    expect(anchor).toContain('rel="noopener noreferrer"');
  });

  it("still closes the mobile drawer on click", () => {
    const anchor = extractAnchor("header-signin-mobile");
    expect(anchor).toMatch(/onClick=\{\(\) => setOpen\(false\)\}/);
  });
});
