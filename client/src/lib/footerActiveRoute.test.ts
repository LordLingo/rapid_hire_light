/*
  Footer active-route indicator — invariants pin (§49).

  The footer columns mirror the header's active-route treatment so
  users navigating from the footer get the same affordance.

  Pins:
    - Footer.tsx imports the shared isActivePath helper from
      Header.tsx (anti-regression: don't fork the logic).
    - Footer.tsx reads the current pathname via wouter's useLocation.
    - Active footer links bump to medium font-weight + the footer's
      foreground (not the muted soft-text) color, AND set
      aria-current="page" for screen readers.
    - The footer surface deliberately does NOT use an underline or
      left rail — it would compete with the column rhythm at footer
      scale, so the weight + color shift carries the indicator.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FOOTER_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "Footer.tsx"
);
const FOOTER_SRC = readFileSync(FOOTER_PATH, "utf8");

describe("Footer.tsx — §49 active-route indicator", () => {
  it("imports the shared isActivePath helper from Header (single source of truth)", () => {
    expect(FOOTER_SRC).toMatch(/import \{ isActivePath \} from "\.\/Header"/);
  });

  it("reads the current pathname via wouter's useLocation", () => {
    expect(FOOTER_SRC).toMatch(/import \{ Link, useLocation \} from "wouter"/);
    expect(FOOTER_SRC).toMatch(/const \[location\] = useLocation\(\)/);
  });

  it("passes the current location into FooterCol for each routed column", () => {
    // All three column invocations must thread `location` through so
    // the column children can compute their own active state. §138
    // expanded the Portals FooterCol to a multi-line JSX (conditional
    // SHRM 2026 link), so we use a non-greedy DOTALL match instead of
    // the previous single-line regex.
    const matches = FOOTER_SRC.match(/<FooterCol[\s\S]*?location=\{location\}/g);
    expect(matches).not.toBeNull();
    expect((matches ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it("computes the active state on each routed footer link via isActivePath", () => {
    expect(FOOTER_SRC).toMatch(
      /const active = it\.to \? isActivePath\(location, it\.to\) : false/
    );
  });

  it("sets aria-current='page' on the active link for screen-reader users", () => {
    expect(FOOTER_SRC).toMatch(
      /aria-current=\{active \? "page" : undefined\}/
    );
  });

  it("bumps the active link to medium weight + the footer foreground color", () => {
    expect(FOOTER_SRC).toMatch(
      /font-medium text-\[color:var\(--color-footer-foreground\)\]/
    );
  });

  it("keeps the resting (inactive) link state in footer-soft-text to preserve the editorial calm", () => {
    expect(FOOTER_SRC).toMatch(
      /text-\[color:var\(--color-footer-soft-text\)\]/
    );
  });

  it("anti-regression: does NOT add a brand-blue underline/rail in the footer columns (would compete with column rhythm)", () => {
    // The footer column surface should not gain the same h-[2px] /
    // w-[2px] brand-blue stripe the header uses, because at footer
    // scale that would visually crowd the link list. The marker is
    // weight + color only.
    const columnMarkup = FOOTER_SRC.match(
      /function FooterCol[\s\S]*$/
    )?.[0] ?? "";
    expect(columnMarkup).not.toMatch(
      /h-\[2px\][^"]*bg-\[color:var\(--color-accent-ink\)\]/
    );
    expect(columnMarkup).not.toMatch(
      /w-\[2px\][^"]*bg-\[color:var\(--color-accent-ink\)\]/
    );
  });
});
