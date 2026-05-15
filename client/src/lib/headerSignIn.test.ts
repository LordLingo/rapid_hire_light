/*
  §60 — Header Sign in button + Client Login removal pin.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HEADER_SRC = readFileSync(
  resolve(__dirname, "..", "components", "site", "Header.tsx"),
  "utf8"
);

describe("§60 — Client Login removal", () => {
  it("removes the Client Login NAV entry", () => {
    expect(HEADER_SRC).not.toMatch(/label:\s*"Client Login"/);
  });

  it("removes the #login href that was attached to the placeholder", () => {
    expect(HEADER_SRC).not.toMatch(/href:\s*"#login"/);
  });
});

describe("§60 — desktop Sign in button", () => {
  it("renders a desktop-only outlined Sign in button next to Get a Quote", () => {
    expect(HEADER_SRC).toMatch(/data-testid="header-signin"/);
  });

  it("desktop Sign in is a true outlined pill: transparent bg + ink border + ink text", () => {
    const desktopBlock = HEADER_SRC.match(
      /data-testid="header-signin"[\s\S]*?>\s*Sign in\s*<\/button>/
    );
    expect(desktopBlock).toBeTruthy();
    const block = desktopBlock![0];
    // hidden on small, visible from md and up
    expect(block).toMatch(/hidden md:inline-flex/);
    // pill
    expect(block).toMatch(/rounded-full/);
    // hairline ink border
    expect(block).toMatch(/border border-\[color:var\(--color-border\)\]/);
    // transparent bg (true outline counterpart)
    expect(block).toMatch(/bg-transparent/);
    // ink text
    expect(block).toMatch(/text-\[color:var\(--color-ink\)\]/);
    // press affordance shared with Get a Quote
    expect(block).toMatch(/btn-press/);
  });

  it("desktop Sign in renders BEFORE the desktop Get a Quote pill in the CTA cluster", () => {
    // Anchor on the desktop Get a Quote pill specifically (it carries the
    // hidden md:inline-flex class), not the JSX comment or the mobile
    // counterpart which both also contain the literal "Get a Quote".
    const signInIdx = HEADER_SRC.indexOf('data-testid="header-signin"');
    const getQuoteIdx = HEADER_SRC.indexOf(
      'hidden md:inline-flex btn-press items-center gap-2 whitespace-nowrap'
    );
    expect(signInIdx).toBeGreaterThan(-1);
    expect(getQuoteIdx).toBeGreaterThan(signInIdx);
  });
});

describe("§60 — mobile Sign in button", () => {
  it("renders the mobile Sign in counterpart inside the open drawer", () => {
    expect(HEADER_SRC).toMatch(/data-testid="header-signin-mobile"/);
  });

  it("mobile Sign in inherits the same outlined pill treatment + closes the drawer on tap", () => {
    const mobileBlock = HEADER_SRC.match(
      /data-testid="header-signin-mobile"[\s\S]*?>\s*Sign in\s*<\/button>/
    );
    expect(mobileBlock).toBeTruthy();
    const block = mobileBlock![0];
    expect(block).toMatch(/setOpen\(false\)/);
    expect(block).toMatch(/notImplemented\("Sign in"\)/);
    expect(block).toMatch(/border border-\[color:var\(--color-border\)\]/);
    expect(block).toMatch(/bg-transparent/);
    expect(block).toMatch(/btn-press/);
  });
});

describe("§60 — anti-regression on the existing Get a Quote CTA", () => {
  it("Get a Quote still uses the filled brand-blue treatment", () => {
    expect(HEADER_SRC).toMatch(
      /bg-\[color:var\(--color-accent-ink\)\][\s\S]*?text-white[\s\S]*?>\s*Get a Quote/
    );
  });

  it("Get a Quote still routes to /contact", () => {
    expect(HEADER_SRC).toMatch(
      /href="\/contact"[\s\S]*?>\s*Get a Quote/
    );
  });
});
